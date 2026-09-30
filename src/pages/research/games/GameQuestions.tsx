import { useEffect, useMemo, useRef, useState } from 'react';
import { PART_STYLE } from '../data/design';
import type { PartId } from '../data/types';
import { segmentText } from '../lib/segments';
import { featureIdea, partIdea, type IdeaId } from './ideas';
import {
  checkSplit, claimWords, partWordIndexes,
  type ChainOrderQ, type ChainStep, type ChoiceQ, type MatchQ, type SpotQ, type SplitQ, type UntestedQ,
} from './generate';

/** What a finished question reports back: right answers and attempts per idea. */
export interface Outcome { correct: number; total: number; ideas: Partial<Record<IdeaId, [number, number]>> }

const add = (o: Outcome['ideas'], id: IdeaId, ok: boolean) => {
  const [c, n] = o[id] ?? [0, 0];
  o[id] = [c + (ok ? 1 : 0), n + 1];
};

const card = 'rounded-[8px] border border-[color:var(--color-line)] bg-white';
const btn = 'rounded-full bg-[color:var(--color-q2-sea)] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-35';
const label = 'font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em]';
const STEP_LABEL: Record<ChainStep, string> = { what: '1 · What they did', effect: '2 · Effect on the evidence', aim: '3 · Link to the aim' };

function KindTag({ kind }: { kind: 'S' | 'W' }) {
  return (
    <span className={`rounded-[3px] px-1.5 py-0.5 ${label} ${kind === 'S' ? 'bg-[color:var(--color-q2-coastal-tint)] text-[color:var(--color-q2-storm)]' : 'bg-[color:var(--color-ember-soft)] text-[color:var(--color-ember)]'}`}>
      {kind === 'S' ? 'Strength' : 'Weakness'}
    </span>
  );
}

function Quote({ q }: { q: { quote: string; context: string; itemTitle: string; kind: 'S' | 'W' } }) {
  const at = q.context.indexOf(q.quote);
  return (
    <div className="rounded-[8px] border border-[color:var(--color-line-soft)] bg-[color:var(--color-paper)] px-3.5 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`${label} text-[color:var(--color-ink-3)]`}>From Source 3 · {q.itemTitle}</p>
        <KindTag kind={q.kind} />
      </div>
      <p className="mt-1 text-[14px] text-[color:var(--color-ink)]">
        “{at < 0 ? <mark className="rounded-[2px] bg-[#FBE3DC] px-0.5 text-inherit">{q.quote}</mark> : (
          <>{q.context.slice(0, at)}<mark className="rounded-[2px] bg-[#FBE3DC] px-0.5 text-inherit">{q.quote}</mark>{q.context.slice(at + q.quote.length)}</>
        )}”
      </p>
    </div>
  );
}

function Feedback({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <p aria-live="polite" className={`mt-3 rounded-[6px] px-3 py-2 text-[13.5px] ${ok ? 'bg-[#E3F2E7]' : 'bg-[color:var(--color-ember-soft)]'}`}>
      <b>{ok ? 'Yes. ' : 'Not quite. '}</b>{children}
    </p>
  );
}

