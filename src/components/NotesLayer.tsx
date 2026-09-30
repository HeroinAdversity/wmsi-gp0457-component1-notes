import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useActiveTab } from '../lib/activeTab';
import { MARK_COLORS, findAnchor, makeAnchor, newMarkId, useMarks, type Mark, type MarkColor } from '../lib/marks';

/* ══════════════════════════════════════════════════════════════════
   Highlights and notes on page text.
   Uses the CSS Custom Highlight API, so the page's DOM is never changed
   (React keeps full control of it). Marks are stored per page and tab.
   ══════════════════════════════════════════════════════════════════ */

interface TextEntry { node: Text; start: number }
interface TextIndex { text: string; entries: TextEntry[] }

// Text inside these is never indexed, so it can't be highlighted.
const SKIP = 'textarea, input, select, button, script, style, svg, [data-no-notes], [contenteditable="true"]';

function buildIndex(root: HTMLElement): TextIndex {
  const entries: TextEntry[] = [];
  let text = '';
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => ((n.parentElement?.closest(SKIP) || !n.nodeValue) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    entries.push({ node: n as Text, start: text.length });
    text += (n as Text).nodeValue;
  }
  return { text, entries };
}

/** Global text offset of a DOM point, or null when it isn't inside indexed text. */
function pointToOffset(idx: TextIndex, node: Node, offset: number): number | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const e = idx.entries.find((x) => x.node === node);
    if (e) return e.start + offset;
  }
  const probe = document.createRange();
  probe.setStart(node, offset);
  for (const e of idx.entries) {
    if (probe.comparePoint(e.node, 0) >= 0) return e.start;
  }
  return idx.text.length;
}

function offsetToPoint(idx: TextIndex, at: number, end: boolean): { node: Text; offset: number } | null {
  for (let i = 0; i < idx.entries.length; i++) {
    const e = idx.entries[i];
    const len = e.node.nodeValue!.length;
    if (at < e.start + len || (end && at === e.start + len)) return { node: e.node, offset: at - e.start };
  }
  return null;
}

function rangeFor(idx: TextIndex, start: number, end: number): Range | null {
  const a = offsetToPoint(idx, start, false);
  const b = offsetToPoint(idx, end, true);
  if (!a || !b) return null;
  const r = document.createRange();
  r.setStart(a.node, a.offset);
  r.setEnd(b.node, b.offset);
  return r;
}

type HighlightRegistry = { set: (k: string, v: unknown) => void; delete: (k: string) => void };
const registry = (): HighlightRegistry | null => ((globalThis as unknown as { CSS?: { highlights?: HighlightRegistry } }).CSS?.highlights ?? null);
const HighlightCtor = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
const KEYS = ['wm-y', 'wm-b', 'wm-p', 'wm-note', 'wm-flash'];

function caretAt(x: number, y: number): { node: Node; offset: number } | null {
  const d = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null };
  if (d.caretPositionFromPoint) { const p = d.caretPositionFromPoint(x, y); return p ? { node: p.offsetNode, offset: p.offset } : null; }
  const r = document.caretRangeFromPoint?.(x, y);
  return r ? { node: r.startContainer, offset: r.startOffset } : null;
}

const coarse = () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

