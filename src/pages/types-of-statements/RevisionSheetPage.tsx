import { Container } from '../../components/primitives';
import {
  RevisionSheetShell,
  SheetMasthead,
  SidebarPanel,
  YesBox,
  NoBox,
  MicroYes,
  MicroNo,
} from '../../components/RevisionSheetChrome';
import { BRANCHES, type Branch } from './mindMapData';

/* ══════════════════════════════════════════════════════════════════
   Statement Types — Revision Sheet (Q1b)
   Fact-as-anchor · three vs-Fact cards · two confusable pairs.
   ══════════════════════════════════════════════════════════════════ */

const BY_ID: Record<string, Branch> = Object.fromEntries(BRANCHES.map((b) => [b.id, b]));

const VS_FACT: { branch: Branch; disc: string }[] = [
  { branch: BY_ID.generalisation, disc: 'STRETCHED SAMPLE' },
  { branch: BY_ID.prediction, disc: 'FUTURE, NOT PAST' },
  { branch: BY_ID.claim, disc: 'ASSERTION, NO CHECK' },
];

const PAIRS: { left: Branch; right: Branch; disc: string; sub: string }[] = [
  {
    left: BY_ID.opinion,
    right: BY_ID.value,
    disc: 'judgement · vs · principle',
    sub: 'One recommends what to do; the other names what matters.',
  },
  {
    left: BY_ID.bias,
    right: BY_ID.vested,
    disc: 'presentation · vs · stake',
    sub: 'One is in the writing; the other is in the writer.',
  },
];

const THREE_MARKS = [
  { n: '1', title: 'Name the type', body: 'One of the eight terms. Not "it seems to generalise" — commit.' },
  { n: '2', title: 'Point to the word', body: 'Quote the exact phrase — the absolute word, the "should", the future tense.' },
  { n: '3', title: 'Say what would be honest', body: 'Contrast with the version that would just be a fact. That is your explanation.' },
];

const LADDER: { q: string; then: string }[] = [
  { q: 'About the future?', then: 'Prediction' },
  { q: 'Can it be checked with evidence?', then: 'Fact' },
  { q: 'Uses always / never / all / everyone?', then: 'Generalisation' },
  { q: 'Asserted as true, without evidence?', then: 'Claim' },
  { q: 'A "should" — what matters, is right, is fair?', then: 'Value' },
  { q: 'A personal preference or judgement?', then: 'Opinion' },
  { q: 'One side of the story left out?', then: 'Bias' },
  { q: 'Speaker has a stake in you believing it?', then: 'Vested Interest' },
];

