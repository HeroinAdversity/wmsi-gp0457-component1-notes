/**
 * Shared chrome for the three revision sheets (Statement Types,
 * Perspectives, Significance).
 *
 * A revision sheet wraps its content in `<RevisionSheetShell accent="cobalt|amber|forest">`.
 * The shell renders the shared CSS once (styles keyed on `--sheet-accent-*`
 * custom properties) and sets those variables to the family's palette so
 * each sheet gets its own tone while sharing the layout language.
 *
 * Sheets compose atoms exported here — Masthead, SidebarPanel, YesBox, NoBox,
 * MicroYes, MicroNo — with whatever bespoke card layout their content
 * needs. Nothing forces every sheet into the same grid.
 */
import type { CSSProperties, ReactNode } from 'react';

export type SheetAccent = 'cobalt' | 'amber' | 'forest' | 'q2';

const ACCENT_STYLES: Record<SheetAccent, CSSProperties> = {
  cobalt: {
    ['--sheet-accent' as string]: 'var(--color-cobalt)',
    ['--sheet-accent-tint' as string]: 'var(--color-cobalt-tint)',
    ['--sheet-accent-soft' as string]: 'var(--color-cobalt-soft)',
    ['--sheet-accent-deep' as string]: 'var(--color-cobalt-deep)',
  },
  amber: {
    ['--sheet-accent' as string]: 'var(--color-amber)',
    ['--sheet-accent-tint' as string]: 'var(--color-amber-tint)',
    ['--sheet-accent-soft' as string]: 'var(--color-amber-soft)',
    ['--sheet-accent-deep' as string]: 'var(--color-amber-deep)',
  },
  forest: {
    ['--sheet-accent' as string]: 'var(--color-forest)',
    ['--sheet-accent-tint' as string]: 'var(--color-forest-tint)',
    ['--sheet-accent-soft' as string]: 'var(--color-forest-soft)',
    ['--sheet-accent-deep' as string]: 'var(--color-forest-deep)',
  },
  q2: {
    ['--sheet-accent' as string]: 'var(--color-q2-storm)',
    ['--sheet-accent-tint' as string]: 'var(--color-q2-coastal-tint)',
    ['--sheet-accent-soft' as string]: 'var(--color-q2-ivory)',
    ['--sheet-accent-deep' as string]: 'var(--color-q2-sea)',
  },
};

/* ══════════════════ Shell ══════════════════ */
export function RevisionSheetShell({
  accent,
  children,
}: {
  accent: SheetAccent;
  children: ReactNode;
}) {
  return (
    <div className="revision-sheet" style={ACCENT_STYLES[accent]}>
      <RevisionSheetStyles />
      <PrintBar />
      {children}
    </div>
  );
}

/* ══════════════════ Print bar ══════════════════ */
function PrintBar() {
  return (
    <div className="no-print mx-auto flex max-w-[1180px] justify-end px-5 pt-5 md:px-8">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)] bg-[color:var(--color-paper)] px-4 py-2 text-[13px] font-semibold text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-2)]"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 6V1.5h8V6M4 12H2.5A1 1 0 0 1 1.5 11V7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H12M4 9.5h8v5H4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
        Print this sheet
      </button>
    </div>
  );
}

