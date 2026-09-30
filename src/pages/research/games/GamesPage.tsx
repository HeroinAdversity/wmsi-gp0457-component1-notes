import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container } from '../../../components/primitives';
import { useProgress, type GameStats } from '../../../lib/progress';
import { Q2Header } from '../components/Q2Header';
import { IDEAS, type IdeaId } from './ideas';
import { GAMES, buildRound, gameInfo, unitsOf, type GameId, type Question } from './generate';
import { ChainOrderView, ChoiceView, MatchView, SpotView, SplitView, UntestedView, type Outcome } from './GameQuestions';
import { applyRound, stars, weaknessMap } from './stats';

const activityId = (id: GameId) => `game-${id}`;

function useGameStats() {
  const { state } = useProgress();
  return useMemo(() => {
    const byGame = {} as Record<GameId, GameStats | undefined>;
    for (const g of GAMES) byGame[g.id] = state.activities[activityId(g.id)]?.game;
    return byGame;
  }, [state]);
}

/** The game with the lowest recent accuracy (untried games count as weakest). */
function weakestGame(stats: Record<GameId, GameStats | undefined>): GameId {
  const playable = GAMES.filter((g) => g.id !== 'mixed');
  const untried = playable.find((g) => !stats[g.id]);
  if (untried) return untried.id;
  return playable.reduce((a, b) => ((stats[b.id]?.ar ?? 1) < (stats[a.id]?.ar ?? 1) ? b : a)).id;
}

function Stars({ n }: { n: number }) {
  return <span className="tracking-[1px] text-[color:var(--color-q2-olive)]" aria-label={`${n} of 3 stars`}>{'★'.repeat(n)}{'☆'.repeat(3 - n)}</span>;
}

function PartTag({ part }: { part: 'a' | 'b' | 'mix' }) {
  const cls = part === 'a' ? 'bg-[color:var(--color-q2-night)] text-white' : part === 'b' ? 'bg-[color:var(--color-q2-sage)] text-white' : 'bg-[color:var(--color-q2-ivory)] text-[color:var(--color-q2-sea)]';
  return <span className={`rounded-[3px] px-1.5 py-0.5 font-mono text-[10.5px] font-semibold ${cls}`}>{part === 'mix' ? 'Mix' : `2(${part})`}</span>;
}

export function GamesPage() {
  const { gameId } = useParams();
  const game = GAMES.find((g) => g.id === gameId);
  return game ? <GamePlayer key={game.id} id={game.id} /> : <GameHub />;
}

function GameHub() {
  const stats = useGameStats();
  const weakest = weakestGame(stats);
  return (
    <div className="q2-page pb-6">
      <Q2Header tone="hub" label="Research · Practice games" title="Train one move at a time"
        lede={<p>About three minutes a round. Every round draws fresh questions from all 33 practice papers, and your scores are saved to <Link to="/my-learning" className="underline text-[color:var(--color-q2-storm)]">My learning</Link>. Start with the one marked <b>Your weakest</b>.</p>} />
      <Container size="wide">
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((g) => {
            const s = stats[g.id];
            const mixed = g.id === 'mixed';
            return (
              <Link key={g.id} to={`/research/games/${g.id}`}
                className={`flex flex-col gap-1.5 rounded-[10px] border p-3.5 transition-colors ${mixed ? 'border-[color:var(--color-q2-sea)] bg-[color:var(--color-q2-sea)] text-white' : g.id === weakest ? 'border-[color:var(--color-q2-storm)] bg-white shadow-[0_0_0_1px_var(--color-q2-storm)]' : 'border-[color:var(--color-line)] bg-white hover:border-[color:var(--color-q2-storm)]'}`}>
                <div className="flex items-center justify-between">
                  <PartTag part={g.part} />
                  {g.id === weakest && !mixed
                    ? <span className="rounded-[3px] bg-[color:var(--color-q2-ivory)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--color-q2-sea)]">Your weakest</span>
                    : !mixed && <Stars n={stars(s, g.rounds)} />}
                </div>
                <h3 className={`font-display text-[20px] leading-[1.15] ${mixed ? 'text-white' : 'text-[color:var(--color-q2-sea)]'}`}>{g.title}</h3>
                <p className={`text-[13px] ${mixed ? 'text-[#cfd9e3]' : 'text-[color:var(--color-ink-2)]'}`}>{g.blurb}</p>
                <div className={`mt-auto flex justify-between pt-2 font-mono text-[10.5px] ${mixed ? 'text-[#cfd9e3]' : 'text-[color:var(--color-ink-3)]'}`}>
                  <span>{g.skill}</span>
                  <span>{s ? `best ${s.b} · ${s.r} round${s.r > 1 ? 's' : ''}` : 'not tried'}</span>
                </div>
              </Link>
            );
          })}
        </div>
        <p className="mt-5 max-w-[70ch] text-[13px] text-[color:var(--color-ink-3)]">Your teacher sees your game totals when you send your results from My learning. Only your teacher sees names.</p>
      </Container>
    </div>
  );
}

