import { describe, expect, it } from 'vitest';
import { emptyProgress, loadProgress, parseProgress, saveProgress, setStudent, upsertActivity, PROGRESS_KEY } from './progress';

const quiz = { id: 'quiz-methods', title: 'Method ↔ data quiz', kind: 'quiz' as const, status: 'done' as const, score: 7, max: 8 };

describe('progress store', () => {
  it('parses null / garbage / wrong shape as empty progress', () => {
    expect(parseProgress(null)).toEqual(emptyProgress());
    expect(parseProgress('{not json')).toEqual(emptyProgress());
    expect(parseProgress(JSON.stringify({ version: 2, activities: [] }))).toEqual(emptyProgress());
  });

  it('upserts immutably and stamps updatedAt', () => {
    const s0 = emptyProgress();
    const s1 = upsertActivity(s0, quiz, new Date('2026-09-30T10:00:00Z'));
    expect(s0.activities).toEqual({});
    expect(s1.activities['quiz-methods']).toMatchObject({ score: 7, updatedAt: '2026-09-30T10:00:00.000Z' });
    const s2 = upsertActivity(s1, { ...quiz, score: 8 });
    expect(s2.activities['quiz-methods'].score).toBe(8);
    expect(Object.keys(s2.activities)).toHaveLength(1);
  });

  it('trims student fields', () => {
    expect(setStudent(emptyProgress(), { name: '  Tan Wei Ling ', className: ' 10 Amethyst' }).student)
      .toEqual({ name: 'Tan Wei Ling', className: '10 Amethyst' });
  });

  it('round-trips through storage and survives a throwing storage', () => {
    const mem = new Map<string, string>();
    const storage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
    const s = upsertActivity(emptyProgress(), quiz);
    saveProgress(s, storage);
    expect(mem.has(PROGRESS_KEY)).toBe(true);
    expect(loadProgress(storage)).toEqual(s);
    const broken = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
    expect(loadProgress(broken)).toEqual(emptyProgress());
    expect(() => saveProgress(s, broken)).not.toThrow();
  });
});
