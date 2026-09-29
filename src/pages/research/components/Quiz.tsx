import { useRef, useState } from 'react';
import { useProgress } from '../../../lib/progress';
import type { QuizQuestion } from '../data/toolkit';

export function Quiz({ activityId, title, questions }: { activityId: string; title: string; questions: QuizQuestion[] }) {
  const { record } = useProgress();
  const [picked, setPicked] = useState<Record<string, number>>({});
  // Latest answers, so rapid clicks never read a stale render.
  const pickedRef = useRef<Record<string, number>>({});
  const answered = Object.keys(picked).length;
  const score = questions.filter((q) => picked[q.id] === q.answer).length;

  const choose = (q: QuizQuestion, i: number) => {
    if (pickedRef.current[q.id] !== undefined) return;
    const next = { ...pickedRef.current, [q.id]: i };
    pickedRef.current = next;
    setPicked(next);
    const done = Object.keys(next).length === questions.length;
    record({
      id: activityId, title, kind: 'quiz', status: done ? 'done' : 'in-progress',
      score: questions.filter((x) => next[x.id] === x.answer).length, max: questions.length,
    });
  };

  return (
    <div className="mt-6 space-y-4">
      {questions.map((q, n) => (
        <fieldset key={q.id} className="rounded-[8px] border border-[color:var(--color-line)] bg-white p-4">
          <legend className="sr-only">Question {n + 1}</legend>
          <p className="text-[14.5px] font-semibold text-[color:var(--color-q2-sea)]">{n + 1}. {q.prompt}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {q.options.map((o, i) => {
              const chosen = picked[q.id] === i;
              const reveal = picked[q.id] !== undefined;
              const state = reveal && i === q.answer ? 'bg-[color:var(--color-q2-coastal-tint)] border-[color:var(--color-q2-storm)]'
                : chosen ? 'bg-[color:var(--color-ember-soft)] border-[#E0A493]' : 'bg-white border-[color:var(--color-line)] hover:border-[color:var(--color-q2-storm)]';
              return (
                <button key={o} type="button" disabled={reveal} onClick={() => choose(q, i)}
                  className={`text-left rounded-[6px] border px-3 py-2 text-[13.5px] transition-colors ${state}`}>{o}</button>
              );
            })}
          </div>
          {picked[q.id] !== undefined && <p className="mt-2 text-[13px] text-[color:var(--color-ink-2)]">{q.why}</p>}
        </fieldset>
      ))}
      <p className="font-mono text-[12.5px] text-[color:var(--color-q2-storm)]" aria-live="polite">
        {answered}/{questions.length} answered · {score} correct
      </p>
    </div>
  );
}
