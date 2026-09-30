import { describe, expect, it } from 'vitest';
import type { GameStats } from '../../../lib/progress';
import type { ResultPayload } from '../../../lib/resultCode';
import { classHeat, initials, leaderboard, weakestIdeas } from './leaderboard';
import { addSubmission, emptyDb, type TrackerDb } from './trackerStore';

const stats = (over: Partial<GameStats>): GameStats => ({ r: 1, c: 5, n: 10, b: 5, p: 5, d: '2026-09-01', dp: 5, a0: 0.5, ar: 0.5, i: {}, ...over });

function add(db: TrackerDb, name: string, at: string, g: Record<string, GameStats>, c = '10 Storm'): TrackerDb {
  const payload: ResultPayload = {
    v: 1, scope: 'q2', n: name, c, at,
    acts: Object.entries(g).map(([id, s]) => ({ i: `game-${id}`, t: id, k: 'game', st: 'done', g: s })),
  };
  return addSubmission(db, payload).db;
}

describe('leaderboard', () => {
  const now = new Date('2026-10-10T12:00:00Z');
  let db = emptyDb();
  db = add(db, 'Aisyah Rahman', '2026-09-20T10:00:00Z', { 'missing-link': stats({ p: 20, r: 2, c: 12, n: 20 }) });
  db = add(db, 'Aisyah Rahman', '2026-10-09T10:00:00Z', { 'missing-link': stats({ p: 50, r: 5, c: 40, n: 50, a0: 0.4, ar: 0.9, i: { sample: [2, 10] } }) });
  db = add(db, 'Daniel Lim', '2026-10-08T10:00:00Z', { 'claim-splitter': stats({ p: 40, r: 3, c: 20, n: 30, i: { 'part-scope': [3, 10] } }) });
  db = add(db, 'No Games', '2026-10-08T10:00:00Z', {});
  const rows = Object.values(db.students);

  it('ranks by points over the term and hides students with no games', () => {
    const lb = leaderboard(rows, 'term', now);
    expect(lb.map((r) => r.name)).toEqual(['Aisyah Rahman', 'Daniel Lim']);
    expect(lb[0].accuracy).toBeCloseTo(0.8);
    expect(lb[0].improve).toBeCloseTo(0.5);
  });

  it('counts only the last seven days for "this week"', () => {
    const lb = leaderboard(rows, 'week', now);
    expect(lb.map((r) => [r.name, r.points])).toEqual([['Daniel Lim', 40], ['Aisyah Rahman', 30]]);
  });

  it('builds the class heatmap and finds the weakest ideas', () => {
    const h = classHeat(rows);
    expect(h.games).toEqual(['claim-splitter', 'missing-link']);
    expect(h.heat.sample['missing-link']).toEqual([2, 10]);
    const weak = weakestIdeas(h.heat);
    expect(weak.map((w) => w.idea)).toEqual(['sample', 'part-scope']);
    expect(weak[0].game).toBe('missing-link');
  });

  it('shortens names to initials for projecting', () => {
    expect(initials('Aisyah binti Rahman')).toBe('A.B.R.');
  });
});
