import type { EvidenceTag, PartId } from '../data/types';

export interface ChainDraft { featureId: string | null; kind: 'S' | 'W'; what: string; effect: string; aim: string }
export interface ChainCheck { linkedToSource: boolean; hasEffect: boolean; hasAimLink: boolean; complete: boolean }
export interface Tally { s: number; w: number; bothSides: boolean; minimumMet: boolean; level4Range: boolean }
export interface MatrixDraft { who: string; how: string; what: string; evidence: EvidenceTag[]; why: string; tests: PartId[] }

const wc = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);
const EFFECT_LINK = /\b(so|means|therefore|because|which|could|may|might|this|as a result)\b/i;

export function checkChain(d: ChainDraft, aimKeywords: string[]): ChainCheck {
  const linkedToSource = d.featureId !== null && d.what.trim().length > 0;
  const hasEffect = wc(d.effect) >= 6 && EFFECT_LINK.test(d.effect);
  const aim = d.aim.toLowerCase();
  const hasAimLink = wc(d.aim) >= 5 && aimKeywords.some((k) => aim.includes(k.toLowerCase()));
  return { linkedToSource, hasEffect, hasAimLink, complete: linkedToSource && hasEffect && hasAimLink };
}

export function tally(chains: ChainDraft[], aimKeywords: string[]): Tally {
  const done = chains.filter((c) => checkChain(c, aimKeywords).complete);
  const s = done.filter((c) => c.kind === 'S').length;
  const w = done.filter((c) => c.kind === 'W').length;
  return { s, w, bothSides: s > 0 && w > 0, minimumMet: s >= 2 && w >= 2, level4Range: s >= 2 && w >= 2 && s + w >= 5 };
}

export const CRITIQUE_WORDS = [
  'however', 'but', 'biased', 'bias', 'unreliable', 'not reliable', 'limitation', 'limitations',
  'disadvantage', 'disadvantages', 'drawback', 'drawbacks', 'inaccurate', 'weakness',
];

export function findCritique(text: string): string[] {
  const lower = text.toLowerCase();
  const found: { w: string; at: number }[] = [];
  for (const w of CRITIQUE_WORDS) {
    const m = new RegExp(`\\b${w.replace(/ /g, '\\s+')}\\b`).exec(lower);
    if (m) found.push({ w, at: m.index });
  }
  return found.sort((a, b) => a.at - b.at).map((f) => f.w);
}

export function rowDeveloped(r: MatrixDraft): boolean {
  return !!(r.who.trim() && r.how.trim() && r.what.trim()) && r.evidence.length > 0 && wc(r.why) >= 8;
}

export function coverage(rows: MatrixDraft[], partIds: PartId[]): Record<PartId, number> {
  const out = {} as Record<PartId, number>;
  for (const id of partIds) out[id] = rows.filter((r) => rowDeveloped(r) && r.tests.includes(id)).length;
  return out;
}

export function matrixAdvice(rows: MatrixDraft[], partIds: PartId[], hasCompareLine: boolean): string[] {
  const out: string[] = [];
  const developed = rows.filter(rowDeveloped).length;
  if (developed < 3) out.push(developed === 2 ? 'Add a third fully explained row (four is safer).' : `Develop at least 3 rows — you have ${developed}.`);
  const cov = coverage(rows, partIds);
  for (const id of partIds) if (cov[id] < 2) out.push(`Part ${id} of the claim is tested by only ${cov[id]} row${cov[id] === 1 ? '' : 's'} — aim for 2.`);
  rows.forEach((r, i) => {
    if ((r.who || r.how || r.what) && r.evidence.length === 0) out.push(`Row ${i + 1}: name the evidence type (quantitative/qualitative, primary/secondary).`);
    const crit = findCritique(r.why);
    if (crit.length) out.push(`Row ${i + 1} “Why” critiques the method (${crit.join(', ')}). Justify why it helps test the claim instead — a limitation only belongs here if it explains why you add another method.`);
  });
  if (!hasCompareLine) out.push('Add one line comparing your results (triangulation).');
  return out;
}
