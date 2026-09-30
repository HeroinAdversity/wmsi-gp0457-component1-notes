import { Link } from 'react-router-dom';
import { Container } from '../../components/primitives';
import { ExportFooter } from '../../components/ExportFooter';
import { useNotesExport } from '../../lib/useNotesExport';
import { Checklist } from './components/Checklist';
import { ClaimSplitter } from './components/ClaimSplitter';
import { ExaminerNote } from './components/ExaminerNote';
import { LevelLadder } from './components/LevelLadder';
import { MarkCard } from './components/MarkCard';
import { Q2Header } from './components/Q2Header';
import { Q2Tabs } from './components/Q2Tabs';
import { WorksheetPrinter } from './components/WorksheetPrinter';
import { Quiz } from './components/Quiz';
import { WhoHowWhatWhy, matrixToBlocks, readMatrix } from './components/WhoHowWhatWhy';
import { getItem } from './data/bank';
import { DESIGN_CHECKLIST, DESIGN_LEVELS, DESIGN_TRAPS, SPLIT_QUIZ } from './data/design';
import { useHashTab } from './lib/useHashTab';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'split', label: 'Split the claim' },
  { id: 'matrix', label: 'The matrix' },
  { id: 'traps', label: 'Traps' },
  { id: 'worked', label: 'Worked examples' },
  { id: 'practice', label: 'Practice' },
  { id: 'checklist', label: 'Checklist' },
] as const;
type TabId = (typeof TABS)[number]['id'];
const IDS = TABS.map((t) => t.id);

// Same stores the practice bank uses for these items, so both views edit one answer.
const MATRIX_STORE = 'research_bank_r-j26-12_b';
const PRACTICE_STORE = 'research_bank_m-j26-12-a_b';
const h2 = 'font-display text-[26px] md:text-[32px] leading-[1.15] tracking-[-0.015em] text-[color:var(--color-q2-sea)]';
const body = 'mt-2 max-w-[66ch] text-[15px] text-[color:var(--color-ink-2)]';

const WHWW = [
  ['Who', 'will I get the information from?', 'Experts, organisations, people with experience. Be specific.'],
  ['How', 'will I get it?', 'The method: survey, interview, secondary data analysis, observation…'],
  ['What', 'will I find out?', 'The evidence, and its type: quantitative or qualitative, primary or secondary.'],
  ['Why', 'does that test the claim?', 'Name the part of the claim it tests and why this source can tell you.'],
] as const;