/* ── Chain order ── */
export function ChainOrderView({ q, onDone }: { q: ChainOrderQ; onDone: (o: Outcome) => void }) {
  const [order, setOrder] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const ok = checked && order.every((i, k) => q.steps[i].step === (['what', 'effect', 'aim'] as ChainStep[])[k]);
  const check = () => {
    setChecked(true);
    const right = order.every((i, k) => q.steps[i].step === (['what', 'effect', 'aim'] as ChainStep[])[k]);
    const ideas = {}; add(ideas, q.idea, right);
    onDone({ correct: right ? 1 : 0, total: 1, ideas });
  };
  return (
    <div>
      <Quote q={q} />
      <p className="mt-4 text-[13.5px] text-[color:var(--color-ink-2)]">Tap the steps in the right order: <b>what they did → effect on the evidence → link to the aim</b>.</p>
      <div className="mt-3 grid gap-2">
        {[0, 1, 2].map((slot) => {
          const i = order[slot];
          const step = i === undefined ? null : q.steps[i];
          const right = checked && step?.step === (['what', 'effect', 'aim'] as ChainStep[])[slot];
          return (
            <div key={slot} className={`min-h-[52px] rounded-[8px] border px-3 py-2 text-[13.5px] ${step ? (checked ? (right ? 'border-[#3E8A58] bg-[#E3F2E7]' : 'border-[#E0A493] bg-[color:var(--color-ember-soft)]') : 'border-[color:var(--color-q2-storm)] bg-white') : 'border-dashed border-[color:var(--color-line)] bg-[color:var(--color-paper)] text-[color:var(--color-ink-3)]'}`}>
              <span className={`${label} block text-[color:var(--color-q2-storm)]`}>Step {slot + 1}</span>
              {step ? step.text : 'Tap a step below'}
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid gap-2">
        {q.steps.map((s, i) => {
          const used = order.includes(i);
          return (
            <button key={s.step} type="button" disabled={used || checked} onClick={() => setOrder((o) => [...o, i])}
              className={`${card} px-3 py-2 text-left text-[13.5px] hover:border-[color:var(--color-q2-storm)] disabled:opacity-35`}>
              {s.text}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        {!checked && <button type="button" className={btn} disabled={order.length < 3} onClick={check}>Check</button>}
        {!checked && order.length > 0 && <button type="button" className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-[13px] font-semibold" onClick={() => setOrder([])}>Start again</button>}
      </div>
      {checked && (
        <Feedback ok={ok}>
          {ok ? 'Name the feature, say what it does to the evidence, then tie it to the aim.' : (
            <>The chain runs: {(['what', 'effect', 'aim'] as ChainStep[]).map((st) => q.steps.find((s) => s.step === st)!.text).join(' → ')}</>
          )}
        </Feedback>
      )}
    </div>
  );
}

/* ── Missing link / Fix it ── */
export function ChoiceView({ q, onDone }: { q: ChoiceQ; onDone: (o: Outcome) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const ideas = {}; add(ideas, q.idea, i === q.answer);
    onDone({ correct: i === q.answer ? 1 : 0, total: 1, ideas });
  };
  return (
    <div>
      <Quote q={q} />
      {q.type === 'missing-link' ? (
        <div className="mt-3 grid gap-2">
          <div className={`${card} px-3 py-2 text-[13.5px]`}><span className={`${label} block text-[color:var(--color-q2-storm)]`}>{STEP_LABEL.what}</span>{q.stem.what}</div>
          <div className={`rounded-[8px] border px-3 py-2 text-[13.5px] ${picked === null ? 'border-dashed border-[color:var(--color-q2-storm)] bg-[color:var(--color-q2-coastal-tint)] italic text-[color:var(--color-q2-storm)]' : 'border-[color:var(--color-q2-storm)] bg-white'}`}>
            <span className={`${label} block not-italic text-[color:var(--color-q2-storm)]`}>{STEP_LABEL.effect}</span>
            {picked === null ? 'Which link goes here?' : q.right}
          </div>
          <div className={`${card} px-3 py-2 text-[13.5px]`}><span className={`${label} block text-[color:var(--color-q2-storm)]`}>{STEP_LABEL.aim}</span>{q.stem.aim}</div>
        </div>
      ) : (
        <div className={`${card} mt-3 px-3 py-2.5 text-[13.5px]`}>
          <span className={`${label} block text-[color:var(--color-ember)]`}>A Level 2 point</span>
          {q.stem.weak}
          <p className="mt-1.5 text-[12.5px] text-[color:var(--color-ink-3)]">Which edit lifts it towards Level 4?</p>
        </div>
      )}
      <div className="mt-3 grid gap-2">
        {q.options.map((o, i) => {
          const state = picked === null ? 'bg-white border-[color:var(--color-line)] hover:border-[color:var(--color-q2-storm)]'
            : i === q.answer ? 'bg-[#E3F2E7] border-[#3E8A58]' : i === picked ? 'bg-[color:var(--color-ember-soft)] border-[#E0A493]' : 'bg-white border-[color:var(--color-line)] opacity-60';
          return (
            <button key={o} type="button" disabled={picked !== null} onClick={() => choose(i)} className={`rounded-[8px] border px-3 py-2 text-left text-[13.5px] ${state}`}>{o}</button>
          );
        })}
      </div>
      {picked !== null && <Feedback ok={picked === q.answer}>{q.explain}</Feedback>}
    </div>
  );
}

/** Inline tappable text: a real <button> can't wrap across lines inside a paragraph. */
function Tap({ onTap, disabled, className, children, label }: { onTap: () => void; disabled?: boolean; className: string; children: React.ReactNode; label?: string }) {
  return (
    <span
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={label}
      onClick={() => { if (!disabled) onTap(); }}
      onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onTap(); } }}
      className={`${disabled ? '' : 'cursor-pointer'} rounded-[2px] ${className}`}
    >
      {children}
    </span>
  );
}

/* ── Spot it ── */
export const SPOT_SECONDS = 90;
export function SpotView({ q, onDone }: { q: SpotQ; onDone: (o: Outcome) => void }) {
  const [left, setLeft] = useState(SPOT_SECONDS);
  const [found, setFound] = useState<Record<string, 'S' | 'W'>>({});
  const [asking, setAsking] = useState<string | null>(null);
  const [miss, setMiss] = useState(0);
  const [over, setOver] = useState(false);
  const doneRef = useRef(false);
  const byId = useMemo(() => new Map(q.item.features.map((f) => [f.id, f])), [q]);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setOver(true);
    const ideas = {};
    let correct = 0;
    for (const f of q.item.features) {
      const ok = found[f.id] === f.kind;
      if (ok) correct += 1;
      add(ideas, featureIdea(f), ok);
    }
    onDone({ correct, total: q.item.features.length, ideas });
  };

  useEffect(() => {
    if (over) return;
    if (left <= 0) { finish(); return; }
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (!over && Object.keys(found).length === q.item.features.length) finish(); }); // eslint-disable-line react-hooks/exhaustive-deps

  const decoy = () => { if (over) return; setMiss((m) => m + 1); setLeft((s) => Math.max(0, s - 3)); };
  const answer = (kind: 'S' | 'W') => { if (!asking) return; setFound((f) => ({ ...f, [asking]: kind })); setAsking(null); };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 text-[13px]">
        <span className={`rounded-full px-3 py-1 font-mono font-semibold ${left <= 15 && !over ? 'bg-[color:var(--color-ember-soft)] text-[color:var(--color-ember)]' : 'bg-[color:var(--color-q2-arctic)]'}`}>⏱ {left}s</span>
        <span>Found <b>{Object.keys(found).length}</b> of {q.item.features.length}</span>
        {miss > 0 && <span className="text-[color:var(--color-ink-3)]">{miss} miss{miss > 1 ? 'es' : ''} (−3s each)</span>}
        {!over && <button type="button" onClick={finish} className="ml-auto rounded-full border border-[color:var(--color-line)] px-3 py-1 font-semibold">I’m done</button>}
      </div>
      <p className="mt-2 text-[13px] text-[color:var(--color-ink-2)]">Tap a phrase that shows how the research was done, then say whether it is a strength or a weakness. Tapping plain description costs 3 seconds.</p>
      {asking && (
        <div className="sticky top-[calc(var(--site-header-h,64px)+var(--section-bar-h,48px))] z-10 mt-3 flex flex-wrap items-center gap-2 rounded-[8px] bg-[color:var(--color-q2-sea)] px-3 py-2 text-[13px] text-white">
          <span className="mr-auto">“{byId.get(asking)!.quote}”</span>
          <button type="button" onClick={() => answer('S')} className="rounded-full bg-[color:var(--color-q2-coastal)] px-3 py-1 font-semibold text-[color:var(--color-q2-sea)]">Strength</button>
          <button type="button" onClick={() => answer('W')} className="rounded-full bg-[#E9A08F] px-3 py-1 font-semibold text-[#3A1109]">Weakness</button>
        </div>
      )}
      <div className={`${card} mt-3 px-4 py-4`}>
        <p className="mb-2 font-display text-[18px]">{q.item.source.heading}</p>
        {q.item.source.paragraphs.map((para, pi) => (
          <p key={pi} className="text-[15px] leading-[1.85] [&+p]:mt-2">
            {segmentText(para, q.item.features).map((seg, si) => {
              if (seg.id) {
                const f = byId.get(seg.id)!;
                const got = found[f.id];
                const tone = over
                  ? (got === f.kind ? 'bg-[#E3F2E7] shadow-[inset_0_-2px_0_#3E8A58]' : got ? 'bg-[color:var(--color-ember-soft)] shadow-[inset_0_-2px_0_#E0A493]' : 'bg-[color:var(--color-q2-ivory-tint)] shadow-[inset_0_-2px_0_var(--color-q2-olive)]')
                  : got ? 'bg-[color:var(--color-q2-coastal-tint)] shadow-[inset_0_-2px_0_var(--color-q2-storm)]' : 'hover:bg-[color:var(--color-paper-2)]';
                return (
                  <Tap key={si} disabled={over || !!got} onTap={() => setAsking(f.id)} className={`spot-feature px-0.5 ${tone}`}>
                    {seg.text}
                    {over && <sup className="ml-0.5 font-mono text-[9.5px] font-bold">{f.kind}{got && got !== f.kind ? ' ✗' : ''}</sup>}
                  </Tap>
                );
              }
              // Plain text is split into clauses; tapping one is a miss.
              // Split after punctuation but keep the original spacing inside each clause.
              return seg.text.split(/(?<=[,.;:]\s)/).map((clause, ci) => (
                <Tap key={`${si}-${ci}`} disabled={over} onTap={decoy} className="spot-plain hover:bg-[color:var(--color-paper-2)]">{clause}</Tap>
              ));
            })}
          </p>
        ))}
      </div>
      {over && (
        <p className="mt-3 text-[13px] text-[color:var(--color-ink-2)]">Green: found and named right. Red: found but named wrong. Olive: missed. The letter shows the answer (S or W).</p>
      )}
    </div>
  );
}

/* ── Claim splitter ── */
export function SplitView({ q, onDone }: { q: SplitQ; onDone: (o: Outcome) => void }) {
  const words = claimWords(q.claim);
  const [tag, setTag] = useState<PartId>(1);
  const [tags, setTags] = useState<Record<number, PartId>>({});
  const [result, setResult] = useState<Record<PartId, boolean> | null>(null);
  const answer = useMemo(() => partWordIndexes(q), [q]);

  const tap = (k: number) => {
    if (result) return;
    setTags((t) => { const n = { ...t }; if (n[k] === tag) delete n[k]; else n[k] = tag; return n; });
  };
  const check = () => {
    const r = checkSplit(q, tags);
    setResult(r);
    const ideas = {};
    let correct = 0;
    for (const p of q.parts) { if (r[p.id]) correct += 1; add(ideas, partIdea(p), r[p.id]); }
    onDone({ correct, total: q.parts.length, ideas });
  };
  const tone = (id: PartId) => ({ 1: 'bg-[#D8E6F4]', 2: 'bg-[#DCEBEE]', 3: 'bg-[#ECECD2]' } as const)[id];

  return (
    <div>
      <p className={`${label} text-[color:var(--color-ink-3)]`}>Pick a part, then tap its words · {q.itemTitle}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {q.parts.map((p) => (
          <button key={p.id} type="button" onClick={() => setTag(p.id)} disabled={!!result}
            className={`rounded-full border px-3 py-1 text-[12.5px] font-semibold ${tag === p.id ? `${PART_STYLE[p.id].bg} border-transparent text-white` : 'border-[color:var(--color-line)] bg-white'}`}>
            {p.id} · {p.label}
          </button>
        ))}
      </div>
      <p className="mt-3 font-display text-[24px] leading-[1.5] text-[color:var(--color-q2-sea)]">
        “{words.map((w, k) => (
          <span key={k}>
            <button type="button" onClick={() => tap(k)} className={`rounded-[4px] px-0.5 ${tags[k] ? `${tone(tags[k])} ${PART_STYLE[tags[k]].underline}` : 'hover:bg-[color:var(--color-paper-2)]'}`}>{w}</button>{k < words.length - 1 ? ' ' : ''}
          </span>
        ))}”
      </p>
      {!result && <button type="button" className={`${btn} mt-2`} disabled={!Object.keys(tags).length} onClick={check}>Check</button>}
      {result && (
        <div className="mt-3 grid gap-1.5 text-[13px]">
          {q.parts.map((p) => (
            <div key={p.id} className={`rounded-[6px] px-3 py-1.5 ${result[p.id] ? 'bg-[#E3F2E7]' : 'bg-[color:var(--color-ember-soft)]'}`}>
              <b>{p.id} · {p.label}: “{answer[p.id].map((k) => words[k]).join(' ').replace(/[.,]$/, '')}”</b> → {p.need}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Method match ── */
export function MatchView({ q, onDone }: { q: MatchQ; onDone: (o: Outcome) => void }) {
  const [pick, setPick] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const check = () => {
    setChecked(true);
    const ideas = {};
    let correct = 0;
    for (const p of q.parts) {
      const ok = pick[p.id] !== undefined && q.rows[pick[p.id]].tests.includes(p.id);
      if (ok) correct += 1;
      add(ideas, partIdea(p), ok);
    }
    onDone({ correct, total: q.parts.length, ideas });
  };
  return (
    <div>
      <p className={`${label} text-[color:var(--color-ink-3)]`}>The claim · {q.itemTitle}</p>
      <p className="mt-1 font-display text-[22px] leading-[1.35] text-[color:var(--color-q2-sea)]">“{q.claim}”</p>
      <p className="mt-2 text-[13.5px] text-[color:var(--color-ink-2)]">For each part of the claim, pick a method that can test it.</p>
      <div className="mt-3 grid gap-3">
        {q.parts.map((p) => (
          <fieldset key={p.id} className={`${card} px-3 py-2.5`}>
            <legend className="sr-only">Part {p.id}</legend>
            <p className="text-[13.5px]"><span className={`mr-1.5 rounded-[3px] px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-white ${PART_STYLE[p.id].bg}`}>{p.id} · {p.label}</span><b>“{p.phrase}”</b></p>
            <div className="mt-2 grid gap-1.5">
              {q.rows.map((r, i) => {
                const chosen = pick[p.id] === i;
                const tone = !checked ? (chosen ? 'border-[color:var(--color-q2-storm)] bg-[color:var(--color-q2-coastal-tint)]' : 'border-[color:var(--color-line)] bg-white')
                  : chosen ? (r.tests.includes(p.id) ? 'border-[#3E8A58] bg-[#E3F2E7]' : 'border-[#E0A493] bg-[color:var(--color-ember-soft)]')
                    : r.tests.includes(p.id) ? 'border-dashed border-[#3E8A58] bg-white' : 'border-[color:var(--color-line)] bg-white opacity-60';
                return (
                  <button key={r.label} type="button" disabled={checked} onClick={() => setPick((x) => ({ ...x, [p.id]: i }))} className={`rounded-[6px] border px-2.5 py-1.5 text-left text-[13px] ${tone}`}>{r.label}</button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      {!checked && <button type="button" className={`${btn} mt-3`} disabled={Object.keys(pick).length < q.parts.length} onClick={check}>Check</button>}
      {checked && <p className="mt-3 text-[13px] text-[color:var(--color-ink-2)]">A dashed green border marks every method that also tests that part. One method can test more than one part.</p>}
    </div>
  );
}

/* ── What's untested? ── */
export function UntestedView({ q, onDone }: { q: UntestedQ; onDone: (o: Outcome) => void }) {
  const [picked, setPicked] = useState<PartId | null>(null);
  const choose = (id: PartId) => {
    if (picked !== null) return;
    setPicked(id);
    const ideas = {}; add(ideas, q.idea, id === q.answer);
    onDone({ correct: id === q.answer ? 1 : 0, total: 1, ideas });
  };
  const target = q.parts.find((p) => p.id === q.answer)!;
  return (
    <div>
      <p className={`${label} text-[color:var(--color-ink-3)]`}>A student’s plan · {q.itemTitle}</p>
      <p className="mt-1 font-display text-[22px] leading-[1.35] text-[color:var(--color-q2-sea)]">“{q.claim}”</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-[13px]">
          <thead><tr className={`${label} text-left text-[color:var(--color-ink-3)]`}><th className="border-b border-[color:var(--color-q2-sea)] px-2 py-1.5">Who</th><th className="border-b border-[color:var(--color-q2-sea)] px-2 py-1.5">How</th><th className="border-b border-[color:var(--color-q2-sea)] px-2 py-1.5">What</th></tr></thead>
          <tbody>{q.rows.map((r) => <tr key={r.who + r.how} className="align-top"><td className="border-b border-[color:var(--color-line)] px-2 py-1.5">{r.who}</td><td className="border-b border-[color:var(--color-line)] px-2 py-1.5">{r.how}</td><td className="border-b border-[color:var(--color-line)] px-2 py-1.5">{r.what}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="mt-3 text-[13.5px] text-[color:var(--color-ink-2)]">Which part of the claim does this plan never test?</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {q.parts.map((p) => {
          const state = picked === null ? 'bg-white border-[color:var(--color-line)] hover:border-[color:var(--color-q2-storm)]'
            : p.id === q.answer ? 'bg-[#E3F2E7] border-[#3E8A58]' : p.id === picked ? 'bg-[color:var(--color-ember-soft)] border-[#E0A493]' : 'bg-white border-[color:var(--color-line)] opacity-60';
          return (
            <button key={p.id} type="button" disabled={picked !== null} onClick={() => choose(p.id)} className={`rounded-[8px] border px-3 py-2 text-left text-[13.5px] ${state}`}>
              <span className={`${label} block text-[color:var(--color-ink-3)]`}>{p.id} · {p.label}</span>“{p.phrase}”
            </button>
          );
        })}
      </div>
      {picked !== null && <Feedback ok={picked === q.answer}>“{target.phrase}” is never tested. To test it, the plan needs: {target.need}</Feedback>}
    </div>
  );
}
