import { useEffect, useRef, useState } from 'react';
import { useProgress } from '../../../lib/progress';
import { nx, usePersistentState, type Block } from '../../../lib/useNotesExport';
import type { BankItem } from '../data/types';
import { checkChain, tally, type ChainDraft } from '../lib/coach';
import { SourceAnnotator } from './SourceAnnotator';

/** Read saved chains outside React (for exports). Never throws. */
export function readChains(storageId: string): ChainDraft[] {
  try {
    const raw = localStorage.getItem(`wne_${storageId}_chains`);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}

export function chainsToText(chains: ChainDraft[]): string {
  return chains.map((c) => `[${c.kind === 'S' ? 'Strength' : 'Weakness'}] ${c.what} ${c.effect} ${c.aim}`.trim()).join('\n');
}

export function chainsToBlocks(chains: ChainDraft[]): Block[] {
  if (!chains.length) return [nx.p('No points written yet.')];
  return chains.flatMap((c, i) => [
    nx.h(3, `${i + 1}. ${c.kind === 'S' ? 'Strength' : 'Weakness'}`),
    nx.p([nx.text('What they did: ', { bold: true }), nx.text(c.what)]),
    nx.p([nx.text('Effect on the evidence: ', { bold: true }), nx.text(c.effect)]),
    nx.p([nx.text('Link to the aim: ', { bold: true }), nx.text(c.aim)]),
  ]);
}

const STEPS = [
  { key: 'what' as const, label: '1 · What they did', ph: 'The researcher only…' },
  { key: 'effect' as const, label: '2 · Effect on the evidence', ph: 'This means the evidence may be…' },
  { key: 'aim' as const, label: '3 · Link to the aim', ph: '…so it is less useful for finding out…' },
];

export function ChainBuilder({ item, storageId, activityId, activityTitle, selfLevel }: {
  item: BankItem; storageId: string; activityId: string; activityTitle: string; selfLevel?: 1 | 2 | 3 | 4;
}) {
  const [chains, setChains] = usePersistentState<ChainDraft[]>(storageId, 'chains', [], (raw) => {
    const v = JSON.parse(raw); return Array.isArray(v) ? v : [];
  });
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const firstFieldRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const { record } = useProgress();
  const t = tally(chains, item.aimKeywords);

  // Record to progress, debounced.
  useEffect(() => {
    if (!chains.length) return;
    const id = setTimeout(() => record({
      id: activityId, title: activityTitle, kind: 'answer-2a',
      status: t.minimumMet ? 'done' : 'in-progress',
      answerText: chainsToText(chains), ...(selfLevel ? { selfLevel } : {}),
    }), 600);
    return () => clearTimeout(id);
  }, [chains, activityId, activityTitle, record, t.minimumMet, selfLevel]);

  useEffect(() => {
    if (focusIdx !== null) firstFieldRefs.current[focusIdx]?.focus();
  }, [focusIdx]);

  const add = (featureId: string | null) => {
    const f = featureId ? item.features.find((x) => x.id === featureId) : undefined;
    setFocusIdx(chains.length);
    setChains((prev) => [...prev, { featureId, kind: 'S', what: f ? `"${f.quote}"` : '', effect: '', aim: '' }]);
  };
  const update = (i: number, patch: Partial<ChainDraft>) => setChains((prev) => prev.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const remove = (i: number) => setChains((prev) => prev.filter((_, j) => j !== i));

  const message = t.level4Range ? 'Wide range — Level 4 territory.'
    : t.minimumMet ? 'Good — add one more for Level 4 range.'
      : 'Level 4 needs both sides, about five points.';

  return (
    <div>
      <p className="mt-2 text-[14px] text-[color:var(--color-ink-2)]">Tap a highlighted phrase to start a point about it. Decide whether it is a strength or a weakness, then explain it in three steps.</p>
      <SourceAnnotator item={item} selected={null} onSelect={(id) => add(id)} showKinds={false} />

      <div className="mt-4 space-y-3">
        {chains.map((c, i) => {
          const check = checkChain(c, item.aimKeywords);
          return (
            <div key={i} className="overflow-hidden rounded-[8px] border border-[#CBD6E0] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[color:var(--color-q2-night)] px-3.5 py-2 text-[12.5px] text-white">
                <span className="font-semibold">Point {i + 1}{c.featureId ? ` · ${c.featureId}` : ' · your own'}</span>
                <span className="flex items-center gap-1.5">
                  {(['S', 'W'] as const).map((k) => (
                    <button key={k} type="button" aria-pressed={c.kind === k} onClick={() => update(i, { kind: k })}
                      className={`rounded-[3px] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] ${c.kind === k
                        ? (k === 'S' ? 'bg-[color:var(--color-q2-coastal)] text-[color:var(--color-q2-sea)]' : 'bg-[#E9A08F] text-[#3A1109]')
                        : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>
                      {k === 'S' ? 'Strength' : 'Weakness'}
                    </button>
                  ))}
                  <button type="button" onClick={() => remove(i)} className="ml-1 rounded-[3px] px-2 py-0.5 text-[11px] text-white/70 hover:bg-white/10" aria-label={`Remove point ${i + 1}`}>Remove</button>
                </span>
              </div>
              <div className="grid md:grid-cols-3">
                {STEPS.map((s, si) => (
                  <label key={s.key} className={`block px-3.5 py-3 ${si ? 'border-t md:border-t-0 md:border-l border-[color:var(--color-line-soft)]' : ''}`}>
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-[color:var(--color-q2-storm)]">{s.label}</span>
                    <textarea
                      ref={si === 0 ? (el) => { firstFieldRefs.current[i] = el; } : undefined}
                      value={c[s.key]} placeholder={s.ph} rows={3}
                      onChange={(e) => update(i, { [s.key]: e.target.value })}
                      className="mt-1 w-full resize-y rounded-[4px] border border-[color:var(--color-line)] px-2 py-1.5 text-[13.5px] leading-[1.5] focus:border-[color:var(--color-q2-storm)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-q2-coastal-tint)]"
                    />
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 border-t border-[color:var(--color-line-soft)] px-3.5 py-2 text-[12px]">
                <Check ok={check.linkedToSource} yes="In the source" no="Not linked to the source" />
                <Check ok={check.hasEffect} yes="Effect explained" no="Say what it does to the evidence" />
                <Check ok={check.hasAimLink} yes="Linked to aim" no="Link it to the aim" />
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={() => add(null)} className="mt-3 text-[13px] font-semibold text-[color:var(--color-q2-storm)] underline underline-offset-2">+ Add a point not in the highlights</button>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px] text-[color:var(--color-ink-2)]" aria-live="polite">
        <span className={`rounded-full border bg-white px-3 py-1 font-semibold ${t.s >= 2 ? 'border-[color:var(--color-q2-coastal)] text-[color:var(--color-q2-storm)]' : 'border-[color:var(--color-line)]'}`}>Strengths explained · {t.s} of 2+</span>
        <span className={`rounded-full border bg-white px-3 py-1 font-semibold ${t.w >= 2 ? 'border-[color:var(--color-q2-coastal)] text-[color:var(--color-q2-storm)]' : 'border-[color:var(--color-line)]'}`}>Weaknesses explained · {t.w} of 2+</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

function Check({ ok, yes, no }: { ok: boolean; yes: string; no: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${ok ? 'text-[color:var(--color-q2-storm)]' : 'text-[color:var(--color-ember)]'}`}>
      <span className={`inline-block h-2 w-2 rounded-full ${ok ? 'bg-[color:var(--color-q2-storm)]' : 'bg-[#E0A493]'}`} aria-hidden />
      {ok ? yes : no}
    </span>
  );
}
