import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { useMarks, type Mark } from '../../../lib/marks';
import { BANK, getItem } from '../data/bank';
import { DESIGN_CHECKLIST } from '../data/design';
import { EVALUATE_CHECKLIST } from '../data/evaluate';
import type { BankItem } from '../data/types';

type Kind = 'a' | 'b';

const TITLE: Record<Kind, string> = { a: 'Strong or Shaky?', b: 'The Test Bench' };
const QUESTION_A = 'Explain the strengths and weaknesses of the research outlined in Source 3. [8]';
const questionB = (claim: string) => `“${claim}” Explain how this claim could be tested. You should consider the research methods and evidence that could be used. [8]`;

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

function ChainBox({ n }: { n: number }) {
  return (
    <div className="ws-box">
      <div className="ws-box-h"><span>Point {n} · strength / weakness (circle one)</span><span>What → Effect → Aim</span></div>
      <div className="ws-chain">
        {['1 · What they did', '2 · Effect on the evidence', '3 · Link to the aim'].map((l) => (
          <div key={l}><i>{l}</i><Lines n={3} /></div>
        ))}
      </div>
    </div>
  );
}

function MatrixRow({ n }: { n: number }) {
  return (
    <div className="ws-box">
      <div className="ws-box-h"><span>Method {n}</span><span>Which part(s) of the claim does it test?  1 · 2 · 3</span></div>
      <div className="ws-matrix">
        {[['Who', 'will I get it from?'], ['How', 'will I get it?'], ['What', 'will I find out? (evidence type)'], ['Why', 'does that test the claim?']].map(([k, q]) => (
          <div key={k}><i><b>{k}</b> {q}</i><Lines n={k === 'Why' ? 2 : 1} /></div>
        ))}
      </div>
    </div>
  );
}

function Header({ kind, item, page }: { kind: Kind; item: BankItem; page: number }) {
  return (
    <>
      <div className="ws-head">
        <div>
          <p className="ws-mono">IGCSE GP 0457 · Paper 1 · Q2({kind})</p>
          <h1>{TITLE[kind]}</h1>
        </div>
        <p className="ws-mono">8 marks · ~10 min · page {page}</p>
      </div>
      {page === 1 && (
        <div className="ws-fields"><span>Name</span><span>Class</span><span>Date</span></div>
      )}
      {page === 1 && <p className="ws-src-note">{item.kind === 'reworded' ? 'Reworded past paper' : 'WMSI practice paper'} · {item.title}</p>}
    </>
  );
}

