import { useEffect } from 'react';
import { useProgress } from '../../../lib/progress';
import { nx, usePersistentState, type Block } from '../../../lib/useNotesExport';
import { PART_STYLE } from '../data/design';
import type { ClaimPart, EvidenceTag, MatrixRow, PartId } from '../data/types';
import { rowDeveloped, type MatrixDraft } from '../lib/coach';
import { CoachPanel } from './CoachPanel';
import { Icon } from './Icon';

export interface MatrixState { rows: MatrixDraft[]; compare: string }
const EVIDENCE: EvidenceTag[] = ['quantitative', 'qualitative', 'primary', 'secondary'];
const EVIDENCE_LABEL: Record<EvidenceTag, string> = { quantitative: 'Quant', qualitative: 'Qual', primary: 'Primary', secondary: 'Secondary' };
const blank = (): MatrixDraft => ({ who: '', how: '', what: '', evidence: [], why: '', tests: [] });
const fresh = (): MatrixState => ({ rows: [blank(), blank(), blank()], compare: '' });

function parseMatrix(raw: string): MatrixState {
  const v = JSON.parse(raw);
  return v && Array.isArray(v.rows) && typeof v.compare === 'string' ? v : fresh();
}

/** Read a saved matrix outside React (for exports). Never throws. */
export function readMatrix(storageId: string): MatrixState {
  try {
    const raw = localStorage.getItem(`wne_${storageId}_matrix`);
    return raw ? parseMatrix(raw) : fresh();
  } catch { return fresh(); }
}

export function matrixToText(m: MatrixState): string {
  const rows = m.rows.filter((r) => r.who || r.how || r.what || r.why)
    .map((r, i) => `${i + 1}. Who: ${r.who} | How: ${r.how} | What: ${r.what} [${r.evidence.join(', ')}] | Why: ${r.why} | Tests: ${r.tests.join(',')}`);
  return rows.join('\n') + (m.compare.trim() ? `\nCompare: ${m.compare.trim()}` : '');
}

export function matrixToBlocks(m: MatrixState): Block[] {
  const rows = m.rows.filter((r) => r.who || r.how || r.what || r.why);
  if (!rows.length) return [nx.p('No rows written yet.')];
  const out: Block[] = rows.flatMap((r, i) => [
    nx.h(3, `Method ${i + 1}${r.tests.length ? ` — tests part${r.tests.length > 1 ? 's' : ''} ${r.tests.join(', ')}` : ''}`),
    nx.ul([
      [nx.text('Who: ', { bold: true }), nx.text(r.who)],
      [nx.text('How: ', { bold: true }), nx.text(r.how)],
      [nx.text('What: ', { bold: true }), nx.text(`${r.what}${r.evidence.length ? ` (${r.evidence.join(', ')})` : ''}`)],
      [nx.text('Why: ', { bold: true }), nx.text(r.why)],
    ]),
  ]);
  if (m.compare.trim()) out.push(nx.p([nx.text('Compare: ', { bold: true }), nx.text(m.compare.trim())]));
  return out;
}

const HEAD = [
  ['Who', 'will I get it from?'], ['How', 'method'], ['What', 'will I find out? (evidence)'], ['Why', 'does that test the claim?'],
] as const;
const field = 'w-full resize-y rounded-[4px] border border-[color:var(--color-line)] bg-white px-2 py-1.5 text-[12.5px] leading-[1.5] focus:border-[color:var(--color-q2-storm)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-q2-coastal-tint)]';

