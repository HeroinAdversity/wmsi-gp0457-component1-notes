import { PART_STYLE } from '../data/design';
import type { ClaimPart } from '../data/types';
import { coverage, matrixAdvice, type MatrixDraft } from '../lib/coach';
import { Icon } from './Icon';

export function CoachPanel({ rows, parts, compare }: { rows: MatrixDraft[]; parts: ClaimPart[]; compare: string }) {
  const ids = parts.map((p) => p.id);
  const cov = coverage(rows, ids);
  const advice = matrixAdvice(rows, ids, compare.trim().length > 0);
  return (
    <div className="mt-4 grid gap-2.5 md:grid-cols-2">
      <div className="rounded-[6px] border border-[color:var(--color-line)] bg-white px-3 py-2.5 text-[12.5px] text-[color:var(--color-ink-2)]">
        <p className="mb-1 flex items-center gap-1.5 font-bold text-[color:var(--color-q2-sea)]">
          <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--color-q2-sage)]" aria-hidden />Claim coverage
        </p>
        <p>Each part of the claim should be tested by at least two developed rows.</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {parts.map((p) => (cov[p.id] >= 2
            ? <span key={p.id} className={`inline-flex items-center gap-1 rounded-[3px] px-2 py-0.5 font-mono text-[10.5px] font-semibold text-white ${PART_STYLE[p.id].bg}`}>{p.id} <Icon name="check" size={11} className="-mt-px" /></span>
            : <span key={p.id} className="rounded-[3px] border border-dashed border-[color:var(--color-ink-3)] px-2 py-0.5 font-mono text-[10.5px] font-semibold text-[color:var(--color-ink-3)]">{p.id} · {cov[p.id]} row{cov[p.id] === 1 ? '' : 's'}</span>))}
        </div>
      </div>
      <div className="rounded-[6px] border border-[color:var(--color-line)] bg-white px-3 py-2.5 text-[12.5px] text-[color:var(--color-ink-2)]">
        <p className="mb-1 flex items-center gap-1.5 font-bold text-[color:var(--color-q2-sea)]">
          <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--color-q2-olive)]" aria-hidden />Coach
        </p>
        <ul aria-live="polite" className="list-disc space-y-1 pl-4">
          {advice.length ? advice.map((a) => <li key={a}>{a}</li>)
            : <li className="list-none -ml-4 text-[color:var(--color-q2-storm)]">Ready: every part covered by two developed rows, plus a comparison.</li>}
        </ul>
      </div>
    </div>
  );
}