function StudentCopy({ kind, item }: { kind: Kind; item: BankItem }) {
  const checklist = kind === 'a' ? EVALUATE_CHECKLIST : DESIGN_CHECKLIST;
  return (
    <>
      <section className="ws-page">
        <Header kind={kind} item={item} page={1} />
        {kind === 'a' ? (
          <>
            <div className="ws-source">
              <p className="ws-source-h">{item.source.heading}</p>
              {item.source.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
            <p className="ws-q">{QUESTION_A}</p>
            <div className="ws-find">
              <div><b>Step 0 · underline, then list strengths</b><Lines n={3} /></div>
              <div><b>Step 0 · underline, then list weaknesses</b><Lines n={3} /></div>
            </div>
            <ChainBox n={1} />
            <ChainBox n={2} />
          </>
        ) : (
          <>
            <p className="ws-q">{questionB(item.claim.text)}</p>
            <div className="ws-box">
              <div className="ws-box-h"><span>Step 0 · split the claim</span><span>Each part tells you what your research must include</span></div>
              <div className="ws-split">
                {[1, 2, 3].map((n) => (
                  <div key={n}><i>Part {n}: words from the claim</i><Lines n={1} /><i>So my research must include…</i><Lines n={1} /></div>
                ))}
              </div>
            </div>
            <MatrixRow n={1} />
            <MatrixRow n={2} />
            <MatrixRow n={3} />
          </>
        )}
      </section>
      <section className="ws-page">
        <Header kind={kind} item={item} page={2} />
        {kind === 'a' ? (
          <>
            <ChainBox n={3} />
            <ChainBox n={4} />
            <ChainBox n={5} />
            <p className="ws-q ws-q-small">Now write it up as a paragraph, using your chains:</p>
            <Lines n={9} />
          </>
        ) : (
          <>
            <MatrixRow n={4} />
            <div className="ws-box">
              <div className="ws-box-h"><span>Compare line</span><span>If the methods agree…</span></div>
              <div style={{ padding: '1.5mm 2.5mm 0' }}><Lines n={2} /></div>
            </div>
            <p className="ws-q ws-q-small">Now write it up, one or two sentences per method:</p>
            <Lines n={12} />
          </>
        )}
        <div className="ws-ticks">
          {checklist.map((c) => <span key={c}>{c}</span>)}
        </div>
        <p className="ws-foot"><span>Self-mark: Level __ / 4 · Teacher: ______</span><span>WMSI · GP0457 · Q2({kind}) worksheet</span></p>
      </section>
    </>
  );
}

function NotesCopy({ kind, marks }: { kind: Kind; marks: Mark[] }) {
  return (
    <section className="ws-page">
      <div className="ws-head">
        <div><p className="ws-mono">My notes · Q2({kind})</p><h1>{TITLE[kind]}</h1></div>
        <p className="ws-mono">What I highlighted on this page</p>
      </div>
      <ol>
        {marks.map((m) => (
          <li key={m.id}>
            {m.tabLabel && <b>{m.tabLabel}: </b>}“{m.quote}”
            {m.note && <><br /><i>Note: {m.note}</i></>}
          </li>
        ))}
      </ol>
    </section>
  );
}

function SchemeCopy({ kind, item }: { kind: Kind; item: BankItem }) {
  const s = item.scheme;
  return (
    <section className="ws-page">
      <div className="ws-head">
        <div><p className="ws-mono">Teacher copy · answer scheme · Q2({kind})</p><h1>{item.title}</h1></div>
        <p className="ws-mono">{item.kind === 'reworded' ? 'Reworded past paper' : 'WMSI practice paper'}</p>
      </div>
      {kind === 'a' ? (
        <>
          <div className="ws-cols">
            <div><p className="ws-sub">Strengths</p><ul>{s.strengths.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><p className="ws-sub">Weaknesses</p><ul>{s.weaknesses.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
          <p className="ws-sub">Chains written out</p>
          <ol>{s.chainsWritten.map((c) => <li key={c.text}><b>{c.kind === 'S' ? 'S' : 'W'}:</b> {c.text}</li>)}</ol>
          <p className="ws-sub">Levels</p>
          <p>{s.levelNote2a}</p>
          <p><b>Level 2 example:</b> {s.level2Example2a}</p>
        </>
      ) : (
        <>
          <p className="ws-q">{questionB(item.claim.text)}</p>
          <p className="ws-sub">Parts of the claim</p>
          <ul>{item.claim.parts.map((p) => <li key={p.id}><b>{p.id} · {p.label}: “{p.phrase}”</b> — {p.need}</li>)}</ul>
          <p className="ws-sub">Model matrix</p>
          <table className="ws-table">
            <thead><tr><th>Who</th><th>How</th><th>What (evidence)</th><th>Why</th></tr></thead>
            <tbody>{s.modelMatrix.map((r) => <tr key={r.who + r.how}><td>{r.who}</td><td>{r.how}</td><td>{r.what} ({r.evidence.join(', ')})</td><td>{r.why}</td></tr>)}</tbody>
          </table>
          <p><b>Compare line:</b> {s.compareLine}</p>
          <p className="ws-sub">Model paragraph</p>
          <p>{s.modelParagraph2b}</p>
          <p><b>Level 2 example:</b> {s.level2Example2b}</p>
        </>
      )}
    </section>
  );
}

/**
 * A "Print worksheet" button with options. The worksheet itself is portalled to
 * <body> and only appears in print when the button set html[data-print=worksheet].
 */
export function WorksheetPrinter({ kind, defaultItemId }: { kind: Kind; defaultItemId: string }) {
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(defaultItemId);
  const [student, setStudent] = useState(true);
  const [scheme, setScheme] = useState(false);
  const item = getItem(itemId) ?? getItem(defaultItemId)!;
  const { pathname } = useLocation();
  const { marks } = useMarks();
  const myMarks = marks.filter((m) => m.page === pathname);
  const [withNotes, setWithNotes] = useState(true);

  useEffect(() => { if (!student && !scheme) setStudent(true); }, [student, scheme]);

  return (
    <div className="no-print mt-4">
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
          <label className="flex items-center gap-2">
            <span className="font-semibold">Source 3:</span>
            <select value={itemId} onChange={(e) => setItemId(e.target.value)} className="max-w-[320px] rounded-[5px] border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-2 py-1 text-[13px]">
              {BANK.map((b) => <option key={b.id} value={b.id}>{b.title} ({b.kind === 'reworded' ? 'reworded' : 'practice'})</option>)}
            </select>
          </label>
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={student} onChange={(e) => setStudent(e.target.checked)} /> Student copy</label>
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={scheme} onChange={(e) => setScheme(e.target.checked)} /> Answer scheme (teacher copy)</label>
          {myMarks.length > 0 && (
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={withNotes} onChange={(e) => setWithNotes(e.target.checked)} /> My notes ({myMarks.length})</label>
          )}
          <button type="button" onClick={printWorksheet} className="rounded-full bg-[color:var(--color-q2-sea)] px-4 py-1.5 font-semibold text-white">Print</button>
          <span className="text-[12px] text-[color:var(--color-ink-3)]">A4 · black and white · {student ? '2 pages' : ''}{student && scheme ? ' + ' : ''}{scheme ? '1 page' : ''}</span>
        </div>
      )}
      {createPortal(
        <div className="ws-print" aria-hidden>
          {student && <StudentCopy kind={kind} item={item} />}
          {student && withNotes && myMarks.length > 0 && <NotesCopy kind={kind} marks={myMarks} />}
          {scheme && <SchemeCopy kind={kind} item={item} />}
        </div>,
        document.body,
      )}
    </div>
  );
}