export function RevisionSheetPage() {
  return (
    <RevisionSheetShell accent="cobalt">
      <Container size="wide" className="pt-8 md:pt-12 pb-16">
        <SheetMasthead
          index="1 of 5"
          paper="Paper 1"
          question="Q1(b)"
          marks="3 marks"
          title="Statement Types"
          tagline={
            <>
              Eight terms · one anchor (<em>fact</em>) · five confusion pairs. Everything you need
              to name a statement in Q1(b) and defend the naming for the mark.
            </>
          }
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Sidebar />
          <MainGrid />
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
      <SidebarPanel eyebrow="How to earn all 3 marks" foot="In that order. Skip step 2 and you cap at 2/3.">
        <ol className="p-4 space-y-3">
          {THREE_MARKS.map((m) => (
            <li key={m.n} className="flex gap-3">
              <span className="rs-marknum shrink-0" aria-hidden>{m.n}</span>
              <div>
                <p className="font-display text-[16px] leading-tight text-[color:var(--color-ink)]">{m.title}</p>
                <p className="text-[12.5px] leading-[1.5] text-[color:var(--color-ink-2)] mt-1">{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </SidebarPanel>

      <SidebarPanel eyebrow="Discriminator Ladder">
        <p className="px-4 pt-3 text-[11.5px] italic leading-[1.5] text-[color:var(--color-ink-2)]">
          Given a sentence, walk down. First "yes" wins.
        </p>
        <ol className="px-4 pb-4 pt-2 space-y-1.5">
          {LADDER.map((step, i) => (
            <li key={i} className="rs-ladder-step">
              <span className="font-mono text-[10px] font-semibold tabular-nums text-[color:var(--color-ink-3)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[12.5px] leading-[1.35] text-[color:var(--color-ink)]">{step.q}</span>
              <span className="rs-ladder-then">→ {step.then}</span>
            </li>
          ))}
        </ol>
      </SidebarPanel>

      <SidebarPanel eyebrow="Signal Words" variant="ink">
        <div className="p-4 space-y-3">
          <SignalRow label="Generalisation" words={BY_ID.generalisation.signals ?? []} />
          <SignalRow label="Prediction" words={['will', 'is likely to', 'by 2030', 'expect', 'forecast']} />
          <SignalRow label="Value" words={['should', 'ought to', 'has a right to', 'deserves', 'must']} />
          <SignalRow label="Claim" words={['claims', 'asserts', 'argues', 'suggests', 'insists']} />
          <SignalRow label="Opinion" words={['I think', 'I believe', 'in my view', "it's my opinion"]} />
        </div>
      </SidebarPanel>
    </aside>
  );
}

function SignalRow({ label, words }: { label: string; words: string[] }) {
  return (
    <div>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)] mb-1.5">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {words.map((w) => (
          <span key={w} className="font-mono text-[11.5px] px-2 py-0.5 rounded-sm bg-[color:var(--color-amber-soft)] text-[color:var(--color-amber-deep)]">
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────── Main grid ────────────────────────── */
function MainGrid() {
  return (
    <div className="space-y-6">
      <FactAnchor branch={BY_ID.fact} />
      <VsFactRow />
      <div className="grid gap-6 md:grid-cols-2 print:grid-cols-2 print:gap-3">
        {PAIRS.map((p) => (
          <PairCard key={p.left.id} pair={p} />
        ))}
      </div>
    </div>
  );
}

function FactAnchor({ branch }: { branch: Branch }) {
  return (
    <article className="rs-card rs-card-anchor relative">
      <div className="rs-halftone-corner" aria-hidden />
      <header className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[color:var(--sheet-accent)]">
            The anchor · everything below compares to this
          </p>
          <h2 className="font-display text-[clamp(36px,5vw,56px)] leading-none tracking-[-0.02em] text-[color:var(--color-ink)] mt-2">
            Fact
          </h2>
        </div>
        <span className="rs-badge">{branch.badge}</span>
      </header>
      <p className="text-[15px] leading-[1.55] text-[color:var(--color-ink)] max-w-[62ch]"
         dangerouslySetInnerHTML={{ __html: branch.def }} />
      <div className="mt-4 grid gap-3 md:grid-cols-2 print:grid-cols-2 print:gap-3">
        <YesBox text={branch.yes!} label="A fact" />
        <NoBox text={branch.no!} label="Not a fact" />
      </div>
      {branch.note && (
        <p className="mt-4 text-[12.5px] leading-[1.55] italic text-[color:var(--color-ink-2)] border-l-2 border-[color:var(--sheet-accent)] pl-3"
           dangerouslySetInnerHTML={{ __html: branch.note }} />
      )}
    </article>
  );
}

function VsFactRow() {
  return (
    <div>
      <div className="rs-section-label" aria-hidden>
        <span>three ways a statement</span>
        <span className="rs-section-label-arrow">↑ isn't a fact</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3 mt-4 print:grid-cols-3 print:gap-3">
        {VS_FACT.map(({ branch, disc }) => (
          <VsFactCard key={branch.id} branch={branch} disc={disc} />
        ))}
      </div>
    </div>
  );
}

function VsFactCard({ branch, disc }: { branch: Branch; disc: string }) {
  return (
    <article className="rs-card rs-card-vsfact relative">
      <div className="rs-ribbon" aria-hidden>
        <span>vs FACT</span>
        <span className="rs-ribbon-disc">{disc}</span>
      </div>
      <header>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--sheet-accent)]">
          {branch.badge}
        </p>
        <h3 className="font-display text-[26px] leading-tight tracking-[-0.015em] text-[color:var(--color-ink)] mt-1">
          {branch.name}
        </h3>
      </header>
      <p className="mt-2 text-[13.5px] leading-[1.5] text-[color:var(--color-ink)]"
         dangerouslySetInnerHTML={{ __html: branch.def }} />
      <div className="mt-3 space-y-2">
        <MicroYes text={branch.yes!} />
        <MicroNo text={branch.no!} />
      </div>
      {branch.note && (
        <p className="mt-3 text-[11.5px] leading-[1.5] italic text-[color:var(--color-ink-2)]"
           dangerouslySetInnerHTML={{ __html: branch.note }} />
      )}
    </article>
  );
}

function PairCard({ pair }: { pair: { left: Branch; right: Branch; disc: string; sub: string } }) {
  return (
    <article className="rs-card rs-card-pair relative">
      <div className="rs-pair-header">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ember)]">
          Common confusion
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[color:var(--color-ink-3)] mt-1">
          {pair.disc}
        </p>
        <p className="text-[12px] italic text-[color:var(--color-ink-2)] mt-1">{pair.sub}</p>
      </div>
      <div className="rs-pair-grid grid grid-cols-[1fr_auto_1fr] items-stretch gap-0">
        <PairHalf branch={pair.left} side="left" />
        <div className="rs-pair-vs" aria-hidden><span>vs</span></div>
        <PairHalf branch={pair.right} side="right" />
      </div>
    </article>
  );
}

