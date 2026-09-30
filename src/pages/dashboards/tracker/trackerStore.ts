import { toCsv } from '../../../lib/dashboards';
import type { CompactActivity, ResultPayload } from '../../../lib/resultCode';

export const TRACKER_KEY = 'wne_tracker_q2_db'; // = usePersistentState('tracker_q2', 'db')
export const NEXT_STEPS = [
  'Both S & W', 'Link to aim', "Explain, don't list", "Only what's in the source",
  'Both parts of claim', 'Name evidence type', "Don't argue the issue",
] as const;

export interface Submission { at: string; acts: CompactActivity[] }
export interface StudentRow { key: string; name: string; className: string; submissions: Submission[]; marks: { a?: number; b?: number }; nextSteps: string[]; comment: string }
export interface TrackerDb { version: 1; students: Record<string, StudentRow> }

const tidy = (s: string) => s.trim().replace(/\s+/g, ' ');
export function studentKey(name: string, className: string): string { return `${tidy(name).toLowerCase()}|${tidy(className).toLowerCase()}`; }
export function emptyDb(): TrackerDb { return { version: 1, students: {} }; }

export function addSubmission(db: TrackerDb, p: ResultPayload): { db: TrackerDb; status: 'added' | 'duplicate' | 'no-name' } {
  if (!tidy(p.n)) return { db, status: 'no-name' };
  const students = { ...db.students };
  let key = studentKey(p.n, p.c);
  const sameName = Object.values(students).filter((s) => s.key.split('|')[0] === key.split('|')[0]);
  if (!tidy(p.c) && !students[key] && sameName.length === 1) {
    // Old Q1 codes have no class: file them under the one student with this name.
    key = sameName[0].key;
  } else if (tidy(p.c) && !students[key]) {
    // A class-less row made from old Q1 codes joins this student once their class is known.
    const orphan = students[studentKey(p.n, '')];
    if (orphan) { delete students[orphan.key]; students[key] = { ...orphan, key, className: tidy(p.c) }; }
  }
  const existing = students[key];
  if (existing?.submissions.some((s) => s.at === p.at)) return { db, status: 'duplicate' };
  const row: StudentRow = existing ?? { key, name: tidy(p.n), className: tidy(p.c), submissions: [], marks: {}, nextSteps: [], comment: '' };
  const submissions = [...row.submissions, { at: p.at, acts: p.acts }].sort((x, y) => y.at.localeCompare(x.at));
  return { db: { ...db, students: { ...students, [key]: { ...row, submissions } } }, status: 'added' };
}

export function latest(row: StudentRow): Submission | undefined { return row.submissions[0]; }

const isQ1 = (s: Submission) => s.acts.length > 0 && s.acts.every((a) => a.k === 'q1');
/** Newest Question 2 submission; old Q1 codes are kept apart so they never hide Q2 work. */
export function latestQ2(row: StudentRow): Submission | undefined { return row.submissions.find((s) => !isQ1(s)); }
/** Newest entry for each Q1 tool. */
export function q1Work(row: StudentRow): CompactActivity[] {
  const seen = new Map<string, CompactActivity>();
  for (const s of row.submissions) if (isQ1(s)) for (const a of s.acts) if (!seen.has(a.i)) seen.set(a.i, a);
  return [...seen.values()];
}

export function quizTotals(row: StudentRow): { score: number; max: number } {
  const quizzes = (latestQ2(row)?.acts ?? []).filter((a) => a.k === 'quiz');
  return { score: quizzes.reduce((n, a) => n + (a.s ?? 0), 0), max: quizzes.reduce((n, a) => n + (a.m ?? 0), 0) };
}

function patch(db: TrackerDb, key: string, f: (r: StudentRow) => StudentRow): TrackerDb {
  const r = db.students[key];
  return r ? { ...db, students: { ...db.students, [key]: f(r) } } : db;
}
export function setMark(db: TrackerDb, key: string, part: 'a' | 'b', value: number | undefined): TrackerDb {
  const v = value === undefined || Number.isNaN(value) ? undefined : Math.min(8, Math.max(0, Math.round(value)));
  return patch(db, key, (r) => ({ ...r, marks: { ...r.marks, [part]: v } }));
}
export function toggleNextStep(db: TrackerDb, key: string, step: string): TrackerDb {
  return patch(db, key, (r) => ({ ...r, nextSteps: r.nextSteps.includes(step) ? r.nextSteps.filter((s) => s !== step) : [...r.nextSteps, step] }));
}
export function setComment(db: TrackerDb, key: string, comment: string): TrackerDb {
  return patch(db, key, (r) => ({ ...r, comment }));
}

export function trackerCsv(db: TrackerDb): string {
  const rows = Object.values(db.students).sort((a, b) => a.className.localeCompare(b.className) || a.name.localeCompare(b.name))
    .map((r) => { const q = quizTotals(r); return [r.name, r.className, latest(r)?.at.slice(0, 10) ?? '', q.score, q.max, r.marks.a, r.marks.b, r.nextSteps.join('; '), r.comment]; });
  return toCsv(['Name', 'Class', 'Last submitted', 'Quiz score', 'Quiz max', '2(a) mark', '2(b) mark', 'Next steps', 'Comment'], rows);
}

export function parseBackup(json: string): { ok: true; db: TrackerDb } | { ok: false; error: string } {
  try {
    const d = JSON.parse(json);
    if (d?.version !== 1 || typeof d.students !== 'object' || d.students === null || Array.isArray(d.students))
      return { ok: false, error: 'This file is not a tracker backup.' };
    const students: Record<string, StudentRow> = {};
    for (const [key, raw] of Object.entries(d.students) as [string, Partial<StudentRow>][]) {
      if (typeof raw?.name !== 'string' || !Array.isArray(raw.submissions)) return { ok: false, error: 'This backup is damaged.' };
      // Fill any missing fields so an older or hand-edited backup can never crash the page.
      students[key] = {
        key,
        name: raw.name,
        className: typeof raw.className === 'string' ? raw.className : '',
        submissions: raw.submissions.filter((sub): sub is Submission => typeof sub?.at === 'string' && Array.isArray(sub.acts)),
        marks: raw.marks && typeof raw.marks === 'object' ? raw.marks : {},
        nextSteps: Array.isArray(raw.nextSteps) ? raw.nextSteps.filter((x): x is string => typeof x === 'string') : [],
        comment: typeof raw.comment === 'string' ? raw.comment : '',
      };
    }
    return { ok: true, db: { version: 1, students } };
  } catch {
    return { ok: false, error: 'This file is not a tracker backup.' };
  }
}
