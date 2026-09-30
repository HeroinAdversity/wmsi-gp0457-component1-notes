import { Link } from 'react-router-dom';
import { Container } from '../../components/primitives';
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
                <article key={m.id} className="rounded-[8px] border border-[color:var(--color-line)] bg-white p-5">
                  <h3 className="font-display text-[20px] text-[color:var(--color-q2-sea)]">{m.name}</h3>
                  <p className="mt-1 text-[13.5px] text-[color:var(--color-ink-2)]">{m.what}</p>
                  <p className="mt-2 text-[13.5px]"><b className="text-[color:var(--color-q2-sea)]">Gives you:</b> {m.data}</p>
                  <div className="mt-2 flex flex-wrap gap-1">{m.tags.map((t) => <span key={t} className={tag}>{t}</span>)}</div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 text-[13px]">
                    <div>
                      <p className="font-semibold text-[color:var(--color-q2-storm)]">Pros</p>
                      <ul className="mt-1 list-disc pl-4 space-y-0.5">{m.pros.map((x) => <li key={x}>{x}</li>)}</ul>
                    </div>
                    <div>
                      <p className="font-semibold text-[color:var(--color-ember)]">Cons</p>
                      <ul className="mt-1 list-disc pl-4 space-y-0.5">{m.cons.map((x) => <li key={x}>{x}</li>)}</ul>
                    </div>
                  </div>
                  <p className="mt-3 rounded-[5px] bg-[color:var(--color-q2-arctic)] px-3 py-2 text-[13px] text-[color:var(--color-q2-sea)]"><b>In 2(b):</b> {m.useIn2b}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === 'sources' && (
          <section>
            <h2 className={h2}>Five sources of information</h2>
            <p className={lede}>Judge each on reliability (bias?), accessibility, and breadth versus depth. These become the <b>Who</b> column in 2(b).</p>
            <div className="mt-6 hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-[13.5px]">
                <thead>
                  <tr className="text-left font-mono text-[10.5px] uppercase tracking-[0.1em] text-[color:var(--color-ink-3)]">
                    {['Source', 'Reliability', 'Access', 'Breadth vs depth', 'Who, for example'].map((h) => (
                      <th key={h} className="border-b border-[color:var(--color-q2-sea)] px-3 py-2 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SOURCES.map((s) => (
                    <tr key={s.id} className="align-top">
                      <td className="border-b border-[color:var(--color-line)] px-3 py-3 font-semibold text-[color:var(--color-q2-sea)]">{s.name}</td>
                      <td className="border-b border-[color:var(--color-line)] px-3 py-3">{s.reliability}</td>
                      <td className="border-b border-[color:var(--color-line)] px-3 py-3">{s.accessibility}</td>
                      <td className="border-b border-[color:var(--color-line)] px-3 py-3">{s.breadthDepth}</td>
                      <td className="border-b border-[color:var(--color-line)] px-3 py-3">{s.whoExamples.join(' · ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 space-y-3 md:hidden">
              {SOURCES.map((s) => (
                <article key={s.id} className="rounded-[8px] border border-[color:var(--color-line)] bg-white p-4 text-[13.5px]">
                  <h3 className="font-display text-[19px] text-[color:var(--color-q2-sea)]">{s.name}</h3>
                  <dl className="mt-2 space-y-1.5">
                    <div><dt className="inline font-semibold">Reliability: </dt><dd className="inline">{s.reliability}</dd></div>
                    <div><dt className="inline font-semibold">Access: </dt><dd className="inline">{s.accessibility}</dd></div>
                    <div><dt className="inline font-semibold">Breadth vs depth: </dt><dd className="inline">{s.breadthDepth}</dd></div>
                    <div><dt className="inline font-semibold">Who: </dt><dd className="inline">{s.whoExamples.join(' · ')}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === 'reliability' && (
          <section>
            <h2 className={h2}>Is this person or source reliable?</h2>
            <p className={lede}>The checklist for Question 3, and for judging <em>who was asked</em> in 2(a).</p>
            <dl className="mt-6 divide-y divide-[color:var(--color-line)] border-y border-[color:var(--color-line)]">
              {RELIABILITY.map((r) => (
                <div key={r.id} className="grid gap-1 py-3 md:grid-cols-[220px_1fr_1.4fr] md:gap-6 text-[13.5px]">
                  <dt className="font-semibold text-[color:var(--color-q2-sea)]">{r.label}</dt>
                  <dd className="m-0 text-[color:var(--color-ink-2)]">{r.ask}</dd>
                  <dd className="m-0 italic">“{r.model}”</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {tab === 'design-check' && (
          <section>
            <h2 className={h2}>Where to look in Source 3</h2>
            <p className={lede}>Ask these seven questions of any research in 2(a). Each answer is a strength or a weakness.</p>
            <dl className="mt-6 divide-y divide-[color:var(--color-line)] border-y border-[color:var(--color-line)]">
              {RESEARCH_DESIGN_CHECK.map((c, i) => (
                <div key={c.id} className="grid gap-1 py-3 md:grid-cols-[1.1fr_1fr_1fr] md:gap-6 text-[13.5px]">
                  <dt className="font-semibold text-[color:var(--color-q2-sea)]">{i + 1}. {c.question}</dt>
                  <dd className="m-0"><span className="font-semibold text-[color:var(--color-q2-storm)]">Strength if: </span>{c.strengthIf}</dd>
                  <dd className="m-0"><span className="font-semibold text-[color:var(--color-ember)]">Weakness if: </span>{c.weaknessIf}</dd>
                </div>
              ))}
            </dl>
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
            <dl className="mt-6 grid gap-x-8 md:grid-cols-2">
              {GLOSSARY.map((g) => (
                <div key={g.term} className="border-b border-[color:var(--color-line)] py-2.5 text-[13.5px]">
                  <dt className="font-semibold text-[color:var(--color-q2-sea)]">{g.term}</dt>
                  <dd className="m-0 text-[color:var(--color-ink-2)]">{g.meaning}</dd>
                </div>
              ))}
            </dl>
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
