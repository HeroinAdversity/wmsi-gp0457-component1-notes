import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/primitives';
import { useProgress, type ActivityRecord, type ProgressState } from '../../lib/progress';
import { encodeResultCode, toPayload, wrapCodeForPdf } from '../../lib/resultCode';
import { nx, useNotesExport, type Block } from '../../lib/useNotesExport';
import { MyNotes } from './MyNotes';

const KIND_ORDER: Record<ActivityRecord['kind'], number> = { quiz: 0, game: 1, 'answer-2a': 2, 'answer-2b': 3, checklist: 4 };
const KIND_LABEL: Record<ActivityRecord['kind'], string> = { quiz: 'Quiz', game: 'Practice game', 'answer-2a': '2(a) answer', 'answer-2b': '2(b) answer', checklist: 'Checklist' };
const STATUS_LABEL: Record<ActivityRecord['status'], string> = { done: 'Done', 'in-progress': 'In progress', 'not-started': 'Not started' };

function rowsOf(state: ProgressState): ActivityRecord[] {
  return Object.values(state.activities).sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.title.localeCompare(b.title));
}
function scoreText(r: ActivityRecord): string {
  if (r.score !== undefined && r.max) return `${r.score} / ${r.max}`;
  if (r.selfLevel) return `L${r.selfLevel} · self`;
  return '—';
}
function ratio(r: ActivityRecord): number {
  if (r.score !== undefined && r.max) return r.score / r.max;
  return r.status === 'done' ? 1 : r.status === 'in-progress' ? 0.5 : 0;
}
function answerBlocks(state: ProgressState): Block[] {
  const answers = rowsOf(state).filter((r) => r.kind === 'answer-2a' || r.kind === 'answer-2b');
  if (!answers.length) return [nx.p('No written answers yet.')];
  return answers.flatMap((r) => [
    nx.h(3, `${r.title}${r.selfLevel ? ` — self-assessed Level ${r.selfLevel}` : ''}`),
    ...(r.answerText ?? '').split('\n').filter(Boolean).map((line) => nx.p(line)),
  ]);
}

