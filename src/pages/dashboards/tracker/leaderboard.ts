import type { CompactActivity } from '../../../lib/resultCode';
import { latestQ2, type StudentRow, type Submission } from './trackerStore';

/**
 * Leaderboard and class heatmap, built only from submissions the teacher has
 * imported. Nothing here is ever shown to students.
 */

export interface GameTotals { points: number; rounds: number; correct: number; attempted: number; improve: number | null }

const games = (s: Submission | undefined): CompactActivity[] => (s?.acts ?? []).filter((a) => a.k === 'game' && a.g);

export function gameTotals(sub: Submission | undefined): GameTotals {
  const gs = games(sub);
  let points = 0, rounds = 0, correct = 0, attempted = 0, first = 0, recent = 0, weight = 0;
  for (const a of gs) {
    const g = a.g!;
    points += g.p; rounds += g.r; correct += g.c; attempted += g.n;
    // Improvement only means something once a game has been played more than once.
    if (g.r > 1 && g.a0 >= 0 && g.ar >= 0) { first += g.a0 * g.r; recent += g.ar * g.r; weight += g.r; }
  }
  return { points, rounds, correct, attempted, improve: weight ? (recent - first) / weight : null };
}

/** The newest submission sent on or before `cutoff` (for "this week" differences). */
function submissionAt(row: StudentRow, cutoff: string): Submission | undefined {
  return row.submissions.find((s) => s.at <= cutoff && !s.acts.every((a) => a.k === 'q1'));
}

export type Period = 'week' | 'term';

export interface LeaderRow { key: string; name: string; className: string; points: number; rounds: number; accuracy: number | null; improve: number | null }

export function leaderboard(rows: StudentRow[], period: Period, now: Date = new Date()): LeaderRow[] {
  const cutoff = new Date(now.getTime() - 7 * 86_400_000).toISOString();
  return rows
    .map((r) => {
      const t = gameTotals(latestQ2(r));
      let { points, rounds, correct, attempted } = t;
      if (period === 'week') {
        const before = gameTotals(submissionAt(r, cutoff));
        points -= before.points; rounds -= before.rounds; correct -= before.correct; attempted -= before.attempted;
      }
      return { key: r.key, name: r.name, className: r.className, points, rounds, accuracy: attempted > 0 ? correct / attempted : null, improve: t.improve };
    })
    .filter((r) => r.rounds > 0)
    .sort((a, b) => b.points - a.points || (b.accuracy ?? 0) - (a.accuracy ?? 0) || a.name.localeCompare(b.name));
}

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).map((p) => `${p[0].toUpperCase()}.`).join('');
}

/** Class accuracy for each idea in each game: heat[idea][game] = [correct, attempted]. */
export function classHeat(rows: StudentRow[]): { games: string[]; ideas: string[]; heat: Record<string, Record<string, [number, number]>> } {
  const heat: Record<string, Record<string, [number, number]>> = {};
  const gameSet = new Set<string>();
  for (const r of rows) {
    for (const a of games(latestQ2(r))) {
      const game = a.i.replace(/^game-/, '');
      gameSet.add(game);
      for (const [idea, v] of Object.entries(a.g!.i)) {
        if (!v) continue;
        const cell = (heat[idea] ??= {})[game] ?? [0, 0];
        heat[idea][game] = [cell[0] + v[0], cell[1] + v[1]];
      }
    }
  }
  return { games: [...gameSet].sort(), ideas: Object.keys(heat).sort(), heat };
}

/** The ideas the class gets right least often (at least `min` attempts), weakest first. */
export function weakestIdeas(heat: Record<string, Record<string, [number, number]>>, min = 5): { idea: string; accuracy: number; game: string }[] {
  return Object.entries(heat)
    .map(([idea, byGame]) => {
      const cells = Object.entries(byGame);
      const c = cells.reduce((n, [, v]) => n + v[0], 0);
      const n = cells.reduce((m, [, v]) => m + v[1], 0);
      const game = cells.filter(([, v]) => v[1] > 0).sort((x, y) => x[1][0] / x[1][1] - y[1][0] / y[1][1])[0]?.[0] ?? '';
      return { idea, accuracy: n ? c / n : 1, n, game };
    })
    .filter((x) => x.n >= min)
    .sort((a, b) => a.accuracy - b.accuracy)
    .map(({ idea, accuracy, game }) => ({ idea, accuracy, game }));
}
