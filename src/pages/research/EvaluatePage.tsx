import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/primitives';
import { NoteTile, TileGrid } from '../../components/NoteTiles';
import { ExportFooter } from '../../components/ExportFooter';
import { useNotesExport } from '../../lib/useNotesExport';
import { ChainBuilder, chainsToBlocks, readChains } from './components/ChainBuilder';
import { Checklist } from './components/Checklist';
import { ExaminerNote } from './components/ExaminerNote';
import { LevelLadder } from './components/LevelLadder';
import { MarkCard, PointTarget } from './components/MarkCard';
import { Q2Header } from './components/Q2Header';
import { Q2Tabs } from './components/Q2Tabs';
import { WorksheetPrinter } from './components/WorksheetPrinter';
import { Quiz } from './components/Quiz';
import { SourceAnnotator } from './components/SourceAnnotator';
import { getItem } from './data/bank';
import { EVALUATE_CHECKLIST, EVALUATE_LEVELS, EVALUATE_TRAPS, SPOT_QUIZ } from './data/evaluate';
import { RESEARCH_DESIGN_CHECK } from './data/toolkit';
import { useHashTab } from './lib/useHashTab';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'move', label: 'The move' },
  { id: 'traps', label: 'Traps' },
  { id: 'worked', label: 'Worked examples' },
  { id: 'practice', label: 'Practice' },
  { id: 'checklist', label: 'Checklist' },
] as const;
type TabId = (typeof TABS)[number]['id'];
const IDS = TABS.map((t) => t.id);

// Same store the practice bank uses for this item, so both views edit one answer.
const PRACTICE_STORE = 'research_bank_m-j26-12-a_a';
const h2 = 'font-display text-[26px] md:text-[32px] leading-[1.15] tracking-[-0.015em] text-[color:var(--color-q2-sea)]';
const body = 'mt-2 max-w-[66ch] text-[15px] text-[color:var(--color-ink-2)]';

