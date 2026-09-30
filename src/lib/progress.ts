import { useCallback, useSyncExternalStore } from 'react';

export type ActivityKind = 'quiz' | 'answer-q1' | 'answer-2a' | 'answer-2b' | 'checklist' | 'game';
export type ActivityStatus = 'not-started' | 'in-progress' | 'done';

export interface ActivityRecord {
  id: string;
  title: string;
  kind: ActivityKind;
  status: ActivityStatus;
  score?: number;
  max?: number;
  selfLevel?: 1 | 2 | 3 | 4;
  answerText?: string;
  /** Running totals for a practice game (kind 'game'). */
  game?: GameStats;
  updatedAt: string;
}

/**
 * Practice-game totals. Short keys keep the result code small:
 * r rounds · c correct · n attempted · b best round · p points (daily cap) ·
 * d / dp day and points that day · a0 first-round accuracy · ar recent accuracy ·
 * i per-idea [correct, attempted].
 */
export interface GameStats {
  r: number; c: number; n: number; b: number; p: number;
  d: string; dp: number; a0: number; ar: number;
  i: Partial<Record<string, [number, number]>>;
}

export interface ProgressState {
  version: 1;
  student: { name: string; className: string };
  activities: Record<string, ActivityRecord>;
}

export const PROGRESS_KEY = 'wne_progress_v1';

export function emptyProgress(): ProgressState {
  return { version: 1, student: { name: '', className: '' }, activities: {} };
}

export function parseProgress(raw: string | null): ProgressState {
  if (!raw) return emptyProgress();
  try {
    const p = JSON.parse(raw);
    if (
      !p || p.version !== 1 ||
      typeof p.student?.name !== 'string' || typeof p.student?.className !== 'string' ||
      typeof p.activities !== 'object' || p.activities === null || Array.isArray(p.activities)
    ) return emptyProgress();
    return p as ProgressState;
  } catch {
    return emptyProgress();
  }
}

function defaultStorage(): Storage | null {
  try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; }
}

export function loadProgress(storage: Pick<Storage, 'getItem'> | null = defaultStorage()): ProgressState {
  try { return parseProgress(storage ? storage.getItem(PROGRESS_KEY) : null); } catch { return emptyProgress(); }
}

export function saveProgress(state: ProgressState, storage: Pick<Storage, 'setItem'> | null = defaultStorage()): void {
  try { storage?.setItem(PROGRESS_KEY, JSON.stringify(state)); } catch { /* storage blocked: keep in memory only */ }
}

export function upsertActivity(
  state: ProgressState,
  rec: Omit<ActivityRecord, 'updatedAt'>,
  now: Date = new Date(),
): ProgressState {
  // A record that omits selfLevel keeps the one already saved (e.g. set on the practice page).
  const prev = state.activities[rec.id];
  const selfLevel = rec.selfLevel ?? prev?.selfLevel;
  const next: ActivityRecord = { ...rec, updatedAt: now.toISOString(), ...(selfLevel !== undefined ? { selfLevel } : {}) };
  return { ...state, activities: { ...state.activities, [rec.id]: next } };
}

export function setStudent(state: ProgressState, student: { name: string; className: string }): ProgressState {
  // Stored exactly as typed so a trailing space survives while typing; toPayload trims.
  return { ...state, student: { name: student.name, className: student.className } };
}

/* ---- React binding: one in-memory copy shared by every component ---- */
let current: ProgressState | null = null;
const listeners = new Set<() => void>();
function get(): ProgressState { if (!current) current = loadProgress(); return current; }
function set(next: ProgressState) { current = next; saveProgress(next); listeners.forEach((l) => l()); }
function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => { if (e.key === PROGRESS_KEY) { current = parseProgress(e.newValue); l(); } };
  window.addEventListener('storage', onStorage);
  return () => { listeners.delete(l); window.removeEventListener('storage', onStorage); };
}

export function useProgress() {
  const state = useSyncExternalStore(subscribe, get, get);
  const record = useCallback((rec: Omit<ActivityRecord, 'updatedAt'>) => set(upsertActivity(get(), rec)), []);
  const updateStudent = useCallback((s: { name: string; className: string }) => set(setStudent(get(), s)), []);
  return { state, record, updateStudent };
}
