import { Container } from '../../components/primitives';
import {
  RevisionSheetShell,
  SheetMasthead,
  SidebarPanel,
} from '../../components/RevisionSheetChrome';
import { CRITERIA, BONUS_MOVE, BANDS, type Criterion } from './weighingRoomData';

/* ══════════════════════════════════════════════════════════════════
   Significance — Revision Sheet (Q1d, "The Weighing Room")
   Five tests as the anchor row · Back It Up bonus · Q1(d) shows up
   in four disguises · Level 4 = comparative reasoning tied to source.
   ══════════════════════════════════════════════════════════════════ */

const FIVE_MOVES = [
  {
    n: '1',
    title: 'State the opinion',
    body: 'One clear sentence, no throat-clearing. "I think X is the most significant because…"',
  },
  {
    n: '2',
    title: 'Pick a test',
    body: 'Crowd · Hurt · Fair · Domino · Stuck. Name the weight you\'re using.',
  },
  {
    n: '3',
    title: 'Back it up from the source',
    body: 'Specific detail — a name, a number, a quoted phrase. Not "the source says…".',
  },
  {
    n: '4',
    title: 'Compare',
    body: 'Show why your pick beats one of the others. This is the Level 4 move.',
  },
];

const DISGUISES = [
  { form: 'benefits', example: 'Which benefit is the most significant?' },
  { form: 'causes', example: 'Which cause is the most significant?' },
  { form: 'consequences', example: 'Which consequence is the most significant?' },
  { form: 'challenges', example: 'Which challenge is the most significant?' },
];

// Compact one-line clues for each test to add to the card face.
const TEST_CLUE: Record<Criterion['key'], string> = {
  crowd: 'reach',
  hurt: 'depth',
  fair: 'right vs wrong',
  domino: 'chain reaction',
  stuck: 'irreversibility',
  backitup: 'evidence',
};

export function SignificanceRevisionSheetPage() {
  return (
    <RevisionSheetShell accent="forest">
      <Container size="wide" className="pt-8 md:pt-12 pb-16">
        <SheetMasthead
          index="3 of 4"
          paper="Paper 1"
          question="Q1(d)"
          marks="8 marks"
          title="Significance"
          tagline={
            <>
              Five tests · one opinion · the compare that separates Level 3 from Level 4. Everything
              you need to weigh evidence and defend a judgement.
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
      <SidebarPanel eyebrow="How to earn Level 4" foot="Steps 1–3 land Level 3. Step 4 is what unlocks Level 4.">
        <ol className="p-4 space-y-3">
          {FIVE_MOVES.map((m) => (
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

      <SidebarPanel eyebrow="Mark bands">
        <ul className="p-4 space-y-2">
          {BANDS.filter((b) => b.key !== '0').map((b) => (
            <li key={b.key} className="grid grid-cols-[48px_1fr] gap-2">
              <span className="font-mono text-[11px] font-semibold tabular-nums text-[color:var(--sheet-accent-deep)] bg-[color:var(--sheet-accent-tint)] px-1.5 py-0.5 rounded-sm text-center h-fit">
                {b.label}
              </span>
              <span className="text-[12.5px] leading-[1.45] text-[color:var(--color-ink-2)]">
                {b.descEn}
              </span>
            </li>
          ))}
        </ul>
      </SidebarPanel>

      <SidebarPanel eyebrow="Four disguises · same question" variant="ink">
        <p className="px-4 pt-3 text-[11.5px] italic leading-[1.5] text-[color:var(--color-ink-2)]">
          Cambridge dresses Q1(d) four ways. The method doesn't change.
        </p>
        <ul className="p-4 pt-2 space-y-2">
          {DISGUISES.map((d) => (
            <li key={d.form} className="text-[12.5px] leading-[1.5]">
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--sheet-accent-deep)]">
                {d.form}
              </span>{' '}
              <span className="text-[color:var(--color-ink-2)] italic">— "{d.example}"</span>
            </li>
          ))}
        </ul>
      </SidebarPanel>
    </aside>
  );
}

/* ────────────────────────── Main grid ────────────────────────── */
function MainGrid() {
  return (
    <div className="space-y-8">
      <ToolkitAnchor />
      <BackItUp />
      <ModelStrip />
    </div>
  );
}

function ToolkitAnchor() {
  const fiveTests = CRITERIA.filter((c) => c.key !== 'backitup');
  return (
    <div>
      <div className="rs-section-label" aria-hidden>
        <span>the Significance Toolkit</span>
        <span className="rs-section-label-arrow">↑ pick the weight that best fits the case</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {fiveTests.map((t, i) => (
          <TestCard key={t.key} test={t} n={i + 1} />
        ))}
      </div>
    </div>
  );
}

function TestCard({ test, n }: { test: Criterion; n: number }) {
  return (
    <article className="rs-card relative">
      <header className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--sheet-accent)]">
            Test {String(n).padStart(2, '0')} · {TEST_CLUE[test.key]}
          </p>
          <h3 className="font-display text-[22px] leading-tight tracking-[-0.015em] text-[color:var(--color-ink)] mt-1">
            {test.labelEn}
          </h3>
        </div>
      </header>
      <p className="text-[13.5px] leading-[1.5] text-[color:var(--color-ink)]">{test.defEn}</p>
      <div className="mt-3 p-3 bg-[color:var(--sheet-accent-tint)] rounded-sm">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--sheet-accent-deep)]">
          Sentence stem
        </p>
        <p className="mt-1 text-[12.5px] leading-[1.5] italic text-[color:var(--color-ink)]">
          {test.starterEn}
        </p>
      </div>
    </article>
  );
}