export function EvaluatePage() {
  const [tab, setTab] = useHashTab<TabId>(IDS, 'overview');
  const model = getItem('r-j26-12')!;
  const practice = getItem('m-j26-12-a')!;
  const [sel, setSel] = useState<string>('W1');
  const feature = model.features.find((f) => f.id === sel)!;

  useNotesExport({
    toolId: 'research_eval',
    pageTitleEn: 'Q2(a) — Strong or Shaky?',
    subtitleEn: 'IGCSE Global Perspectives 0457 · Student worksheet',
    filenameStem: 'GP_Q2a',
    studentNameSelector: '#wne-student-name',
    exportDocxSelector: '#wne-export-docx',
    exportPdfSelector: '#wne-export-pdf',
    openNotesSelector: '#wne-open-notes',
    collect: () => ({ sections: [{ heading: 'Practice — Food waste (mirror paper)', blocks: chainsToBlocks(readChains(PRACTICE_STORE)) }] }),
  });

  return (
    <div className="q2-page">
      <Q2Header tone="a" label="Question 2(a) · Evaluate research" title="Strong or Shaky?" subtitle="Judging the strengths and weaknesses of research">
        <WorksheetPrinter kind="a" defaultItemId="m-j26-12-a" />
        <Q2Tabs tabs={TABS} active={tab} onChange={setTab} />
      </Q2Header>

      <Container size="wide">
        <div className="grid gap-8 py-9 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-11">
          <MarkCard marks={8} table="Table C" time="~10 min" command="Explain"
            rule={<p><strong>Level 4 (7–8):</strong> a wide range of reasoned points, <strong>both</strong> strengths and weaknesses, clearly tied to the purpose.</p>}
            target={<><PointTarget s={3} w={2} /><p className="mt-2 text-[13px]">Aim for <strong>5 explained points</strong>, e.g. 3 + 2 or 2 + 3. Minimum 2 + 2.</p></>} />

          <div className="min-w-0 lg:order-first">
            {tab === 'overview' && (
              <section>
                <h2 className={h2}>What Q2(a) really asks</h2>
                <blockquote className="mt-4 rounded-[6px] border border-[color:var(--color-line)] bg-white px-4 py-3 font-display text-[19px] text-[color:var(--color-q2-sea)]">
                  Explain the strengths and weaknesses of the research outlined in Source 3. [8]
                </blockquote>
                <p className={body}>You are judging the <b>method</b>, not the topic: who was asked, how, where, how it was recorded, and whether the conclusion fits. Every point is a three-step chain:</p>
                <ol className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    ['What they did', 'Quote or name the feature from Source 3.'],
                    ['Effect on the evidence', 'Does it make the data more or less accurate, honest, complete or representative?'],
                    ['Link to the aim', 'So is the research more or less useful for finding out what it set out to find?'],
                  ].map(([t, d], i) => (
                    <li key={t} className="rounded-[6px] border border-[color:var(--color-line)] bg-white px-4 py-3">
                      <span className="flex items-center gap-2 text-[12px] font-bold text-[color:var(--color-q2-storm)]">
                        <i className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[color:var(--color-q2-storm)] text-[10px] not-italic text-white">{i + 1}</i>{t}
                      </span>
                      <p className="mt-1 text-[15px]">{d}</p>
                    </li>
                  ))}
                </ol>
                <h3 className="mt-8 font-display text-[22px] text-[color:var(--color-q2-sea)]">Where to look in Source 3</h3>
                <TileGrid cols={4} className="mt-3">
                  {RESEARCH_DESIGN_CHECK.map((c, i) => (
                    <NoteTile key={c.id} accent="var(--color-q2-storm)" eyebrow={`Check ${i + 1}`}>
                      <span className="font-display text-[18px] leading-snug text-[color:var(--color-ink)]">{c.question}</span>
                    </NoteTile>
                  ))}
                </TileGrid>
                <p className="mt-2 text-[13px] text-[color:var(--color-ink-3)]">Strength and weakness wording for each is in the <Link to="/research/toolkit#design-check" className="underline">Toolkit</Link>.</p>
                <ExaminerNote source="Principal Examiner Report · June 2026"
                  quote="Some candidates focused only on strengths or weaknesses of the research and therefore omitted part of the question."
                  action="always cover both. Level 4 names both strengths and weaknesses." />
              </section>
            )}

            {tab === 'move' && (
              <section>
                <h2 className={h2}>Find it, then follow it through.</h2>
                <p className={body}>Tap a highlighted phrase. Blue helps the research; red weakens it. The marks come from explaining <em>why</em>, in three steps.</p>
                <SourceAnnotator item={model} selected={sel} onSelect={setSel} />
                <div className="mt-4 overflow-hidden rounded-[8px] border border-[#CBD6E0] bg-white" aria-live="polite">
                  <div className="flex items-center justify-between gap-2 bg-[color:var(--color-q2-night)] px-3.5 py-2 text-[12.5px] text-white">
                    <span><b>{feature.id}</b> · “{feature.quote}”</span>
                    <span className={`rounded-[3px] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] ${feature.kind === 'S' ? 'bg-[color:var(--color-q2-coastal)] text-[color:var(--color-q2-sea)]' : 'bg-[#E9A08F] text-[#3A1109]'}`}>
                      {feature.kind === 'S' ? 'Strength' : 'Weakness'}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3">
                    {([['1 · What they did', feature.chain.what, 'The researcher only…'], ['2 · Effect on the evidence', feature.chain.effect, 'This means the evidence may be…'], ['3 · Link to the aim', feature.chain.aim, '…so it is less useful for finding out…']] as const).map(([l, t, st], i) => (
                      <div key={l} className={`px-3.5 py-3 ${i ? 'border-t md:border-t-0 md:border-l border-[color:var(--color-line-soft)]' : ''}`}>
                        <span className="text-[11px] font-bold text-[color:var(--color-q2-storm)]">{l}</span>
                        <p className="mt-1 text-[15px] leading-[1.5]">{t}</p>
                        <p className="mt-1 text-[11.5px] text-[color:var(--color-ink-3)]">“{st}”</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-[13px] text-[color:var(--color-ink-2)]">This source has {model.features.filter((f) => f.kind === 'S').length} strengths and {model.features.filter((f) => f.kind === 'W').length} weaknesses highlighted. A Level 4 answer explains about five of them.</p>
                <ExaminerNote source="Principal Examiner Report · June 2026"
                  quote="Some candidates discussed general strengths and weaknesses of different methods, some of which were not part of the research in the source."
                  action="only judge what Source 3 actually did. If the source doesn't mention it, don't evaluate it." />
              </section>
            )}

            {tab === 'traps' && (
              <section>
                <h2 className={h2}>Five ways to lose marks</h2>
                <div className="mt-2 space-y-8">
                  {EVALUATE_TRAPS.map((t) => (
                    <article key={t.id}>
                      <h3 className="font-display text-[21px] text-[color:var(--color-q2-sea)]">{t.title}</h3>
                      <ExaminerNote compact source={t.source} quote={t.quote} action="rewrite it like the “Better” version." />
                      <div className="mt-3 grid gap-3 md:grid-cols-2 text-[15px]">
                        <p className="rounded-[6px] bg-[color:var(--color-paper-2)] px-4 py-3"><b className="mb-1 block font-mono text-[10.5px] uppercase tracking-[0.12em] text-[color:var(--color-ember)]">Weak</b>{t.before}</p>
                        <p className="rounded-[6px] border border-[color:var(--color-line)] bg-white px-4 py-3"><b className="mb-1 block font-mono text-[10.5px] uppercase tracking-[0.12em] text-[color:var(--color-q2-storm)]">Better</b>{t.after}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {tab === 'worked' && (
              <section>
                <h2 className={h2}>The same source at every level</h2>
                <p className={body}>Source 3: vehicle crime, one building firm (reworded from June 2026 · 0457/12).</p>
                <LevelLadder levels={EVALUATE_LEVELS} />
                <h3 className="mt-10 font-display text-[24px] text-[color:var(--color-q2-sea)]">Now spot them: strength or weakness?</h3>
                <Quiz activityId="quiz-spot" title="Strong or Shaky? · spot-it quiz" questions={SPOT_QUIZ} />
              </section>
            )}

            {tab === 'practice' && (
              <section>
                <h2 className={h2}>Your turn: food waste, one café</h2>
                <p className={body}>A mirror paper built on the same structure as June 2026 /12. Aim for five explained points.</p>
                <ChainBuilder item={practice} storageId={PRACTICE_STORE} activityId={`answer-2a:${practice.id}`} activityTitle={`Practice · ${practice.title} (mirror) · 2(a)`} />
                <p className="mt-6 text-[14px]"><Link to={`/research/practice/${practice.id}`} className="font-semibold text-[color:var(--color-q2-storm)] underline">Check against the answer scheme →</Link> <span className="text-[color:var(--color-ink-3)]">· 32 more in the <Link to="/research/practice" className="underline">practice bank</Link></span></p>
              </section>
            )}

            {tab === 'checklist' && (
              <section>
                <h2 className={h2}>Before you move on</h2>
                <Checklist activityId="checklist-2a" title="Checklist · 2(a)" items={EVALUATE_CHECKLIST} />
              </section>
            )}
          </div>
        </div>
      </Container>
      <ExportFooter toolId="research_eval" />
    </div>
  );
}
