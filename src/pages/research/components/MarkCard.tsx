import type { ReactNode } from 'react';

export function MarkCard({ marks, table, time, command, rule, target }: {
  marks: number; table: string; time: string; command: string; rule: ReactNode; target: ReactNode;
}) {
  const rows: [string, string][] = [['Marks', String(marks)], ['Marked on', table], ['Time', time], ['Command word', command]];
  return (
    <>
      {/* Phone: collapsible strip */}
      <details className="lg:hidden mt-3 rounded-[6px] bg-[color:var(--color-q2-night)] text-white">
        <summary className="list-none cursor-pointer px-3 py-2.5 font-mono text-[10.5px] flex justify-between">
          <span>{table.toUpperCase()} · {marks} MARKS · {time.toUpperCase()}</span><span aria-hidden>▾</span>
        </summary>
        <div className="px-3 pb-3 text-[13px] text-[#D6D5EA] space-y-2">{rule}{target}</div>
      </details>
      {/* Desktop: sticky card */}
      <aside className="hidden lg:block sticky top-24 self-start rounded-[8px] bg-[color:var(--color-q2-night)] text-[#E9E8F5] px-[22px] py-5">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-q2-ivory)]">The mark</p>
        <dl className="mt-3.5 grid grid-cols-[1fr_auto] gap-y-2 text-[13.5px]">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-[#B9B8D6]">{k}</dt>
              <dd className="m-0 text-right font-mono font-semibold text-white">{v}</dd>
            </div>
          ))}
        </dl>
        <hr className="my-4 border-0 border-t border-white/15" />
        <div className="text-[13px] leading-[1.55] text-[#D6D5EA] [&_strong]:text-[color:var(--color-q2-ivory)] [&_strong]:font-semibold">{rule}</div>
        <div className="mt-2.5">{target}</div>
      </aside>
    </>
  );
}

/** The "S S S W W" strip used in the 2(a) card. */
export function PointTarget({ s, w }: { s: number; w: number }) {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${s + w}, 1fr)` }} aria-label={`Target: ${s} strengths and ${w} weaknesses`}>
      {Array.from({ length: s }, (_, i) => <span key={`s${i}`} className="h-[26px] rounded-[3px] grid place-items-center font-mono text-[10.5px] font-semibold bg-[color:var(--color-q2-coastal)] text-[color:var(--color-q2-sea)]">S</span>)}
      {Array.from({ length: w }, (_, i) => <span key={`w${i}`} className="h-[26px] rounded-[3px] grid place-items-center font-mono text-[10.5px] font-semibold bg-[#E9A08F] text-[#3A1109]">W</span>)}
    </div>
  );
}
