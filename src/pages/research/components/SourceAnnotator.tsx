import type { KeyboardEvent } from 'react';
import { SESSIONS, type BankItem } from '../data/types';
import { segmentText } from '../lib/segments';

/**
 * Source 3 with its features highlighted. With `showKinds` the marks are coloured
 * as strengths (coastal) or weaknesses (ember); without it every mark is neutral,
 * so practice mode doesn't give the answer away.
 */
export function SourceAnnotator({ item, selected, onSelect, showKinds = true }: {
  item: BankItem; selected: string | null; onSelect: (featureId: string) => void; showKinds?: boolean;
}) {
  const byId = new Map(item.features.map((f) => [f.id, f]));
  const label = item.kind === 'reworded' ? `Reworded from ${SESSIONS[item.parent]}` : `WMSI mirror · ${item.id}`;
  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id); }
  };

  return (
    <div className="mt-5 rounded-[6px] border border-[color:var(--color-line)] bg-white px-5 py-5 md:px-6">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-[color:var(--color-line)] pb-2">
        <b className="font-display text-[19px] font-normal">{item.source.heading}</b>
        <span className="font-mono text-[10.5px] uppercase text-[color:var(--color-ink-3)]">{label}</span>
      </div>
      {item.source.paragraphs.map((para, pi) => (
        <p key={pi} className="text-[15px] leading-[1.85] [&+p]:mt-2">
          {segmentText(para, item.features).map((seg, si) => {
            if (!seg.id) return <span key={si}>{seg.text}</span>;
            const f = byId.get(seg.id)!;
            const tone = !showKinds
              ? 'bg-[color:var(--color-q2-arctic)] shadow-[inset_0_-2px_0_#C9CED6]'
              : f.kind === 'S'
                ? 'bg-[color:var(--color-q2-coastal-tint)] shadow-[inset_0_-2px_0_var(--color-q2-coastal)]'
                : 'bg-[color:var(--color-ember-soft)] shadow-[inset_0_-2px_0_#E0A493]';
            const supTone = !showKinds ? 'text-[color:var(--color-ink-3)]' : f.kind === 'S' ? 'text-[color:var(--color-q2-storm)]' : 'text-[color:var(--color-ember)]';
            return (
              <mark
                key={si} role="button" tabIndex={0} aria-pressed={selected === f.id}
                aria-label={showKinds ? `${f.kind === 'S' ? 'Strength' : 'Weakness'} ${f.id}: ${f.label}` : `Feature: ${seg.text}`}
                onClick={() => onSelect(f.id)} onKeyDown={(e) => onKey(e, f.id)}
                className={`cursor-pointer rounded-[2px] px-0.5 text-inherit transition-colors ${tone} ${selected === f.id ? 'outline outline-2 outline-offset-1 outline-[color:var(--color-q2-sea)]' : ''}`}
              >
                {seg.text}
                {showKinds && <sup className={`ml-0.5 font-mono text-[9.5px] font-bold ${supTone}`}>{f.id}</sup>}
              </mark>
            );
          })}
        </p>
      ))}
    </div>
  );
}
