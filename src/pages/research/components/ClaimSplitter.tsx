import type { ClaimPart } from '../data/types';
import { PART_STYLE } from '../data/design';
import { segmentText } from '../lib/segments';

export function ClaimSplitter({ claim, source }: { claim: { text: string; parts: ClaimPart[] }; source?: string }) {
  const segs = segmentText(claim.text, claim.parts.map((p) => ({ id: String(p.id), quote: p.phrase })));
  return (
    <div className="mt-5 rounded-[6px] border border-[color:var(--color-line)] bg-white px-5 py-5 md:px-6">
      {source && <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[color:var(--color-ink-3)]">The claim · {source}</p>}
      <p className="font-display text-[22px] md:text-[29px] leading-[1.4] text-[color:var(--color-q2-sea)]">
        “{segs.map((s, i) => (s.id
          ? <span key={i} className={PART_STYLE[Number(s.id) as 1 | 2 | 3].underline}>{s.text}</span>
          : <span key={i}>{s.text}</span>))}”
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {claim.parts.map((p) => (
          <div key={p.id} className="rounded-[5px] bg-[color:var(--color-q2-arctic)] px-3 py-2.5 text-[13px] text-[color:var(--color-ink-2)]">
            <b className="mb-0.5 flex items-center gap-1.5 text-[12.5px] text-[color:var(--color-q2-sea)]">
              <i className={`inline-block h-2.5 w-2.5 rounded-[2px] ${PART_STYLE[p.id].bg}`} aria-hidden />{p.id} · {p.label} — “{p.phrase}”
            </b>
            {p.need}
          </div>
        ))}
      </div>
    </div>
  );
}
