import { useMemo, useState } from 'react';
import { IDEAS, type IdeaId } from '../../research/games/ideas';
import { gameInfo, type GameId } from '../../research/games/generate';
import { classHeat, initials, leaderboard, weakestIdeas, type Period } from './leaderboard';
import type { StudentRow } from './trackerStore';

const MEDAL = ['#B8962E', '#8E9AA6', '#A0673A'];
const ideaName = (id: string) => IDEAS[id as IdeaId] ?? id;
const gameName = (id: string) => { try { return gameInfo(id as GameId).title; } catch { return id; } };

function shade(acc: number | null): string {
  if (acc === null) return 'var(--color-paper-2)';
  return acc >= 0.85 ? '#CFE6D6' : acc >= 0.7 ? 'var(--color-q2-coastal-tint)' : acc >= 0.55 ? 'var(--color-q2-ivory-tint)' : 'var(--color-ember-soft)';
}

export function LeaderboardView({ rows }: { rows: StudentRow[] }) {
  const [period, setPeriod] = useState<Period>('term');
  const [projector, setProjector] = useState(false);
  const board = useMemo(() => leaderboard(rows, period), [rows, period]);
  const heat = useMemo(() => classHeat(rows), [rows]);
  const weak = useMemo(() => weakestIdeas(heat.heat), [heat]);

  const seg = (on: boolean) => `px-3 py-1 text-[12.5px] font-semibold ${on ? 'bg-[color:var(--color-q2-sea)] text-white' : 'text-[color:var(--color-ink-3)]'}`;
  const th = 'border-b border-[color:var(--color-q2-sea)] px-2.5 py-2 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-ink-3)]';
  const td = 'border-b border-[color:var(--color-line-soft)] px-2.5 py-2';

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex overflow-hidden rounded-full border border-[color:var(--color-line)] bg-white">
          <button type="button" aria-pressed={period === 'week'} className={seg(period === 'week')} onClick={() => setPeriod('week')}>This week</button>
          <button type="button" aria-pressed={period === 'term'} className={seg(period === 'term')} onClick={() => setPeriod('term')}>All time</button>
        </div>
        <button type="button" aria-pressed={projector} onClick={() => setProjector((p) => !p)}
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] bg-white px-3 py-1 text-[12.5px] font-semibold">
          <span className={`relative h-[17px] w-[30px] rounded-full transition-colors ${projector ? 'bg-[color:var(--color-q2-storm)]' : 'bg-[color:var(--color-paper-3)]'}`}>
            <span className={`absolute left-[2px] top-[2px] h-[13px] w-[13px] rounded-full bg-white shadow transition-transform ${projector ? 'translate-x-[13px]' : ''}`} />
          </span>
          Initials only (projector)
        </button>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="overflow-x-auto rounded-[10px] border border-[color:var(--color-line)] bg-white">
          {board.length === 0 ? (
            <p className="px-4 py-6 text-[13.5px] text-[color:var(--color-ink-2)]">No game results {period === 'week' ? 'in the last seven days' : 'yet'}. They appear once students play a practice game and send their results from My learning.</p>
          ) : (
            <table className="w-full min-w-[480px] border-collapse text-[13px]">
              <thead><tr><th className={th}>#</th><th className={th}>Student</th><th className={`${th} text-right`}>Points</th><th className={`${th} text-right`}>Rounds</th><th className={`${th} text-right`}>Accuracy</th><th className={`${th} text-right`}>Improvement</th></tr></thead>
              <tbody>
                {board.map((r, i) => (
                  <tr key={r.key}>
                    <td className={`${td} font-mono font-semibold text-[color:var(--color-q2-storm)]`}>
                      {i < 3 ? <span className="inline-grid h-5 w-5 place-items-center rounded-full text-[10.5px] font-bold text-white" style={{ background: MEDAL[i] }}>{i + 1}</span> : i + 1}
                    </td>
                    <td className={td}>{projector ? initials(r.name) : r.name}{!projector && <span className="ml-1.5 text-[11.5px] text-[color:var(--color-ink-3)]">{r.className}</span>}</td>
                    <td className={`${td} text-right font-mono`}>{r.points}</td>
                    <td className={`${td} text-right font-mono`}>{r.rounds}</td>
                    <td className={`${td} text-right font-mono`}>{r.accuracy === null ? '—' : `${Math.round(r.accuracy * 100)}%`}</td>
                    <td className={`${td} text-right font-mono ${r.improve && r.improve > 0 ? 'text-[#3E8A58]' : ''}`}>{r.improve === null ? '—' : `${r.improve > 0 ? '+' : ''}${Math.round(r.improve * 100)}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="px-3 py-2 text-[11.5px] text-[color:var(--color-ink-3)]">Points are correct answers, capped at 30 per game per day so replaying one game can’t win. “This week” compares each student’s latest results with what they sent at least seven days earlier.</p>
        </div>

        <div className="rounded-[10px] border border-[color:var(--color-line)] bg-white px-3.5 py-3">
          <h3 className="text-[13.5px] font-bold">Where the class slips (accuracy by idea)</h3>
          {heat.ideas.length === 0 ? <p className="mt-2 text-[13px] text-[color:var(--color-ink-3)]">No game results yet.</p> : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full border-separate border-spacing-[3px] text-[11.5px]">
                <thead><tr><th />{heat.games.map((g) => <th key={g} className="px-1 text-center font-mono text-[9.5px] font-normal text-[color:var(--color-ink-3)]">{gameName(g)}</th>)}</tr></thead>
                <tbody>
                  {heat.ideas.map((idea) => (
                    <tr key={idea}>
                      <td className="pr-2">{ideaName(idea)}</td>
                      {heat.games.map((g) => {
                        const v = heat.heat[idea][g];
                        const acc = v && v[1] ? v[0] / v[1] : null;
                        return <td key={g} className="h-[22px] rounded-[3px] text-center font-mono text-[10px]" style={{ background: shade(acc) }} title={v ? `${v[0]}/${v[1]}` : 'not played'}>{acc === null ? '–' : `${Math.round(acc * 100)}%`}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {weak.length > 0 && (
            <p className="mt-3 rounded-[6px] bg-[color:var(--color-q2-ivory-tint)] px-2.5 py-2 text-[12.5px]">
              <b>Re-teach next:</b> {weak.slice(0, 2).map((w) => `“${ideaName(w.idea)}” (${Math.round(w.accuracy * 100)}%)`).join(' and ')}.
              {weak[0].game && <> Suggested homework: <b>{gameName(weak[0].game)}</b>.</>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
