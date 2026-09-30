import { useState } from 'react';
import type { Outcome } from '../../../components/games/GameShell';
import { withArticle } from '../data/types';
import { signalWordIndexes, wordSpans, type Excerpt, type Q1ChoiceQ, type Q1Question, type Q1SignalQ } from './generate';

const label = 'font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em]';
const one = (idea: string, ok: boolean): Outcome => ({ correct: ok ? 1 : 0, total: 1, ideas: { [idea]: [ok ? 1 : 0, 1] } });

function Marked({ text, mark }: { text: string; mark?: string }) {
  const at = mark ? text.indexOf(mark) : -1;
  if (!mark || at < 0) return <>{text}</>;
  return <>{text.slice(0, at)}<mark className="rounded-[2px] bg-[color:var(--color-amber-soft)] px-0.5 text-inherit">{mark}</mark>{text.slice(at + mark.length)}</>;
}

function ExcerptCard({ e }: { e: Excerpt }) {
  return (
    <div className="rounded-[8px] border border-[color:var(--color-line-soft)] bg-[color:var(--color-paper)] px-3.5 py-2.5">
      <p className={`${label} text-[color:var(--color-ink-3)]`}>{e.label}</p>
      <p className="mt-1 text-[14px] leading-[1.55] text-[color:var(--color-ink)]"><Marked text={e.text} mark={e.mark} /></p>
      {e.list && (
        <div className="mt-2 text-[13.5px]">
          <p className="font-semibold">{e.list.title}</p>
          <ul className="mt-0.5 list-disc pl-5">{e.list.items.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      )}
    </div>
  );
}

function Feedback({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div aria-live="polite" className={`mt-3 rounded-[6px] px-3 py-2 text-[13.5px] ${ok ? 'bg-[#E3F2E7]' : 'bg-[color:var(--color-ember-soft)]'}`}>
      <b>{ok ? 'Yes. ' : 'Not quite. '}</b>{children}
    </div>
  );
}

export function Q1ChoiceView({ q, onDone }: { q: Q1ChoiceQ; onDone: (o: Outcome) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    onDone(one(q.idea, i === q.answer));
  };
  const own = picked !== null && picked !== q.answer ? q.whyWrong?.[picked] : undefined;
  return (
    <div>
      <ExcerptCard e={q.excerpt} />
      <p className="mt-4 text-[14px] font-semibold text-[color:var(--color-ink)]">{q.prompt}</p>
      <div className="mt-2.5 grid gap-2">
        {q.options.map((o, i) => {
          const state = picked === null ? 'bg-white border-[color:var(--color-line)] hover:border-[color:var(--g-mid)]'
            : i === q.answer ? 'bg-[#E3F2E7] border-[#3E8A58]' : i === picked ? 'bg-[color:var(--color-ember-soft)] border-[#E0A493]' : 'bg-white border-[color:var(--color-line)] opacity-60';
          return <button key={o} type="button" disabled={picked !== null} onClick={() => choose(i)} className={`rounded-[8px] border px-3 py-2 text-left text-[13.5px] ${state}`}>{o}</button>;
        })}
      </div>
      {picked !== null && (
        <Feedback ok={picked === q.answer}>
          {own && <span className="block">{own}</span>}
          <span className={own ? 'mt-1 block' : ''}>{q.explain}</span>
        </Feedback>
      )}
    </div>
  );
}

export function Q1SignalView({ q, onDone }: { q: Q1SignalQ; onDone: (o: Outcome) => void }) {
  const [tapped, setTapped] = useState<number | null>(null);
  const words = wordSpans(q.quote);
  const hits = new Set(signalWordIndexes(q.quote, q.signal));
  const tap = (i: number) => {
    if (tapped !== null) return;
    setTapped(i);
    onDone(one(q.idea, hits.has(i)));
  };
  return (
    <div>
      <ExcerptCard e={q.excerpt} />
      <p className="mt-4 text-[14px] font-semibold text-[color:var(--color-ink)]">
        The highlighted part is {withArticle(q.statementType)}. Tap the word that shows it.
      </p>
      <p className="mt-2.5 rounded-[8px] border border-[color:var(--color-line)] bg-white px-3.5 py-3 text-[16px] leading-[2.1]">
        {words.map((w, i) => {
          const state = tapped === null ? 'hover:bg-[color:var(--color-cobalt-tint)] cursor-pointer'
            : hits.has(i) ? 'bg-[#E3F2E7] font-semibold' : i === tapped ? 'bg-[color:var(--color-ember-soft)] line-through' : 'opacity-70';
          return (
            <span key={i}>
              <span
                role="button"
                tabIndex={tapped === null ? 0 : -1}
                aria-disabled={tapped !== null}
                onClick={() => tap(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(i); } }}
                className={`rounded-[4px] px-0.5 ${state}`}
              >{w.word}</span>{' '}
            </span>
          );
        })}
      </p>
      {tapped !== null && <Feedback ok={hits.has(tapped)}>{q.explain}</Feedback>}
    </div>
  );
}

export function Q1QuestionView({ q, onDone }: { q: Q1Question; onDone: (o: Outcome) => void }) {
  return q.type === 'signal' ? <Q1SignalView q={q} onDone={onDone} /> : <Q1ChoiceView q={q} onDone={onDone} />;
}
