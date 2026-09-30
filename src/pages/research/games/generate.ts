import { BANK } from '../data/bank';
import type { BankItem, ClaimPart, Feature, PartId } from '../data/types';
import { featureIdea, partIdea, type IdeaId } from './ideas';

export type GameId = 'chain-order' | 'missing-link' | 'fix-it' | 'spot-it' | 'claim-splitter' | 'method-match' | 'untested' | 'mixed';

export interface GameInfo { id: GameId; part: 'a' | 'b' | 'mix'; title: string; blurb: string; skill: string; rounds: number }

export const GAMES: GameInfo[] = [
  { id: 'chain-order', part: 'a', title: 'Chain order', blurb: 'Three shuffled steps: put them back into what → effect → aim.', skill: 'Structure', rounds: 8 },
  { id: 'missing-link', part: 'a', title: 'Missing link', blurb: 'Given the feature and the aim, pick the right “effect on the evidence”.', skill: 'Effect step', rounds: 10 },
  { id: 'fix-it', part: 'a', title: 'Fix it', blurb: 'A Level 2 point: choose the edit that lifts it towards Level 4.', skill: 'Development', rounds: 8 },
  { id: 'spot-it', part: 'a', title: 'Spot it · 90s', blurb: 'Tap every strength and weakness in a Source 3 before time runs out.', skill: 'Finding', rounds: 1 },
  { id: 'claim-splitter', part: 'b', title: 'Claim splitter', blurb: 'Tag the words that are each part of the claim.', skill: 'Split', rounds: 5 },
  { id: 'method-match', part: 'b', title: 'Method match', blurb: 'Match each part of a claim to a method that can test it.', skill: 'How + Who', rounds: 4 },
  { id: 'untested', part: 'b', title: 'What’s untested?', blurb: 'A student’s 2(b) plan: which part of the claim does it never test?', skill: 'Coverage', rounds: 6 },
  { id: 'mixed', part: 'mix', title: 'Mixed round', blurb: 'Ten questions across the games, your weakest ideas first.', skill: 'Everything', rounds: 10 },
];

export const gameInfo = (id: GameId) => GAMES.find((g) => g.id === id)!;

/* ── Seeded random numbers, so a round can be replayed in tests ── */
export type Rng = () => number;
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle<T>(xs: readonly T[], rng: Rng): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = <T,>(xs: readonly T[], rng: Rng): T => xs[Math.floor(rng() * xs.length)];

/* ── Question types ── */
interface Base { key: string; itemId: string; itemTitle: string; idea: IdeaId }
export type ChainStep = 'what' | 'effect' | 'aim';
export interface ChainOrderQ extends Base { type: 'chain-order'; quote: string; context: string; kind: 'S' | 'W'; steps: { step: ChainStep; text: string }[] }
export interface ChoiceQ extends Base { type: 'missing-link' | 'fix-it'; quote: string; context: string; kind: 'S' | 'W'; stem: { what?: string; aim?: string; weak?: string }; options: string[]; answer: number; explain: string; right: string }
export interface SpotQ extends Base { type: 'spot-it'; item: BankItem }
export interface SplitQ extends Base { type: 'claim-splitter'; claim: string; parts: ClaimPart[] }
export interface MatchQ extends Base { type: 'method-match'; claim: string; parts: ClaimPart[]; rows: { label: string; tests: PartId[] }[] }
export interface UntestedQ extends Base { type: 'untested'; claim: string; parts: ClaimPart[]; rows: { who: string; how: string; what: string }[]; answer: PartId }
export type Question = ChainOrderQ | ChoiceQ | SpotQ | SplitQ | MatchQ | UntestedQ;

/** Every scorable unit a question holds (claim parts count one each). */
export function unitsOf(q: Question): number {
  if (q.type === 'claim-splitter' || q.type === 'method-match') return q.parts.length;
  if (q.type === 'spot-it') return q.item.features.length;
  return 1;
}

interface Pooled { item: BankItem; f: Feature; idea: IdeaId }
function featurePool(): Pooled[] {
  return BANK.flatMap((item) => item.features.map((f) => ({ item, f, idea: featureIdea(f) })));
}

const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const trimStop = (s: string) => s.replace(/[.\s]+$/, '');

/** Weighted pick: ideas with a low score so far come up more often. */
function weightedFeatures(pool: Pooled[], n: number, rng: Rng, weakness: Partial<Record<IdeaId, number>>): Pooled[] {
  const out: Pooled[] = [];
  const left = [...pool];
  while (out.length < n && left.length) {
    const weights = left.map((p) => 1 + 3 * (weakness[p.idea] ?? 0));
    let r = rng() * weights.reduce((a, b) => a + b, 0);
    let i = 0;
    while (r > weights[i] && i < left.length - 1) { r -= weights[i]; i++; }
    const chosen = left.splice(i, 1)[0];
    // Avoid two questions on the same idea from the same paper.
    if (out.some((o) => o.item.id === chosen.item.id && o.idea === chosen.idea)) continue;
    out.push(chosen);
  }
  return out;
}