export function NotesLayer({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { pathname, state } = useLocation();
  const active = useActiveTab();
  const tab = active?.id ?? '';
  const { marks, add, update, remove } = useMarks();
  const here = useMemo(() => marks.filter((m) => m.page === pathname && m.tab === tab), [marks, pathname, tab]);

  const rangesRef = useRef<Map<string, Range>>(new Map());
  const [pins, setPins] = useState<{ id: string; top: number; left: number }[]>([]);
  const [sel, setSel] = useState<{ start: number; end: number; rect: DOMRect } | null>(null);
  const [pop, setPop] = useState<{ id: string; x: number; y: number } | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const idxRef = useRef<TextIndex | null>(null);

  /* Re-anchor every mark on this tab and paint the highlights. */
  const paint = useCallback(() => {
    const root = rootRef.current;
    const reg = registry();
    if (!root) return;
    const idx = buildIndex(root);
    idxRef.current = idx;
    const ranges = new Map<string, Range>();
    for (const m of here) {
      const at = findAnchor(idx.text, m);
      const r = at && rangeFor(idx, at.start, at.end);
      if (r) ranges.set(m.id, r);
    }
    rangesRef.current = ranges;
    if (reg && HighlightCtor) {
      for (const c of MARK_COLORS) reg.set(`wm-${c.id}`, new HighlightCtor(...here.filter((m) => m.color === c.id && ranges.has(m.id)).map((m) => ranges.get(m.id)!)));
      reg.set('wm-note', new HighlightCtor(...here.filter((m) => m.note && ranges.has(m.id)).map((m) => ranges.get(m.id)!)));
      const f = flashId && ranges.get(flashId);
      if (f) reg.set('wm-flash', new HighlightCtor(f)); else reg.delete('wm-flash');
    }
    // Margin markers for marks with a note: level with the first line of the
    // highlight, just left of the paragraph (not of the highlight, which may start mid-line).
    const base = root.getBoundingClientRect();
    const next = here.filter((m) => m.note && ranges.has(m.id)).map((m) => {
      const r = ranges.get(m.id)!;
      const first = r.getClientRects()[0];
      if (!first) return null;
      const startEl = r.startContainer.nodeType === Node.TEXT_NODE ? r.startContainer.parentElement : r.startContainer as Element;
      const block = startEl?.closest('p, li, dd, dt, td, blockquote, h1, h2, h3, h4, div') ?? startEl;
      const edge = block ? block.getBoundingClientRect().left : first.left;
      return { id: m.id, top: first.top - base.top + first.height / 2 - 9, left: Math.max(2, edge - base.left - 24) };
    }).filter((p): p is { id: string; top: number; left: number } => p !== null);
    setPins((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [here, flashId]);

  useLayoutEffect(() => { paint(); }, [paint, pathname, tab]);

  // Pages render in stages (tabs, lazy content): repaint when the text changes or the window resizes.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let t = 0;
    const later = () => { window.clearTimeout(t); t = window.setTimeout(paint, 120); };
    const mo = new MutationObserver(later);
    mo.observe(root, { childList: true, subtree: true, characterData: true });
    window.addEventListener('resize', later);
    return () => { mo.disconnect(); window.removeEventListener('resize', later); window.clearTimeout(t); };
  }, [paint]);

  useEffect(() => () => { const reg = registry(); KEYS.forEach((k) => reg?.delete(k)); }, []);

  /* Jump to a mark when asked (from the drawer or My notes). */
  const focusMark = (state as { focusMark?: string } | null)?.focusMark;
  useEffect(() => {
    if (!focusMark) return;
    let tries = 0;
    const go = () => {
      const r = rangesRef.current.get(focusMark);
      if (!r) { if (tries++ < 20) window.setTimeout(go, 150); return; }
      const rect = r.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + rect.top - window.innerHeight / 3, behavior: 'smooth' });
      setFlashId(focusMark);
      window.setTimeout(() => setFlashId(null), 1600);
    };
    go();
  }, [focusMark, tab]);

  /* Watch the selection and offer the toolbar when it sits inside the page text. */
  useEffect(() => {
    let t = 0;
    const check = () => {
      const root = rootRef.current;
      const s = window.getSelection();
      if (!root || !s || s.isCollapsed || s.rangeCount === 0) { setSel(null); return; }
      const r = s.getRangeAt(0);
      if (!root.contains(r.commonAncestorContainer)) { setSel(null); return; }
      const idx = buildIndex(root);
      idxRef.current = idx;
      const a = pointToOffset(idx, r.startContainer, r.startOffset);
      const b = pointToOffset(idx, r.endContainer, r.endOffset);
      if (a === null || b === null || b - a < 2 || b - a > 800 || !idx.text.slice(a, b).trim()) { setSel(null); return; }
      setSel({ start: a, end: b, rect: r.getBoundingClientRect() });
    };
    const onChange = () => { window.clearTimeout(t); t = window.setTimeout(check, coarse() ? 350 : 120); };
    document.addEventListener('selectionchange', onChange);
    return () => { document.removeEventListener('selectionchange', onChange); window.clearTimeout(t); };
  }, []);

  const pageTitle = () => rootRef.current?.querySelector('h1')?.textContent?.trim() || document.title;

  const create = (color: MarkColor, withNote: boolean) => {
    const idx = idxRef.current;
    if (!sel || !idx) return;
    // Trim spaces the selection picked up at either end.
    let { start, end } = sel;
    while (start < end && /\s/.test(idx.text[start])) start++;
    while (end > start && /\s/.test(idx.text[end - 1])) end--;
    const m: Mark = {
      id: newMarkId(), page: pathname, tab, pageTitle: pageTitle(), tabLabel: active?.label ?? '',
      color, ...makeAnchor(idx.text, start, end), note: '', createdAt: new Date().toISOString(),
    };
    add(m);
    const rect = sel.rect;
    window.getSelection()?.removeAllRanges();
    setSel(null);
    if (withNote) setPop({ id: m.id, x: rect.left, y: rect.bottom });
  };

  /* Tap a highlight to edit it. */
  const onClick = (e: React.MouseEvent) => {
    const s = window.getSelection();
    if (s && !s.isCollapsed) return;
    const p = caretAt(e.clientX, e.clientY);
    if (!p) return;
    for (const [id, r] of rangesRef.current) {
      try {
        if (r.isPointInRange(p.node, p.offset)) { setPop({ id, x: e.clientX, y: e.clientY }); return; }
      } catch { /* point in another document part */ }
    }
  };

  const popMark = pop ? marks.find((m) => m.id === pop.id) : undefined;
  const notes = here.filter((m) => m.note);

  return (
    <div className="relative">
      <div ref={rootRef} data-notes-root onClick={onClick}>{children}</div>

      {/* Margin markers for notes */}
      <div className="no-print pointer-events-none absolute inset-0" aria-hidden={false}>
        {pins.map((p) => {
          const m = here.find((x) => x.id === p.id);
          return (
            <button key={p.id} type="button" aria-label={`Note: ${m?.note ?? ''}`} title={m?.note}
              onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPop({ id: p.id, x: r.right, y: r.bottom }); }}
              className="pointer-events-auto absolute grid h-[18px] w-[18px] place-items-center rounded-full bg-[color:var(--color-q2-storm)] text-[10px] text-white shadow"
              style={{ top: p.top, left: p.left }}>✎</button>
          );
        })}
      </div>

      {/* Print: the notes written on this tab */}
      {notes.length > 0 && (
        <section className="hidden print:block mt-6 border border-black px-4 py-3 text-[11px] break-inside-avoid">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em]">My notes on this page</p>
          <ol className="mt-1 list-decimal pl-5">
            {notes.map((m) => <li key={m.id} className="mt-1"><i>“{m.quote.length > 90 ? `${m.quote.slice(0, 90)}…` : m.quote}”</i> — {m.note}</li>)}
          </ol>
        </section>
      )}

      {sel && !pop && createPortal(<SelectionBar rect={sel.rect} onPick={create} />, document.body)}
      {pop && popMark && createPortal(
        <NotePopover key={popMark.id} mark={popMark} x={pop.x} y={pop.y}
          onClose={() => setPop(null)}
          onSave={(note, color) => { update(popMark.id, { note, color }); setPop(null); }}
          onRemove={() => { remove(popMark.id); setPop(null); }} />,
        document.body,
      )}
    </div>
  );
}

