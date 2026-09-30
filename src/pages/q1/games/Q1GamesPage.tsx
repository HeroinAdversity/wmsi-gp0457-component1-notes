import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../components/primitives';
import { GamesShell, activityOf, type GameCatalog } from '../../../components/games/GameShell';
import { Q1_BANK } from '../data/bank';
import { Q1_GAMES, Q1_IDEAS, buildQ1Round, q1UnitsOf, type Q1GameId, type Q1Question } from './generate';
import { Q1QuestionView } from './Q1GameQuestions';

const PART_COLOR: Record<string, string> = {
  a: 'var(--color-violet)', b: 'var(--color-cobalt)', c: 'var(--color-amber)', d: 'var(--color-forest)',
};

function PartTag({ part }: { part: string }) {
  if (part === 'mix') return <span className="rounded-[3px] bg-[color:var(--color-paper-3)] px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-[color:var(--color-ink)]">Mix</span>;
  return <span className="rounded-[3px] px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-white" style={{ background: PART_COLOR[part] }}>1({part})</span>;
}

function Header() {
  return (
    <section className="pt-10 md:pt-12">
      <Container size="wide">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-cobalt)]">Perspectives · Practice games</p>
        <h1 className="mt-3 font-display text-[40px] md:text-[60px] leading-[1.04] tracking-[-0.02em] text-[color:var(--color-ink)]">One step at a time</h1>
        <div className="mt-4 max-w-[64ch] text-[15.5px] md:text-[16.5px] leading-[1.6] text-[color:var(--color-ink-2)]">
          <p>About three minutes a round. Questions come from all {Q1_BANK.length} Question 1 practice papers, and your scores are saved to <Link to="/my-learning" className="underline text-[color:var(--color-cobalt)]">My learning</Link>. Start with the one marked <b>Your weakest</b>.</p>
        </div>
      </Container>
    </section>
  );
}

const STRIP: Record<string, string> = {
  a: 'bg-[color:var(--color-violet-deep)]', b: 'bg-[color:var(--color-cobalt-deep)]', c: 'bg-[color:var(--color-amber-deep)]', d: 'bg-[color:var(--color-forest-deep)]', mix: 'bg-[color:var(--color-ink)]',
};

const TITLES = Object.fromEntries(Q1_GAMES.map((g) => [g.id, g.title]));

export const Q1_GAME_CATALOG: GameCatalog<Q1Question> = {
  base: '/perspectives/games',
  games: Q1_GAMES,
  mixedId: 'q1-mixed',
  buildRound: (id, opts) => buildQ1Round(id as Q1GameId, opts),
  unitsOf: q1UnitsOf,
  QuestionView: Q1QuestionView,
  questionTitle: (q) => TITLES[q.game],
  ideas: Q1_IDEAS,
  PartTag,
  stripClass: (part) => STRIP[part] ?? STRIP.mix,
  theme: {
    '--g-deep': 'var(--color-ink)', '--g-mid': 'var(--color-cobalt)', '--g-soft': 'var(--color-cobalt-soft)', '--g-star': 'var(--color-amber)',
  } as CSSProperties,
  pageClass: 'q1-games',
  Header,
  activityId: activityOf,
};

export function Q1GamesPage() {
  return <GamesShell cat={Q1_GAME_CATALOG} />;
}