/* ══════════════════ Masthead ══════════════════ */
export function SheetMasthead({
  index,
  paper,
  question,
  marks,
  title,
  tagline,
}: {
  index: string;
  paper: string;
  question: string;
  marks: string;
  title: string;
  tagline: ReactNode;
}) {
  return (
    <header className="rs-masthead relative overflow-hidden border-y-[3px] border-[color:var(--color-ink)] py-6 md:py-8">
      <div className="rs-halftone-band" aria-hidden />
      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--sheet-accent)]">
            Revision Sheet · {index} · IGCSE 0457
          </p>
          <h1 className="rs-title mt-2 font-display text-[clamp(40px,7vw,84px)] leading-[0.95] tracking-[-0.02em] text-[color:var(--color-ink)]">
            {title}
          </h1>
          <p className="mt-2 font-body text-[15px] italic text-[color:var(--color-ink-2)] max-w-[56ch]">
            {tagline}
          </p>
        </div>
        <div className="rs-stamp shrink-0">
          <div className="rs-stamp-inner">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[color:var(--sheet-accent-deep)]">
              {paper}
            </p>
            <p className="font-display text-[26px] leading-none text-[color:var(--sheet-accent-deep)] mt-1">
              {question}
            </p>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--sheet-accent-deep)] mt-1">
              {marks}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ══════════════════ Sidebar panel ══════════════════ */
export function SidebarPanel({
  eyebrow,
  variant = 'accent',
  children,
  foot,
}: {
  eyebrow: string;
  variant?: 'accent' | 'ink';
  children: ReactNode;
  foot?: ReactNode;
}) {
  const head = variant === 'ink' ? 'rs-panel-head rs-panel-head-alt' : 'rs-panel-head';
  return (
    <section className="rs-panel">
      <header className={head}>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-paper)]">
          {eyebrow}
        </p>
      </header>
      {children}
      {foot && (
        <div className="rs-panel-foot font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
          {foot}
        </div>
      )}
    </section>
  );
}

/* ══════════════════ YES / NO boxes ══════════════════ */
export function YesBox({ text, label = 'Is this' }: { text: string; label?: string }) {
  return (
    <div className="rs-yes">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-forest-deep)]">
        ✓ {label}
      </p>
      <p className="mt-1.5 text-[13px] leading-[1.5] italic text-[color:var(--color-ink)]">"{text}"</p>
    </div>
  );
}

export function NoBox({ text, label = 'Not this' }: { text: string; label?: string }) {
  return (
    <div className="rs-no">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ember)]">
        ✗ {label}
      </p>
      <p className="mt-1.5 text-[13px] leading-[1.5] italic text-[color:var(--color-ink)]">"{text}"</p>
    </div>
  );
}

export function MicroYes({ text }: { text: string }) {
  return (
    <div className="rs-micro rs-micro-yes">
      <span className="rs-micro-tag">✓</span>
      <span className="rs-micro-text">"{text}"</span>
    </div>
  );
}

export function MicroNo({ text }: { text: string }) {
  return (
    <div className="rs-micro rs-micro-no">
      <span className="rs-micro-tag">✗</span>
      <span className="rs-micro-text">"{text}"</span>
    </div>
  );
}

