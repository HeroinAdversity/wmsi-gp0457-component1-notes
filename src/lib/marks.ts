import { useCallback, useSyncExternalStore } from 'react';

/**
 * Students' own highlights and notes. Stored only in this browser.
 * A mark is anchored by its quoted text plus a little context either side,
 * so it survives small layout changes and finds the right copy of a phrase
 * that appears more than once.
 */

export type MarkColor = 'y' | 'b' | 'p';
export const MARK_COLORS: { id: MarkColor; label: string; css: string }[] = [
  { id: 'y', label: 'Important', css: '#F3E7A6' },
  { id: 'b', label: 'Revise', css: '#CFE3F5' },
  { id: 'p', label: 'Unsure', css: '#F6D5CB' },
];

export interface Mark {
  id: string;
  /** Pathname the mark belongs to, e.g. /research/evaluate */
  page: string;
  /** Tab id on that page ('' when the page has no tabs). */
  tab: string;
  pageTitle: string;
  tabLabel: string;
  color: MarkColor;
  quote: string;
  prefix: string;
  suffix: string;
  note: string;
  createdAt: string;
}

export interface MarksState { version: 1; marks: Mark[] }
export const MARKS_KEY = 'wne_marks_v1';
const CONTEXT = 32;

export function emptyMarks(): MarksState { return { version: 1, marks: [] }; }

export function parseMarks(raw: string | null): MarksState {
  if (!raw) return emptyMarks();
  try {
    const d = JSON.parse(raw);
    if (d?.version !== 1 || !Array.isArray(d.marks)) return emptyMarks();
    const marks = d.marks.filter((m: Partial<Mark>): m is Mark =>
      typeof m?.id === 'string' && typeof m.page === 'string' && typeof m.quote === 'string' && m.quote.length > 0,
    ).map((m: Mark) => ({
      ...m,
      tab: typeof m.tab === 'string' ? m.tab : '',
      pageTitle: typeof m.pageTitle === 'string' ? m.pageTitle : m.page,
      tabLabel: typeof m.tabLabel === 'string' ? m.tabLabel : '',
      color: (['y', 'b', 'p'] as const).includes(m.color) ? m.color : 'y',
      prefix: typeof m.prefix === 'string' ? m.prefix : '',
      suffix: typeof m.suffix === 'string' ? m.suffix : '',
      note: typeof m.note === 'string' ? m.note : '',
      createdAt: typeof m.createdAt === 'string' ? m.createdAt : new Date(0).toISOString(),
    }));
    return { version: 1, marks };
  } catch {
    return emptyMarks();
  }
}

/** Build the quote + context for a selection at [start, end) of a text. */
export function makeAnchor(text: string, start: number, end: number): { quote: string; prefix: string; suffix: string } {
  return { quote: text.slice(start, end), prefix: text.slice(Math.max(0, start - CONTEXT), start), suffix: text.slice(end, end + CONTEXT) };
}

function sharedSuffix(a: string, b: string): number {
  let n = 0;
  while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) n++;
  return n;
}
function sharedPrefix(a: string, b: string): number {
  let n = 0;
  while (n < a.length && n < b.length && a[n] === b[n]) n++;
  return n;
}

/** Where a mark sits in `text` now: the copy of the quote whose surroundings match best, or null. */
export function findAnchor(text: string, m: Pick<Mark, 'quote' | 'prefix' | 'suffix'>): { start: number; end: number } | null {
  let best: { start: number; score: number } | null = null;
  for (let at = text.indexOf(m.quote); at !== -1; at = text.indexOf(m.quote, at + 1)) {
    const score = sharedSuffix(text.slice(Math.max(0, at - m.prefix.length), at), m.prefix)
      + sharedPrefix(text.slice(at + m.quote.length, at + m.quote.length + m.suffix.length), m.suffix);
    if (!best || score > best.score) best = { start: at, score };
  }
  return best ? { start: best.start, end: best.start + m.quote.length } : null;
}

/* ── Store: one in-memory copy shared by every component, synced across tabs ── */
function storage(): Storage | null {
  try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; }
}
let current: MarksState | null = null;
const listeners = new Set<() => void>();
function get(): MarksState {
  if (!current) { try { current = parseMarks(storage()?.getItem(MARKS_KEY) ?? null); } catch { current = emptyMarks(); } }
  return current;
}
function set(next: MarksState) {
  current = next;
  try { storage()?.setItem(MARKS_KEY, JSON.stringify(next)); } catch { /* storage blocked: keep in memory */ }
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => { if (e.key === MARKS_KEY) { current = parseMarks(e.newValue); l(); } };
  window.addEventListener('storage', onStorage);
  return () => { listeners.delete(l); window.removeEventListener('storage', onStorage); };
}

export function newMarkId(): string {
  return `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function useMarks() {
  const state = useSyncExternalStore(subscribe, get, get);
  const add = useCallback((m: Mark) => set({ ...get(), marks: [...get().marks, m] }), []);
  const update = useCallback((id: string, patch: Partial<Pick<Mark, 'note' | 'color'>>) =>
    set({ ...get(), marks: get().marks.map((m) => (m.id === id ? { ...m, ...patch } : m)) }), []);
  const remove = useCallback((id: string) => set({ ...get(), marks: get().marks.filter((m) => m.id !== id) }), []);
  /** Merge a backup: marks with an id already here are kept as they are. */
  const importMarks = useCallback((incoming: MarksState) => {
    const have = new Set(get().marks.map((m) => m.id));
    const added = incoming.marks.filter((m) => !have.has(m.id));
    set({ ...get(), marks: [...get().marks, ...added] });
    return added.length;
  }, []);
  return { marks: state.marks, add, update, remove, importMarks };
}

/** Marks per tab on one page, for the count badges on tab bars. */
export function countByTab(marks: Mark[], page: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const m of marks) if (m.page === page) out[m.tab] = (out[m.tab] ?? 0) + 1;
  return out;
}
