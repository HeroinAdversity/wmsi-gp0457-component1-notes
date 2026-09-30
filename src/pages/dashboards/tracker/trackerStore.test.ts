import { describe, expect, it } from 'vitest';
import type { ResultPayload } from '../../../lib/resultCode';
import { addSubmission, emptyDb, parseBackup, quizTotals, setMark, studentKey, toggleNextStep, trackerCsv } from './trackerStore';

const p = (over: Partial<ResultPayload> = {}): ResultPayload => ({
  v: 1, scope: 'q2', n: 'Tan Wei Ling', c: '10 Amethyst', at: '2026-09-30T10:00:00.000Z',
  acts: [
    { i: 'quiz-methods', t: 'Method quiz', k: 'quiz', st: 'done', s: 7, m: 8 },
    { i: 'quiz-spot', t: 'Spot quiz', k: 'quiz', st: 'done', s: 7, m: 10 },
    { i: 'answer-2a:m-j26-12-a', t: 'Food waste 2(a)', k: 'answer-2a', st: 'done', l: 3, a: 'text', w: 1 },
  ],
  ...over,
});

describe('tracker store', () => {
  it('normalises student keys', () => {
    expect(studentKey('  tan  wei LING ', '10 amethyst ')).toBe(studentKey('Tan Wei Ling', '10 Amethyst'));
  });
  it('adds, dedupes and keeps submissions sorted newest first', () => {
    let { db, status } = addSubmission(emptyDb(), p());
    expect(status).toBe('added');
    ({ db, status } = addSubmission(db, p({ n: 'tan wei ling ' })));
    expect(status).toBe('duplicate');
    ({ db, status } = addSubmission(db, p({ at: '2026-10-02T10:00:00.000Z' })));
    expect(status).toBe('added');
    const row = Object.values(db.students)[0];
    expect(row.submissions.map((s) => s.at)).toEqual(['2026-10-02T10:00:00.000Z', '2026-09-30T10:00:00.000Z']);
    expect(quizTotals(row)).toEqual({ score: 14, max: 18 });
  });
  it('rejects nameless payloads', () => {
    expect(addSubmission(emptyDb(), p({ n: '  ' })).status).toBe('no-name');
  });
  it('clamps marks to whole numbers 0–8 and toggles steps', () => {
    let { db } = addSubmission(emptyDb(), p());
    const key = Object.keys(db.students)[0];
    db = setMark(db, key, 'a', 9.6);
    expect(db.students[key].marks.a).toBe(8);
    db = setMark(db, key, 'a', undefined);
    expect(db.students[key].marks.a).toBeUndefined();
    db = toggleNextStep(db, key, 'Link to aim');
    db = toggleNextStep(db, key, 'Link to aim');
    expect(db.students[key].nextSteps).toEqual([]);
  });
  it('exports CSV with a header row', () => {
    const { db } = addSubmission(emptyDb(), p());
    const csv = trackerCsv(db);
    expect(csv.split('\r\n')[0]).toBe('Name,Class,Last submitted,Quiz score,Quiz max,2(a) mark,2(b) mark,Next steps,Comment');
    expect(csv).toContain('Tan Wei Ling,10 Amethyst');
  });
  it('rejects bad backups without throwing', () => {
    expect(parseBackup('nope').ok).toBe(false);
    expect(parseBackup(JSON.stringify({ version: 1, students: [] })).ok).toBe(false);
    const { db } = addSubmission(emptyDb(), p());
    expect(parseBackup(JSON.stringify(db))).toEqual({ ok: true, db });
  });

  it('normalises a structurally incomplete backup instead of crashing later (I3)', () => {
    const partial = { version: 1, students: { k: { name: 'Ana', submissions: [{ at: '2026-01-01T00:00:00Z', acts: [] }, { acts: [] }] } } };
    const r = parseBackup(JSON.stringify(partial));
    expect(r.ok).toBe(true);
    if (r.ok) {
      const row = r.db.students.k;
      expect(row).toMatchObject({ key: 'k', name: 'Ana', className: '', nextSteps: [], marks: {}, comment: '' });
      expect(row.submissions).toHaveLength(1);
      expect(() => trackerCsv(r.db)).not.toThrow();
    }
  });
});