export function MyLearningPage() {
  const { state, updateStudent } = useProgress();
  const rows = rowsOf(state);
  const [code, setCode] = useState('');
  const codeRef = useRef('');
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const codeBoxRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let live = true;
    encodeResultCode(toPayload(state, 'q2')).then((c) => { if (live) { codeRef.current = c; setCode(c); } });
    return () => { live = false; };
  }, [state]);

  const stateRef = useRef(state);
  stateRef.current = state;
  useNotesExport({
    toolId: 'my_learning',
    pageTitleEn: 'My learning — Question 2',
    subtitleEn: 'IGCSE Global Perspectives 0457 · Summary for your teacher',
    filenameStem: 'GP_MyLearning',
    studentNameSelector: '#wne-student-name',
    exportDocxSelector: '#wne-export-docx',
    exportPdfSelector: '#wne-export-pdf',
    collect: () => {
      const s = stateRef.current;
      const list = rowsOf(s);
      return {
        sections: [
          { heading: 'Student', blocks: [nx.p(`${s.student.name || '(no name)'} · ${s.student.className || '(no class)'}`)] },
          { heading: 'Summary', blocks: list.length ? [nx.ul(list.map((r) => `${r.title}: ${scoreText(r)} (${STATUS_LABEL[r.status]})`))] : [nx.p('Nothing recorded yet.')] },
          { heading: 'My answers', blocks: answerBlocks(s) },
          { heading: 'Result code — for your teacher', blocks: [
            nx.p('Your teacher drops this PDF into the class tracker, or pastes the code below.'),
            ...wrapCodeForPdf(codeRef.current).map((line) => nx.p(line)),
          ] },
        ],
      };
    },
  });

  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied('ok'); }
    catch { setCopied('fail'); codeBoxRef.current?.select(); }
    setTimeout(() => setCopied('idle'), 2500);
  };

  const input = 'mt-1 block rounded-[5px] border border-[color:var(--color-line)] bg-white px-3 py-2 text-[14px] focus:border-[color:var(--color-q2-storm)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-q2-coastal-tint)]';

  return (
    <div className="q2-page pb-20">
      <section className="pt-10 md:pt-12">
        <Container size="wide">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-q2-storm)]">Your record</p>
          <h1 className="mt-3 font-display text-[40px] md:text-[60px] leading-[1.04] tracking-[-0.02em] text-[color:var(--color-q2-sea)]">My learning.</h1>
          <p className="mt-4 max-w-[64ch] text-[15.5px] md:text-[16.5px] leading-[1.6] text-[color:var(--color-ink-2)]">Everything you have done on this device, in one place. Download it and hand it in; your teacher’s tracker reads the code at the bottom.</p>
        </Container>
      </section>

      <Container size="wide">
        <div className="mt-8 grid gap-9 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="mb-5 flex flex-wrap gap-3">
              <label className="text-[12.5px] font-semibold">Name
                <input id="wne-student-name" value={state.student.name} autoComplete="name"
                  onChange={(e) => updateStudent({ ...state.student, name: e.target.value })} className={`${input} w-[240px]`} />
              </label>
              <label className="text-[12.5px] font-semibold">Class
                <input value={state.student.className} onChange={(e) => updateStudent({ ...state.student, className: e.target.value })} className={`${input} w-[150px]`} />
              </label>
            </div>

            {rows.length === 0 ? (
              <div className="rounded-[8px] border border-dashed border-[color:var(--color-line)] bg-white px-5 py-8 text-[14.5px] text-[color:var(--color-ink-2)]">
                Nothing here yet. Try the <Link to="/research/toolkit#quiz" className="font-semibold text-[color:var(--color-q2-storm)] underline">Toolkit quiz</Link> or a <Link to="/research/practice" className="font-semibold text-[color:var(--color-q2-storm)] underline">practice paper</Link>.
              </div>
            ) : (
              <ul className="border-t border-[color:var(--color-ink)]">
                {rows.map((r) => (
                  <li key={r.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 border-b border-[color:var(--color-line)] py-3 text-[13.5px] sm:grid-cols-[1.4fr_1fr_80px_96px]">
                    <span className="font-semibold text-[color:var(--color-q2-sea)]">{r.title}
                      <small className="block text-[12px] font-normal text-[color:var(--color-ink-3)]">{KIND_LABEL[r.kind]}{r.selfLevel ? ` · self-assessed Level ${r.selfLevel}` : ''}</small>
                    </span>
                    <span className="order-last col-span-2 h-1.5 overflow-hidden rounded bg-[color:var(--color-q2-arctic)] sm:order-none sm:col-span-1" aria-hidden>
                      <i className={`block h-full rounded ${r.kind.startsWith('answer') ? 'bg-[color:var(--color-q2-sage)]' : 'bg-[color:var(--color-q2-storm)]'}`} style={{ width: `${Math.round(ratio(r) * 100)}%` }} />
                    </span>
                    <span className="text-right font-mono text-[12.5px]">{scoreText(r)}</span>
                    <span className={`hidden rounded-full px-2 py-0.5 text-center text-[11px] font-bold sm:block ${r.status === 'done' ? 'bg-[color:var(--color-q2-coastal-tint)] text-[color:var(--color-q2-sapphire)]' : r.status === 'in-progress' ? 'bg-[color:var(--color-q2-ivory-tint)] text-[#5C5C24]' : 'bg-[color:var(--color-q2-arctic)] text-[color:var(--color-ink-3)]'}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className={`${rows.length ? 'flex' : 'hidden lg:flex'} aspect-[1/1.3] flex-col rounded-[4px] border border-[color:var(--color-line)] bg-white p-5 text-[10.5px] text-[color:var(--color-ink-2)] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.3)]`} aria-label="Preview of your PDF">
              <p className="font-display text-[18px] text-[color:var(--color-q2-sea)]">My learning · Question 2</p>
              <p>{state.student.name || 'Your name'} · {state.student.className || 'Class'}</p>
              {[92, 80, 86, 60, 90, 74].map((w, i) => <div key={i} className="mt-1.5 h-[5px] rounded bg-[color:var(--color-q2-arctic)]" style={{ width: `${w}%`, marginTop: i === 3 ? 12 : undefined }} />)}
              <div className="mt-auto rounded-[5px] border-[1.5px] border-[color:var(--color-q2-sea)] p-2.5">
                <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-q2-sea)]">Result code · for your teacher</p>
                <code className="mt-1 block break-all font-mono text-[8.5px] leading-[1.4] text-[color:var(--color-q2-sea)]">{code ? `${code.slice(0, 64)}…` : '…'}</code>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button id="wne-export-pdf" type="button" className="rounded-full bg-[color:var(--color-q2-sea)] px-4 py-2 text-[13px] font-semibold text-white">Download PDF</button>
              <button id="wne-export-docx" type="button" className="rounded-full border border-[color:var(--color-q2-sea)] bg-white px-4 py-2 text-[13px] font-semibold text-[color:var(--color-q2-sea)]">Word</button>
              <button type="button" onClick={copy} disabled={!code} className="rounded-full border border-[color:var(--color-q2-sea)] bg-white px-4 py-2 text-[13px] font-semibold text-[color:var(--color-q2-sea)] disabled:opacity-40">Copy code</button>
              <span className="self-center text-[12.5px] text-[color:var(--color-q2-storm)]" aria-live="polite">
                {copied === 'ok' ? 'Copied' : copied === 'fail' ? 'Copy blocked — the code is selected below; press Ctrl+C.' : ''}
              </span>
            </div>
            {copied === 'fail' && (
              <textarea ref={codeBoxRef} readOnly value={code} rows={4} className="mt-2 w-full rounded-[5px] border border-[color:var(--color-line)] p-2 font-mono text-[11px]" aria-label="Your result code" />
            )}
            <p className="mt-2 text-[12px] text-[color:var(--color-ink-3)]">The code carries your scores, answers and self-assessments. Nothing is uploaded anywhere. Enter your name before downloading.</p>
          </div>
        </div>
        <MyNotes />
      </Container>
    </div>
  );
}