/** The sentence of Source 3 that holds the quote, so a short quote still makes sense. */
export function contextOf(item: BankItem, quote: string): string {
  for (const para of item.source.paragraphs) {
    const at = para.indexOf(quote);
    if (at < 0) continue;
    const start = Math.max(para.lastIndexOf('. ', at) + 2, 0);
    const endDot = para.indexOf('. ', at + quote.length);
    const end = endDot < 0 ? para.length : endDot + 1;
    return para.slice(start === 1 ? 0 : start, end).trim();
  }
  return quote;
}

function base(p: Pooled, i: number): Base {
  return { key: `${p.item.id}:${p.f.id}:${i}`, itemId: p.item.id, itemTitle: p.item.title, idea: p.idea };
}

function chainOrder(p: Pooled, i: number, rng: Rng): ChainOrderQ {
  const steps = (['what', 'effect', 'aim'] as ChainStep[]).map((step) => ({ step, text: p.f.chain[step] }));
  let shuffled = shuffle(steps, rng);
  if (shuffled.every((s, k) => s.step === steps[k].step)) shuffled = [shuffled[2], shuffled[0], shuffled[1]];
  return { ...base(p, i), type: 'chain-order', quote: p.f.quote, context: contextOf(p.item, p.f.quote), kind: p.f.kind, steps: shuffled };
}

function missingLink(p: Pooled, i: number, pool: Pooled[], rng: Rng): ChoiceQ {
  // Wrong options: effects from other papers about a different idea, so they cannot fit.
  const others = shuffle(pool.filter((o) => o.idea !== p.idea && o.item.id !== p.item.id), rng);
  const wrong: string[] = [];
  for (const o of others) {
    if (wrong.length === 2) break;
    if (!wrong.includes(o.f.chain.effect) && o.f.chain.effect !== p.f.chain.effect) wrong.push(o.f.chain.effect);
  }
  const options = shuffle([p.f.chain.effect, ...wrong], rng);
  return {
    ...base(p, i), type: 'missing-link', quote: p.f.quote, context: contextOf(p.item, p.f.quote), kind: p.f.kind,
    stem: { what: p.f.chain.what, aim: p.f.chain.aim }, options, answer: options.indexOf(p.f.chain.effect), right: p.f.chain.effect,
    explain: 'The middle link says what this feature does to the evidence (accurate? honest? complete? representative?), which sets up the link to the aim.',
  };
}

function fixIt(p: Pooled, i: number, rng: Rng): ChoiceQ {
  const { item, f } = p;
  const weak = `${f.kind === 'S' ? 'A strength' : 'A weakness'} is that ${lcFirst(trimStop(f.chain.what))}, so the research is ${f.kind === 'S' ? 'reliable' : 'not reliable'}.`;
  const right = `Say what it does to the evidence, then link it to the aim: “${trimStop(f.chain.effect)}. ${f.chain.aim}”`;
  const others = item.features.filter((o) => o.id !== f.id);
  const two = shuffle(others, rng).slice(0, 2).map((o) => `“${o.label.toLowerCase()}”`);
  const list = `Add two more ${f.kind === 'S' ? 'strengths' : 'weaknesses'} from the source, such as ${two.join(' and ')}.`;
  const notInSource = pick([
    'Add: “A survey would have been better, because surveys reach more people.”',
    'Add: “Interviews are always biased, so no interview can be trusted.”',
    'Add: “The researcher should also have used an experiment.”',
  ], rng);
  const topic = `Add: “${item.topic} is an important issue in many countries.”`;
  const options = shuffle([right, list, notInSource, topic], rng);
  return {
    ...base(p, i), type: 'fix-it', quote: f.quote, context: contextOf(item, f.quote), kind: f.kind, stem: { weak }, options, answer: options.indexOf(right), right,
    explain: '“Not reliable” is not an explanation. Level 4 points say what the feature does to the evidence and why that matters for the aim. Listing, judging methods the source never used, and talking about the topic earn nothing extra.',
  };
}

function claimParts(item: BankItem) { return item.claim.parts; }

function splitQ(item: BankItem, i: number): SplitQ {
  return { key: `${item.id}:split:${i}`, itemId: item.id, itemTitle: item.title, idea: partIdea(claimParts(item)[0]), type: 'claim-splitter', claim: item.claim.text, parts: claimParts(item) };
}

