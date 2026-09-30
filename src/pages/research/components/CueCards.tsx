import { useState } from 'react';
import type { CueIcon, TestingCue } from '../data/toolkit';

const STROKE = 'var(--color-q2-storm)';

function CueIllustration({ icon }: { icon: CueIcon }) {
  const common = { width: 40, height: 40, viewBox: '0 0 40 40', fill: 'none', stroke: STROKE, strokeWidth: 1.8, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  switch (icon) {
    case 'building':
      return <svg {...common}><path d="M6 15 20 7l14 8H6z" fill="#fff" /><path d="M9 15v14M15 15v14M25 15v14M31 15v14" /><path d="M5 33h30M7 29h26" /></svg>;
    case 'document':
      return <svg {...common}><path d="M9 5h16l6 6v24H9z" fill="#fff" /><path d="M25 5v6h6M13 17h14M13 22h14M13 27h8" /><circle cx="29" cy="30" r="5" fill="var(--color-q2-coastal-tint)" /><path d="M27 30h4M29 28v4" /></svg>;
    case 'expert':
      return <svg {...common}><circle cx="18" cy="13" r="6" fill="#fff" /><path d="M6 34c1-7 6-11 12-11s11 4 12 11" /><circle cx="30" cy="24" r="5" fill="var(--color-q2-ivory)" /><path d="m28 24 1.5 1.5L32 23" /></svg>;
    case 'scope':
      return <svg {...common}><path d="M8 10c6-4 10 3 16-1s8 2 8 2v19c-4-2-6 3-12 1s-8-3-12 0z" fill="#fff" /><path d="M4 8v26M36 8v26" strokeDasharray="2 3" /><circle cx="16" cy="18" r="1.6" fill={STROKE} /><circle cx="24" cy="23" r="1.6" fill={STROKE} /><circle cx="20" cy="28" r="1.6" fill={STROKE} /></svg>;
    case 'bars':
      return <svg {...common}><path d="M6 34h28" /><rect x="9" y="22" width="6" height="12" fill="#fff" /><rect x="17" y="17" width="6" height="17" fill="var(--color-q2-coastal-tint)" /><rect x="25" y="10" width="6" height="24" fill="var(--color-q2-coastal)" /><path d="m8 16 10-6 6 3 9-7" stroke="var(--color-q2-olive)" /></svg>;
    case 'triangle':
      return <svg {...common}><path d="M20 7 34 31H6z" fill="#fff" /><circle cx="20" cy="7" r="4" fill="var(--color-q2-coastal)" /><circle cx="34" cy="31" r="4" fill="var(--color-q2-ivory)" /><circle cx="6" cy="31" r="4" fill="var(--color-q2-sage)" /><path d="m17 21 2.5 2.5L24 19" stroke="var(--color-q2-sea)" /></svg>;
  }
}

function CueCard({ cue, n }: { cue: TestingCue; n: number }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="relative flex flex-col rounded-[10px] border border-[color:var(--color-line)] bg-white p-4 pb-3.5">
      <div className="absolute right-3.5 top-3.5 grid h-16 w-16 place-items-center rounded-[10px] bg-[color:var(--color-q2-coastal-tint)]">
        <CueIllustration icon={cue.icon} />
      </div>
      <p className="font-mono text-[10.5px] font-semibold tracking-[0.12em] text-[color:var(--color-q2-storm)]">{String(n).padStart(2, '0')}</p>
      <h3 className="mt-1 pr-[74px] font-display text-[22px] leading-[1.15] text-[color:var(--color-q2-sea)]">{cue.title}</h3>
      <p className="mt-2.5 text-[13.5px] text-[color:var(--color-ink-2)]">{cue.ask}</p>
      <p className="mt-3 rounded-[6px] bg-[color:var(--color-q2-ivory-tint)] px-2.5 py-2 text-[12.5px] text-[color:var(--color-q2-sea)]">
        <b className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-q2-olive)]">For the vehicle-crime claim</b>
        {cue.example}
      </p>
      {open && (
        <p className="mt-2.5 rounded-[6px] bg-[color:var(--color-q2-coastal-tint)] px-2.5 py-2 text-[13px]" aria-live="polite">
          <b>{cue.check}</b> <em>{cue.answer}</em>
        </p>
      )}
      <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[12px] text-[color:var(--color-ink-3)]">
        <span>Links to: {cue.links}</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="no-print rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-2.5 py-0.5 text-[12px] font-semibold text-[color:var(--color-q2-storm)]"
        >
          {open ? 'Hide answer' : 'Test yourself'}
        </button>
      </div>
    </article>
  );
}

export function CueCards({ cues }: { cues: TestingCue[] }) {
  return (
    <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2">
      {cues.map((c, i) => <CueCard key={c.id} cue={c} n={i + 1} />)}
    </div>
  );
}
