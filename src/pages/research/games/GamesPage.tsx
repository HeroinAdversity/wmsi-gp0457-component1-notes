import { Link } from 'react-router-dom';
import { GamesShell, activityOf, type GameCatalog } from '../../../components/games/GameShell';
import { Q2Header } from '../components/Q2Header';
import { IDEAS } from './ideas';
import { GAMES, buildRound, unitsOf, type GameId, type Question } from './generate';
import { ChainOrderView, ChoiceView, MatchView, SpotView, SplitView, UntestedView, type Outcome } from './GameQuestions';

function PartTag({ part }: { part: string }) {
  const cls = part === 'a' ? 'bg-[color:var(--color-q2-night)] text-white' : part === 'b' ? 'bg-[color:var(--color-q2-sage)] text-white' : 'bg-[color:var(--color-q2-ivory)] text-[color:var(--color-q2-sea)]';
  return <span className={`rounded-[3px] px-1.5 py-0.5 font-mono text-[10.5px] font-semibold ${cls}`}>{part === 'mix' ? 'Mix' : `2(${part})`}</span>;
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

function Header() {
  return (
    <Q2Header tone="hub" label="Research · Practice games" title="Train one move at a time"
      lede={<p>About three minutes a round. Every round draws fresh questions from all 33 practice papers, and your scores are saved to <Link to="/my-learning" className="underline text-[color:var(--color-q2-storm)]">My learning</Link>. Start with the one marked <b>Your weakest</b>.</p>} />
  );
}

export const Q2_GAMES: GameCatalog<Question> = {
  base: '/research/games',
  games: GAMES,
  mixedId: 'mixed',
  buildRound: (id, opts) => buildRound(id as GameId, opts),
  unitsOf,
  QuestionView,
  questionTitle: (q) => QUESTION_TITLE[q.type],
  ideas: IDEAS,
  PartTag,
  stripClass: (part) => (part === 'b' ? 'bg-[color:var(--color-q2-sage-ink)]' : 'bg-[color:var(--color-q2-night)]'),
  theme: {
    '--g-deep': 'var(--color-q2-sea)', '--g-mid': 'var(--color-q2-storm)', '--g-soft': 'var(--color-q2-ivory)', '--g-star': 'var(--color-q2-olive)',
  } as React.CSSProperties,
  pageClass: 'q2-page',
  Header,
  activityId: activityOf,
};

export function GamesPage() {
  return <GamesShell cat={Q2_GAMES} />;
}