export function WhoHowWhatWhy({ parts, storageId, activityId, activityTitle, readOnlyRows, compareLine, selfLevel }: {
  parts: ClaimPart[]; storageId: string; activityId?: string; activityTitle?: string;
  readOnlyRows?: MatrixRow[]; compareLine?: string; selfLevel?: 1 | 2 | 3 | 4;
}) {
  const [m, setM] = usePersistentState<MatrixState>(storageId, 'matrix', fresh(), parseMatrix);
  const { record } = useProgress();
  const ro = !!readOnlyRows;
  const rows: MatrixDraft[] = readOnlyRows ?? m.rows;
  const compare = ro ? compareLine ?? '' : m.compare;

  useEffect(() => {
    if (ro || !activityId || !activityTitle) return;
    const any = m.rows.some((r) => r.who || r.how || r.what || r.why) || m.compare.trim();
    if (!any) return;
    const id = setTimeout(() => record({
      id: activityId, title: activityTitle, kind: 'answer-2b',
      status: m.rows.filter(rowDeveloped).length >= 3 ? 'done' : 'in-progress',
      answerText: matrixToText(m), ...(selfLevel ? { selfLevel } : {}),
    }), 600);
    return () => clearTimeout(id);
  }, [m, ro, activityId, activityTitle, record, selfLevel]);

  const setRow = (i: number, patch: Partial<MatrixDraft>) => setM((p) => ({ ...p, rows: p.rows.map((r, j) => (j === i ? { ...r, ...patch } : r)) }));
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const cell = (i: number, key: 'who' | 'how' | 'what' | 'why', label: string) => (ro
    ? <p className="text-[13px] leading-[1.5]">{rows[i][key]}</p>
    : <textarea aria-label={`Row ${i + 1} ${label}`} rows={3} value={rows[i][key]} onChange={(e) => setRow(i, { [key]: e.target.value })} className={field} />);

  const evidenceChips = (i: number) => (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {EVIDENCE.map((e) => {
        const on = rows[i].evidence.includes(e);
        if (ro && !on) return null;
        return (
          <button key={e} type="button" disabled={ro} aria-pressed={on} aria-label={e} onClick={() => setRow(i, { evidence: toggle(rows[i].evidence, e) })}
            className={`rounded-[3px] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${on ? 'bg-[color:var(--color-q2-sage-ink)] text-white' : 'border border-dashed border-[color:var(--color-ink-3)] text-[color:var(--color-ink-3)]'}`}>
            {EVIDENCE_LABEL[e]}
          </button>
        );
      })}
    </div>
  );

  const partChips = (i: number) => (
    <div className="mt-1.5 flex flex-wrap items-center gap-1">
      {!ro && <span className="text-[11px] text-[color:var(--color-ink-3)]">Tests part:</span>}
      {parts.map((p) => {
        const on = rows[i].tests.includes(p.id);
        if (ro && !on) return null;
        return (
          <button key={p.id} type="button" disabled={ro} aria-pressed={on} aria-label={`Tests part ${p.id}: ${p.phrase}`}
            onClick={() => setRow(i, { tests: toggle(rows[i].tests, p.id as PartId) })}
            className={`rounded-[3px] px-1.5 py-0.5 font-mono text-[10px] font-semibold ${on ? `${PART_STYLE[p.id].bg} text-white` : 'border border-dashed border-[color:var(--color-ink-3)] text-[color:var(--color-ink-3)]'}`}>
            {p.id}
          </button>
        );
      })}
    </div>
  );

  return (
    <div>
      <div className="mt-5 overflow-hidden rounded-[8px] border border-[#CFCFE0] bg-white">
        <div className="hidden md:grid grid-cols-[40px_1fr_1fr_1.2fr_1.4fr] bg-[color:var(--color-q2-night)] text-white">
          <div />
          {HEAD.map(([t, s]) => (
            <div key={t} className="px-3 py-2.5 text-[11.5px]"><b className="block font-display text-[20px] font-normal leading-[1.05] text-[color:var(--color-q2-ivory)]">{t}</b><span className="opacity-75">{s}</span></div>
          ))}
        </div>
        {rows.map((_, i) => (
          <div key={i} className="grid border-t border-[color:var(--color-line)] first:border-t-0 md:first:border-t md:grid-cols-[40px_1fr_1fr_1.2fr_1.4fr]">
            <div className="flex items-center justify-between bg-[color:var(--color-q2-night)] px-3 py-2 md:block md:bg-transparent md:px-0 md:py-3 md:text-center">
              <span className="font-display text-[20px] text-[color:var(--color-q2-ivory)] md:text-[22px] md:text-[color:var(--color-q2-sage-ink)]">
                {ro ? <><span className="md:hidden">Example row</span><span className="hidden md:inline text-[15px]">Eg</span></> : <><span className="md:hidden">Row </span>{i + 1}</>}
              </span>
              {!ro && rows.length > 1 && (
                <button type="button" onClick={() => setM((p) => ({ ...p, rows: p.rows.filter((__, j) => j !== i) }))}
                  className="grid h-8 w-8 place-items-center rounded-full text-white/80 hover:bg-white/10 md:mx-auto md:mt-1 md:text-[color:var(--color-ink-2)] md:hover:bg-[color:var(--color-paper-2)]"
                  aria-label={`Remove row ${i + 1}`} title="Remove row"><Icon name="cross" size={14} /></button>
              )}
            </div>
            {(['who', 'how', 'what', 'why'] as const).map((k, ci) => (
              <div key={k} className="px-3 py-2.5 md:border-l md:border-[color:var(--color-line-soft)]">
                <span className="mb-1 block font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-q2-sage-ink)] md:hidden">{HEAD[ci][0]}{k === 'what' ? ' · evidence' : ''}</span>
                {cell(i, k, HEAD[ci][0])}
                {k === 'what' && evidenceChips(i)}
                {k === 'why' && partChips(i)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {!ro && m.rows.length < 5 && (
        <button type="button" onClick={() => setM((p) => ({ ...p, rows: [...p.rows, blank()] }))}
          className="mt-3 text-[13px] font-semibold text-[color:var(--color-q2-storm)] underline underline-offset-2">+ Add row</button>
      )}

      {(!ro || compare) && <label className="mt-4 block">
        <span className="text-[12.5px] font-bold text-[color:var(--color-q2-sea)]">Compare line (triangulation)</span>
        {ro
          ? <p className="mt-1 rounded-[5px] bg-[color:var(--color-q2-arctic)] px-3 py-2 text-[13.5px]">{compare}</p>
          : <textarea rows={2} value={m.compare} onChange={(e) => setM((p) => ({ ...p, compare: e.target.value }))}
              placeholder="If … and … both show …, the claim is better supported." className={`mt-1 ${field} text-[13.5px]`} />}
      </label>}

      {!ro && <CoachPanel rows={m.rows} parts={parts} compare={m.compare} />}
    </div>
  );
}
