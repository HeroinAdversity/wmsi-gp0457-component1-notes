import { Container } from '../../../components/primitives';
import { RevisionSheetShell, SheetMasthead, SidebarPanel } from '../../../components/RevisionSheetChrome';
import { DESIGN_TRAPS } from '../data/design';
import type { EvidenceTag, PartId } from '../data/types';
import { J26_12_REWORDED as MODEL } from '../data/bank/reworded/j26-12';
import { ExaminerSaw, KeyTerm, Mark, MarkBands, Q2SheetStyles, STEP_TONE, TONE, Tag, type Tone } from './sheetParts';

/* ══════════════════════════════════════════════════════════════════
   Research 2(b) — Revision Sheet ("The Test Bench")
   Split the claim as the anchor row · Table D bands · Who/How/What/Why
   · evidence words · a Level 4 design unpacked by colour · what the
   June 2026 examiner report saw.
   ══════════════════════════════════════════════════════════════════ */

const HOW_TO = [
  { n: '1', title: 'Split the claim', body: 'Find its parts: what is measured, the change or comparison, the scope. Each part needs testing.' },
  { n: '2', title: 'Pick 3–4 methods', body: 'Different methods for different parts. Every part tested at least once, ideally twice.' },
  { n: '3', title: 'Who · How · What · Why', body: 'For each method: who from, how collected, what evidence it gives, why it tests the claim.' },
  { n: '4', title: 'Compare the results', body: 'One closing line: if the methods agree, the claim is supported. That is triangulation.' },
];

// Table D, 0457/12 Mark Scheme, June 2026 (level names are the scheme's own).
const TABLE_D = [
  { level: 4, marks: '7–8', name: 'Fully justified design', desc: 'A wide range of methods and evidence, each explained and clearly related to testing the claim.' },
  { level: 3, marks: '5–6', name: 'Justified design', desc: 'A range of methods and evidence explained, mostly related to testing the claim.' },
  { level: 2, marks: '3–4', name: 'Partly justified design', desc: 'Methods and/or evidence mostly described, with little explanation.' },
  { level: 1, marks: '1–2', name: 'Limited design', desc: 'Methods or evidence listed without explanation, or only the topic described.' },
];

// Claim words → the method that tests them (from the Toolkit's "use in 2(b)" notes).
const METHOD_FOR: [string, string][] = [
  ['“increasing” · “nationally” · “global”', 'Official statistics (secondary data)'],
  ['“many” · “most” · two groups', 'Survey or questionnaire'],
  ['“why” · expert knowledge', 'Interview'],
  ['what people actually do', 'Observation'],
  ['“causes” · “improves”', 'Experiment or comparison of groups'],
  ['a real example', 'Case study (pair it with a bigger method)'],
];

const WHWW: { key: 'who' | 'how' | 'what' | 'why'; title: string; ask: string }[] = [
  { key: 'who', title: 'Who', ask: 'Which person or organisation? Name them.' },
  { key: 'how', title: 'How', ask: 'Which method: survey, interview, statistics…?' },
  { key: 'what', title: 'What', ask: 'What exactly will you find out, and what type of evidence is it?' },
  { key: 'why', title: 'Why', ask: 'Which part of the claim does it test, and how?' },
];

const EVIDENCE: { tone: Tone; tag: EvidenceTag; def: string }[] = [
  { tone: 'storm', tag: 'primary', def: 'You collect it yourself: your survey, your interview.' },
  { tone: 'storm', tag: 'secondary', def: 'Someone else collected it: police statistics, published studies.' },
  { tone: 'olive', tag: 'quantitative', def: 'Numbers you can count and compare: thefts per year.' },
  { tone: 'olive', tag: 'qualitative', def: 'Words and experiences: why victims think it is rising.' },
];

// Mark-scheme "who" examples for this claim (0457/12, June 2026, Table D indicative content).
const WHO_EXAMPLES = ['Police authorities', 'Insurance companies', 'Government data', 'University criminologists', 'Victims of vehicle crime', 'Vehicle manufacturers · repair garages'];

const partTone = (id: PartId) => STEP_TONE[id - 1];

