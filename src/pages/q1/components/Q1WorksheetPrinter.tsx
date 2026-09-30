import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { useMarks, type Mark } from '../../../lib/marks';
import { Q1_BANK, getQ1Item } from '../data/bank';
import { ELEMENT_LABEL, TEST_LABEL, questionText, withArticle, type ElementId, type Q1BankItem, type Q1Source } from '../data/types';

export type Q1Part = 'all' | 'a' | 'b' | 'c' | 'd';

const PART_LABEL: Record<Q1Part, string> = {
  all: 'Question 1 (a)–(d)', a: '1(a) First Read', b: '1(b) Statements', c: '1(c) Perspectives', d: '1(d) Significance',
};
const PART_MARKS: Record<Q1Part, string> = { all: '18 marks · ~23 min', a: '1 mark · ~2 min', b: '3 marks · ~4 min', c: '6 marks · ~7 min', d: '8 marks · ~10 min' };

const CHECKS: Record<Exclude<Q1Part, 'all'>, string[]> = {
  a: ['I copied only what was asked', 'I kept the units (%, $, million)'],
  b: ['I quoted one example from Source 2', 'I named the type in my explanation', 'I pointed to the word that shows it'],
  c: ['I covered at least four of the five elements', 'Every point has a quote from Source 2', 'I described; I did not judge'],
  d: ['I made one clear choice', 'I used a test (crowd, hurt, fair, domino, stuck)', 'I backed it with the sources', 'I compared it with another option'],
};

