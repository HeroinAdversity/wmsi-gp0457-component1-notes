import { Container } from '../../../components/primitives';
import { RevisionSheetShell, SheetMasthead, SidebarPanel } from '../../../components/RevisionSheetChrome';
import { EVALUATE_CHECKLIST, EVALUATE_TRAPS } from '../data/evaluate';
import { RESEARCH_DESIGN_CHECK } from '../data/toolkit';
import { J26_12_REWORDED as MODEL } from '../data/bank/reworded/j26-12';
import { ExaminerSaw, KeyTerm, Mark, MarkBands, Q2SheetStyles, STEP_TONE, TONE, Tag, type Tone } from './sheetParts';

/* ══════════════════════════════════════════════════════════════════
   Research 2(a) — Revision Sheet ("Strong or Shaky?")
   Three-step chain as the anchor row · Table C bands · the words the
   examiner rewards · a Level 4 answer unpacked by colour · what the
   June 2026 examiner report saw.
   ══════════════════════════════════════════════════════════════════ */

const HOW_TO = [
  { n: '1', title: 'Find it in Source 3', body: 'Quote or name what the researcher actually did. If the source doesn’t say it, don’t judge it.' },
  { n: '2', title: 'Say what it does to the evidence', body: 'More or less accurate, honest, complete or representative? Use the key words below.' },
  { n: '3', title: 'Link it to the aim', body: '“…so it is less useful for finding out…” Use the aim’s own words.' },
  { n: '4', title: 'Cover both sides, then judge', body: 'About five chains, at least 2 strengths and 2 weaknesses. End with one overall line.' },
];

// Table C, 0457/12 Mark Scheme, June 2026 (level names are the scheme's own).
const TABLE_C = [
  { level: 4, marks: '7–8', name: 'Consistently evaluative', desc: 'A wide range of points, both strengths and weaknesses, each explained and clearly related to the purpose of the research.' },
  { level: 3, marks: '5–6', name: 'Mainly evaluative', desc: 'A range of explained points, mostly supported and related to the purpose.' },
  { level: 2, marks: '3–4', name: 'Partly evaluative', desc: 'A range of points, mostly descriptive with little explanation.' },
  { level: 1, marks: '1–2', name: 'Limited evaluation', desc: 'Points asserted, or the research or topic only described.' },
];

const CHAIN = [
  { title: 'What they did', ask: 'Which feature of the research are you judging?', stem: 'The researcher only interviewed…' },
  { title: 'Effect on the evidence', ask: 'Does it make the data more or less accurate, honest, complete or representative?', stem: 'This means the evidence may be…' },
  { title: 'Link to the aim', ask: 'So is the research more or less useful for what it set out to find?', stem: '…so it is less useful for finding out…' },
];

// The concepts the June 2026 examiner report says strong answers "applied accurately".
const CONCEPTS: { tone: Tone; group: string; terms: [string, string][] }[] = [
  { tone: 'storm', group: 'Who was asked', terms: [
    ['Sample', 'How many, and who. One person is a sample of one.'],
    ['Representative', 'Typical of the wider group the aim is about.'],
  ] },
  { tone: 'sage', group: 'How good the data is', terms: [
    ['Accurate', 'Recorded correctly: nothing misheard or lost.'],
    ['Reliable', 'Would give the same result if repeated.'],
    ['Valid', 'Actually measures what the aim asks about.'],
  ] },
  { tone: 'olive', group: 'Can we trust it', terms: [
    ['Bias · vested interest', 'Would the person gain from a certain answer?'],
    ['Ethics', 'Permission, consent, confidentiality.'],
    ['Recency', 'Is the data up to date?'],
  ] },
  { tone: 'strength', group: 'Can we check it', terms: [
    ['Triangulation', 'A second method or source to compare against.'],
    ['Relevance', 'Does it answer the research question?'],
  ] },
];

// Chains shown in the model, from the reworded June 2026 · 0457/12 source.
const MODEL_IDS = ['S3', 'S2', 'W1', 'W2', 'W3', 'W5'];