export function DesignPage() {
  const [tab, setTab] = useHashTab<TabId>(IDS, 'overview');
  const model = getItem('r-j26-12')!;
  const practice = getItem('m-j26-12-a')!;

  useNotesExport({
    toolId: 'research_design',
    pageTitleEn: 'Q2(b) — The Test Bench',
    subtitleEn: 'IGCSE Global Perspectives 0457 · Student worksheet',
    filenameStem: 'GP_Q2b',
    studentNameSelector: '#wne-student-name',
    exportDocxSelector: '#wne-export-docx',
    exportPdfSelector: '#wne-export-pdf',
    openNotesSelector: '#wne-open-notes',
    collect: () => ({ sections: [
      { heading: `Matrix — “${model.claim.text}”`, blocks: matrixToBlocks(readMatrix(MATRIX_STORE)) },
      { heading: `Practice — “${practice.claim.text}”`, blocks: matrixToBlocks(readMatrix(PRACTICE_STORE)) },
    ] }),
  });

  return (
    <div className="q2-page">
      <Q2Header tone="b" label="Question 2(b) · Research design" title="The Test Bench" subtitle="Designing research to test a claim">
        <WorksheetPrinter kind="b" defaultItemId="m-j26-12-a" />
        <Q2Tabs tabs={TABS} active={tab} onChange={setTab} />
      </Q2Header>

      <Container size="wide">
        <div className="grid gap-8 py-9 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-11">
          <MarkCard marks={8} table="Table D" time="~10 min" command="Explain"
            rule={<p><strong>Level 4 (7–8):</strong> a wide range of methods <strong>and</strong> evidence, each explained and clearly tied to testing the claim.</p>}
            target={<p className="text-[13px]"><strong>Target:</strong> 3 fully explained rows (4 is safer), plus one line comparing the results.</p>} />

          <div className="min-w-0 lg:order-first">
            {tab === 'overview' && (
              <section>
                <h2 className={h2}>What Q2(b) really asks</h2>
                <blockquote className="mt-4 rounded-[6px] border border-[color:var(--color-line)] bg-white px-4 py-3 font-display text-[19px] text-[color:var(--color-q2-sea)]">
                  “&lt;claim&gt;” Explain how this claim could be tested. You should consider the research methods and evidence that could be used. [8]
                </blockquote>
                <p className={body}><b>Don’t argue the issue. Don’t critique your methods. Design the test.</b> For each method, fill four boxes:</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {WHWW.map(([t, q, d]) => (
                    <div key={t} className="rounded-[6px] border border-[color:var(--color-line)] bg-white px-4 py-3">
                      <p className="font-display text-[22px] text-[color:var(--color-q2-sea)]">{t} <span className="font-body text-[13px] text-[color:var(--color-ink-3)]">{q}</span></p>
                      <p className="mt-1 text-[13.5px] text-[color:var(--color-ink-2)]">{d}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 rounded-[5px] bg-[color:var(--color-q2-arctic)] px-4 py-3 text-[13.5px] text-[color:var(--color-q2-sea)]">
                  <b>Where it pays again:</b> your Team Project plan (Table A) must say how the action will be evidenced and how its success will be measured. That is this matrix, pointed at your own project.
                </p>
                <ExaminerNote source="Principal Examiner Report · June 2026"
                  quote="Most candidates clearly and explicitly related their research design to the purpose of the research, which was to test the claim. This included both aspects of the claim."
                  action="split the claim first, then make sure every part is tested." />
              </section>
            )}

            {tab === 'split' && (
              <section>
                <h2 className={h2}>Split the claim before you plan</h2>
                <p className={body}>Every claim has parts. Each part tells you something your research must include.</p>
                <ClaimSplitter claim={model.claim} source="Reworded from June 2026 · 0457/12" />
                <h3 className="mt-10 font-display text-[24px] text-[color:var(--color-q2-sea)]">Quick check: what does each claim need?</h3>
                <Quiz activityId="quiz-split" title="Test Bench · split-the-claim quiz" questions={SPLIT_QUIZ} />
              </section>
            )}

            {tab === 'matrix' && (
              <section>
                <h2 className={h2}>Three rows. Every part of the claim.</h2>
                <ClaimSplitter claim={model.claim} source="Reworded from June 2026 · 0457/12" />
                <h3 className="mt-7 font-display text-[21px] text-[color:var(--color-q2-sea)]">Worked row — how one method is written</h3>
                <p className="mt-1 text-[13.5px] text-[color:var(--color-ink-2)]">Every box filled, the evidence type named, and the parts of the claim it tests.</p>
                <WhoHowWhatWhy parts={model.claim.parts} storageId="research_design_worked" readOnlyRows={[model.scheme.modelMatrix[0]]} />
                <h3 className="mt-8 font-display text-[21px] text-[color:var(--color-q2-sea)]">Your turn — write the next rows</h3>
                <WhoHowWhatWhy parts={model.claim.parts} storageId={MATRIX_STORE}
                  activityId={`answer-2b:${model.id}`} activityTitle={`Practice · ${model.title} (reworded) · 2(b)`} />
              </section>
            )}

            {tab === 'traps' && (
              <section>
                <h2 className={h2}>Five ways to lose marks</h2>
                <div className="mt-2 space-y-8">
                  {DESIGN_TRAPS.map((t) => (
                    <article key={t.id}>
                      <h3 className="font-display text-[21px] text-[color:var(--color-q2-sea)]">{t.title}</h3>
                      <ExaminerNote compact source={t.source} quote={t.quote} action="rewrite it like the “Better” version." />
                      <div className="mt-3 grid gap-3 md:grid-cols-2 text-[13.5px]">
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
                <h2 className={h2}>The same claim at every level</h2>
                <p className={body}>“{model.claim.text}” (reworded from June 2026 · 0457/12).</p>
                <LevelLadder levels={DESIGN_LEVELS} />
                <h3 className="mt-10 font-display text-[24px] text-[color:var(--color-q2-sea)]">The Level 4 answer as a matrix</h3>
                <p className={body}>The matrix is the plan; each row becomes one or two sentences.</p>
                <WhoHowWhatWhy parts={model.claim.parts} storageId="research_design_model" readOnlyRows={model.scheme.modelMatrix} compareLine={model.scheme.compareLine} />
              </section>
            )}

            {tab === 'practice' && (
              <section>
                <h2 className={h2}>Your turn</h2>
                <ClaimSplitter claim={practice.claim} source="WMSI mirror of June 2026 · 0457/12" />
                <WhoHowWhatWhy parts={practice.claim.parts} storageId={PRACTICE_STORE}
                  activityId={`answer-2b:${practice.id}`} activityTitle={`Practice · ${practice.title} (mirror) · 2(b)`} />
                <p className="mt-6 text-[14px]"><Link to={`/research/practice/${practice.id}`} className="font-semibold text-[color:var(--color-q2-storm)] underline">Check against the answer scheme →</Link> <span className="text-[color:var(--color-ink-3)]">· more claims in the <Link to="/research/practice" className="underline">practice bank</Link></span></p>
              </section>
            )}

            {tab === 'checklist' && (
              <section>
                <h2 className={h2}>Before you move on</h2>
                <Checklist activityId="checklist-2b" title="Checklist · 2(b)" items={DESIGN_CHECKLIST} />
              </section>
            )}
          </div>
        </div>
      </Container>
      <ExportFooter toolId="research_design" />
    </div>
  );
}