/** Print only the worksheet: flag the page, print, then clear the flag. */
function printWorksheet() {
  const html = document.documentElement;
  html.dataset.print = 'worksheet';
  const done = () => { delete html.dataset.print; window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  window.print();
  // Some mobile browsers never fire afterprint.
  window.setTimeout(done, 60_000);
}

function Lines({ n }: { n: number }) {
  return <div className="ws-lines">{Array.from({ length: n }, (_, i) => <span key={i} />)}</div>;
}

function SourceBox({ n, s }: { n: 1 | 2; s: Q1Source }) {
  return (
    <div className="ws-source">
      <p className="ws-source-h">Source {n}</p>
      {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
      {s.list && <><p className="ws-source-h">{s.list.title}</p><ul>{s.list.items.map((x) => <li key={x}>{x}</li>)}</ul></>}
      {s.attribution && <p><i>{s.attribution}</i></p>}
    </div>
  );
}

function Head({ part, item, page }: { part: Q1Part; item: Q1BankItem; page: number }) {
  return (
    <>
      <div className="ws-head">
        <div>
          <p className="ws-mono">IGCSE GP 0457 · Paper 1 · {PART_LABEL[part]}</p>
          <h1>{item.title}</h1>
        </div>
        <p className="ws-mono">{PART_MARKS[part]} · page {page}</p>
      </div>
      {page === 1 && <div className="ws-fields"><span>Name</span><span>Class</span><span>Date</span></div>}
      {page === 1 && <p className="ws-src-note">{item.kind === 'reworded' ? 'Reworded past paper' : 'WMSI practice paper'} · {item.topic}</p>}
    </>
  );
}

const ELEMENTS: ElementId[] = ['issues', 'values', 'causes', 'consequences', 'actions'];

function PartA({ item }: { item: Q1BankItem }) {
  return <><p className="ws-q">(a) {questionText(item).a} [1]</p><Lines n={2} /></>;
}

function PartB({ item }: { item: Q1BankItem }) {
  const q = questionText(item);
  return (
    <>
      <p className="ws-q">(b) (i) {q.bi} [1]</p>
      <Lines n={2} />
      <p className="ws-q">(ii) {q.bii} [2]</p>
      <p className="ws-src-note">Frame: It is {withArticle(item.q1b.type)} because… The words “…” show that…</p>
      <Lines n={3} />
    </>
  );
}

function PartC({ item, plan, lines }: { item: Q1BankItem; plan: boolean; lines: number }) {
  return (
    <>
      <p className="ws-q">(c) {questionText(item).c} [6]</p>
      {plan && (
        <div className="ws-box">
          <div className="ws-box-h"><span>Plan · five elements</span><span>Quote → what it shows</span></div>
          <div className="ws-matrix">
            {ELEMENTS.map((e) => <div key={e}><i><b>{ELEMENT_LABEL[e]}</b></i><Lines n={1} /></div>)}
            <div><i><b>Level</b> global · national · local · personal</i><Lines n={1} /></div>
          </div>
        </div>
      )}
      <Lines n={lines} />
    </>
  );
}

function PartD({ item, plan, lines }: { item: Q1BankItem; plan: boolean; lines: number }) {
  return (
    <>
      <p className="ws-q">(d) {questionText(item).d} [8]</p>
      {plan && (
        <div className="ws-box">
          <div className="ws-box-h"><span>Plan · judge it</span><span>Crowd · Hurt · Fair · Domino · Stuck</span></div>
          <div className="ws-matrix">
            {[['My choice', ''], ['Test I will use', ''], ['Evidence from the sources', ''], ['Compared with… (and why mine matters more)', '']].map(([k]) => (
              <div key={k}><i><b>{k}</b></i><Lines n={1} /></div>
            ))}
          </div>
        </div>
      )}
      {lines > 0 && <Lines n={lines} />}
    </>
  );
}

function Ticks({ part }: { part: Q1Part }) {
  const list = part === 'all' ? [...CHECKS.c.slice(0, 2), ...CHECKS.d.slice(2)] : CHECKS[part];
  return (
    <>
      <div className="ws-ticks">{list.map((c) => <span key={c}>{c}</span>)}</div>
      <p className="ws-foot"><span>Self-mark: ___ / {part === 'all' ? 18 : { a: 1, b: 3, c: 6, d: 8 }[part]} · Teacher: ______</span><span>WMSI · GP0457 · {PART_LABEL[part]}</span></p>
    </>
  );
}

function StudentCopy({ part, item }: { part: Q1Part; item: Q1BankItem }) {
  const has = (p: Exclude<Q1Part, 'all'>) => part === 'all' || part === p;
  const needs2 = part !== 'a';
  if (part === 'all') {
    return (
      <>
        <section className="ws-page">
          <Head part={part} item={item} page={1} />
          <SourceBox n={1} s={item.source1} />
          <SourceBox n={2} s={item.source2} />
          <PartA item={item} />
          <PartB item={item} />
        </section>
        <section className="ws-page">
          <Head part={part} item={item} page={2} />
          <PartC item={item} plan lines={14} />
        </section>
        <section className="ws-page">
          <Head part={part} item={item} page={3} />
          <PartD item={item} plan lines={16} />
          <Ticks part={part} />
        </section>
      </>
    );
  }
  // 1(d) needs both sources and a long answer, so it takes two pages.
  if (part === 'd') {
    return (
      <>
        <section className="ws-page">
          <Head part={part} item={item} page={1} />
          <SourceBox n={1} s={item.source1} />
          <SourceBox n={2} s={item.source2} />
          <PartD item={item} plan lines={0} />
        </section>
        <section className="ws-page">
          <Head part={part} item={item} page={2} />
          <p className="ws-q ws-q-small">Write your answer: choice → test → evidence → comparison → so…</p>
          <Lines n={24} />
          <Ticks part={part} />
        </section>
      </>
    );
  }
  return (
    <section className="ws-page">
      <Head part={part} item={item} page={1} />
      {has('a') && <SourceBox n={1} s={item.source1} />}
      {needs2 && <SourceBox n={2} s={item.source2} />}
      {has('a') && <PartA item={item} />}
      {has('b') && <PartB item={item} />}
      {has('c') && <PartC item={item} plan lines={10} />}
      <Ticks part={part} />
    </section>
  );
}

function SchemeCopy({ part, item }: { part: Q1Part; item: Q1BankItem }) {
  const has = (p: Exclude<Q1Part, 'all'>) => part === 'all' || part === p;
  const q = questionText(item);
  const examples = item.statements.filter((s) => s.source === 2 && s.type === item.q1b.type);
  return (
    <section className="ws-page">
      <div className="ws-head">
        <div><p className="ws-mono">Teacher copy · answer scheme · {PART_LABEL[part]}</p><h1>{item.title}</h1></div>
        <p className="ws-mono">{item.kind === 'reworded' ? 'Reworded past paper' : 'WMSI practice paper'}</p>
      </div>
      {has('a') && (
        <>
          <p className="ws-sub">(a) {q.a}</p>
          <p><b>{item.q1a.answer}</b>{item.q1a.accept.length > 0 && <> · also accept: {item.q1a.accept.join('; ')}</>}{item.q1a.note && <> · {item.q1a.note}</>}</p>
        </>
      )}
      {has('b') && (
        <>
          <p className="ws-sub">(b)(i) Accept any of</p>
          <ul>{examples.map((s) => <li key={s.quote}>“{s.quote}”</li>)}</ul>
          <p className="ws-sub">(b)(ii) Explanation</p>
          <p><b>2 marks:</b> {item.q1b.explain}</p>
          <p><b>1 mark:</b> {item.q1b.oneMark}</p>
        </>
      )}
      {has('c') && (
        <>
          <p className="ws-sub">(c) Elements of the perspective (Table A: 5–6 = wide range, frequent quotes)</p>
          <ul>{item.q1c.points.map((p) => <li key={p.quote}><b>{ELEMENT_LABEL[p.element]}:</b> {p.point} (“{p.quote}”)</li>)}</ul>
          <p><b>Level 3 model:</b> {item.q1c.model}</p>
        </>
      )}
      {has('d') && (
        <>
          <p className="ws-sub">(d) Choices students may make (Table B)</p>
          <ul>{item.q1d.options.map((o) => <li key={o.label}><b>{o.label}</b> · {TEST_LABEL[o.test]} test: {o.why}</li>)}</ul>
          <p><b>Level 4 model:</b> {item.q1d.model}</p>
          <p><b>Level 2 example:</b> {item.q1d.levelUp.base}</p>
        </>
      )}
    </section>
  );
}

function NotesCopy({ marks }: { marks: Mark[] }) {
  return (
    <section className="ws-page">
      <div className="ws-head">
        <div><p className="ws-mono">My notes · Question 1</p><h1>What I highlighted</h1></div>
        <p className="ws-mono">{marks[0]?.pageTitle}</p>
      </div>
      <ol>
        {marks.map((m) => (
          <li key={m.id}>{m.tabLabel && <b>{m.tabLabel}: </b>}“{m.quote}”{m.note && <><br /><i>Note: {m.note}</i></>}</li>
        ))}
      </ol>
    </section>
  );
}

/**
 * A "Print worksheet" button with options, for any Q1 bank paper. The sheet is
 * portalled to <body> and only prints when the button sets html[data-print=worksheet].
 */
export function Q1WorksheetPrinter({ part: initialPart = 'all', itemId: fixedId, defaultItemId = 'q1r-j26-12' }: {
  part?: Q1Part; itemId?: string; defaultItemId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [part, setPart] = useState<Q1Part>(initialPart);
  const [chosen, setChosen] = useState(defaultItemId);
  const [student, setStudent] = useState(true);
  const [scheme, setScheme] = useState(false);
  const [withNotes, setWithNotes] = useState(true);
  const item = getQ1Item(fixedId ?? chosen) ?? Q1_BANK[0];
  const { pathname } = useLocation();
  const { marks } = useMarks();
  const myMarks = marks.filter((m) => m.page === pathname);

  useEffect(() => { if (!student && !scheme) setStudent(true); }, [student, scheme]);

  const pages = (student ? (part === 'all' ? 3 : part === 'd' ? 2 : 1) : 0) + (scheme ? 1 : 0);

  return (
    <div className="no-print mt-4" data-no-notes>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)] bg-[color:var(--color-paper)] px-4 py-1.5 text-[13px] font-semibold text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-2)]"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 6V1.5h8V6M4 12H2.5A1 1 0 0 1 1.5 11V7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H12M4 9.5h8v5H4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
        Print worksheet
      </button>
      {open && (
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[8px] border border-[color:var(--color-line)] bg-white px-4 py-3 text-[13px]">
          {!fixedId && (
            <label className="flex items-center gap-2">
              <span className="font-semibold">Paper:</span>
              <select value={chosen} onChange={(e) => setChosen(e.target.value)} className="max-w-[300px] rounded-[5px] border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-2 py-1 text-[13px]">
                {Q1_BANK.map((b) => <option key={b.id} value={b.id}>{b.title} ({b.kind === 'reworded' ? 'reworded' : 'practice'})</option>)}
              </select>
            </label>
          )}
          <label className="flex items-center gap-2">
            <span className="font-semibold">Part:</span>
            <select value={part} onChange={(e) => setPart(e.target.value as Q1Part)} className="rounded-[5px] border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-2 py-1 text-[13px]">
              {(Object.keys(PART_LABEL) as Q1Part[]).map((p) => <option key={p} value={p}>{PART_LABEL[p]}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={student} onChange={(e) => setStudent(e.target.checked)} /> Student copy</label>
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={scheme} onChange={(e) => setScheme(e.target.checked)} /> Answer scheme (teacher copy)</label>
          {myMarks.length > 0 && (
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={withNotes} onChange={(e) => setWithNotes(e.target.checked)} /> My notes ({myMarks.length})</label>
          )}
          <button type="button" onClick={printWorksheet} className="rounded-full bg-[color:var(--color-ink)] px-4 py-1.5 font-semibold text-white">Print</button>
          <span className="text-[12px] text-[color:var(--color-ink-3)]">A4 · black and white · about {pages} page{pages > 1 ? 's' : ''}</span>
        </div>
      )}
      {createPortal(
        <div className="ws-print" aria-hidden>
          {student && <StudentCopy part={part} item={item} />}
          {student && withNotes && myMarks.length > 0 && <NotesCopy marks={myMarks} />}
          {scheme && <SchemeCopy part={part} item={item} />}
        </div>,
        document.body,
      )}
    </div>
  );
}