function BackItUp() {
  return (
    <article className="rs-card rs-card-anchor relative">
      <div className="rs-halftone-corner" aria-hidden />
      <header className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[color:var(--sheet-accent)]">
            Bonus move
          </p>
          <h3 className="font-display text-[clamp(28px,4vw,40px)] leading-tight tracking-[-0.02em] text-[color:var(--color-ink)] mt-1">
            Back It Up
          </h3>
        </div>
        <span className="rs-badge">Level 4 booster</span>
      </header>
      <p className="text-[14px] leading-[1.55] text-[color:var(--color-ink)] max-w-[62ch]">
        {BONUS_MOVE.bodyEn}
      </p>
      <div className="mt-3 p-3 bg-[color:var(--sheet-accent-tint)] rounded-sm">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--sheet-accent-deep)]">
          Sounds like
        </p>
        <p className="mt-1 text-[12.5px] leading-[1.5] italic text-[color:var(--color-ink)]">
          "Source 2 shows that public health researchers also identify this as…"
        </p>
      </div>
    </article>
  );
}

function ModelStrip() {
  const steps: { tag: string; text: string; move: string }[] = [
    {
      tag: 'Opinion',
      text: 'I think the most significant benefit is that redesigning workstations for staff with disabilities ended up improving conditions for the entire workforce, not just the employees the changes were originally made for.',
      move: 'Clear opinion up front. No throat-clearing.',
    },
    {
      tag: 'Crowd Test',
      text: "This matters because the benefit reaches every worker on the line, not only the small group it was designed for.",
      move: 'Test named. "Reach" is doing the work.',
    },
    {
      tag: 'Back It Up',
      text: 'Source 2 shows that when Star Fasteners lowered benches and enlarged control buttons, the error rate on that whole assembly line fell.',
      move: 'Specific detail from the source — a named change, a named effect.',
    },
    {
      tag: 'Compare',
      text: 'This makes it more significant than the government incentive scheme mentioned in Source 1, because a tax break only benefits the company\'s finances, whereas this reaches every worker and improves the product itself.',
      move: 'The Level 4 move. Beats an alternative, not just describes.',
    },
  ];
  return (
    <div>
      <div className="rs-section-label" aria-hidden>
        <span>a Level 4 answer, unpacked</span>
        <span className="rs-section-label-arrow">↑ how the four moves stitch together</span>
      </div>
      <div className="grid gap-3 mt-4">
        {steps.map((s, i) => (
          <article key={i} className="rs-card p-4 grid grid-cols-[80px_minmax(0,1fr)] gap-4 items-baseline">
            <div className="text-right">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--sheet-accent-deep)] bg-[color:var(--sheet-accent-tint)] px-2 py-1 rounded-sm">
                {s.tag}
              </span>
            </div>
            <div>
              <p className="text-[13.5px] leading-[1.55] text-[color:var(--color-ink)] italic">"{s.text}"</p>
              <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
                → {s.move}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────── Footer ────────────────────────── */
function Footer() {
  return (
    <footer className="mt-10 border-t-[3px] border-[color:var(--color-ink)] pt-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--sheet-accent)]">
            Exam-day reminders
          </p>
          <ul className="mt-3 space-y-2 text-[13px] leading-[1.5] text-[color:var(--color-ink)]">
            <li>• Any of the options can be the "most significant". You choose. The <em>defending</em> is the marks.</li>
            <li>• Every test must actually fit the case. Don't force Crowd Test onto a fairness issue.</li>
            <li>• A Compare that isn't from the sources doesn't count. Beat something the passages named.</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ember)]">
            The three traps
          </p>
          <ul className="mt-3 space-y-2 text-[13px] leading-[1.5] text-[color:var(--color-ink)]">
            <li>• Naming a test without <em>using</em> it. "This is significant by the Crowd Test" is Level 2.</li>
            <li>• Listing all five tests instead of picking one. Depth, not breadth.</li>
            <li>• No Compare. You are capped at Level 3 without it, however good the rest is.</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-3)]">
            This sheet
          </p>
          <p className="mt-3 text-[13px] leading-[1.5] text-[color:var(--color-ink-2)]">
            Digital revision one-pager · WMSI GP0457 · Y10 T1. Full Weighing Room tutorial, matching drill and worked model at{' '}
            <a href="/perspectives#weigh" className="text-[color:var(--sheet-accent)] underline">/perspectives#weigh</a>.
          </p>
          <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
            Sheet 3 of 3 · <a href="/revision" className="underline">See all sheets →</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
