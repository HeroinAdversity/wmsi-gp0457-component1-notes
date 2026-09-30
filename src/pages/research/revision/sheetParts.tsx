import type { ReactNode } from 'react';

/* ══════════════════════════════════════════════════════════════════
   Shared pieces for the two Question 2 revision sheets.
   Colour carries meaning on both sheets: each key idea keeps one
   colour everywhere it appears (chain step, claim part, strength or
   weakness), so a student can scan the page by colour.
   ══════════════════════════════════════════════════════════════════ */

export type Tone = 'storm' | 'sage' | 'olive' | 'strength' | 'weakness' | 'ivory';

/** Fill, border and label colour for each tone (labels are darkened for contrast). */
export const TONE: Record<Tone, { fill: string; line: string; ink: string; solid: string }> = {
  storm: { fill: '#E4EDF4', line: 'var(--color-q2-storm)', ink: 'var(--color-q2-storm)', solid: 'var(--color-q2-storm)' },
  sage: { fill: '#E6F0F2', line: 'var(--color-q2-sage)', ink: 'var(--color-q2-sage-ink)', solid: 'var(--color-q2-sage)' },
  olive: { fill: 'var(--color-q2-ivory-tint)', line: 'var(--color-q2-olive)', ink: '#5E5E2A', solid: 'var(--color-q2-olive)' },
  strength: { fill: 'var(--color-q2-coastal-tint)', line: 'var(--color-q2-coastal)', ink: 'var(--color-q2-storm)', solid: 'var(--color-q2-storm)' },
  weakness: { fill: 'var(--color-ember-soft)', line: '#E9A08F', ink: 'var(--color-ember)', solid: 'var(--color-ember)' },
  ivory: { fill: 'var(--color-q2-ivory-tint)', line: '#D8D8A8', ink: 'var(--color-q2-sea)', solid: 'var(--color-q2-olive)' },
};

/** The same three colours stand for the three chain steps (2a) and the three claim parts (2b). */
export const STEP_TONE: Tone[] = ['storm', 'sage', 'olive'];

/** A coloured key-word box: the term, then what it means. */
export function KeyTerm({ tone, term, children }: { tone: Tone; term: string; children?: ReactNode }) {
  const t = TONE[tone];
  return (
    <div className="q2rs-term" style={{ background: t.fill, borderColor: t.line }}>
      <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: t.ink }}>{term}</p>
      {children && <p className="mt-0.5 text-[12.5px] leading-[1.45] text-[color:var(--color-ink)]">{children}</p>}
    </div>
  );
}

/** A small solid tag (S, W, Method 1…). */
export function Tag({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className="inline-block rounded-[2px] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white"
      style={{ background: TONE[tone].solid }}>
      {children}
    </span>
  );
}

/** A run of text highlighted in a tone, used to show the chain inside a model sentence. */
export function Mark({ tone, children }: { tone: Tone; children: ReactNode }) {
  const t = TONE[tone];
  return <span className="q2rs-mark" style={{ background: t.fill, boxShadow: `inset 0 -2px 0 ${t.line}` }}>{children}</span>;
}

/** Mark-scheme level rows (Table C / Table D). Wording follows the published mark scheme. */
export function MarkBands({ rows }: { rows: { level: number; marks: string; name: string; desc: string }[] }) {
  return (
    <ul className="p-4 space-y-2.5">
      {rows.map((b) => (
        <li key={b.level} className="grid grid-cols-[48px_1fr] gap-2">
          <span className="h-fit rounded-sm bg-[color:var(--sheet-accent-tint)] px-1.5 py-0.5 text-center font-mono text-[11px] font-semibold tabular-nums text-[color:var(--sheet-accent-deep)]">
            L{b.level} · {b.marks}
          </span>
          <span className="text-[12.5px] leading-[1.45] text-[color:var(--color-ink-2)]">
            <b className="text-[color:var(--color-ink)]">{b.name}.</b> {b.desc}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * "What the examiner saw": the report's comprehensive vs limited responses
 * side by side, with the citation and a one-line "So:" action.
 */
export function ExaminerSaw({ source, did, lost, action }: { source: string; did: string[]; lost: string[]; action: string }) {
  return (
    <section className="q2rs-examiner" aria-label="What the examiner saw">
      <header className="flex flex-wrap items-center gap-2.5 px-4 pt-4 md:px-5">
        <svg width="20" height="24" viewBox="0 0 22 26" aria-hidden className="flex-none">
          <path d="M2 1h12l6 6v17a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" fill="#fff" stroke="#021526" strokeWidth="1.4" />
          <path d="M14 1v6h6" fill="none" stroke="#021526" strokeWidth="1.4" />
          <path d="M5 12h11M5 16h11M5 20h7" stroke="#8C8C45" strokeWidth="1.4" />
        </svg>
        <span className="font-display text-[20px] leading-none text-[color:var(--color-q2-sea)]">What the examiner saw</span>
        <span className="ml-auto font-mono text-[10.5px] text-[#6B6B3A]">{source}</span>
      </header>
      <div className="grid gap-3 p-4 md:grid-cols-2 md:px-5 print:grid-cols-2">
        {([['strength', 'Comprehensive responses', did], ['weakness', 'Limited responses', lost]] as const).map(([tone, label, items]) => (
          <div key={label} className="rounded-[3px] border px-3.5 py-3" style={{ background: TONE[tone].fill, borderColor: TONE[tone].line }}>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: TONE[tone].ink }}>
              {tone === 'strength' ? '✓' : '✗'} {label}
            </p>
            <ul className="mt-1.5 space-y-1.5 text-[12.5px] leading-[1.45] text-[color:var(--color-ink)]">
              {items.map((q) => <li key={q}>“{q}”</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-4 mb-4 flex gap-2 border-t border-dashed border-[#CFCF9A] pt-2.5 text-[13.5px] text-[color:var(--color-ink-2)] md:mx-5">
        <b className="whitespace-nowrap text-[color:var(--color-q2-sea)]">So:</b><span>{action}</span>
      </p>
    </section>
  );
}

/** Styles for the pieces above; rendered once per sheet. */
export function Q2SheetStyles() {
  return (
    <style>{`
      .q2rs-term { border: 1px solid; border-radius: 3px; padding: 7px 10px 8px; }
      .q2rs-mark { padding: 1px 2px; border-radius: 2px; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
      .q2rs-examiner {
        background: var(--color-q2-ivory-tint);
        border: 1px solid #D8D8A8;
        border-radius: 6px;
        box-shadow: 0 1px 0 #D8D8A8, 0 6px 14px -8px rgba(0,0,0,0.18);
      }
      .q2rs-step { border-top-width: 6px; }
      @media print {
        .q2rs-examiner { box-shadow: none; }
        .q2rs-term, .q2rs-mark, .q2rs-examiner, .rs-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .rs-card { break-inside: avoid; }
      }
    `}</style>
  );
}
