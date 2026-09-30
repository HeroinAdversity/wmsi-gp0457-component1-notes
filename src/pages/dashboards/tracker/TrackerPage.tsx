import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { Container } from '../../../components/primitives';
import { downloadFile, formatTimestamp } from '../../../lib/dashboards';
import { decodeResultCode, extractCode } from '../../../lib/resultCode';
import { usePersistentState } from '../../../lib/useNotesExport';
import { docxToText } from './docxText';
import { LeaderboardView } from './LeaderboardView';
import { useHashTab } from '../../research/lib/useHashTab';
import { decodeLegacyCode } from './legacyCode';
import {
  NEXT_STEPS, addSubmission, emptyDb, latest, latestQ2, parseBackup, q1Work, quizTotals, setComment, setMark, toggleNextStep, trackerCsv,
  type StudentRow, type TrackerDb,
} from './trackerStore';

type SortKey = 'name' | 'className' | 'last' | 'quiz';
const VIEWS = ['students', 'leaderboard'] as const;
type View = (typeof VIEWS)[number];
interface Msg { id: number; text: string; tone: 'ok' | 'err' }

export function TrackerPage() {
  const [db, setDb] = usePersistentState<TrackerDb>('tracker_q2', 'db', emptyDb(), (raw) => {
    const r = parseBackup(raw); return r.ok ? r.db : emptyDb();
  });
  const [paste, setPaste] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [cls, setCls] = useState('all');
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'className', dir: 1 });
  const [dragging, setDragging] = useState(false);
  const [view, setView] = useHashTab<View>(VIEWS, 'students');
  const fileRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLInputElement>(null);
  const msgId = useRef(0);
  const dbRef = useRef(db);
  dbRef.current = db;

  const say = (text: string, tone: Msg['tone']) => setMsgs((m) => [{ id: ++msgId.current, text, tone }, ...m].slice(0, 6));

  /** Decode one code and add it; reports the outcome. */
  const ingest = async (rawCode: string, label: string) => {
    const r = await decodeResultCode(rawCode);
    const legacy = r.ok ? null : decodeLegacyCode(rawCode);
    if (!r.ok && !legacy) { say(`${label}: ${r.error}`, 'err'); return; }
    const payload = r.ok ? r.payload : legacy!;
    // Work from the latest db (a ref, so several files in a row each see the last result).
    const out = addSubmission(dbRef.current, payload);
    dbRef.current = out.db;
    setDb(out.db);
    const who = payload.n.trim() || 'This code';
    const what = legacy ? ` (${legacy.acts[0].t})` : '';
    if (out.status === 'added') say(`Added ${who}${what}.`, 'ok');
    else if (out.status === 'duplicate') say(`${who}${what} — already added, skipped.`, 'ok');
    else say(`${label}: this code has no student name.`, 'err');
  };

  const onFiles = async (files: FileList | File[]) => {
    for (const f of Array.from(files)) {
      const kind = /\.pdf$/i.test(f.name) ? 'pdf' : /\.docx$/i.test(f.name) ? 'docx' : null;
      if (!kind) { say(`${f.name}: drop a PDF or Word (.docx) file.`, 'err'); continue; }
      try {
        const text = kind === 'pdf' ? await (await import('./pdfText')).pdfToText(f) : await docxToText(f);
        const code = extractCode(text);
        if (!code) { say(`No result code found in ${f.name}.`, 'err'); continue; }
        await ingest(code, f.name);
      } catch {
        say(`${f.name}: could not read this ${kind === 'pdf' ? 'PDF' : 'Word file'}.`, 'err');
      }
    }
  };

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) void onFiles(e.dataTransfer.files); };
  const addPasted = async () => {
    const text = paste.trim();
    if (!text) { say('Paste a result code first.', 'err'); return; }
    await ingest(extractCode(text) ?? text, 'Pasted code');
    setPaste('');
  };

  const restore = async (f: File) => {
    const r = parseBackup(await f.text());
    if (!r.ok) { say(`${f.name}: ${r.error} Your current data is unchanged.`, 'err'); return; }
    if (!window.confirm('Replace current tracker data with this backup?')) return;
    setDb(r.db); setSelected(null); say(`Restored ${Object.keys(r.db.students).length} students from ${f.name}.`, 'ok');
  };

  const students = Object.values(db.students);
  const classes = useMemo(() => [...new Set(students.map((s) => s.className))].sort(), [students]);
  const rows = students
    .filter((s) => cls === 'all' || s.className === cls)
    .sort((a, b) => {
      const qa = quizTotals(a), qb = quizTotals(b);
      const v = sort.key === 'name' ? a.name.localeCompare(b.name)
        : sort.key === 'className' ? a.className.localeCompare(b.className) || a.name.localeCompare(b.name)
          : sort.key === 'last' ? (latest(a)?.at ?? '').localeCompare(latest(b)?.at ?? '')
            : (qa.max ? qa.score / qa.max : -1) - (qb.max ? qb.score / qb.max : -1);
      return v * sort.dir;
    });
  const sel = selected ? db.students[selected] : undefined;
  const sortBy = (key: SortKey) => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }));
  const btn = 'rounded-full border px-4 py-2 text-[13px] font-semibold';

  return (
    <div className="q2-page pb-20">
      <Container size="wide">
        <div className="flex flex-wrap items-end justify-between gap-4 pt-10">
          <div>
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-q2-storm)]">Teacher · Question 2</p>
            <h1 className="mt-2 font-display text-[34px] md:text-[44px] leading-[1.05] text-[color:var(--color-q2-sea)]">Class tracker</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`${btn} border-[color:var(--color-q2-sea)] bg-white text-[color:var(--color-q2-sea)]`}
              onClick={() => downloadFile('gp-q2-tracker-backup.json', JSON.stringify(db), 'application/json')}>Back up</button>
            <button type="button" className={`${btn} border-[color:var(--color-q2-sea)] bg-white text-[color:var(--color-q2-sea)]`} onClick={() => restoreRef.current?.click()}>Restore</button>
            <input ref={restoreRef} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void restore(f); e.target.value = ''; }} />
            <button type="button" className={`${btn} border-[color:var(--color-q2-sea)] bg-[color:var(--color-q2-sea)] text-white`}
              onClick={() => downloadFile('gp-q2-tracker.csv', trackerCsv(db))}>Export CSV</button>
          </div>
        </div>
        <p className="mt-2 max-w-[70ch] text-[13.5px] text-[color:var(--color-ink-2)]">Everything here stays in this browser. Back up before clearing your browser or changing computers.</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}
          className={`mt-5 flex flex-wrap items-center gap-3 rounded-[8px] border-[1.5px] border-dashed px-4 py-3.5 text-[13.5px] text-[color:var(--color-q2-sea)] ${dragging ? 'border-[color:var(--color-q2-storm)] bg-[color:var(--color-q2-coastal)]/20' : 'border-[#9DB3C6] bg-[color:var(--color-q2-coastal-tint)]'}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v3h16v-3" fill="none" stroke="#021526" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span><b>Drop My learning PDFs or Word files here</b>, <button type="button" className="underline" onClick={() => fileRef.current?.click()}>choose files</button>, or paste a code</span>
          <input ref={fileRef} type="file" accept="application/pdf,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx" multiple hidden onChange={(e) => { if (e.target.files) void onFiles(e.target.files); e.target.value = ''; }} />
          <input value={paste} onChange={(e) => setPaste(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void addPasted(); }}
            placeholder="WMSI2.q2.… or an old Q1 code" aria-label="Paste a result code"
            className="min-w-[180px] flex-1 rounded-[5px] border border-[color:var(--color-line)] bg-white px-2.5 py-2 font-mono text-[12px]" />
          <button type="button" onClick={() => void addPasted()} className={`${btn} border-[color:var(--color-q2-sea)] bg-white text-[color:var(--color-q2-sea)]`}>Add</button>
        </div>
        <ul aria-live="polite" className="mt-2 space-y-1 text-[13px]">
          {msgs.map((m) => <li key={m.id} className={m.tone === 'ok' ? 'text-[color:var(--color-q2-storm)]' : 'text-[color:var(--color-ember)]'}>{m.text}</li>)}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[color:var(--color-line)]">
          {VIEWS.map((v) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)}
              className={`-mb-px border-b-2 py-2.5 text-[13.5px] font-semibold ${view === v ? 'border-[color:var(--color-q2-sea)] text-[color:var(--color-q2-sea)]' : 'border-transparent text-[color:var(--color-ink-3)]'}`}>
              {v === 'students' ? 'Students' : 'Leaderboard'}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 pb-2 text-[13px]">
            <label htmlFor="cls">Class</label>
            <select id="cls" value={cls} onChange={(e) => setCls(e.target.value)} className="rounded-[5px] border border-[color:var(--color-line)] bg-white px-2 py-1">
              <option value="all">All classes</option>
              {classes.map((c) => <option key={c} value={c}>{c || '(no class)'}</option>)}
            </select>
            <span className="text-[color:var(--color-ink-3)]">{rows.length} student{rows.length === 1 ? '' : 's'}</span>
          </div>
        </div>

        {view === 'leaderboard' ? <div className="mt-5"><LeaderboardView rows={rows} /></div> : (
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="min-w-0">

            {rows.length === 0 ? (
              <p className="rounded-[8px] border border-dashed border-[color:var(--color-line)] bg-white px-5 py-8 text-[14px] text-[color:var(--color-ink-2)]">No submissions yet. Drop students’ My learning PDFs or Word files above.</p>
            ) : (
              <>
                <table className="hidden w-full border-collapse text-[13px] md:table">
                  <thead>
                    <tr>
                      {([['name', 'Student'], ['className', 'Class'], ['last', 'Last in'], ['quiz', 'Quizzes']] as const).map(([k, l]) => (
                        <th key={k} className="border-b border-[color:var(--color-q2-sea)] px-2.5 py-2 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-ink-3)]">
                          <button type="button" onClick={() => sortBy(k)} className="uppercase">{l}{sort.key === k ? (sort.dir === 1 ? ' ↑' : ' ↓') : ''}</button>
                        </th>
                      ))}
                      {['2(a)', '2(b)', 'Next steps'].map((h) => (
                        <th key={h} className="border-b border-[color:var(--color-q2-sea)] px-2.5 py-2 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-ink-3)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => <Row key={r.key} r={r} selected={selected === r.key} onSelect={() => setSelected(r.key)} />)}
                  </tbody>
                </table>
                <ul className="space-y-2 md:hidden">
                  {rows.map((r) => {
                    const q = quizTotals(r);
                    return (
                      <li key={r.key}>
                        <button type="button" onClick={() => setSelected(r.key)} className={`w-full rounded-[8px] border bg-white px-3 py-2.5 text-left text-[13px] ${selected === r.key ? 'border-[color:var(--color-q2-storm)]' : 'border-[color:var(--color-line)]'}`}>
                          <b className="block text-[color:var(--color-q2-sea)]">{r.name}</b>
                          <span className="font-mono text-[12px] text-[color:var(--color-ink-2)]">{r.className} · quizzes {q.max ? `${q.score}/${q.max}` : '—'} · 2(a) {r.marks.a ?? '—'} · 2(b) {r.marks.b ?? '—'}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>

          {sel ? <Panel row={sel} setDb={setDb} /> : (
            <aside className="self-start rounded-[8px] border border-[color:var(--color-line)] bg-white px-4 py-4 text-[13.5px] text-[color:var(--color-ink-2)]">Select a student to add marks and next steps.</aside>
          )}
        </div>
        )}
      </Container>
    </div>
  );
}

function Row({ r, selected, onSelect }: { r: StudentRow; selected: boolean; onSelect: () => void }) {
  const q = quizTotals(r);
  const last = latest(r);
  const td = `border-b border-[color:var(--color-line)] px-2.5 py-2.5 align-middle ${selected ? 'bg-[color:var(--color-q2-coastal-tint)]' : ''}`;
  return (
    <tr onClick={onSelect} className="cursor-pointer hover:bg-[color:var(--color-paper-2)]" aria-selected={selected}>
      <td className={td}><button type="button" onClick={onSelect} className="font-semibold text-left">{r.name}</button></td>
      <td className={td}>{r.className}</td>
      <td className={`${td} font-mono tabular-nums`}>{last ? formatTimestamp(last.at) : '—'}</td>
      <td className={`${td} font-mono tabular-nums`}>{q.max ? `${q.score}/${q.max}` : '—'}</td>
      <td className={`${td} font-mono tabular-nums`}>{r.marks.a !== undefined ? `${r.marks.a}/8` : '—'}</td>
      <td className={`${td} font-mono tabular-nums`}>{r.marks.b !== undefined ? `${r.marks.b}/8` : '—'}</td>
      <td className={td}>{r.nextSteps.map((s) => <span key={s} className="mr-1 inline-block rounded-full border border-[#DADAA8] bg-[color:var(--color-q2-ivory-tint)] px-2 py-0.5 text-[11px] font-semibold text-[#4B4B1E]">{s}</span>)}</td>
    </tr>
  );
}

function Panel({ row, setDb }: { row: StudentRow; setDb: (f: (p: TrackerDb) => TrackerDb) => void }) {
  const [comment, setCommentText] = useState(row.comment);
  useEffect(() => { setCommentText(row.comment); }, [row.key, row.comment]);
  useEffect(() => {
    if (comment === row.comment) return;
    const id = setTimeout(() => setDb((p) => setComment(p, row.key, comment)), 500);
    return () => clearTimeout(id);
  }, [comment, row.key, row.comment, setDb]);

  const q1 = q1Work(row);
  const answers = (latestQ2(row)?.acts ?? []).filter((a) => a.k === 'answer-q1' || a.k === 'answer-2a' || a.k === 'answer-2b');
  const markInput = (part: 'a' | 'b') => (
    <span className="flex items-center gap-1.5">
      <input type="number" min={0} max={8} step={1} aria-label={`2(${part}) mark out of 8`}
        value={row.marks[part] ?? ''} onChange={(e) => setDb((p) => setMark(p, row.key, part, e.target.value === '' ? undefined : Number(e.target.value)))}
        className="w-14 rounded-[4px] border border-[color:var(--color-line)] px-1.5 py-1 text-center font-mono" />/ 8
    </span>
  );

  return (
    <aside className="self-start rounded-[8px] border border-[color:var(--color-line)] bg-white px-4 py-4">
      <h2 className="font-display text-[22px] text-[color:var(--color-q2-sea)]">{row.name}</h2>
      <p className="text-[12px] text-[color:var(--color-ink-3)]">{row.className} · {row.submissions.length} submission{row.submissions.length === 1 ? '' : 's'}</p>
      <div className="mt-3 space-y-2 text-[13px]">
        <div className="flex items-center justify-between gap-2"><span>2(a) teacher mark</span>{markInput('a')}</div>
        <div className="flex items-center justify-between gap-2"><span>2(b) teacher mark</span>{markInput('b')}</div>
      </div>
      <p className="mt-4 text-[12.5px] font-bold">Next steps</p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {NEXT_STEPS.map((s) => {
          const on = row.nextSteps.includes(s);
          return (
            <button key={s} type="button" aria-pressed={on} onClick={() => setDb((p) => toggleNextStep(p, row.key, s))}
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${on ? 'border-[color:var(--color-q2-sea)] bg-[color:var(--color-q2-sea)] text-white' : 'border-[#DADAA8] bg-[color:var(--color-q2-ivory-tint)] text-[#4B4B1E]'}`}>{s}</button>
          );
        })}
      </div>
      <label className="mt-3 block text-[12.5px] font-bold">Comment
        <textarea value={comment} onChange={(e) => setCommentText(e.target.value)} rows={3}
          className="mt-1 w-full resize-y rounded-[5px] border border-[color:var(--color-line)] p-2 text-[12.5px] font-normal" />
      </label>
      <details className="mt-3 text-[13px]">
        <summary className="cursor-pointer font-semibold text-[color:var(--color-q2-storm)]">Open answers ({answers.length})</summary>
        {answers.length === 0 ? <p className="mt-2 text-[color:var(--color-ink-3)]">No written answers in the latest submission.</p> : answers.map((a) => {
          const shown = a.a ? a.a.trim().split(/\s+/).length : 0;
          return (
            <div key={a.i} className="mt-3 border-t border-[color:var(--color-line)] pt-2">
              <p className="font-semibold">{a.t}{a.l ? ` · self L${a.l}` : ''}{a.w ? ` · ${a.w} words` : ''}</p>
              {a.a ? <p className="mt-1 whitespace-pre-wrap text-[13px] leading-[1.5]">{a.a}</p> : <p className="mt-1 text-[color:var(--color-ink-3)]">(Answer text not included — see the student’s PDF.)</p>}
              {a.a && a.w && a.w > shown && <p className="mt-1 text-[12px] text-[color:var(--color-ink-3)]">(trimmed — full text is in the student’s PDF)</p>}
            </div>
          );
        })}
      </details>
      {q1.length > 0 && (
        <details className="mt-2 text-[13px]">
          <summary className="cursor-pointer font-semibold text-[color:var(--color-q2-storm)]">Question 1 work ({q1.length})</summary>
          {q1.map((a) => (
            <div key={a.i} className="mt-3 border-t border-[color:var(--color-line)] pt-2">
              <p className="font-semibold">{a.t}</p>
              <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-[1.5] text-[color:var(--color-ink-2)]">{a.a}</p>
            </div>
          ))}
        </details>
      )}
    </aside>
  );
}
