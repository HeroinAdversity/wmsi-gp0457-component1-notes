import type { GameStats } from '../../../lib/progress';
import type { IdeaId } from './ideas';

/** Points per day per game are capped, so replaying one game all night can't top the leaderboard. */
export const DAILY_POINT_CAP = 30;

export interface RoundResult { correct: number; total: number; ideas: Partial<Record<IdeaId, [number, number]>> }

export function emptyStats(): GameStats {
  return { r: 0, c: 0, n: 0, b: 0, p: 0, d: '', dp: 0, a0: -1, ar: -1, i: {} };
}

const dayKey = (now: Date) => now.toISOString().slice(0, 10);

export function applyRound(prev: GameStats | undefined, res: RoundResult, now: Date = new Date()): GameStats {
  const s = prev ?? emptyStats();
  const acc = res.total ? res.correct / res.total : 0;
  const today = dayKey(now);
  const dp = s.d === today ? s.dp : 0;
  const gained = Math.max(0, Math.min(res.correct, DAILY_POINT_CAP - dp));
  const ideas = { ...s.i };
  for (const [id, [c, n]] of Object.entries(res.ideas) as [IdeaId, [number, number]][]) {
    const [pc, pn] = ideas[id] ?? [0, 0];
    ideas[id] = [pc + c, pn + n];
  }
  return {
    r: s.r + 1,
    c: s.c + res.correct,
    n: s.n + res.total,
    b: Math.max(s.b, res.correct),
    p: s.p + gained,
    d: today,
    dp: dp + gained,
    a0: s.a0 < 0 ? round2(acc) : s.a0,
    // Recent accuracy: a running average that leans on the latest rounds.
    ar: s.ar < 0 ? round2(acc) : round2(s.ar * 0.6 + acc * 0.4),
    i: ideas,
  };
}

const round2 = (x: number) => Math.round(x * 100) / 100;

/** 0 (strong) … 1 (weak) for each idea seen at least twice, across all games. */
export function weaknessMap(all: (GameStats | undefined)[]): Partial<Record<IdeaId, number>> {
  const sum: Partial<Record<IdeaId, [number, number]>> = {};
  for (const s of all) {
    if (!s) continue;
    for (const [id, [c, n]] of Object.entries(s.i) as [IdeaId, [number, number]][]) {
      const [pc, pn] = sum[id] ?? [0, 0];
      sum[id] = [pc + c, pn + n];
    }
  }
  const out: Partial<Record<IdeaId, number>> = {};
  for (const [id, [c, n]] of Object.entries(sum) as [IdeaId, [number, number]][]) if (n >= 2) out[id] = 1 - c / n;
  return out;
}

/** 0…3 stars from the best round, shown on the game card. */
export function stars(s: GameStats | undefined, rounds: number): number {
  if (!s || !s.r) return 0;
  const best = s.b / Math.max(1, rounds);
  return best >= 0.9 ? 3 : best >= 0.6 ? 2 : 1;
}