export function DesignRevisionSheetPage() {
  return (
    <RevisionSheetShell accent="q2">
      <Q2SheetStyles />
      <Container size="wide" className="pt-8 md:pt-12 pb-16">
        <SheetMasthead
          index="5 of 5"
          paper="Paper 1"
          question="Q2(b)"
          marks="8 marks"
          title="Testing a Claim"
          tagline={<>The Test Bench. Split the claim · test every part · compare the results. Design the research; don’t argue the issue.</>}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Sidebar />
          <div className="space-y-8">
            <SplitAnchor />
            <Matrix />
            <EvidenceWords />
            <ModelStrip />
            <ExaminerSaw
              source="Principal Examiner Report · June 2026 · 0457/12 · Q2(b)"
              did={[
                'Described and fully explained their reasons for choosing a range of methods and sources of evidence.',
                'Clearly and explicitly related their research design to the purpose of the research, which was to test the claim. This included both aspects of the claim.',
                'Comparison of data gathered from different methods and sources to triangulate and verify outcomes.',
              ]}
              lost={[
                'Some candidates simply asserted some methods and sources without explanation.',
                'Some candidates listed a very wide range of methods and types of evidence without relating them to testing the claim.',
                'Some candidates discussed the issue of crime in general and gave reasons for and against trying to prevent vehicle crime.',
              ]}
              action="explain several methods and several sources in detail, each tied to a part of the claim. Fewer, fully justified rows beat a long list."
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
      <SidebarPanel eyebrow="How to earn Level 4" foot="Justify, don’t critique. A method’s weakness earns nothing here.">
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

      <SidebarPanel eyebrow="Mark scheme · Table D" foot="0457/12 Mark Scheme · June 2026">
        <MarkBands rows={TABLE_D} />
      </SidebarPanel>

      <SidebarPanel eyebrow="Claim word → method" variant="ink">
        <p className="px-4 pt-3 text-[11.5px] italic leading-[1.5] text-[color:var(--color-ink-2)]">The claim tells you which method to reach for.</p>
        <ul className="p-4 pt-2 space-y-2">
          {METHOD_FOR.map(([cue, method]) => (
            <li key={cue} className="text-[12.5px] leading-[1.45]">
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[color:var(--sheet-accent-deep)]">{cue}</span>
              <span className="block text-[color:var(--color-ink)]">→ {method}</span>
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

/** The claim with each part highlighted in its own colour. */
function ColouredClaim() {
  const { text, parts } = MODEL.claim;
  const pieces: { t: string; id?: PartId }[] = [];
  let rest = text;
  for (const p of [...parts].sort((a, b) => text.indexOf(a.phrase) - text.indexOf(b.phrase))) {
    const at = rest.indexOf(p.phrase);
    if (at < 0) continue;
    if (at > 0) pieces.push({ t: rest.slice(0, at) });
    pieces.push({ t: p.phrase, id: p.id });
    rest = rest.slice(at + p.phrase.length);
  }
  if (rest) pieces.push({ t: rest });
  return (
    <p className="font-display text-[clamp(22px,3vw,30px)] leading-[1.35] text-[color:var(--color-ink)]">
      “{pieces.map((p, i) => (p.id ? <Mark key={i} tone={partTone(p.id)}>{p.t}</Mark> : <span key={i}>{p.t}</span>))}”
    </p>
  );
}

function SplitAnchor() {
  return (
    <div>
      <SectionLabel label="split the claim first" arrow="every colour must be tested" />
      <article className="rs-card rs-card-anchor mt-4">
        <div className="rs-halftone-corner" aria-hidden />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--sheet-accent)]">
          The claim · reworded from June 2026 · 0457/12
        </p>
        <div className="mt-2"><ColouredClaim /></div>
        <div className="mt-4 grid gap-3 md:grid-cols-3 print:grid-cols-3">
          {MODEL.claim.parts.map((p) => (
            <KeyTerm key={p.id} tone={partTone(p.id)} term={`${p.id} · ${p.label} · “${p.phrase}”`}>{p.need}</KeyTerm>
          ))}
        </div>
        <p className="mt-3 text-[12.5px] leading-[1.5] text-[color:var(--color-ink-2)]">
          Other parts to look for: a <b>comparison</b> (“more than”), a <b>group</b> (“young people”), a <b>cause</b> (“improves”, “leads to”).
          The examiner praised answers that tested “both aspects of the claim — vehicle crime and increasing nationally.”
        </p>
      </article>
    </div>
  );
}

function Matrix() {
  const row = MODEL.scheme.modelMatrix[0];
  return (
    <div>
      <SectionLabel label="who · how · what · why" arrow="one row per method, every box filled" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-4 print:gap-3">
        {WHWW.map((w) => (
          <article key={w.key} className="rs-card p-4">
            <h3 className="font-display text-[26px] leading-none text-[color:var(--color-q2-sea)]">{w.title}</h3>
            <p className="mt-1.5 text-[12.5px] leading-[1.45] text-[color:var(--color-ink-2)]">{w.ask}</p>
            <div className="mt-3 rounded-sm bg-[color:var(--sheet-accent-tint)] p-2.5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--sheet-accent-deep)]">Worked row</p>
              <p className="mt-1 text-[12.5px] italic leading-[1.45] text-[color:var(--color-ink)]">{row[w.key]}</p>
              {w.key === 'why' && (
                <p className="mt-1.5 flex flex-wrap gap-1">{row.tests.map((id) => <Tag key={id} tone={partTone(id)}>Tests {id}</Tag>)}</p>
              )}
            </div>
          </article>
        ))}
      </div>
      <p className="mt-3 text-[12.5px] leading-[1.5] text-[color:var(--color-ink-2)]">
        <b className="text-[color:var(--color-ink)]">Name a real “who”.</b> The mark scheme’s examples for this claim:{' '}
        {WHO_EXAMPLES.join(' · ')}. “I would ask people” is too vague to credit.
      </p>
    </div>
  );
}

function EvidenceWords() {
  return (
    <div>
      <SectionLabel label="name the evidence type" arrow="the “what” box, every row" />
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-4">
        {EVIDENCE.map((e) => <KeyTerm key={e.tag} tone={e.tone} term={e.tag}>{e.def}</KeyTerm>)}
      </div>
      <p className="mt-2 text-[12.5px] leading-[1.5] text-[color:var(--color-ink-2)]">
        Numbers show <em>whether</em> the claim is true; words show <em>why</em>. A Level 4 design usually uses both.
      </p>
    </div>
  );
}

function ModelStrip() {
  return (
    <div>
      <SectionLabel label="a Level 4 design, unpacked" arrow="the tags show which part each method tests" />
      <div className="mt-4 grid gap-2.5">
        {MODEL.scheme.modelMatrix.map((r, i) => (
          <article key={r.who} className="rs-card grid grid-cols-[92px_minmax(0,1fr)] items-baseline gap-3 p-3.5 md:gap-4">
            <div className="text-right"><Tag tone="strength">Method {i + 1}</Tag></div>
            <div>
              <p className="text-[13.5px] leading-[1.6] text-[color:var(--color-ink)]">
                <b>{r.how}</b> · {r.who} · {r.what}. <span className="italic">{r.why}</span>
              </p>
              <p className="mt-1.5 flex flex-wrap items-center gap-1">
                {r.tests.map((id) => <Tag key={id} tone={partTone(id)}>{MODEL.claim.parts.find((p) => p.id === id)?.label}</Tag>)}
                <span className="ml-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[color:var(--color-ink-3)]">{r.evidence.join(' · ')}</span>
              </p>
            </div>
          </article>
        ))}
        <article className="rs-card rs-card-anchor grid grid-cols-[92px_minmax(0,1fr)] items-baseline gap-3 p-3.5 md:gap-4">
          <div className="text-right"><Tag tone="ivory">Compare</Tag></div>
          <p className="text-[13.5px] leading-[1.6] text-[color:var(--color-ink)]">{MODEL.scheme.compareLine}</p>
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
            <li>• Colour-check your plan: is every part of the claim tested?</li>
            <li>• 3 developed methods is the minimum; 4 is safer.</li>
            <li>• Whether the claim is true is what your research finds out. Don’t answer it.</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ember)]">The traps</p>
          <ul className="mt-3 space-y-2 text-[13px] leading-[1.5] text-[color:var(--color-ink)]">
            {DESIGN_TRAPS.map((t) => <li key={t.id}>• {t.title}.</li>)}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-3)]">This sheet</p>
          <p className="mt-3 text-[13px] leading-[1.5] text-[color:var(--color-ink-2)]">
            Digital revision one-pager · WMSI GP0457 · Y10. Built from the June 2026 mark scheme (Table D) and Principal Examiner Report.
            Full lesson, traps and practice at{' '}
            <a href="/research/design" className="text-[color:var(--sheet-accent)] underline">The Test Bench</a>.
          </p>
          <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
            Sheet 5 of 5 · <a href="/revision/research/2a" className="underline">← 2(a)</a> · <a href="/revision" className="underline">All sheets</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
