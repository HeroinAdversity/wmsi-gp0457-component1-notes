import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container } from '../../components/primitives';
import { useProgress } from '../../lib/progress';
import { usePersistentState } from '../../lib/useNotesExport';
import { ChainBuilder } from './components/ChainBuilder';
import { ClaimSplitter } from './components/ClaimSplitter';
import { Q2Header } from './components/Q2Header';
import { WhoHowWhatWhy } from './components/WhoHowWhatWhy';
import { BANK, getItem } from './data/bank';
import { SESSIONS, type BankItem } from './data/types';
import { Icon } from './components/Icon';

type Filter = 'all' | 'reworded' | 'mirror';
type Level = 0 | 1 | 2 | 3 | 4;

/* Print: only the mock paper (and the scheme when the teacher asks for it). */
const PRINT_CSS = `
@media print {
  header, footer, .q2-no-print { display: none !important; }
  .q2-print-only { display: block !important; }
  .q2-scheme { display: none !important; }
  html[data-print-scheme="1"] .q2-scheme { display: block !important; }
  html[data-print-scheme="1"] .q2-scheme details > *:not(summary) { display: block !important; }
}`;

function shortParent(item: BankItem) {
  return SESSIONS[item.parent].replace('June', 'Jun').replace('November', 'Nov').replace('March', 'Mar').replace('Specimen', 'Spec');
}

export function PracticePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const { state } = useProgress();
  const item = id ? getItem(id) : BANK[0];

  if (!item) {
    return (
      <Container size="wide" className="py-16">
        <p className="text-[16px]">That practice item doesn’t exist. <Link to="/research/practice" className="font-semibold text-[color:var(--color-q2-storm)] underline">Back to the practice bank</Link></p>
      </Container>
    );
  }

  const list = BANK.filter((b) => filter === 'all' || b.kind === filter);
  const attempted = (b: BankItem) => !!(state.activities[`answer-2a:${b.id}`] || state.activities[`answer-2b:${b.id}`]);
  const count = (k: Filter) => (k === 'all' ? BANK.length : BANK.filter((b) => b.kind === k).length);

  return (
    <div className="q2-page pb-20">
      <style>{PRINT_CSS}</style>
      <div className="q2-no-print">
        <Q2Header tone="hub" label="Question 2 · Practice bank" title="Practice bank"
          lede={<p>Every past-paper Source 3, reworded, plus two mirror papers for each: new topics built on the same strengths and weaknesses. Write your answer first; the answer scheme unlocks when you have.</p>} />
      </div>
      <Container size="wide">
        <div className="mt-8 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Rail (desktop) / select (phone) */}
          <aside className="q2-no-print">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter practice items">
              {(['all', 'reworded', 'mirror'] as const).map((f) => (
                <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}
                  className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${filter === f ? 'border-[color:var(--color-q2-sea)] bg-[color:var(--color-q2-sea)] text-white' : 'border-[color:var(--color-line)] bg-white text-[color:var(--color-ink-2)]'}`}>
                  {f === 'all' ? 'All' : f === 'reworded' ? 'Reworded' : 'Mirror'} {count(f)}
                </button>
              ))}
            </div>
            <label className="mt-3 block lg:hidden">
              <span className="sr-only">Choose a practice item</span>
              <select value={item.id} onChange={(e) => navigate(`/research/practice/${e.target.value}`)}
                className="w-full rounded-[6px] border border-[color:var(--color-line)] bg-white px-3 py-2 text-[14px]">
                {list.map((b) => <option key={b.id} value={b.id}>{b.title} — {b.kind === 'reworded' ? 'reworded' : 'mirror'} ({shortParent(b)}){attempted(b) ? ' (done)' : ''}</option>)}
              </select>
            </label>
            <nav className="mt-3 hidden max-h-[70vh] space-y-2 overflow-y-auto pr-1 lg:block" aria-label="Practice items">
              {list.map((b) => (
                <Link key={b.id} to={`/research/practice/${b.id}`} aria-current={b.id === item.id ? 'page' : undefined}
                  className={`block rounded-[6px] border bg-white px-3 py-2.5 text-[12.5px] ${b.id === item.id ? 'border-[color:var(--color-q2-storm)] ring-2 ring-[color:var(--color-q2-coastal-tint)]' : 'border-[color:var(--color-line)] hover:border-[color:var(--color-q2-storm)]'}`}>
                  <b className="block text-[13px] text-[color:var(--color-q2-sea)]">{b.title}</b>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-[3px] px-1.5 py-px font-mono text-[9.5px] font-bold uppercase tracking-[0.08em] ${b.kind === 'reworded' ? 'bg-[color:var(--color-q2-arctic)] text-[color:var(--color-q2-sea)]' : 'bg-[color:var(--color-q2-ivory)] text-[#4B4B1E]'}`}>
                      {b.kind === 'reworded' ? 'Reworded' : 'Mirror'}
                    </span>
                    <span className="font-mono text-[10.5px] text-[color:var(--color-ink-3)]">{shortParent(b)}</span>
                    {attempted(b) && <span className="inline-flex items-center gap-1 font-mono text-[10.5px] text-[color:var(--color-q2-storm)]"><Icon name="check" size={12} />attempted</span>}
                  </span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* key remounts the answer components so each item loads its own saved answers */}
          <PracticeItem key={item.id} item={item} />
        </div>
      </Container>
    </div>
  );
}