function QuestionView({ q, onDone }: { q: Question; onDone: (o: Outcome) => void }) {
  switch (q.type) {
    case 'chain-order': return <ChainOrderView q={q} onDone={onDone} />;
    case 'missing-link': case 'fix-it': return <ChoiceView q={q} onDone={onDone} />;
    case 'spot-it': return <SpotView q={q} onDone={onDone} />;
    case 'claim-splitter': return <SplitView q={q} onDone={onDone} />;
    case 'method-match': return <MatchView q={q} onDone={onDone} />;
    case 'untested': return <UntestedView q={q} onDone={onDone} />;
  }
}

const QUESTION_TITLE: Record<Question['type'], string> = {
  'chain-order': 'Chain order', 'missing-link': 'Missing link', 'fix-it': 'Fix it', 'spot-it': 'Spot it',
  'claim-splitter': 'Claim splitter', 'method-match': 'Method match', untested: 'What’s untested?',
};

function GamePlayer({ id }: { id: GameId }) {
  const info = gameInfo(id);
  const { state, record } = useProgress();
  const allStats = useGameStats();
  const [seed, setSeed] = useState(() => Date.now());
  const questions = useMemo(
    () => buildRound(id, { seed, weakness: weaknessMap(Object.values(allStats)) }),
    [id, seed], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const [at, setAt] = useState(0);
  const [results, setResults] = useState<(Outcome | null)[]>([]);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState<{ correct: number; total: number; ideas: Outcome['ideas']; prevBest: number } | null>(null);

  const q = questions[at];
  const answered = results[at] != null;
  const units = questions.reduce((n, x) => n + unitsOf(x), 0);

  const onDone = (o: Outcome) => {
    setResults((r) => { const n = [...r]; n[at] = o; return n; });
    setStreak((s) => (o.correct === o.total ? s + 1 : 0));
  };

  const finish = () => {
    const all = results.filter((r): r is Outcome => r != null);
    const ideas: Outcome['ideas'] = {};
    for (const r of all) for (const [k, [c, n]] of Object.entries(r.ideas) as [IdeaId, [number, number]][]) {
      const [pc, pn] = ideas[k] ?? [0, 0];
      ideas[k] = [pc + c, pn + n];
    }
    const correct = all.reduce((n, r) => n + r.correct, 0);
    const prev = state.activities[activityId(id)]?.game;
    record({ id: activityId(id), title: `Game · ${info.title}`, kind: 'game', status: 'done', score: correct, max: units, game: applyRound(prev, { correct, total: units, ideas }) });
    setFinished({ correct, total: units, ideas, prevBest: prev?.b ?? -1 });
  };

  const replay = () => { setSeed(Date.now()); setAt(0); setResults([]); setStreak(0); setFinished(null); };
  const dark = info.part === 'b' ? 'bg-[color:var(--color-q2-sage-ink)]' : 'bg-[color:var(--color-q2-night)]';

  return (
    <div className="q2-page pb-6">
      {/* data-no-notes: tapping text is part of play, so no highlighting here. */}
      <div data-no-notes>
      <Container size="narrow" className="pt-8">
        <p className="text-[13px]"><Link to="/research/games" className="font-semibold text-[color:var(--color-q2-storm)]">← All games</Link></p>
        {finished ? (
          <RoundResult info={info} result={finished} onReplay={replay} stats={allStats} />
        ) : (
          <div className="mt-3 overflow-hidden rounded-[12px] border border-[color:var(--color-line)] bg-white">
            <div className={`flex flex-wrap items-center gap-2.5 px-4 py-2.5 text-[12.5px] text-white ${dark}`}>
              <span className="font-bold">{id === 'mixed' ? `Mixed · ${QUESTION_TITLE[q.type]}` : info.title}</span>
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
                    ? <button type="button" onClick={() => setAt((n) => n + 1)} className="rounded-full bg-[color:var(--color-q2-sea)] px-4 py-2 text-[13px] font-semibold text-white">Next →</button>
                    : <button type="button" onClick={finish} className="rounded-full bg-[color:var(--color-q2-sea)] px-4 py-2 text-[13px] font-semibold text-white">See my results</button>}
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
      </div>
    </div>
  );
}

function RoundResult({ info, result, onReplay, stats }: {
  info: ReturnType<typeof gameInfo>;
  result: { correct: number; total: number; ideas: Outcome['ideas']; prevBest: number };
  onReplay: () => void;
  stats: Record<GameId, GameStats | undefined>;
}) {
  const pct = result.total ? result.correct / result.total : 0;
  const circ = 2 * Math.PI * 50;
  const ideas = (Object.entries(result.ideas) as [IdeaId, [number, number]][]).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]);
  const worst = ideas.find(([, [c, n]]) => c < n);
  const next = GAMES.find((g) => g.id === weakestGame(stats) && g.id !== info.id) ?? GAMES.find((g) => g.id === 'mixed')!;
  const delta = result.prevBest >= 0 ? result.correct - result.prevBest : null;
  return (
    <div className="mt-3 grid items-start gap-5 rounded-[12px] border border-[color:var(--color-line)] bg-white p-5 md:grid-cols-[250px_1fr]">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 120 120" className="h-[112px] w-[112px] shrink-0" aria-hidden>
          <circle cx="60" cy="60" r="50" stroke="var(--color-q2-arctic)" strokeWidth="12" fill="none" />
          <circle cx="60" cy="60" r="50" stroke="var(--color-q2-storm)" strokeWidth="12" fill="none" strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round" transform="rotate(-90 60 60)" />
          <text x="60" y="64" textAnchor="middle" fontFamily="DM Serif Display, serif" fontSize="28" fill="var(--color-q2-sea)">{result.correct}/{result.total}</text>
        </svg>
        <div>
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-q2-storm)]">End of round</p>
          <p className="font-display text-[22px] leading-[1.2] text-[color:var(--color-q2-sea)]">{info.title}</p>
          <p className="mt-1 text-[12.5px] text-[color:var(--color-ink-3)]">
            {delta === null ? 'First round' : delta > 0 ? `New best, +${delta}` : delta === 0 ? 'Equals your best' : `Best is ${result.prevBest}`} · saved to My learning ✓
          </p>
        </div>
      </div>
      <div className="grid gap-2 text-[13px]">
        <p className="text-[13.5px] font-bold">How you did, by idea</p>
        {ideas.map(([id, [c, n]]) => (
          <div key={id}>
            <div className="flex justify-between"><span>{IDEAS[id]}</span><span className="font-mono">{c}/{n}</span></div>
            <div className="mt-1 h-2 overflow-hidden rounded bg-[color:var(--color-q2-arctic)]">
              <i className={`block h-full ${c / n < 0.6 ? 'bg-[color:var(--color-ember)]' : 'bg-[color:var(--color-q2-storm)]'}`} style={{ width: `${Math.round((c / n) * 100)}%` }} />
            </div>
          </div>
        ))}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button type="button" onClick={onReplay} className="rounded-full bg-[color:var(--color-q2-sea)] px-4 py-2 text-[13px] font-semibold text-white">Play again (new questions)</button>
          <Link to={`/research/games/${next.id}`} className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-[13px] font-semibold">Next: {next.title}</Link>
        </div>
        {worst && <p className="text-[12.5px] text-[color:var(--color-ink-2)]">Most missed: <b>{IDEAS[worst[0]]}</b>. The next rounds will give you more of these.</p>}
      </div>
    </div>
  );
}
