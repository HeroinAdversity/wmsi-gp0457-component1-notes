import { describe, expect, it } from 'vitest';
import { emptyProgress, upsertActivity } from './progress';
import {
  CODE_BEGIN, CODE_END, CODE_MAX, decodeResultCode, encodeResultCode, extractCode, fnv1a, toPayload, wrapCodeForPdf,
} from './resultCode';

function sample(answerText = 'The only data comes from one firm, so the sample is not representative.') {
  let s = emptyProgress();
  s = { ...s, student: { name: 'Tan Wei Ling', className: '10 Amethyst' } };
  s = upsertActivity(s, { id: 'quiz-methods', title: 'Method quiz', kind: 'quiz', status: 'done', score: 7, max: 8 });
  s = upsertActivity(s, { id: 'answer-2a:m-j26-12-a', title: 'Food waste 2(a)', kind: 'answer-2a', status: 'done', selfLevel: 3, answerText });
  return toPayload(s, 'q2', new Date('2026-09-30T10:00:00Z'));
}

describe('result code', () => {
  it('fnv1a is stable 8-hex', () => {
    expect(fnv1a('abc')).toMatch(/^[0-9a-f]{8}$/);
    expect(fnv1a('abc')).toBe(fnv1a('abc'));
    expect(fnv1a('abc')).not.toBe(fnv1a('abd'));
  });

  it('round-trips', async () => {
    const p = sample();
    const code = await encodeResultCode(p);
    expect(code.startsWith('WMSI2.q2.')).toBe(true);
    const r = await decodeResultCode(code);
    expect(r).toEqual({ ok: true, payload: p });
  });

  it('ignores whitespace and line breaks inside the code', async () => {
    const code = await encodeResultCode(sample());
    const mangled = code.match(/.{1,17}/g)!.join('\n  ');
    expect((await decodeResultCode(mangled)).ok).toBe(true);
  });

  it('rejects truncated or edited codes with a friendly error', async () => {
    const code = await encodeResultCode(sample());
    for (const bad of [code.slice(0, -5), code.slice(0, -1) + (code.endsWith('A') ? 'B' : 'A'), 'hello', '']) {
      const r = await decodeResultCode(bad);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error).toMatch(/incomplete or was changed|not a WMSI result code/);
    }
  });

  it('trims huge answers in the payload and keeps the word count', async () => {
    const huge = 'word '.repeat(6000);
    const p = sample(huge);
    const code = await encodeResultCode(p);
    expect(code.length).toBeLessThanOrEqual(CODE_MAX);
    const r = await decodeResultCode(code);
    expect(r.ok).toBe(true);
    if (r.ok) {
      const a = r.payload.acts.find((x) => x.k === 'answer-2a')!;
      expect(a.w).toBe(6000);
      expect((a.a ?? '').length).toBeLessThanOrEqual(1200);
    }
  });

  it('drops answer text (not word counts) when many answers would exceed CODE_MAX', async () => {
    // Incompressible pseudo-random answers across 40 activities.
    let seed = 7;
    const rnd = () => { seed = (seed * 1103515245 + 12345) % 2 ** 31; return seed.toString(36); };
    const p = sample();
    p.acts = Array.from({ length: 40 }, (_, i) => ({ i: `answer-2a:x${i}`, t: `Item ${i}`, k: 'answer-2a' as const, st: 'done' as const, a: Array.from({ length: 200 }, rnd).join(' ').slice(0, 1200), w: 200 }));
    const code = await encodeResultCode(p);
    expect(code.length).toBeLessThanOrEqual(CODE_MAX);
    const r = await decodeResultCode(code);
    expect(r.ok).toBe(true);
    if (r.ok) { expect(r.payload.acts[0].a).toBeUndefined(); expect(r.payload.acts[0].w).toBe(200); }
  });

  it('wraps for PDF and extracts back from noisy text', async () => {
    const code = await encodeResultCode(sample());
    const lines = wrapCodeForPdf(code, 56);
    expect(lines[0]).toBe(CODE_BEGIN);
    expect(lines[lines.length - 1]).toBe(CODE_END);
    expect(lines.slice(1, -1).every((l) => l.length <= 56)).toBe(true);
    const pdfText = `My learning summary\n${lines.join(' \n ')}\nPage 2`;
    expect(extractCode(pdfText)).toBe(code);
    expect(extractCode(`paste: ${code} thanks`)).toBe(code);
    expect(extractCode('no code here')).toBeNull();
  });
});
