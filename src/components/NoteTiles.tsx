import type { ReactNode } from 'react';

/* ══════════════════════════════════════════════════════════════════
   Note tiles: the content-page version of the revision-sheet tiles.
   Notes that used to be bulleted lists, ruled definition lists or
   side-bar callouts are laid out as tiles instead, with the
   explanation text a size up (15px) so it reads comfortably.
   ══════════════════════════════════════════════════════════════════ */

const COLS: Record<2 | 3 | 4, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

export function TileGrid({ cols = 3, className = '', children }: { cols?: 2 | 3 | 4; className?: string; children: ReactNode }) {
  return <div className={`grid gap-3 ${COLS[cols]} ${className}`}>{children}</div>;
}

/** One tile: a coloured top edge, an optional label, a title and the explanation. */
export function NoteTile({
  accent = 'var(--color-ink-3)', eyebrow, title, children, className = '',
}: {
  accent?: string; eyebrow?: ReactNode; title?: ReactNode; children?: ReactNode; className?: string;
}) {
  return (
    <article className={`rounded-[8px] border border-[color:var(--color-line)] border-t-[4px] bg-white px-4 py-3.5 ${className}`} style={{ borderTopColor: accent }}>
      {eyebrow && <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: accent }}>{eyebrow}</p>}
      {title && <h3 className="mt-0.5 font-display text-[19px] leading-snug text-[color:var(--color-ink)]">{title}</h3>}
      {children && <div className={`${title || eyebrow ? 'mt-1.5' : ''} text-[15px] leading-[1.55] text-[color:var(--color-ink-2)]`}>{children}</div>}
    </article>
  );
}

type BoxTone = 'good' | 'bad' | 'info' | 'tip' | 'plain';

const BOX: Record<BoxTone, { bg: string; line: string; ink: string; mark: string }> = {
  good: { bg: 'var(--color-forest-tint)', line: 'color-mix(in srgb, var(--color-forest) 45%, transparent)', ink: 'var(--color-forest-deep)', mark: '✓' },
  bad: { bg: 'var(--color-ember-soft)', line: 'color-mix(in srgb, var(--color-ember) 40%, transparent)', ink: 'var(--color-ember)', mark: '✗' },
  info: { bg: 'var(--color-cobalt-tint)', line: 'color-mix(in srgb, var(--color-cobalt) 35%, transparent)', ink: 'var(--color-cobalt-deep)', mark: 'i' },
  tip: { bg: 'var(--color-amber-tint)', line: 'color-mix(in srgb, var(--color-amber) 45%, transparent)', ink: 'var(--color-amber-deep)', mark: '★' },
  plain: { bg: 'var(--color-paper-2)', line: 'var(--color-line)', ink: 'var(--color-ink-2)', mark: '' },
};

/**
 * A card-style note (replaces the old coloured side-bar callouts):
 * a full thin border, a tint, and a small labelled heading.
 */
export function NoteBox({
  tone = 'plain', label, children, className = '',
}: {
  tone?: BoxTone; label?: ReactNode; children: ReactNode; className?: string;
}) {
  const t = BOX[tone];
  return (
    <div className={`rounded-[6px] border px-4 py-3 ${className}`} style={{ background: t.bg, borderColor: t.line }}>
      {label && (
        <p className="mb-1 flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: t.ink }}>
          {t.mark && <span aria-hidden className="grid h-4 w-4 place-items-center rounded-full text-[9.5px] text-white" style={{ background: t.ink }}>{t.mark}</span>}
          {label}
        </p>
      )}
      <div className="text-[15px] leading-[1.55] text-[color:var(--color-ink)]">{children}</div>
    </div>
  );
}