function PairHalf({ branch, side }: { branch: Branch; side: 'left' | 'right' }) {
  return (
    <div className={`rs-pair-half rs-pair-half-${side}`}>
      <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[color:var(--sheet-accent)]">
        {branch.badge}
      </p>
      <h4 className="font-display text-[22px] leading-tight tracking-[-0.015em] text-[color:var(--color-ink)] mt-1">
        {branch.name}
      </h4>
      <p className="mt-2 text-[12.5px] leading-[1.5] text-[color:var(--color-ink)]"
         dangerouslySetInnerHTML={{ __html: branch.def }} />
      <p className="mt-2 text-[11.5px] leading-[1.45] italic text-[color:var(--color-ink-2)] border-l-2 border-[color:var(--color-line)] pl-2">
        "{branch.yes}"
      </p>
    </div>
  );
}

/* ────────────────────────── Footer ────────────────────────── */
function Footer() {
  return (
    <footer className="mt-10 border-t-[3px] border-[color:var(--color-ink)] pt-6">
      <div className="grid gap-6 md:grid-cols-3 print:grid-cols-3 print:gap-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--sheet-accent)]">
            Exam-day reminders
          </p>
          <ul className="mt-3 space-y-2 text-[13px] leading-[1.5] text-[color:var(--color-ink)]">
            <li>• Q1(b) sits under a source. Every named type must be defended <em>from that source's wording</em>.</li>
            <li>• If two types could fit, name the one whose signal word actually appears in the sentence.</li>
            <li>• A fact can still be biased in how it's <em>chosen</em>. Don't rule out bias just because the sentence checks out.</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ember)]">
            The three traps
          </p>
          <ul className="mt-3 space-y-2 text-[13px] leading-[1.5] text-[color:var(--color-ink)]">
            <li>• Saying "it generalises" without pointing at <em>always / all / everyone</em>. Two marks lost.</li>
            <li>• Calling a "should" statement an opinion. It's a <strong>value</strong>.</li>
            <li>• Calling a future statement a fact. Tense first, always.</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-3)]">
            This sheet
          </p>
          <p className="mt-3 text-[13px] leading-[1.5] text-[color:var(--color-ink-2)]">
            Digital revision one-pager · WMSI GP0457 · Y10 T1. Notes, drills and the diagnostic live at{' '}
            <a href="/statements" className="text-[color:var(--sheet-accent)] underline">/statements</a>.
          </p>
          <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
            Sheet 1 of 5 · <a href="/revision" className="underline">See all sheets →</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