/* ══════════════════ Shared styles ══════════════════ */
function RevisionSheetStyles() {
  return (
    <style>{`
      .revision-sheet {
        background:
          radial-gradient(circle at 8% 0%, color-mix(in srgb, var(--sheet-accent) 6%, transparent) 0%, transparent 42%),
          radial-gradient(circle at 96% 12%, rgba(143,93,15,0.05) 0%, transparent 40%),
          radial-gradient(circle at 50% 100%, rgba(39,106,80,0.04) 0%, transparent 45%);
      }

      .rs-title {
        text-shadow:
          3px 3px 0 color-mix(in srgb, var(--sheet-accent) 35%, transparent),
          6px 6px 0 rgba(143, 93, 15, 0.12);
      }

      /* ── Halftone bands / corners ── */
      .rs-halftone-band {
        position: absolute; inset: 0;
        background-image: radial-gradient(circle, var(--sheet-accent) 1px, transparent 1.4px);
        background-size: 8px 8px;
        opacity: 0.10;
        mask-image: linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%);
        pointer-events: none;
      }
      .rs-halftone-corner {
        position: absolute; right: 0; top: 0;
        width: 180px; height: 180px;
        background-image: radial-gradient(circle, var(--sheet-accent) 1.4px, transparent 1.8px);
        background-size: 10px 10px;
        opacity: 0.18;
        mask-image: radial-gradient(circle at 100% 0%, black 0%, transparent 70%);
        pointer-events: none;
      }

      /* ── Stamp ── */
      .rs-stamp {
        transform: rotate(-3deg);
        border: 2px solid var(--sheet-accent-deep);
        border-radius: 4px;
        padding: 8px 14px;
        background: var(--sheet-accent-tint);
        box-shadow: 3px 3px 0 var(--sheet-accent-deep);
        min-width: 120px;
        text-align: center;
      }
      .rs-stamp-inner {
        border: 1px dashed var(--sheet-accent-deep);
        padding: 6px 8px;
      }

      /* ── Sidebar panels ── */
      .rs-panel {
        background: var(--color-paper);
        border: 1px solid var(--color-ink);
        box-shadow: 3px 3px 0 var(--color-ink);
      }
      .rs-panel-head {
        background: var(--sheet-accent);
        padding: 8px 14px;
        border-bottom: 1px solid var(--color-ink);
      }
      .rs-panel-head-alt {
        background: var(--color-ink);
      }
      .rs-panel-foot {
        border-top: 1px dashed var(--color-line);
        padding: 8px 14px 10px;
      }

      /* ── Numbered marker ── */
      .rs-marknum {
        width: 28px; height: 28px;
        display: inline-flex; align-items: center; justify-content: center;
        font-family: var(--font-mono);
        font-weight: 700;
        font-size: 14px;
        color: var(--color-paper);
        background: var(--sheet-accent);
        border-radius: 3px;
      }

      /* ── Ladder rows (used by discriminator/method lists) ── */
      .rs-ladder-step {
        display: grid;
        grid-template-columns: 22px 1fr auto;
        align-items: baseline;
        gap: 6px 8px;
        padding: 4px 0;
        border-bottom: 1px dotted var(--color-line);
      }
      .rs-ladder-step:last-child { border-bottom: 0; }
      .rs-ladder-then {
        font-family: var(--font-mono);
        font-size: 10.5px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--sheet-accent-deep);
        background: var(--sheet-accent-soft);
        padding: 2px 8px;
        border-radius: 2px;
      }

      /* ── Cards ── */
      .rs-card {
        position: relative;
        background: var(--color-paper);
        border: 1px solid var(--color-ink);
        padding: 20px 22px;
        box-shadow: 4px 4px 0 var(--color-ink);
      }
      .rs-card-anchor {
        border-top: 6px solid var(--sheet-accent);
        padding-top: 22px;
        background: linear-gradient(180deg, var(--sheet-accent-tint) 0%, var(--color-paper) 40%);
      }
      .rs-card-vsfact {
        padding-top: 44px; /* clears the flush-top ribbon */
      }
      .rs-card-pair {
        border: 1px solid var(--color-ember);
        box-shadow: 4px 4px 0 var(--color-ember);
        padding: 0;
        overflow: hidden;
      }
      .rs-pair-header {
        padding: 12px 16px;
        border-bottom: 1px dashed var(--color-ember);
        background: var(--color-ember-soft);
        background-image: repeating-linear-gradient(
          -45deg,
          transparent 0px, transparent 6px,
          rgba(179,53,32,0.05) 6px, rgba(179,53,32,0.05) 8px
        );
      }
      .rs-pair-half {
        padding: 14px 14px 16px;
        background: var(--color-paper);
      }
      .rs-pair-half-left { border-right: 1px dashed var(--color-line); }
      .rs-pair-vs {
        display: flex; align-items: center; justify-content: center;
        padding: 0 4px;
        font-family: var(--font-mono);
        font-weight: 700;
        font-size: 11px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--color-ember);
        background: var(--color-paper);
        border-left: 1px dashed var(--color-line);
        border-right: 1px dashed var(--color-line);
        min-width: 32px;
        position: relative;
      }
      .rs-pair-vs::before {
        content: "";
        position: absolute;
        left: 50%; top: 50%;
        width: 24px; height: 24px;
        border: 1.5px solid var(--color-ember);
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }
      .rs-pair-vs span { position: relative; z-index: 1; }

      /* ── Section labels (row headers) ── */
      .rs-section-label {
        display: flex; align-items: baseline; gap: 10px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--color-line);
        font-family: var(--font-mono);
        font-size: 10.5px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: var(--color-ink-3);
      }
      .rs-section-label-arrow {
        color: var(--sheet-accent);
        font-weight: 700;
      }

      /* ── vs-Fact / vs-* card ribbon (flush inside top of card) ── */
      .rs-ribbon {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        background: var(--sheet-accent);
        color: var(--color-paper);
        font-family: var(--font-mono);
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        padding: 7px 14px;
        border-bottom: 1px solid var(--sheet-accent-deep);
      }
      .rs-ribbon-disc {
        color: var(--sheet-accent-soft);
        font-weight: 500;
        letter-spacing: 0.1em;
      }

      /* ── Badges ── */
      .rs-badge {
        font-family: var(--font-mono);
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        padding: 5px 10px;
        border: 1px solid var(--sheet-accent);
        color: var(--sheet-accent-deep);
        background: var(--sheet-accent-tint);
        white-space: nowrap;
        align-self: flex-start;
      }

      /* ── YES / NO boxes ── */
      .rs-yes, .rs-no {
        padding: 10px 12px;
        border: 1px solid;
      }
      .rs-yes {
        background: var(--color-forest-tint);
        border-color: var(--color-forest);
      }
      .rs-no {
        background: var(--color-ember-soft);
        border-color: var(--color-ember);
      }

      /* ── Micro YES / NO (compact rows) ── */
      .rs-micro {
        display: grid;
        grid-template-columns: 20px 1fr;
        gap: 6px;
        align-items: baseline;
        padding: 5px 10px;
        font-size: 12px;
        line-height: 1.45;
        border-radius: 3px;
      }
      .rs-micro-yes { background: var(--color-forest-tint); }
      .rs-micro-no { background: var(--color-ember-soft); }
      .rs-micro-tag { font-family: var(--font-mono); font-weight: 700; }
      .rs-micro-yes .rs-micro-tag { color: var(--color-forest-deep); }
      .rs-micro-no .rs-micro-tag { color: var(--color-ember); }
      .rs-micro-text { font-style: italic; color: var(--color-ink); }

      /* ── Responsive ── */
      @media (max-width: 640px) {
        .rs-card-pair .rs-pair-grid {
          grid-template-columns: 1fr !important;
        }
        .rs-pair-half-left {
          border-right: none;
          border-bottom: 1px dashed var(--color-line);
        }
        .rs-pair-vs {
          border-left: none;
          border-right: none;
          border-top: 1px dashed var(--color-line);
          border-bottom: 1px dashed var(--color-line);
          padding: 8px;
          min-height: 32px;
        }
      }

      /* ── Print ── */
      @media print {
        .revision-sheet { background: #fff !important; }
        .revision-sheet > div { padding-top: 0 !important; padding-bottom: 0 !important; max-width: none !important; padding-left: 0 !important; padding-right: 0 !important; }
        .rs-panel, .rs-card { box-shadow: none !important; }
        .rs-halftone-band, .rs-halftone-corner { display: none !important; }
        .rs-title { text-shadow: none !important; font-size: 40px !important; }
        .rs-section-label { break-after: avoid; page-break-after: avoid; }
        .rs-masthead { padding-top: 10px !important; padding-bottom: 10px !important; }
        .revision-sheet .mt-8, .revision-sheet .mt-6 { margin-top: 10px !important; }
        .revision-sheet .mt-12, .revision-sheet .mt-10 { margin-top: 14px !important; }
        .revision-sheet .gap-6 { gap: 10px !important; }
      }
    `}</style>
  );
}
