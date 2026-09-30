import { Container } from '../../components/primitives';
import {
  RevisionSheetShell,
  SheetMasthead,
  SidebarPanel,
} from '../../components/RevisionSheetChrome';
import { LEVEL_DEFS, FIVE_ELEMENTS, type LevelKey, type Element } from './data';

/* ══════════════════════════════════════════════════════════════════
   Perspectives — Revision Sheet (Q1c)
   Four levels of perspective (global/national/local/personal) as
   anchor cards, five elements as the mark-scheme method, "who is
   speaking" as the top-line question.
   ══════════════════════════════════════════════════════════════════ */

// Palette per level, drawn from data.ts colorVar assignments and the
// existing Identifying Perspectives page conventions.
const LEVEL_STYLE: Record<LevelKey, { tint: string; accent: string; deep: string }> = {
  GLOBAL: {
    tint: 'bg-[color:var(--color-cobalt-tint)]',
    accent: 'text-[color:var(--color-cobalt)]',
    deep: 'text-[color:var(--color-cobalt-deep)]',
  },
  NATIONAL: {
    tint: 'bg-[color:var(--color-forest-tint)]',
    accent: 'text-[color:var(--color-forest)]',
    deep: 'text-[color:var(--color-forest-deep)]',
  },
  LOCAL: {
    tint: 'bg-[color:var(--color-amber-tint)]',
    accent: 'text-[color:var(--color-amber)]',
    deep: 'text-[color:var(--color-amber-deep)]',
  },
  PERSONAL: {
    tint: 'bg-[color:var(--color-violet-tint)]',
    accent: 'text-[color:var(--color-violet)]',
    deep: 'text-[color:var(--color-violet-deep)]',
  },
};

const SIX_MARKS = [
  {
    n: '1',
    title: 'Name the level',
    body: 'Global · National · Local · Personal. Point to who is speaking, not what the topic is.',
  },
  {
    n: '2',
    title: 'Multiple elements',
    body: 'Issues + Values + Causes + Consequences + Actions. A single element is a describe — an examiner wants three or more.',
  },
  {
    n: '3',
    title: 'Anchor to the source',
    body: 'Every element must point at a specific word or phrase in the passage. General summary earns nothing.',
  },
];

const IDENTIFY_TREE: { q: string; then: string }[] = [
  { q: 'International body, treaty, or worldwide movement?', then: 'Global' },
  { q: 'A government, national law, whole-country policy?', then: 'National' },
  { q: 'A town, community, or specific place on the ground?', then: 'Local' },
  { q: 'One individual reflecting on their own experience?', then: 'Personal' },
];

const COMMON_CONFUSIONS: { pair: string; disc: string }[] = [
  {
    pair: 'National vs Personal',
    disc: 'A minister speaking about national policy is national. A former soldier reflecting on the same policy is personal — even on the same topic.',
  },
  {
    pair: 'Global vs National',
    disc: 'A UN agency or international NGO is global. A single government or its ministry is national. Check the affiliation, not the scope of the issue.',
  },
  {
    pair: 'Local vs National',
    disc: 'A village council, farmer, or town-level actor is local, even when talking about a national issue.',
  },
];

