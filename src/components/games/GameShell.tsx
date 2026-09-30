import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container } from '../primitives';
import { useProgress, type GameStats } from '../../lib/progress';
import { applyRound, stars, weaknessMap } from '../../pages/research/games/stats';

/**
 * The practice-game hub, player and end-of-round screen, shared by Question 1
 * and Question 2. Each question supplies its own games, questions and colours.
 */

export type Ideas = Partial<Record<string, [number, number]>>;

/** What a finished question reports back: right answers and attempts per idea. */
export interface Outcome { correct: number; total: number; ideas: Ideas }

export interface ShellGame { id: string; part: string; title: string; blurb: string; skill: string; rounds: number }

export interface GameCatalog<Q extends { key: string }> {
  /** e.g. "/research/games". */
  base: string;
  games: ShellGame[];
  /** The id of the mixed round, which is never "your weakest". */
  mixedId: string;
  buildRound: (id: string, opts: { seed: number; weakness: Partial<Record<string, number>> }) => Q[];
  unitsOf: (q: Q) => number;
  QuestionView: (p: { q: Q; onDone: (o: Outcome) => void }) => ReactNode;
  questionTitle: (q: Q) => string;
  ideas: Record<string, string>;
  /** Small badge before the title, e.g. "2(a)". */
  PartTag: (p: { part: string }) => ReactNode;
  /** Class for the player's top strip, by part. */
  stripClass: (part: string) => string;
  /** Colours: --g-deep (buttons, titles), --g-mid (links, rings), --g-soft (chips), --g-star. */
  theme: CSSProperties;
  pageClass: string;
  Header: () => ReactNode;
  activityId: (id: string) => string;
}

export const activityOf = (id: string) => `game-${id}`;

function useGameStats(cat: GameCatalog<{ key: string }>) {
  const { state } = useProgress();
  return useMemo(() => {
    const byGame: Record<string, GameStats | undefined> = {};
    for (const g of cat.games) byGame[g.id] = state.activities[cat.activityId(g.id)]?.game;
    return byGame;
  }, [state, cat]);
}

/** The game with the lowest recent accuracy (untried games count as weakest). */
function weakestGame(cat: GameCatalog<{ key: string }>, stats: Record<string, GameStats | undefined>): string {
  const playable = cat.games.filter((g) => g.id !== cat.mixedId);
  const untried = playable.find((g) => !stats[g.id]);
  if (untried) return untried.id;
  return playable.reduce((a, b) => ((stats[b.id]?.ar ?? 1) < (stats[a.id]?.ar ?? 1) ? b : a)).id;
}

function Stars({ n }: { n: number }) {
  return <span className="tracking-[1px] text-[color:var(--g-star)]" aria-label={`${n} of 3 stars`}>{'★'.repeat(n)}{'☆'.repeat(3 - n)}</span>;
}

export function GamesShell<Q extends { key: string }>({ cat }: { cat: GameCatalog<Q> }) {
  const { gameId } = useParams();
  const game = cat.games.find((g) => g.id === gameId);
  const c = cat as unknown as GameCatalog<{ key: string }>;
  return (
    <div className={`${cat.pageClass} pb-6`} style={cat.theme}>
      {game ? <GamePlayer key={game.id} cat={c} id={game.id} /> : <GameHub cat={c} />}
    </div>
  );
}

