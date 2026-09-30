import { describe, expect, it } from 'vitest';
import { CODE_BEGIN, CODE_END, extractCode } from '../../../lib/resultCode';
import { docxToText, documentXmlToText } from './docxText';
import { decodeLegacyCode, summarise } from './legacyCode';
import { addSubmission, emptyDb, latestQ2, q1Work, quizTotals } from './trackerStore';

async function deflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  const out = new Blob([new Uint8Array(bytes)]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(out).arrayBuffer());
}

/** Minimal zip writer (deflate) for building a test .docx. */
async function zip(files: Record<string, string>): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const [name, text] of Object.entries(files)) {
    const nameB = enc.encode(name);
    const data = await deflateRaw(enc.encode(text));
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(8, 8, true);
    lh.setUint32(18, data.length, true); lh.setUint16(26, nameB.length, true);
    const local = new Uint8Array([...new Uint8Array(lh.buffer), ...nameB, ...data]);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(10, 8, true);
    ch.setUint32(20, data.length, true); ch.setUint16(28, nameB.length, true); ch.setUint32(42, offset, true);
    centrals.push(new Uint8Array([...new Uint8Array(ch.buffer), ...nameB]));
    locals.push(local);
    offset += local.length;
  }
  const cd = centrals.flatMap((c) => [...c]);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, centrals.length, true); end.setUint16(10, centrals.length, true);
  end.setUint32(12, cd.length, true); end.setUint32(16, offset, true);
  return new Uint8Array([...locals.flatMap((l) => [...l]), ...cd, ...new Uint8Array(end.buffer)]);
}

const para = (t: string) => `<w:p><w:r><w:t xml:space="preserve">${t}</w:t></w:r></w:p>`;
const legacy = (o: object) => btoa(unescape(encodeURIComponent(JSON.stringify(o))));

describe('Word (.docx) import', () => {
  it('reads paragraphs and entities from document.xml', () => {
    expect(documentXmlToText(`${para('A &amp; B')}${para('C')}`)).toBe('A & B\nC\n');
  });
  it('finds the result code in a Word export', async () => {
    const lines = [CODE_BEGIN, 'WMSI2.q2.0123abcd.' + 'x'.repeat(38), 'y'.repeat(20), CODE_END];
    const xml = `<w:document><w:body>${para('My learning')}${lines.map(para).join('')}</w:body></w:document>`;
    const bytes = await zip({ '[Content_Types].xml': '<Types/>', 'word/document.xml': xml });
    const text = await docxToText(new Blob([new Uint8Array(bytes)]));
    expect(extractCode(text)).toBe(`WMSI2.q2.0123abcd.${'x'.repeat(38)}${'y'.repeat(20)}`);
  });
  it('rejects a file that is not a zip', async () => {
    await expect(docxToText(new Blob(['hello']))).rejects.toThrow();
  });
});

describe('old Q1 codes', () => {
  const code = legacy({ toolId: 'statement-types', studentName: 'Tan Wei Ling', timestamp: '2026-03-01T08:00:00.000Z',
    data: { sortAndClassify: '8/10', improved: true, answers: [1, 2], nested: { a: 1 } } });

  it('decodes to a class-less q1 payload with a readable summary', () => {
    const p = decodeLegacyCode(code)!;
    expect(p).toMatchObject({ scope: 'q1', n: 'Tan Wei Ling', c: '', at: '2026-03-01T08:00:00.000Z' });
    expect(p.acts[0]).toMatchObject({ k: 'q1', t: 'Q1 · Statement types' });
    expect(p.acts[0].a).toBe('Sort And Classify: 8/10\nImproved: yes\nAnswers: 1, 2\nNested: 1 items');
  });
  it('ignores text that is not an old code', () => {
    expect(decodeLegacyCode('WMSI2.q2.00000000.abc')).toBeNull();
    expect(decodeLegacyCode('hello')).toBeNull();
  });
  it('summarises long text briefly', () => {
    expect(summarise({ reflection: 'w'.repeat(400) }).length).toBeLessThan(330);
  });

  const q2 = { v: 1 as const, scope: 'q2', n: 'Tan Wei Ling', c: '10 Amethyst', at: '2026-09-30T10:00:00.000Z',
    acts: [{ i: 'quiz-methods', t: 'Method quiz', k: 'quiz' as const, st: 'done' as const, s: 7, m: 8 }] };

  it('files a Q1 code under the one student with that name, without hiding Q2 work', () => {
    let { db } = addSubmission(emptyDb(), q2);
    const later = { ...decodeLegacyCode(code)!, at: '2026-10-05T08:00:00.000Z' };
    ({ db } = addSubmission(db, later));
    const rows = Object.values(db.students);
    expect(rows).toHaveLength(1);
    expect(latestQ2(rows[0])?.at).toBe(q2.at);
    expect(quizTotals(rows[0])).toEqual({ score: 7, max: 8 });
    expect(q1Work(rows[0]).map((a) => a.t)).toEqual(['Q1 · Statement types']);
  });
  it('moves a class-less Q1 row into the student once a Q2 code gives the class', () => {
    let { db } = addSubmission(emptyDb(), decodeLegacyCode(code)!);
    ({ db } = addSubmission(db, q2));
    const rows = Object.values(db.students);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ className: '10 Amethyst' });
    expect(rows[0].submissions).toHaveLength(2);
  });
  it('skips the same Q1 code twice', () => {
    const { db } = addSubmission(emptyDb(), decodeLegacyCode(code)!);
    expect(addSubmission(db, decodeLegacyCode(code)!).status).toBe('duplicate');
  });
});