function SelectionBar({ rect, onPick }: { rect: DOMRect; onPick: (c: MarkColor, note: boolean) => void }) {
  const mobile = coarse();
  const style: React.CSSProperties = mobile
    ? { left: '50%', bottom: 'calc(env(safe-area-inset-bottom) + 16px)', transform: 'translateX(-50%)' }
    : { left: Math.max(8, Math.min(rect.left, window.innerWidth - 360)), top: Math.min(rect.bottom + 8, window.innerHeight - 56) };
  // mousedown would clear the selection before the click lands.
  const keep = (e: React.MouseEvent | React.TouchEvent) => e.preventDefault();
  return (
    <div role="toolbar" aria-label="Highlight or add a note" className="no-print fixed z-[70] flex gap-0.5 rounded-[8px] bg-[color:var(--color-q2-sea)] p-1 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.35)]" style={style} onMouseDown={keep}>
      {MARK_COLORS.map((c) => (
        <button key={c.id} type="button" onMouseDown={keep} onClick={() => onPick(c.id, false)} className="flex items-center gap-1.5 rounded-[5px] px-2 py-1.5 text-[12px] font-semibold text-white hover:bg-white/10">
          <i className="inline-block h-3 w-3 rounded-full" style={{ background: c.css }} />{c.label}
        </button>
      ))}
      <button type="button" onMouseDown={keep} onClick={() => onPick('y', true)} className="rounded-[5px] px-2 py-1.5 text-[12px] font-semibold text-white hover:bg-white/10">✎ Add note</button>
    </div>
  );
}