function GameHub({ cat }: { cat: GameCatalog<{ key: string }> }) {
  const stats = useGameStats(cat);
  const weakest = weakestGame(cat, stats);
  const { PartTag, Header } = cat;
  return (
    <>
      <Header />
      <Container size="wide">
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cat.games.map((g) => {
            const s = stats[g.id];
            const mixed = g.id === cat.mixedId;
            return (
              <Link key={g.id} to={`${cat.base}/${g.id}`}
                className={`flex flex-col gap-1.5 rounded-[10px] border p-3.5 transition-colors ${mixed ? 'border-[color:var(--g-deep)] bg-[color:var(--g-deep)] text-white' : g.id === weakest ? 'border-[color:var(--g-mid)] bg-white shadow-[0_0_0_1px_var(--g-mid)]' : 'border-[color:var(--color-line)] bg-white hover:border-[color:var(--g-mid)]'}`}>
                <div className="flex items-center justify-between">
                  <PartTag part={g.part} />
                  {g.id === weakest && !mixed
                    ? <span className="rounded-[3px] bg-[color:var(--g-soft)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--g-deep)]">Your weakest</span>
                    : !mixed && <Stars n={stars(s, g.rounds)} />}
                </div>
                <h3 className={`font-display text-[20px] leading-[1.15] ${mixed ? 'text-white' : 'text-[color:var(--g-deep)]'}`}>{g.title}</h3>
                <p className={`text-[13px] ${mixed ? 'text-white/75' : 'text-[color:var(--color-ink-2)]'}`}>{g.blurb}</p>
                <div className={`mt-auto flex justify-between pt-2 font-mono text-[10.5px] ${mixed ? 'text-white/75' : 'text-[color:var(--color-ink-3)]'}`}>
                  <span>{g.skill}</span>
                  <span>{s ? `best ${s.b} · ${s.r} round${s.r > 1 ? 's' : ''}` : 'not tried'}</span>
                </div>
              </Link>
            );
          })}
        </div>
        <p className="mt-5 max-w-[70ch] text-[13px] text-[color:var(--color-ink-3)]">Your teacher sees your game totals when you send your results from My learning. Only your teacher sees names.</p>
      </Container>
    </>
  );
}

interface Finished { correct: number; total: number; ideas: Ideas; prevBest: number }