function PracticeItem({ item }: { item: BankItem }) {
  const { state } = useProgress();
  const [self, setSelf] = usePersistentState<{ a: Level; b: Level }>(`research_bank_${item.id}`, 'self', { a: 0, b: 0 });
  const unlocked = !!(state.activities[`answer-2a:${item.id}`]?.answerText || state.activities[`answer-2b:${item.id}`]);
  const label = item.kind === 'reworded'
    ? `Reworded from ${SESSIONS[item.parent]}`
    : `Mirror paper · practice only · built on the structure of ${SESSIONS[item.parent]}`;
  const s = item.scheme;

  const print = (withScheme: boolean) => {
    if (withScheme) document.documentElement.dataset.printScheme = '1';
    window.print();
    delete document.documentElement.dataset.printScheme;
  };

  return (
    <main className="min-w-0">
      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-q2-storm)]">{label}</p>
      <h2 className="mt-2 font-display text-[28px] text-[color:var(--color-q2-sea)]">{item.title}</h2>
      <div className="q2-no-print mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => print(false)} className="rounded-full border border-[color:var(--color-q2-sea)] bg-white px-4 py-1.5 text-[13px] font-semibold text-[color:var(--color-q2-sea)]">Print as mock paper</button>
        <button type="button" onClick={() => print(true)} className="rounded-full border border-[color:var(--color-line)] bg-white px-4 py-1.5 text-[13px] font-semibold text-[color:var(--color-ink-2)]">Print with answer scheme (teacher)</button>
      </div>

      {/* Print-only mock paper */}
      <div className="q2-print-only hidden">
        <p className="mt-4 text-[14px]">{item.source.heading}</p>
        {item.source.paragraphs.map((p, i) => <p key={i} className="mt-2 text-[13px] leading-[1.6]">{p}</p>)}
        <p className="mt-6 text-[13px] font-bold">2 (a) Explain the strengths and weaknesses of the research outlined in Source 3. [8]</p>
        {Array.from({ length: 20 }, (_, i) => <div key={`a${i}`} className="h-[26px] border-b border-dotted border-black/40" />)}
        <p className="q2-print-break mt-6 text-[13px] font-bold">(b) “{item.claim.text}” Explain how this claim could be tested. You should consider the research methods and evidence that could be used. [8]</p>
        {Array.from({ length: 20 }, (_, i) => <div key={`b${i}`} className="h-[26px] border-b border-dotted border-black/40" />)}
      </div>

      <div className="q2-no-print">
        <h3 className="mt-8 font-display text-[22px] text-[color:var(--color-q2-sea)]">2(a) Explain the strengths and weaknesses of the research outlined in Source 3. <span className="font-mono text-[13px]">[8]</span></h3>
        <ChainBuilder item={item} storageId={`research_bank_${item.id}_a`} activityId={`answer-2a:${item.id}`}
          activityTitle={`Practice · ${item.title} (${item.kind}) · 2(a)`} selfLevel={self.a || undefined} />

        <h3 className="mt-10 font-display text-[22px] text-[color:var(--color-q2-sea)]">2(b) “{item.claim.text}” Explain how this claim could be tested. You should consider the research methods and evidence that could be used. <span className="font-mono text-[13px]">[8]</span></h3>
        <ClaimSplitter claim={item.claim} source={item.kind === 'reworded' ? `Reworded from ${SESSIONS[item.parent]}` : `WMSI mirror of ${SESSIONS[item.parent]}`} />
        <WhoHowWhatWhy parts={item.claim.parts} storageId={`research_bank_${item.id}_b`} activityId={`answer-2b:${item.id}`}
          activityTitle={`Practice · ${item.title} (${item.kind}) · 2(b)`} selfLevel={self.b || undefined} />

        <fieldset className="mt-8 rounded-[8px] border border-[color:var(--color-line)] bg-white px-4 py-3">
          <legend className="px-1 text-[13px] font-bold text-[color:var(--color-q2-sea)]">Mark yourself</legend>
          {(['a', 'b'] as const).map((part) => (
            <div key={part} className="mt-1 flex flex-wrap items-center gap-3 text-[13.5px]">
              <span className="w-12 font-semibold">2({part})</span>
              {[1, 2, 3, 4].map((l) => (
                <label key={l} className="inline-flex items-center gap-1.5">
                  <input type="radio" name={`self-${part}`} checked={self[part] === l} onChange={() => setSelf((p) => ({ ...p, [part]: l as Level }))} className="accent-[color:var(--color-q2-storm)]" />
                  Level {l}
                </label>
              ))}
            </div>
          ))}
          <p className="mt-2 text-[12px] text-[color:var(--color-ink-3)]">Use the level descriptions on the Strong or Shaky? and Test Bench pages. Your teacher sees this in your export.</p>
        </fieldset>
      </div>

      <div className="q2-scheme mt-8">
        <details className="overflow-hidden rounded-[8px] border border-[color:var(--color-line)] bg-white" open={false}>
          <summary className={`flex cursor-pointer items-center justify-between gap-3 bg-[color:var(--color-q2-arctic)] px-4 py-3 text-[13.5px] font-bold text-[color:var(--color-q2-sea)] ${unlocked ? '' : 'pointer-events-none opacity-70'}`}
            aria-disabled={!unlocked} onClick={(e) => { if (!unlocked) e.preventDefault(); }}>
            Answer scheme · 2(a) and 2(b)
            <span className="font-mono text-[11px] font-medium">{unlocked ? 'open' : 'Save an attempt first'}</span>
          </summary>
          {unlocked && (
            <div className="space-y-5 px-4 py-4 text-[13.5px]">
              <div className="grid gap-4 md:grid-cols-2">
                <div><b className="text-[color:var(--color-q2-storm)]">Strengths</b><ul className="mt-1 list-disc space-y-1 pl-5">{s.strengths.map((x) => <li key={x}>{x}</li>)}</ul></div>
                <div><b className="text-[color:var(--color-ember)]">Weaknesses</b><ul className="mt-1 list-disc space-y-1 pl-5">{s.weaknesses.map((x) => <li key={x}>{x}</li>)}</ul></div>
              </div>
              <div><b>Two chains written out</b>{s.chainsWritten.map((c) => <p key={c.text} className="mt-1"><span className="font-mono text-[11px]">{c.kind === 'S' ? 'STRENGTH' : 'WEAKNESS'}</span> {c.text}</p>)}</div>
              <p><b>Applying Table C:</b> {s.levelNote2a}</p>
              <p className="text-[color:var(--color-ink-2)]"><b>Level 2 looks like:</b> {s.level2Example2a}</p>
              <hr className="border-[color:var(--color-line)]" />
              <div className="grid gap-4 md:grid-cols-2">
                <div><b>Methods</b><ul className="mt-1 list-disc space-y-1 pl-5">{s.methods.map((x) => <li key={x}>{x}</li>)}</ul></div>
                <div><b>Evidence</b><ul className="mt-1 list-disc space-y-1 pl-5">{s.evidence.map((x) => <li key={x}>{x}</li>)}</ul></div>
              </div>
              <div><b>Model matrix</b>
                <WhoHowWhatWhy parts={item.claim.parts} storageId={`research_model_${item.id}`} readOnlyRows={s.modelMatrix} compareLine={s.compareLine} />
              </div>
              <p><b>Model Level 4 paragraph:</b> {s.modelParagraph2b}</p>
              <p className="text-[color:var(--color-ink-2)]"><b>Level 2 looks like:</b> {s.level2Example2b}</p>
            </div>
          )}
        </details>
      </div>

    </main>
  );
}

