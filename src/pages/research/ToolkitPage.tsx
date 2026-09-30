import { Link } from 'react-router-dom';
import { Container } from '../../components/primitives';
import { NoteBox, NoteTile, TileGrid } from '../../components/NoteTiles';
import { Q2Header } from './components/Q2Header';
import { Q2Tabs } from './components/Q2Tabs';
import { Quiz } from './components/Quiz';
import { CueCards } from './components/CueCards';
import { useHashTab } from './lib/useHashTab';
import {
  GLOSSARY, METHOD_QUIZ, METHODS, RELIABILITY, RESEARCH_DESIGN_CHECK, SOURCES, TESTING_CUES,
} from './data/toolkit';

const TABS = [
  { id: 'methods', label: 'Methods' },
  { id: 'sources', label: 'Sources' },
  { id: 'reliability', label: 'Reliability (Q3)' },
  { id: 'design-check', label: 'Research-design check (2a)' },
  { id: 'testing', label: 'Testing a claim (2b)' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'quiz', label: 'Quiz' },
] as const;
type TabId = (typeof TABS)[number]['id'];
const IDS = TABS.map((t) => t.id);

const h2 = 'font-display text-[26px] md:text-[32px] leading-[1.15] tracking-[-0.015em] text-[color:var(--color-q2-sea)]';
const lede = 'mt-2 max-w-[66ch] text-[15px] text-[color:var(--color-ink-2)]';
const tag = 'inline-block font-mono text-[10px] font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-[3px] bg-[color:var(--color-q2-arctic)] text-[color:var(--color-q2-sea)]';

export function ToolkitPage() {
  const [tab, setTab] = useHashTab<TabId>(IDS, 'methods');
  return (
    <div className="q2-page pb-20">
      <Q2Header
        tone="hub"
        label="Toolkit · used in 2(a), 2(b), Q3, Report, Project"
        title="The Toolkit"
        lede={<p>The words and checks both parts of Question 2 need. Learn them once here; you will use them in 2(a), 2(b), Question 3, your Individual Report and your Team Project.</p>}
      >
        <Q2Tabs tabs={TABS} active={tab} onChange={setTab} />
      </Q2Header>

      <Container size="wide" className="pt-9">
        {tab === 'methods' && (
          <section>
            <h2 className={h2}>Eight research methods</h2>
            <p className={lede}>For each: what it is, the data it gives you, and when it helps in 2(b).</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {METHODS.map((m) => (
                <article key={m.id} className="rounded-[8px] border border-[color:var(--color-line)] border-t-[4px] border-t-[color:var(--color-q2-storm)] bg-white p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-[21px] text-[color:var(--color-q2-sea)]">{m.name}</h3>
                    <div className="flex flex-wrap gap-1">{m.tags.map((t) => <span key={t} className={tag}>{t}</span>)}</div>
                  </div>
                  <p className="mt-1 text-[15px] leading-[1.55] text-[color:var(--color-ink-2)]">{m.what}</p>
                  <p className="mt-2 text-[15px] leading-[1.55]"><b className="text-[color:var(--color-q2-sea)]">Gives you:</b> {m.data}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <NoteBox tone="good" label="Pros">{m.pros.map((x) => <p key={x} className="mt-0.5">{x}</p>)}</NoteBox>
                    <NoteBox tone="bad" label="Cons">{m.cons.map((x) => <p key={x} className="mt-0.5">{x}</p>)}</NoteBox>
                  </div>
                  <p className="mt-2 rounded-[6px] bg-[color:var(--color-q2-arctic)] px-4 py-2.5 text-[15px] leading-[1.5] text-[color:var(--color-q2-sea)]"><b>In 2(b):</b> {m.useIn2b}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === 'sources' && (
          <section>
            <h2 className={h2}>Five sources of information</h2>
            <p className={lede}>Judge each on reliability (bias?), accessibility, and breadth versus depth. These become the <b>Who</b> column in 2(b).</p>
            <TileGrid cols={3} className="mt-6">
              {SOURCES.map((s) => (
                <NoteTile key={s.id} accent="var(--color-q2-storm)" title={s.name}>
                  <p><b className="text-[color:var(--color-q2-sea)]">Reliability.</b> {s.reliability}</p>
                  <p className="mt-1.5"><b className="text-[color:var(--color-q2-sea)]">Access.</b> {s.accessibility}</p>
                  <p className="mt-1.5"><b className="text-[color:var(--color-q2-sea)]">Breadth vs depth.</b> {s.breadthDepth}</p>
                  <p className="mt-2.5 flex flex-wrap gap-1">
                    {s.whoExamples.map((w) => <span key={w} className="rounded-[3px] bg-[color:var(--color-q2-coastal-tint)] px-2 py-0.5 text-[13px] text-[color:var(--color-q2-sea)]">{w}</span>)}
                  </p>
                </NoteTile>
              ))}
            </TileGrid>
          </section>
        )}

        {tab === 'reliability' && (
          <section>
            <h2 className={h2}>Is this person or source reliable?</h2>
            <p className={lede}>The checklist for Question 3, and for judging <em>who was asked</em> in 2(a).</p>
            <TileGrid cols={4} className="mt-6">
              {RELIABILITY.map((r) => (
                <NoteTile key={r.id} accent="var(--color-q2-sage)" title={r.label}>
                  <p>{r.ask}</p>
                  <p className="mt-2 rounded-[4px] bg-[color:var(--color-q2-ivory-tint)] px-2.5 py-1.5 italic text-[color:var(--color-ink)]">“{r.model}”</p>
                </NoteTile>
              ))}
            </TileGrid>
          </section>
        )}

        {tab === 'design-check' && (
          <section>
            <h2 className={h2}>Where to look in Source 3</h2>
            <p className={lede}>Ask these seven questions of any research in 2(a). Each answer is a strength or a weakness.</p>
            <TileGrid cols={3} className="mt-6">
              {RESEARCH_DESIGN_CHECK.map((c, i) => (
                <NoteTile key={c.id} accent="var(--color-q2-night)" eyebrow={`Check ${i + 1}`} title={c.question}>
                  <div className="mt-2 grid gap-1.5">
                    <NoteBox tone="good" label="Strength if">{c.strengthIf}</NoteBox>
                    <NoteBox tone="bad" label="Weakness if">{c.weaknessIf}</NoteBox>
                  </div>
                </NoteTile>
              ))}
            </TileGrid>
          </section>
        )}

        {tab === 'testing' && (
          <section>
            <h2 className={h2}>Testing a claim: what makes a strong “Why”</h2>
            <p className={lede}>Use these six checks to justify each method in your 2(b) matrix. Justify; don’t critique.</p>
            <CueCards cues={TESTING_CUES} />
          </section>
        )}

        {tab === 'glossary' && (
          <section>
            <h2 className={h2}>Glossary</h2>
            <TileGrid cols={3} className="mt-6">
              {GLOSSARY.map((g) => (
                <NoteTile key={g.term} accent="var(--color-q2-olive)" title={g.term}>{g.meaning}</NoteTile>
              ))}
            </TileGrid>
          </section>
        )}

        {tab === 'quiz' && (
          <section>
            <h2 className={h2}>Method ↔ data quiz</h2>
            <p className={lede}>Eight questions. Your score is saved to <Link className="underline text-[color:var(--color-q2-storm)]" to="/my-learning">My learning</Link>.</p>
            <Quiz activityId="quiz-methods" title="Toolkit · method ↔ data quiz" questions={METHOD_QUIZ} />
          </section>
        )}
      </Container>
    </div>
  );
}