function GamePlayer({ cat, id }: { cat: GameCatalog<{ key: string }>; id: string }) {
  const info = cat.games.find((g) => g.id === id)!;
  const { state, record } = useProgress();
  const allStats = useGameStats(cat);
  const [seed, setSeed] = useState(() => Date.now());
  const questions = useMemo(
    () => cat.buildRound(id, { seed, weakness: weaknessMap(Object.values(allStats)) }),
    [id, seed], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const [at, setAt] = useState(0);
  const [results, setResults] = useState<(Outcome | null)[]>([]);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState<Finished | null>(null);
  const { QuestionView } = cat;

  const q = questions[at];
  const answered = results[at] != null;
  const units = questions.reduce((n, x) => n + cat.unitsOf(x), 0);

  const onDone = (o: Outcome) => {
    setResults((r) => { const n = [...r]; n[at] = o; return n; });
    setStreak((s) => (o.correct === o.total ? s + 1 : 0));
  };

  const finish = () => {
    const all = results.filter((r): r is Outcome => r != null);
    const ideas: Ideas = {};
    for (const r of all) for (const [k, v] of Object.entries(r.ideas)) {
      if (!v) continue;
      const [pc, pn] = ideas[k] ?? [0, 0];
      ideas[k] = [pc + v[0], pn + v[1]];
    }
    const correct = all.reduce((n, r) => n + r.correct, 0);
    const prev = state.activities[cat.activityId(id)]?.game;
    record({ id: cat.activityId(id), title: `Game · ${info.title}`, kind: 'game', status: 'done', score: correct, max: units, game: applyRound(prev, { correct, total: units, ideas }) });
    setFinished({ correct, total: units, ideas, prevBest: prev?.b ?? -1 });
  };

  const replay = () => { setSeed(Date.now()); setAt(0); setResults([]); setStreak(0); setFinished(null); };

  return (
    // data-no-notes: tapping text is part of play, so no highlighting here.
    <div data-no-notes>
      <Container size="narrow" className="pt-8">
        <p className="text-[13px]"><Link to={cat.base} className="font-semibold text-[color:var(--g-mid)]">← All games</Link></p>
        {finished ? (
          <RoundResult cat={cat} info={info} result={finished} onReplay={replay} stats={allStats} />
        ) : !q ? (
          <p className="mt-4 text-[14px]">No questions are available for this game yet.</p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-[12px] border border-[color:var(--color-line)] bg-white">
            <div className={`flex flex-wrap items-center gap-2.5 px-4 py-2.5 text-[12.5px] text-white ${cat.stripClass(info.part)}`}>
              <span className="font-bold">{id === cat.mixedId ? `Mixed · ${cat.questionTitle(q)}` : info.title}</span>
              <span className="flex gap-1" aria-label={`Question ${at + 1} of ${questions.length}`}>
                {questions.map((x, k) => {
                  const r = results[k];
                  const tone = r ? (r.correct === r.total ? 'bg-[#8fd0a3]' : r.correct > 0 ? 'bg-[color:var(--color-q2-ivory)]' : 'bg-[#e9a08f]') : k === at ? 'bg-white' : 'bg-white/25';
                  return <i key={x.key} className={`h-[5px] w-[18px] rounded-[3px] ${tone}`} />;
                })}
              </span>
              <span className="flex-1" />
              {questions.length > 1 && <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[11px]">streak {streak}</span>}
            </div>
            <div className="p-4 md:p-5">
              <QuestionView key={q.key} q={q} onDone={onDone} />
              {answered && (
                <div className="mt-4 flex justify-end">
                  {at < questions.length - 1
                    ? <button type="button" onClick={() => setAt((n) => n + 1)} className="rounded-full bg-[color:var(--g-deep)] px-4 py-2 text-[13px] font-semibold text-white">Next →</button>
                    : <button type="button" onClick={finish} className="rounded-full bg-[color:var(--g-deep)] px-4 py-2 text-[13px] font-semibold text-white">See my results</button>}
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

function RoundResult({ cat, info, result, onReplay, stats }: {
  cat: GameCatalog<{ key: string }>;
  info: ShellGame;
  result: Finished;
  onReplay: () => void;
  stats: Record<string, GameStats | undefined>;
}) {
  const pct = result.total ? result.correct / result.total : 0;
  const circ = 2 * Math.PI * 50;
  const ideas = (Object.entries(result.ideas).filter(([, v]) => v) as [string, [number, number]][])
    .sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]);
  const worst = ideas.find(([, [c, n]]) => c < n);
  const next = cat.games.find((g) => g.id === weakestGame(cat, stats) && g.id !== info.id) ?? cat.games.find((g) => g.id === cat.mixedId)!;
  const delta = result.prevBest >= 0 ? result.correct - result.prevBest : null;
  return (
    <div className="mt-3 grid items-start gap-5 rounded-[12px] border border-[color:var(--color-line)] bg-white p-5 md:grid-cols-[250px_1fr]">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 120 120" className="h-[112px] w-[112px] shrink-0" aria-hidden>
          <circle cx="60" cy="60" r="50" stroke="var(--color-q2-arctic)" strokeWidth="12" fill="none" />
          <circle cx="60" cy="60" r="50" stroke="var(--g-mid)" strokeWidth="12" fill="none" strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round" transform="rotate(-90 60 60)" />
          <text x="60" y="64" textAnchor="middle" fontFamily="DM Serif Display, serif" fontSize="28" fill="var(--g-deep)">{result.correct}/{result.total}</text>
        </svg>
        <div>
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--g-mid)]">End of round</p>
          <p className="font-display text-[22px] leading-[1.2] text-[color:var(--g-deep)]">{info.title}</p>
          <p className="mt-1 text-[12.5px] text-[color:var(--color-ink-3)]">
            {delta === null ? 'First round' : delta > 0 ? `New best, +${delta}` : delta === 0 ? 'Equals your best' : `Best is ${result.prevBest}`} · saved to My learning ✓
          </p>
        </div>
      </div>
      <div className="grid gap-2 text-[13px]">
        <p className="text-[13.5px] font-bold">How you did, by idea</p>
        {ideas.map(([id, [c, n]]) => (
          <div key={id}>
            <div className="flex justify-between"><span>{cat.ideas[id] ?? id}</span><span className="font-mono">{c}/{n}</span></div>
            <div className="mt-1 h-2 overflow-hidden rounded bg-[color:var(--color-q2-arctic)]">
              <i className={`block h-full ${c / n < 0.6 ? 'bg-[color:var(--color-ember)]' : 'bg-[color:var(--g-mid)]'}`} style={{ width: `${Math.round((c / n) * 100)}%` }} />
            </div>
          </div>
        ))}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button type="button" onClick={onReplay} className="rounded-full bg-[color:var(--g-deep)] px-4 py-2 text-[13px] font-semibold text-white">Play again (new questions)</button>
          <Link to={`${cat.base}/${next.id}`} className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-[13px] font-semibold">Next: {next.title}</Link>
        </div>
        {worst && <p className="text-[12.5px] text-[color:var(--color-ink-2)]">Most missed: <b>{cat.ideas[worst[0]] ?? worst[0]}</b>. The next rounds will give you more of these.</p>}
      </div>
    </div>
  );
}