export function EvaluateRevisionSheetPage() {
  return (
    <RevisionSheetShell accent="q2">
      <Q2SheetStyles />
      <Container size="wide" className="pt-8 md:pt-12 pb-16">
        <SheetMasthead
          index="4 of 5"
          paper="Paper 1"
          question="Q2(a)"
          marks="8 marks"
          title="Evaluating Research"
          tagline={<>Strong or Shaky? One chain · both sides · always back to the aim. Everything you need to judge the research in Source 3 for Level 4.</>}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Sidebar />
          <div className="space-y-8">
            <ChainAnchor />
            <Concepts />
            <WhereToLook />
            <ModelStrip />
            <ExaminerSaw
              source="Principal Examiner Report · June 2026 · 0457/12 · Q2(a)"
              did={[
                'Provided thorough explanations of both strengths and weaknesses of the research.',
                'Discussed the “fitness for purpose” of the research design and quality of evidence gathered.',
                'Applied methodological concepts accurately… sampling, representative, validity, reliability…',
              ]}
              lost={EVALUATE_TRAPS.filter((t) => t.source.startsWith('Principal')).map((t) => t.quote)}
              action="explain fewer points properly. The report says answers improve by explaining the impact of fewer strengths and weaknesses on the quality of the evidence."
            />
          </div>
        </div>

        <Footer />
      </Container>
    </RevisionSheetShell>
  );
}

