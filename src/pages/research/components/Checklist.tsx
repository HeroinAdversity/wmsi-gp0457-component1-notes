import { useEffect } from 'react';
import { useProgress } from '../../../lib/progress';
import { usePersistentState } from '../../../lib/useNotesExport';

export function Checklist({ activityId, title, items }: { activityId: string; title: string; items: string[] }) {
  const [ticks, setTicks] = usePersistentState<boolean[]>(activityId, 'ticks', items.map(() => false));
  const { record } = useProgress();
  const ticked = ticks.filter(Boolean).length;

  useEffect(() => {
    if (!ticked) return;
    record({ id: activityId, title, kind: 'checklist', status: ticked === items.length ? 'done' : 'in-progress', score: ticked, max: items.length });
  }, [ticked, activityId, title, items.length, record]);

  return (
    <div className="mt-6">
      <ul className="divide-y divide-[color:var(--color-line)] border-y border-[color:var(--color-line)]">
        {items.map((it, i) => (
          <li key={it}>
            <label className="flex cursor-pointer items-start gap-3 py-3 text-[14.5px]">
              <input type="checkbox" checked={!!ticks[i]} onChange={() => setTicks((p) => items.map((_, j) => (j === i ? !p[j] : !!p[j])))}
                className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--color-q2-storm)]" />
              <span>{it}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-3 font-mono text-[12.5px] text-[color:var(--color-q2-storm)]" aria-live="polite">{ticked}/{items.length} ticked</p>
    </div>
  );
}