function NotePopover({ mark, x, y, onClose, onSave, onRemove }: {
  mark: Mark; x: number; y: number; onClose: () => void; onSave: (note: string, color: MarkColor) => void; onRemove: () => void;
}) {
  const [note, setNote] = useState(mark.note);
  const [color, setColor] = useState<MarkColor>(mark.color);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector('textarea')?.focus();
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [onClose]);
  const w = 290;
  const left = Math.max(8, Math.min(x, window.innerWidth - w - 8));
  const top = Math.min(y + 10, window.innerHeight - 240);
  return (
    <div ref={ref} role="dialog" aria-label="Your note" className="no-print fixed z-[80] rounded-[10px] border border-[color:var(--color-line)] bg-white p-2.5 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.3)]" style={{ left, top, width: w }}>
      <p className="mb-1.5 text-[12px] italic text-[color:var(--color-ink-3)]">“{mark.quote.length > 80 ? `${mark.quote.slice(0, 80)}…` : mark.quote}”</p>
      <div className="mb-1.5 flex gap-1">
        {MARK_COLORS.map((c) => (
          <button key={c.id} type="button" aria-pressed={color === c.id} onClick={() => setColor(c.id)}
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11.5px] ${color === c.id ? 'border-[color:var(--color-q2-sea)]' : 'border-[color:var(--color-line)]'}`}>
            <i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: c.css }} />{c.label}
          </button>
        ))}
      </div>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Write your note…" rows={3}
        className="w-full resize-y rounded-[6px] border border-[color:var(--color-line)] p-2 text-[13.5px]" />
      <div className="mt-1.5 flex justify-between">
        <button type="button" onClick={onRemove} className="text-[12.5px] font-semibold text-[color:var(--color-ember)]">Remove highlight</button>
        <button type="button" onClick={() => onSave(note.trim(), color)} className="rounded-full bg-[color:var(--color-q2-sea)] px-3 py-1 text-[12.5px] font-semibold text-white">Save</button>
      </div>
    </div>
  );
}

/** Button + drawer listing every mark on this page, grouped by tab. */
export function PageNotesButton({ dark = false }: { dark?: boolean }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { marks } = useMarks();
  const mine = marks.filter((m) => m.page === pathname);
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);

  const groups = useMemo(() => {
    const g = new Map<string, Mark[]>();
    for (const m of mine) { const k = m.tabLabel || 'This page'; g.set(k, [...(g.get(k) ?? []), m]); }
    return [...g.entries()];
  }, [mine]);

  const go = (m: Mark) => { setOpen(false); navigate({ pathname: m.page, hash: m.tab ? `#${m.tab}` : '' }, { state: { focusMark: m.id } }); };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`My notes on this page (${mine.length})`}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${dark ? 'text-[color:var(--color-q2-ivory)] hover:bg-white/10' : 'border border-[color:var(--color-line)] bg-white'}`}>
        ✎ My notes{mine.length ? <span className="rounded-full bg-[color:var(--color-q2-ivory)] px-1.5 font-mono text-[10.5px] text-[color:var(--color-q2-sea)]">{mine.length}</span> : null}
      </button>
      {open && createPortal(
        <div className="fixed inset-0 z-[76]" role="dialog" aria-label="My notes on this page">
          <div className="absolute inset-0 bg-[color:var(--color-ink)]/35" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-[340px] max-w-[92vw] flex-col bg-[color:var(--color-paper-2)] pt-[calc(env(safe-area-inset-top)+12px)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[color:var(--color-line)] px-4 py-3">
              <p className="text-[14px] font-bold">Notes on this page <span className="ml-1 rounded-full bg-[color:var(--color-q2-ivory)] px-1.5 font-mono text-[11px]">{mine.length}</span></p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="h-8 w-8 rounded-full hover:bg-white">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {mine.length === 0 ? (
                <p className="text-[13px] text-[color:var(--color-ink-2)]">Nothing yet. Select any words on the page, then pick a colour or “Add note”.</p>
              ) : groups.map(([label, ms]) => (
                <div key={label} className="mb-4">
                  <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-ink-3)]">{label}</p>
                  {ms.map((m) => (
                    <button key={m.id} type="button" onClick={() => go(m)} className="mt-2 block w-full rounded-[8px] border border-[color:var(--color-line)] bg-white px-3 py-2 text-left text-[12.5px] hover:border-[color:var(--color-q2-storm)]">
                      <span className="rounded-[2px] px-0.5" style={{ background: MARK_COLORS.find((c) => c.id === m.color)!.css }}>{m.quote.length > 90 ? `${m.quote.slice(0, 90)}…` : m.quote}</span>
                      {m.note && <span className="mt-1 block text-[13px] text-[color:var(--color-ink)]">✎ {m.note}</span>}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <p className="border-t border-[color:var(--color-line)] px-4 py-3 text-[12px] text-[color:var(--color-ink-3)]">Everything you marked, on every page, is in <a href="/my-learning#notes" onClick={(e) => { e.preventDefault(); setOpen(false); navigate('/my-learning#notes'); }} className="font-semibold text-[color:var(--color-q2-storm)] underline">My learning → My notes</a>. Saved on this device only.</p>
          </aside>
        </div>,
        document.body,
      )}
    </>
  );
}
