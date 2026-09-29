export interface LevelRow { level: 1 | 2 | 3 | 4; marks: string; descriptor: string; answer: string; why: string }

/** The same question answered at every level, with the descriptor it meets. */
export function LevelLadder({ levels }: { levels: LevelRow[] }) {
  return (
    <ol className="mt-6 space-y-4">
      {[...levels].sort((a, b) => b.level - a.level).map((l) => (
        <li key={l.level} className="grid gap-3 md:grid-cols-[150px_1fr]">
          <div>
            <span className={`inline-block rounded-[4px] px-2.5 py-1 font-mono text-[11px] font-semibold ${l.level === 4 ? 'bg-[color:var(--color-q2-night)] text-[color:var(--color-q2-ivory)]' : 'bg-[color:var(--color-q2-arctic)] text-[color:var(--color-q2-sea)]'}`}>
              LEVEL {l.level} · {l.marks}
            </span>
            <p className="mt-2 text-[13px] leading-[1.5] text-[color:var(--color-ink-2)]">{l.descriptor}</p>
          </div>
          <div>
            <p className="rounded-[6px] border border-[color:var(--color-line)] bg-white px-4 py-3 text-[14px] leading-[1.6]">{l.answer}</p>
            <p className="mt-1.5 text-[13px] text-[color:var(--color-ink-2)]"><b className="text-[color:var(--color-q2-sea)]">Why this level:</b> {l.why}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