export function PerspectivesRevisionSheetPage() {
  return (
    <RevisionSheetShell accent="amber">
      <Container size="wide" className="pt-8 md:pt-12 pb-16">
        <SheetMasthead
          index="2 of 4"
          paper="Paper 1"
          question="Q1(c)"
          marks="6 marks"
          title="Perspectives"
          tagline={
            <>
              Four levels · five elements · one command word (<em>describe</em>). Everything you need
              to identify whose perspective a source represents and describe it for the mark.
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
      <SidebarPanel eyebrow="How to earn all 6 marks" foot="Missing step 3 drops you to a Level 2.">
        <ol className="p-4 space-y-3">
          {SIX_MARKS.map((m) => (
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

      <SidebarPanel eyebrow="Which level?">
        <p className="px-4 pt-3 text-[11.5px] italic leading-[1.5] text-[color:var(--color-ink-2)]">
          Ask: who is speaking? First "yes" wins.
        </p>
        <ol className="px-4 pb-4 pt-2 space-y-1.5">
          {IDENTIFY_TREE.map((step, i) => (
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

      <SidebarPanel eyebrow="Common confusions" variant="ink">
        <ul className="p-4 space-y-3">
          {COMMON_CONFUSIONS.map((c) => (
            <li key={c.pair}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ember)]">
                {c.pair}
              </p>
              <p className="mt-1 text-[12.5px] leading-[1.5] text-[color:var(--color-ink)]">{c.disc}</p>
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
      <FourLevels />
      <FiveElements />
    </div>
  );
}

function FourLevels() {
  return (
    <div>
      <div className="rs-section-label" aria-hidden>
        <span>the four levels</span>
        <span className="rs-section-label-arrow">↑ whose viewpoint is this?</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 mt-4 print:grid-cols-2 print:gap-3">
        {LEVEL_DEFS.map((l) => (
          <LevelCard key={l.key} lvl={l} />
        ))}
      </div>
    </div>
  );
}

function LevelCard({ lvl }: { lvl: typeof LEVEL_DEFS[number] }) {
  const style = LEVEL_STYLE[lvl.key];
  return (
    <article className="rs-card relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1.5 ${style.tint.replace('bg-', 'bg-')}`} aria-hidden />
      <header className="flex items-baseline justify-between gap-3 mb-3 mt-2">
        <p className={`font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] ${style.accent}`}>
          {lvl.en.name}
        </p>
        <span className={`font-mono text-[10px] font-semibold uppercase tracking-[0.14em] ${style.deep}`}>
          Level of perspective
        </span>
      </header>
      <p className="text-[14px] leading-[1.5] text-[color:var(--color-ink)] max-w-[52ch]">
        {lvl.en.def}
      </p>
      <div className={`mt-3 p-3 ${style.tint} rounded-sm`}>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
          Example
        </p>
        <p className="mt-1 text-[12.5px] leading-[1.5] italic text-[color:var(--color-ink)]">"{lvl.en.example}"</p>
      </div>
    </article>
  );
}

function FiveElements() {
  return (
    <div>
      <div className="rs-section-label" aria-hidden>
        <span>the five elements</span>
        <span className="rs-section-label-arrow">↑ what to say about the perspective</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mt-4 print:grid-cols-5 print:gap-3">
        {FIVE_ELEMENTS.map((e, i) => (
          <ElementCard key={e.id} el={e} n={i + 1} />
        ))}
      </div>
      <div className="mt-4 rs-card rs-card-anchor relative">
        <div className="rs-halftone-corner" aria-hidden />
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[color:var(--sheet-accent)]">
          Frame sentences · fill the blanks with source words
        </p>
        <ul className="mt-2 grid gap-1.5 md:grid-cols-2 text-[13px] leading-[1.55] text-[color:var(--color-ink)] print:grid-cols-2 print:gap-3">
          <li>· "One issue this organisation identifies is <span className="italic text-[color:var(--color-ink-3)]">______</span>."</li>
          <li>· "They value <span className="italic text-[color:var(--color-ink-3)]">______</span>, because <span className="italic text-[color:var(--color-ink-3)]">______</span>."</li>
          <li>· "They see this as caused by <span className="italic text-[color:var(--color-ink-3)]">______</span>."</li>
          <li>· "One consequence they mention is <span className="italic text-[color:var(--color-ink-3)]">______</span>."</li>
          <li>· "To address this, they have taken action by <span className="italic text-[color:var(--color-ink-3)]">______</span>."</li>
        </ul>
      </div>
    </div>
  );
}

function ElementCard({ el, n }: { el: Element; n: number }) {
  return (
    <article className="rs-card p-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] tabular-nums text-[color:var(--sheet-accent)]">
        Element {String(n).padStart(2, '0')}
      </p>
      <h3 className="font-display text-[17px] leading-[1.1] tracking-[-0.01em] text-[color:var(--color-ink)] mt-1">
        {el.labelEn}
      </h3>
      <p className="mt-2 text-[12.5px] leading-[1.5] text-[color:var(--color-ink)]">{el.descEn}</p>
      <p className="mt-2 text-[11.5px] leading-[1.45] italic text-[color:var(--color-ink-2)]">
        Signal: {el.signalsEn}
      </p>
    </article>
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
            <li>• Command word is <strong>describe</strong>, not explain. Say what's there — don't argue whether it's right.</li>
            <li>• Whose voice, not what topic. A minister on climate is <em>national</em>. A farmer on climate is <em>personal</em>.</li>
            <li>• Three or more elements. One element is a describe of one thing, not of a perspective.</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ember)]">
            The three traps
          </p>
          <ul className="mt-3 space-y-2 text-[13px] leading-[1.5] text-[color:var(--color-ink)]">
            <li>• Naming the topic instead of the level. "Climate change" isn't a level; <em>global</em> is.</li>
            <li>• Summarising in your own words with no source quotes. Level 2 at best.</li>
            <li>• Only writing about <em>issues</em>. That's one element out of five. You need at least three.</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-3)]">
            This sheet
          </p>
          <p className="mt-3 text-[13px] leading-[1.5] text-[color:var(--color-ink-2)]">
            Digital revision one-pager · WMSI GP0457 · Y10 T1. Full notes, case study, and practice at{' '}
            <a href="/perspectives" className="text-[color:var(--sheet-accent)] underline">/perspectives</a>.
          </p>
          <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
            Sheet 2 of 3 · <a href="/revision" className="underline">See all sheets →</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