function matchQ(item: BankItem, i: number, rng: Rng): MatchQ {
  const rows = shuffle(item.scheme.modelMatrix.map((r) => ({ label: `${r.how} · ${r.who}`, tests: r.tests })), rng);
  return { key: `${item.id}:match:${i}`, itemId: item.id, itemTitle: item.title, idea: partIdea(claimParts(item)[0]), type: 'method-match', claim: item.claim.text, parts: claimParts(item), rows };
}

/** Returns null when every method in the model plan tests every part. */
function untestedQ(item: BankItem, i: number, rng: Rng): UntestedQ | null {
  const candidates = shuffle(item.claim.parts, rng).filter((p) => item.scheme.modelMatrix.some((r) => !r.tests.includes(p.id)));
  const target = candidates[0];
  if (!target) return null;
  const rows = item.scheme.modelMatrix.filter((r) => !r.tests.includes(target.id)).map((r) => ({ who: r.who, how: r.how, what: r.what }));
  return { key: `${item.id}:untested:${i}`, itemId: item.id, itemTitle: item.title, idea: partIdea(target), type: 'untested', claim: item.claim.text, parts: item.claim.parts, rows, answer: target.id };
}

export interface RoundOptions { seed?: number; weakness?: Partial<Record<IdeaId, number>> }

/** Build one round of questions for a game. */
export function buildRound(game: GameId, opts: RoundOptions = {}): Question[] {
  const rng = makeRng(opts.seed ?? Date.now());
  const weakness = opts.weakness ?? {};
  const pool = featurePool();
  const n = gameInfo(game).rounds;
  const items = shuffle(BANK, rng);
  switch (game) {
    case 'chain-order': return weightedFeatures(pool, n, rng, weakness).map((p, i) => chainOrder(p, i, rng));
    case 'missing-link': return weightedFeatures(pool, n, rng, weakness).map((p, i) => missingLink(p, i, pool, rng));
    case 'fix-it': return weightedFeatures(pool, n, rng, weakness).map((p, i) => fixIt(p, i, rng));
    case 'spot-it': { const item = items[0]; return [{ key: `${item.id}:spot`, itemId: item.id, itemTitle: item.title, idea: 'methods', type: 'spot-it', item }]; }
    case 'claim-splitter': return items.slice(0, n).map((it, i) => splitQ(it, i));
    case 'method-match': return items.slice(0, n).map((it, i) => matchQ(it, i, rng));
    case 'untested': return items.map((it, i) => untestedQ(it, i, rng)).filter((q): q is UntestedQ => q !== null).slice(0, n);
    case 'mixed': {
      const feats = weightedFeatures(pool, 6, rng, weakness);
      const qs: Question[] = [
        chainOrder(feats[0], 0, rng), chainOrder(feats[1], 1, rng),
        missingLink(feats[2], 2, pool, rng), missingLink(feats[3], 3, pool, rng),
        fixIt(feats[4], 4, rng), fixIt(feats[5], 5, rng),
        splitQ(items[0], 6), matchQ(items[1], 7, rng),
      ];
      const u = items.slice(2).map((it, i) => untestedQ(it, 8 + i, rng)).filter((q): q is UntestedQ => q !== null).slice(0, 2);
      return shuffle([...qs, ...u], rng);
    }
  }
}

/* ── Checking answers ── */

/** Words of a claim, with punctuation stripped, for tagging. */
export function claimWords(claim: string): string[] {
  return claim.split(/\s+/).filter(Boolean);
}
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9’'-]+/g, ' ').trim();

/**
 * Which claim parts were tagged right. A part counts when its tagged words all
 * sit inside the model phrase and cover at least half of it, so "leftover food"
 * is accepted for "recycle their leftover food" but a stray extra word is not.
 * `tags[k]` is the part id on word k.
 */
export function checkSplit(q: SplitQ, tags: Record<number, PartId>): Record<PartId, boolean> {
  const idx = partWordIndexes(q);
  const out = {} as Record<PartId, boolean>;
  for (const p of q.parts) {
    const want = new Set(idx[p.id]);
    const got = Object.entries(tags).filter(([, id]) => id === p.id).map(([k]) => Number(k));
    out[p.id] = got.length > 0 && got.every((k) => want.has(k)) && got.length * 2 >= want.size;
  }
  return out;
}

/** Word indexes that make up each claim part (for showing the answer). */
export function partWordIndexes(q: SplitQ): Record<PartId, number[]> {
  const words = claimWords(q.claim).map(norm);
  const out = {} as Record<PartId, number[]>;
  for (const p of q.parts) {
    const target = norm(p.phrase).split(' ');
    for (let k = 0; k + target.length <= words.length; k++) {
      if (target.every((t, j) => words[k + j] === t)) { out[p.id] = target.map((_, j) => k + j); break; }
    }
    out[p.id] ??= [];
  }
  return out;
}
