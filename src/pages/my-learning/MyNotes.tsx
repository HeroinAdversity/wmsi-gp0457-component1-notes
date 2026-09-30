import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { MARK_COLORS, parseMarks, useMarks, type Mark, type MarkColor } from '../../lib/marks';

type Filter = 'all' | 'notes' | MarkColor;

function printNotes() {
  const html = document.documentElement;
  html.dataset.print = 'mynotes';
  const done = () => { delete html.dataset.print; window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  window.print();
  window.setTimeout(done, 60_000);
}

function groupByPage(marks: Mark[]): { page: string; title: string; tabs: { label: string; marks: Mark[] }[] }[] {
  const pages = new Map<string, { title: string; tabs: Map<string, Mark[]> }>();
  for (const m of [...marks].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    const p = pages.get(m.page) ?? { title: m.pageTitle, tabs: new Map() };
    const label = m.tabLabel || 'Page';
    p.tabs.set(label, [...(p.tabs.get(label) ?? []), m]);
    pages.set(m.page, p);
  }
  return [...pages.entries()].map(([page, p]) => ({ page, title: p.title, tabs: [...p.tabs.entries()].map(([label, ms]) => ({ label, marks: ms })) }));
}

const swatch = (c: MarkColor) => MARK_COLORS.find((x) => x.id === c)!.css;

export function MyNotes() {
  const { marks, remove, importMarks } = useMarks();
  const [filter, setFilter] = useState<Filter>('all');
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { hash } = useLocation();
  const sectionRef = useRef<HTMLElement>(null);
  // The page scrolls to the top on arrival; come back down when linked to #notes.
  useEffect(() => {
    if (hash === '#notes') window.setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  }, [hash]);

  const shown = useMemo(() => marks.filter((m) => filter === 'all' || (filter === 'notes' ? !!m.note : m.color === filter)), [marks, filter]);
  const groups = useMemo(() => groupByPage(shown), [shown]);

  const go = (m: Mark) => navigate({ pathname: m.page, hash: m.tab ? `#${m.tab}` : '' }, { state: { focusMark: m.id } });

  const download = () => {
    const blob = new Blob([JSON.stringify({ version: 1, marks })], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gp-my-notes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const load = async (f: File) => {
    const parsed = parseMarks(await f.text());
    if (!parsed.marks.length) { setMsg(`${f.name} has no notes in it.`); return; }
    const n = importMarks(parsed);
    setMsg(n ? `Added ${n} note${n === 1 ? '' : 's'} from ${f.name}.` : 'Those notes are already here.');
  };

  const chip = (on: boolean) => `rounded-full border px-2.5 py-0.5 text-[12px] ${on ? 'border-[color:var(--color-q2-sea)] bg-[color:var(--color-q2-sea)] text-white' : 'border-[color:var(--color-line)] bg-white text-[color:var(--color-ink-2)]'}`;
  const btn = 'rounded-full border border-[color:var(--color-q2-sea)] bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[color:var(--color-q2-sea)] disabled:opacity-40';

  return (
    <section ref={sectionRef} id="notes" className="mt-14 scroll-mt-32">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[color:var(--color-ink)] pb-3">
        <div>
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-q2-storm)]">My notes</p>
          <h2 className="mt-1 font-display text-[28px] md:text-[34px] leading-[1.1] text-[color:var(--color-q2-sea)]">Everything you marked</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn} disabled={!marks.length} onClick={printNotes}>⎙ Print my notes</button>
          <button type="button" className={btn} disabled={!marks.length} onClick={download}>Save a backup</button>
          <button type="button" className={btn} onClick={() => fileRef.current?.click()}>Load a backup</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void load(f); e.target.value = ''; }} />
        </div>
      </div>
      <p className="mt-2 max-w-[70ch] text-[13px] text-[color:var(--color-ink-3)]">
        Select any words on a Question 1 or Question 2 page to highlight them or add a note. Notes stay on this device; use “Save a backup” to move them to another one. {msg && <b className="text-[color:var(--color-q2-storm)]" aria-live="polite">{msg}</b>}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button type="button" className={chip(filter === 'all')} onClick={() => setFilter('all')}>All ({marks.length})</button>
        <button type="button" className={chip(filter === 'notes')} onClick={() => setFilter('notes')}>With a note</button>
        {MARK_COLORS.map((c) => (
          <button key={c.id} type="button" className={`${chip(filter === c.id)} inline-flex items-center gap-1`} onClick={() => setFilter(c.id)}>
            <i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: c.css }} />{c.label}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="mt-4 rounded-[8px] border border-dashed border-[color:var(--color-line)] bg-white px-5 py-6 text-[14px] text-[color:var(--color-ink-2)]">
          {marks.length ? 'Nothing matches this filter.' : 'No notes yet. Open Strong or Shaky? or The Test Bench, select a sentence and pick “Important”.'}
        </p>
      ) : groups.map((g) => (
        <div key={g.page} className="mt-5">
          <h3 className="font-display text-[20px] text-[color:var(--color-q2-sea)]">{g.title}</h3>
          {g.tabs.map((t) => (
            <div key={t.label} className="mt-2">
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-ink-3)]">{t.label}</p>
              {t.marks.map((m) => (
                <div key={m.id} className="mt-1.5 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 rounded-[8px] border border-[color:var(--color-line)] bg-white px-3 py-2 text-[13px]">
                  <div>
                    <span className="rounded-[2px] px-0.5" style={{ background: swatch(m.color) }}>{m.quote}</span>
                    {m.note && <p className="mt-1">✎ {m.note}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 text-[12px]">
                    <button type="button" onClick={() => go(m)} className="whitespace-nowrap font-semibold text-[color:var(--color-q2-storm)]">Go to it →</button>
                    <button type="button" onClick={() => remove(m.id)} className="text-[color:var(--color-ink-3)] hover:text-[color:var(--color-ember)]">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      {createPortal(
        <div className="mn-print" aria-hidden>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20pt' }}>My notes · Global Perspectives</h1>
          {groupByPage(marks).map((g) => (
            <div key={g.page} style={{ marginTop: '5mm', breakInside: 'avoid' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '14pt', borderBottom: '0.8pt solid #111' }}>{g.title}</h2>
              {g.tabs.map((t) => (
                <div key={t.label} style={{ marginTop: '2mm' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5pt', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{t.label}</p>
                  <ul style={{ margin: '1mm 0 0 5mm', padding: 0 }}>
                    {t.marks.map((m) => (
                      <li key={m.id} style={{ marginTop: '1.2mm', fontSize: '10pt' }}>
                        <span style={{ background: swatch(m.color), WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{m.quote}</span>
                        {m.note && <><br /><i>Note: {m.note}</i></>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </section>
  );
}
