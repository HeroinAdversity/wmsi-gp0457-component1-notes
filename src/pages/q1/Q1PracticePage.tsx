import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container } from '../../components/primitives';
import { useProgress } from '../../lib/progress';
import { usePersistentState } from '../../lib/useNotesExport';
import { SESSIONS } from '../research/data/types';
import { Q1WorksheetPrinter } from './components/Q1WorksheetPrinter';
import { Q1_BANK, getQ1Item } from './data/bank';
import { ELEMENT_LABEL, TEST_LABEL, questionText, type Q1BankItem, type Q1Source } from './data/types';

type Filter = 'all' | 'reworded' | 'mirror';
type Answers = { a: string; bi: string; bii: string; c: string; d: string };
const EMPTY: Answers = { a: '', bi: '', bii: '', c: '', d: '' };

const activityId = (id: string) => `answer-q1:${id}`;

function shortParent(item: Q1BankItem) {
  return SESSIONS[item.parent].replace('June', 'Jun').replace('November', 'Nov').replace('March', 'Mar').replace('Specimen', 'Spec');
}

export function Q1PracticePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const { state } = useProgress();
  const item = id ? getQ1Item(id) : Q1_BANK[0];

  if (!item) {
    return (
      <Container size="wide" className="py-16">
        <p className="text-[16px]">That practice paper doesn’t exist. <Link to="/perspectives/practice" className="font-semibold text-[color:var(--color-cobalt)] underline">Back to the practice bank</Link></p>
      </Container>
    );
  }

  const list = Q1_BANK.filter((b) => filter === 'all' || b.kind === filter);
  const count = (k: Filter) => (k === 'all' ? Q1_BANK.length : Q1_BANK.filter((b) => b.kind === k).length);
  const attempted = (b: Q1BankItem) => !!state.activities[activityId(b.id)];

  return (
    <div className="pb-20">
      <section className="pt-10 md:pt-12">
        <Container size="wide">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-cobalt)]">Question 1 · Practice bank</p>
          <h1 className="mt-3 font-display text-[40px] md:text-[60px] leading-[1.04] tracking-[-0.02em] text-[color:var(--color-ink)]">Practice papers</h1>
          <p className="mt-4 max-w-[64ch] text-[15.5px] md:text-[16.5px] leading-[1.6] text-[color:var(--color-ink-2)]">
            Every past-paper Question 1, reworded, with Sources 1 and 2 and all four parts. Write your answers first. The answer scheme unlocks when you save an attempt.
          </p>
        </Container>
      </section>
      <Container size="wide">
        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside data-no-notes>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter papers">
              {(['all', 'reworded', 'mirror'] as const).filter((f) => f !== 'mirror' || count('mirror') > 0).map((f) => (
                <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}
                  className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${filter === f ? 'border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white' : 'border-[color:var(--color-line)] bg-white text-[color:var(--color-ink-2)]'}`}>
                  {f === 'all' ? 'All' : f === 'reworded' ? 'Reworded' : 'Mirror'} {count(f)}
                </button>
              ))}
            </div>
            <label className="mt-3 block lg:hidden">
              <span className="sr-only">Choose a paper</span>
              <select value={item.id} onChange={(e) => navigate(`/perspectives/practice/${e.target.value}`)}
                className="w-full rounded-[6px] border border-[color:var(--color-line)] bg-white px-3 py-2 text-[14px]">
                {list.map((b) => <option key={b.id} value={b.id}>{b.title} ({shortParent(b)}){attempted(b) ? ' ✓' : ''}</option>)}
              </select>
            </label>
            <nav className="mt-3 hidden max-h-[70vh] space-y-2 overflow-y-auto pr-1 lg:block" aria-label="Practice papers">
              {list.map((b) => (
                <Link key={b.id} to={`/perspectives/practice/${b.id}`} aria-current={b.id === item.id ? 'page' : undefined}
                  className={`block rounded-[6px] border bg-white px-3 py-2.5 text-[12.5px] ${b.id === item.id ? 'border-[color:var(--color-cobalt)] ring-2 ring-[color:var(--color-cobalt-soft)]' : 'border-[color:var(--color-line)] hover:border-[color:var(--color-cobalt)]'}`}>
                  <b className="block text-[13px] text-[color:var(--color-ink)]">{b.title}</b>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5 font-mono text-[10.5px] text-[color:var(--color-ink-3)]">
                    <span>{b.kind === 'reworded' ? 'Reworded' : 'Mirror'} · {shortParent(b)}</span>
                    {attempted(b) && <span className="text-[color:var(--color-forest)]">✓ attempted</span>}
                  </span>
                </Link>
              ))}
            </nav>
          </aside>
          <PaperView key={item.id} item={item} />
        </div>
      </Container>
    </div>
  );
}

function SourceCard({ n, s }: { n: 1 | 2; s: Q1Source }) {
  return (
    <div className="rounded-[8px] border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14.5px] leading-[1.6]">
      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-ink-3)]">Source {n}</p>
      {s.paragraphs.map((p) => <p key={p} className="mt-2">{p}</p>)}
      {s.list && (
        <div className="mt-2">
          <p className="font-semibold">{s.list.title}</p>
          <ul className="mt-1 list-disc pl-5">{s.list.items.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      )}
      {s.attribution && <p className="mt-2 text-[12.5px] italic text-[color:var(--color-ink-3)]">{s.attribution}</p>}
    </div>
  );
}

function PaperView({ item }: { item: Q1BankItem }) {
  const { state, record } = useProgress();
  const [ans, setAns] = usePersistentState<Answers>(`q1_bank_${item.id}`, 'answers', EMPTY);
  const saved = state.activities[activityId(item.id)];
  const [open, setOpen] = useState(false);
  const q = questionText(item);
  const written = Object.values(ans).some((v) => v.trim().length > 0);

  const save = () => {
    const text = [`(a) ${ans.a}`, `(b)(i) ${ans.bi}`, `(b)(ii) ${ans.bii}`, `(c) ${ans.c}`, `(d) ${ans.d}`].join('\n');
    record({ id: activityId(item.id), title: `Q1 practice · ${item.title}`, kind: 'answer-q1', status: 'done', answerText: text });
  };

  const box = (k: keyof Answers, rows: number) => (
    <textarea value={ans[k]} onChange={(e) => setAns((p) => ({ ...p, [k]: e.target.value }))} rows={rows}
      className="mt-2 w-full resize-y rounded-[6px] border border-[color:var(--color-line)] bg-white p-2.5 text-[14px] leading-[1.55]" />
  );
  const qh = 'mt-7 text-[15.5px] font-semibold text-[color:var(--color-ink)]';
  const examples = item.statements.filter((s) => s.source === 2 && s.type === item.q1b.type);

  return (
    <main className="min-w-0">
      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-cobalt)]">
        {item.kind === 'reworded' ? `Reworded from ${SESSIONS[item.parent]}` : `Mirror paper · built on ${SESSIONS[item.parent]}`}
      </p>
      <h2 className="mt-2 font-display text-[28px] text-[color:var(--color-ink)]">{item.title}</h2>
      <Q1WorksheetPrinter itemId={item.id} />

      <div className="mt-6 grid gap-3 xl:grid-cols-2">
        <SourceCard n={1} s={item.source1} />
        <SourceCard n={2} s={item.source2} />
      </div>

      <div data-no-notes>
        <p className={qh}>1 (a) {q.a} <span className="font-mono text-[12px]">[1]</span></p>
        {box('a', 1)}
        <p className={qh}>(b) (i) {q.bi} <span className="font-mono text-[12px]">[1]</span></p>
        {box('bi', 1)}
        <p className={qh}>(ii) {q.bii} <span className="font-mono text-[12px]">[2]</span></p>
        {box('bii', 3)}
        <p className={qh}>(c) {q.c} <span className="font-mono text-[12px]">[6]</span></p>
        {box('c', 8)}
        <p className={qh}>(d) {q.d} <span className="font-mono text-[12px]">[8]</span></p>
        {box('d', 10)}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" disabled={!written} onClick={save} className="rounded-full bg-[color:var(--color-ink)] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-35">
            {saved ? 'Save again' : 'Save my attempt'}
          </button>
          <span className="text-[12.5px] text-[color:var(--color-ink-3)]">{saved ? 'Saved to My learning ✓' : 'Your answers stay on this device as you type.'}</span>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-[8px] border border-[color:var(--color-line)] bg-white">
        <button type="button" disabled={!saved} onClick={() => setOpen((o) => !o)} aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 bg-[color:var(--color-paper-2)] px-4 py-3 text-left text-[13.5px] font-bold disabled:opacity-70">
          Answer scheme · 1(a)–(d)
          <span className="font-mono text-[11px] font-medium">{saved ? (open ? 'close' : 'open') : 'Save an attempt first'}</span>
        </button>
        {saved && open && (
          <div className="space-y-4 px-4 py-4 text-[13.5px] leading-[1.55]">
            <p><b>(a)</b> {item.q1a.answer}{item.q1a.accept.length > 0 && <> · also accept: {item.q1a.accept.join('; ')}</>}{item.q1a.note && <> · <i>{item.q1a.note}</i></>}</p>
            <div>
              <b>(b)(i)</b> Accept any of: {examples.map((s) => `“${s.quote}”`).join(' · ')}
              <p className="mt-1"><b>(b)(ii) 2 marks:</b> {item.q1b.explain}</p>
              <p className="mt-1 text-[color:var(--color-ink-2)]"><b>1 mark:</b> {item.q1b.oneMark}</p>
            </div>
            <div>
              <b>(c) Elements to describe</b>
              <ul className="mt-1 list-disc space-y-1 pl-5">{item.q1c.points.map((p) => <li key={p.quote}><b>{ELEMENT_LABEL[p.element]}:</b> {p.point} <span className="text-[color:var(--color-ink-3)]">(“{p.quote}”)</span></li>)}</ul>
              <p className="mt-2"><b>Level 3 model:</b> {item.q1c.model}</p>
            </div>
            <div>
              <b>(d) Choices you could make</b>
              <ul className="mt-1 list-disc space-y-1 pl-5">{item.q1d.options.map((o) => <li key={o.label}><b>{o.label}</b> · {TEST_LABEL[o.test]} test: {o.why}</li>)}</ul>
              <p className="mt-2"><b>Level 4 model:</b> {item.q1d.model}</p>
              <p className="mt-1 text-[color:var(--color-ink-2)]"><b>Level 2 looks like:</b> {item.q1d.levelUp.base}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