/* ────────────────────────── Sidebar ────────────────────────── */
function Sidebar() {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start space-y-6">
      <SidebarPanel eyebrow="How to earn Level 4" foot="Steps 1–2 only is Level 2. Step 3 on every point, both sides, is Level 4.">
        <ol className="p-4 space-y-3">
          {HOW_TO.map((m) => (
            <li key={m.n} className="flex gap-3">
              <span className="rs-marknum shrink-0" aria-hidden>{m.n}</span>
              <div>
                <p className="font-display text-[16px] leading-tight text-[color:var(--color-ink)]">{m.title}</p>
                <p className="mt-1 text-[12.5px] leading-[1.5] text-[color:var(--color-ink-2)]">{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </SidebarPanel>

      <SidebarPanel eyebrow="Mark scheme · Table C" foot="0457/12 Mark Scheme · June 2026">
        <MarkBands rows={TABLE_C} />
      </SidebarPanel>

      <SidebarPanel eyebrow="Before you move on" variant="ink">
        <ul className="p-4 space-y-1.5">
          {EVALUATE_CHECKLIST.map((c) => (
            <li key={c} className="grid grid-cols-[16px_1fr] gap-1.5 text-[12.5px] leading-[1.45] text-[color:var(--color-ink)]">
              <span aria-hidden className="mt-[3px] h-[11px] w-[11px] border border-[color:var(--color-ink-3)]" />{c}
            </li>
          ))}
        </ul>
      </SidebarPanel>
    </aside>
  );
}

/* ────────────────────────── Main ────────────────────────── */
function SectionLabel({ label, arrow }: { label: string; arrow: string }) {
  return (
    <div className="rs-section-label" aria-hidden>
      <span>{label}</span>
      <span className="rs-section-label-arrow">↑ {arrow}</span>
    </div>
  );
}

function ChainAnchor() {
  return (
    <div>
      <SectionLabel label="the three-step chain" arrow="every point, every time" />
      <div className="mt-4 grid gap-4 md:grid-cols-3 print:grid-cols-3 print:gap-3">
        {CHAIN.map((c, i) => {
          const t = TONE[STEP_TONE[i]];
          return (
            <article key={c.title} className="rs-card q2rs-step" style={{ borderTopColor: t.solid }}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: t.ink }}>Step {i + 1}</p>
              <h3 className="mt-1 font-display text-[22px] leading-tight tracking-[-0.015em] text-[color:var(--color-ink)]">{c.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-[1.5] text-[color:var(--color-ink)]">{c.ask}</p>
              <div className="mt-3 rounded-sm p-3" style={{ background: t.fill }}>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: t.ink }}>Sentence stem</p>
                <p className="mt-1 text-[12.5px] italic leading-[1.5] text-[color:var(--color-ink)]">{c.stem}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Concepts() {
  return (
    <div>
      <SectionLabel label="the words the examiner rewards" arrow="use them in step 2" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-4 print:gap-2">
        {CONCEPTS.map((g) => (
          <div key={g.group}>
            <p className="mb-1.5 text-[12px] font-bold text-[color:var(--color-q2-sea)]">{g.group}</p>
            <div className="space-y-1.5">
              {g.terms.map(([term, def]) => <KeyTerm key={term} tone={g.tone} term={term}>{def}</KeyTerm>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhereToLook() {
  return (
    <div>
      <SectionLabel label="where to look in Source 3" arrow="same question, two possible answers" />
      <div className="mt-4 rs-card p-0 overflow-hidden">
        <div className="hidden grid-cols-[1.1fr_1fr_1fr] gap-px bg-[color:var(--color-line)] font-mono text-[10px] font-bold uppercase tracking-[0.14em] md:grid print:grid">
          <span className="bg-[color:var(--color-paper-2)] px-3 py-2 text-[color:var(--color-ink-3)]">Ask</span>
          <span className="px-3 py-2" style={{ background: TONE.strength.fill, color: TONE.strength.ink }}>✓ Strength if…</span>
          <span className="px-3 py-2" style={{ background: TONE.weakness.fill, color: TONE.weakness.ink }}>✗ Weakness if…</span>
        </div>
        {RESEARCH_DESIGN_CHECK.map((c) => (
          <div key={c.id} className="grid gap-px border-t border-[color:var(--color-line)] bg-[color:var(--color-line)] text-[12.5px] leading-[1.45] md:grid-cols-[1.1fr_1fr_1fr] print:grid-cols-[1.1fr_1fr_1fr]">
            <span className="bg-[color:var(--color-paper)] px-3 py-2 font-semibold text-[color:var(--color-ink)]">{c.question}</span>
            <span className="px-3 py-2" style={{ background: TONE.strength.fill }}>{c.strengthIf}</span>
            <span className="px-3 py-2" style={{ background: TONE.weakness.fill }}>{c.weaknessIf}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModelStrip() {
  const rows = MODEL_IDS.map((id) => MODEL.features.find((f) => f.id === id)!).filter(Boolean);
  return (
    <div>
      <SectionLabel label="a Level 4 answer, unpacked" arrow="each colour is one step of the chain" />
      <p className="mt-3 text-[12.5px] text-[color:var(--color-ink-2)]">
        Source 3 (reworded from June 2026 · 0457/12): a student interviews one new manager in a noisy café, then decides vehicle crime is rising nationally.
        Aim: <b className="text-[color:var(--color-ink)]">{MODEL.aim}</b>
      </p>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px]">
        {CHAIN.map((c, i) => <Mark key={c.title} tone={STEP_TONE[i]}>{i + 1} · {c.title}</Mark>)}
      </p>
      <div className="mt-3 grid gap-2.5">
        {rows.map((f) => (
          <article key={f.id} className="rs-card grid grid-cols-[92px_minmax(0,1fr)] items-baseline gap-3 p-3.5 md:gap-4">
            <div className="text-right">
              <Tag tone={f.kind === 'S' ? 'strength' : 'weakness'}>{f.kind === 'S' ? 'Strength' : 'Weakness'}</Tag>
              <p className="mt-1 text-[11px] leading-tight text-[color:var(--color-ink-3)]">{f.label}</p>
            </div>
            <p className="text-[13.5px] leading-[1.75] text-[color:var(--color-ink)]">
              <Mark tone="storm">{f.chain.what}</Mark> <Mark tone="sage">{f.chain.effect}</Mark> <Mark tone="olive">{f.chain.aim}</Mark>
            </p>
          </article>
        ))}
        <article className="rs-card rs-card-anchor grid grid-cols-[92px_minmax(0,1fr)] items-baseline gap-3 p-3.5 md:gap-4">
          <div className="text-right"><Tag tone="ivory">Judge</Tag></div>
          <p className="text-[13.5px] leading-[1.6] text-[color:var(--color-ink)]">
            Overall, one interview with a new manager cannot show how much vehicle crime there is, so the student’s national conclusion is not supported.
          </p>
        </article>
      </div>
    </div>
  );
}

/* ────────────────────────── Footer ────────────────────────── */
function Footer() {
  return (
    <footer className="mt-10 border-t-[3px] border-[color:var(--color-ink)] pt-6">
      <div className="grid gap-6 md:grid-cols-3 print:grid-cols-3 print:gap-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--sheet-accent)]">Exam-day reminders</p>
          <ul className="mt-3 space-y-2 text-[13px] leading-[1.5] text-[color:var(--color-ink)]">
            <li>• Underline the aim in Source 3 first. Every chain ends there.</li>
            <li>• Judge the research, not the topic. Crime being serious earns nothing.</li>
            <li>• About 10 minutes. Five explained points beat ten listed ones.</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ember)]">The traps</p>
          <ul className="mt-3 space-y-2 text-[13px] leading-[1.5] text-[color:var(--color-ink)]">
            {EVALUATE_TRAPS.map((t) => <li key={t.id}>• {t.title}.</li>)}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-3)]">This sheet</p>
          <p className="mt-3 text-[13px] leading-[1.5] text-[color:var(--color-ink-2)]">
            Digital revision one-pager · WMSI GP0457 · Y10. Built from the June 2026 mark scheme (Table C) and Principal Examiner Report.
            Full lesson, traps and practice at{' '}
            <a href="/research/evaluate" className="text-[color:var(--sheet-accent)] underline">Strong or Shaky?</a>.
          </p>
          <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
            Sheet 4 of 5 · <a href="/revision/research/2b" className="underline">Next: 2(b) →</a> · <a href="/revision" className="underline">All sheets</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
