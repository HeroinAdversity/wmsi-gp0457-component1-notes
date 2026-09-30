import { Q1_BANK, sourceOf } from '../data/bank';
import {
  ELEMENT_LABEL, TEST_LABEL, TEST_QUESTION, withArticle,
  type ElementId, type LevelKey, type Q1BankItem, type SigTest, type SourceNo, type StatementType,
} from '../data/types';
import { STATEMENT_TYPES } from '../../types-of-statements/statementTypesData';
import { makeRng, shuffle, type Rng } from '../../research/games/generate';

export type Q1GameId = 'q1-pinpoint' | 'q1-name-it' | 'q1-signal' | 'q1-level' | 'q1-element' | 'q1-which-test' | 'q1-level-up' | 'q1-mixed';

export interface Q1GameInfo { id: Q1GameId; part: 'a' | 'b' | 'c' | 'd' | 'mix'; title: string; blurb: string; skill: string; rounds: number }

export const Q1_GAMES: Q1GameInfo[] = [
  { id: 'q1-pinpoint', part: 'a', title: 'Pinpoint', blurb: 'Pick the exact answer. Not the total, not the trend, not two answers at once.', skill: 'Locating', rounds: 6 },
  { id: 'q1-name-it', part: 'b', title: 'Name it', blurb: 'Fact, opinion, claim, prediction…? Name the type of statement.', skill: 'Statement types', rounds: 10 },
  { id: 'q1-signal', part: 'b', title: 'Signal word', blurb: 'You know the type. Tap the word that gives it away.', skill: 'Explaining', rounds: 8 },
  { id: 'q1-level', part: 'c', title: 'Which level?', blurb: 'Global, national, local or personal: whose view is this?', skill: 'Levels', rounds: 8 },
  { id: 'q1-element', part: 'c', title: 'Element sort', blurb: 'Issue, value, cause, consequence or action? Tag each part of the perspective.', skill: 'Five elements', rounds: 10 },
  { id: 'q1-which-test', part: 'd', title: 'Which test?', blurb: 'A reason for “most significant”: crowd, hurt, fair, domino or stuck?', skill: 'Judging', rounds: 8 },
  { id: 'q1-level-up', part: 'd', title: 'Level up', blurb: 'A Level 2 judgement: choose the edit that lifts it to Level 4.', skill: 'Justifying', rounds: 6 },
  { id: 'q1-mixed', part: 'mix', title: 'Q1 mixed round', blurb: 'Ten questions across all four parts, your weakest ideas first.', skill: 'Everything', rounds: 10 },
];

/* ── Ideas a round reports on (shown in results and on the teacher's heatmap) ── */
const typeIdea = (t: StatementType) => `q1-type-${t.toLowerCase().replace(/\s+/g, '-')}`;
const levelIdea = (l: LevelKey) => `q1-level-${l.toLowerCase()}`;
const elementIdea = (e: ElementId) => `q1-el-${e}`;
const testIdea = (t: SigTest) => `q1-test-${t}`;
const LEVEL_NAME: Record<LevelKey, string> = { GLOBAL: 'Global', NATIONAL: 'National', LOCAL: 'Local', PERSONAL: 'Personal' };

export const Q1_IDEAS: Record<string, string> = {
  'q1-locate': 'Finding the exact detail',
  'q1-levelup': 'Justifying a choice',
  ...Object.fromEntries(STATEMENT_TYPES.map((t) => [typeIdea(t), t])),
  ...Object.fromEntries((Object.keys(LEVEL_NAME) as LevelKey[]).map((l) => [levelIdea(l), `${LEVEL_NAME[l]} level`])),
  ...Object.fromEntries((Object.keys(ELEMENT_LABEL) as ElementId[]).map((e) => [elementIdea(e), `${ELEMENT_LABEL[e]}s`])),
  ...Object.fromEntries((Object.keys(TEST_LABEL) as SigTest[]).map((t) => [testIdea(t), `${TEST_LABEL[t]} test`])),
};

/* ── Question shapes ── */
interface Base { key: string; itemId: string; itemTitle: string; idea: string; game: Exclude<Q1GameId, 'q1-mixed'> }

/** Text shown above the question, with an optional highlighted phrase. */
export interface Excerpt { label: string; text: string; mark?: string; list?: { title: string; items: string[] } }

export interface Q1ChoiceQ extends Base {
  type: 'choice';
  excerpt: Excerpt;
  prompt: string;
  options: string[];
  answer: number;
  /** Shown after answering; a wrong pick shows its own reason first when there is one. */
  explain: string;
  whyWrong?: Record<number, string>;
}

export interface Q1SignalQ extends Base {
  type: 'signal';
  excerpt: Excerpt;
  statementType: StatementType;
  quote: string;
  signal: string;
  explain: string;
}

export type Q1Question = Q1ChoiceQ | Q1SignalQ;

export const q1UnitsOf = (): number => 1;

/* ── Helpers ── */

/** The sentence in a source that holds the quote, so a short phrase still makes sense. */
export function sentenceAround(text: string, quote: string): string {
  const at = text.indexOf(quote);
  if (at < 0) return quote;
  const before = text.slice(0, at);
  const start = Math.max(before.lastIndexOf('. '), before.lastIndexOf('! '), before.lastIndexOf('? '), before.lastIndexOf('\n'));
  const afterAt = at + quote.length;
  const ends = ['. ', '! ', '? ', '\n'].map((d) => text.indexOf(d, afterAt)).filter((i) => i >= 0);
  const end = ends.length ? Math.min(...ends) + 1 : text.length;
  return text.slice(start < 0 ? 0 : start + 1, end).trim();
}

const sourceLabel = (item: Q1BankItem, n: SourceNo) => `Source ${n} · ${item.title}`;

function excerptFor(item: Q1BankItem, n: SourceNo, quote: string): Excerpt {
  return { label: sourceLabel(item, n), text: sentenceAround(sourceOf(item, n), quote), mark: quote };
}

/** Types students most often mix up with each one: used first as wrong options. */
const CONFUSED: Record<StatementType, StatementType[]> = {
  Fact: ['Claim', 'Generalisation', 'Prediction'],
  Opinion: ['Value', 'Claim', 'Generalisation'],
  Claim: ['Fact', 'Opinion', 'Generalisation'],
  Generalisation: ['Claim', 'Fact', 'Opinion'],
  Value: ['Opinion', 'Claim', 'Bias'],
  Prediction: ['Claim', 'Opinion', 'Fact'],
  Bias: ['Opinion', 'Vested interest', 'Claim'],
  'Vested interest': ['Bias', 'Claim', 'Opinion'],
};

interface Weighted<T> { value: T; idea: string; itemId: string }

/** Weighted pick without replacement: weak ideas come up more; no repeat of the same idea from one paper. */
function pickWeighted<T>(pool: Weighted<T>[], n: number, rng: Rng, weakness: Partial<Record<string, number>>): Weighted<T>[] {
  const out: Weighted<T>[] = [];
  const left = [...pool];
  while (out.length < n && left.length) {
    const weights = left.map((p) => 1 + 3 * (weakness[p.idea] ?? 0));
    let r = rng() * weights.reduce((a, b) => a + b, 0);
    let i = 0;
    while (r > weights[i] && i < left.length - 1) { r -= weights[i]; i++; }
    const chosen = left.splice(i, 1)[0];
    if (out.some((o) => o.itemId === chosen.itemId && o.idea === chosen.idea) && left.length >= n - out.length) continue;
    out.push(chosen);
  }
  return out;
}

const withKey = <T extends Omit<Base, 'key'>>(q: T, i: number, tag: string): T & { key: string } => ({ ...q, key: `${q.itemId}:${tag}:${i}` });

/* ── Builders ── */

function pinpoint(item: Q1BankItem, i: number, rng: Rng): Q1ChoiceQ {
  const { q1a } = item;
  const wrong = shuffle(q1a.distractors, rng).slice(0, 3);
  const options = shuffle([q1a.answer, ...wrong.map((d) => d.text)], rng);
  const answer = options.indexOf(q1a.answer);
  const whyWrong: Record<number, string> = {};
  wrong.forEach((d) => { whyWrong[options.indexOf(d.text)] = d.why; });
  return withKey({
    type: 'choice', game: 'q1-pinpoint', itemId: item.id, itemTitle: item.title, idea: 'q1-locate',
    excerpt: { label: sourceLabel(item, 1), text: item.source1.paragraphs.join(' '), list: item.source1.list },
    prompt: q1a.stem, options, answer, whyWrong,
    explain: `“${q1a.answer}” answers exactly what was asked.${q1a.note ? ` ${q1a.note}` : ''} Copy only the detail the question asks for.`,
  }, i, 'pin');
}

type Stmt = Q1BankItem['statements'][number];

function nameIt(item: Q1BankItem, s: Stmt, i: number, rng: Rng): Q1ChoiceQ {
  const wrong = CONFUSED[s.type].slice(0, 3);
  const options = shuffle([s.type, ...wrong], rng);
  return withKey({
    type: 'choice', game: 'q1-name-it', itemId: item.id, itemTitle: item.title, idea: typeIdea(s.type),
    excerpt: excerptFor(item, s.source, s.quote),
    prompt: 'What type of statement is the highlighted part?',
    options, answer: options.indexOf(s.type),
    explain: `It is ${withArticle(s.type)}. ${s.why} The words that give it away: “${s.signal}”.`,
  }, i, `name-${s.quote.slice(0, 12)}`);
}

function signal(item: Q1BankItem, s: Stmt, i: number): Q1SignalQ {
  return withKey({
    type: 'signal', game: 'q1-signal', itemId: item.id, itemTitle: item.title, idea: typeIdea(s.type),
    excerpt: excerptFor(item, s.source, s.quote),
    statementType: s.type, quote: s.quote, signal: s.signal,
    explain: `“${s.signal}” is what makes it ${withArticle(s.type)}. ${s.why}`,
  }, i, `sig-${s.quote.slice(0, 12)}`);
}

type Voice = Q1BankItem['voices'][number];

function level(item: Q1BankItem, v: Voice, i: number, rng: Rng): Q1ChoiceQ {
  const options = shuffle((Object.keys(LEVEL_NAME) as LevelKey[]).map((l) => LEVEL_NAME[l]), rng);
  return withKey({
    type: 'choice', game: 'q1-level', itemId: item.id, itemTitle: item.title, idea: levelIdea(v.level),
    excerpt: { label: v.who, text: `“${v.quote}”` },
    prompt: 'At which level is this perspective?',
    options, answer: options.indexOf(LEVEL_NAME[v.level]),
    explain: `${LEVEL_NAME[v.level]}: ${v.why}`,
  }, i, `lvl-${v.who.slice(0, 12)}`);
}

type Point = Q1BankItem['q1c']['points'][number];

function element(item: Q1BankItem, p: Point, i: number, rng: Rng): Q1ChoiceQ {
  const options = shuffle((Object.keys(ELEMENT_LABEL) as ElementId[]).map((e) => ELEMENT_LABEL[e]), rng);
  return withKey({
    type: 'choice', game: 'q1-element', itemId: item.id, itemTitle: item.title, idea: elementIdea(p.element),
    excerpt: excerptFor(item, 2, p.quote),
    prompt: `Describing ${item.q1c.holder}’s perspective: which element does the highlighted part show?`,
    options, answer: options.indexOf(ELEMENT_LABEL[p.element]),
    explain: `${ELEMENT_LABEL[p.element]}. ${p.point}`,
  }, i, `el-${p.quote.slice(0, 12)}`);
}

type Opt = Q1BankItem['q1d']['options'][number];

function whichTest(item: Q1BankItem, o: Opt, i: number, rng: Rng): Q1ChoiceQ {
  const tests = Object.keys(TEST_LABEL) as SigTest[];
  const options = shuffle(tests, rng).map((t) => `${TEST_LABEL[t]}: ${TEST_QUESTION[t]}`);
  return withKey({
    type: 'choice', game: 'q1-which-test', itemId: item.id, itemTitle: item.title, idea: testIdea(o.test),
    excerpt: { label: `${item.q1d.lead} · ${item.title}`, text: `“${o.label}” is the most significant ${item.q1d.focus}, because: ${o.why}` },
    prompt: 'Which test is this reason using?',
    options, answer: options.findIndex((x) => x.startsWith(`${TEST_LABEL[o.test]}:`)),
    explain: `The ${TEST_LABEL[o.test]} test: ${TEST_QUESTION[o.test].toLowerCase()} Name the test in your answer, then back it with the source.`,
  }, i, `test-${o.label.slice(0, 12)}`);
}

function levelUp(item: Q1BankItem, i: number, rng: Rng): Q1ChoiceQ {
  const { levelUp: lu, focus } = item.q1d;
  const options = shuffle([lu.right, ...lu.wrong.map((w) => w.text)], rng);
  const whyWrong: Record<number, string> = {};
  lu.wrong.forEach((w) => { whyWrong[options.indexOf(w.text)] = w.why; });
  return withKey({
    type: 'choice', game: 'q1-level-up', itemId: item.id, itemTitle: item.title, idea: 'q1-levelup',
    excerpt: { label: `A Level 2 answer · which ${focus} is most significant?`, text: lu.base },
    prompt: 'Which edit lifts it to Level 4?',
    options, answer: options.indexOf(lu.right), whyWrong,
    explain: 'Level 4 needs a clear choice, support from the source, and a reason it matters more than an alternative.',
  }, i, 'up');
}

/* ── Pools ── */
const stmtPool = (bank: Q1BankItem[]) => bank.flatMap((item) => item.statements.map((s) => ({ value: { item, s }, idea: typeIdea(s.type), itemId: item.id })));
const voicePool = (bank: Q1BankItem[]) => bank.flatMap((item) => item.voices.map((v) => ({ value: { item, v }, idea: levelIdea(v.level), itemId: item.id })));
const pointPool = (bank: Q1BankItem[]) => bank.flatMap((item) => item.q1c.points.map((p) => ({ value: { item, p }, idea: elementIdea(p.element), itemId: item.id })));
const optPool = (bank: Q1BankItem[]) => bank.flatMap((item) => item.q1d.options.map((o) => ({ value: { item, o }, idea: testIdea(o.test), itemId: item.id })));

export interface Q1RoundOptions { seed?: number; weakness?: Partial<Record<string, number>>; bank?: Q1BankItem[] }

/** Build one round of questions for a Q1 game. */
export function buildQ1Round(game: Q1GameId, opts: Q1RoundOptions = {}): Q1Question[] {
  const rng = makeRng(opts.seed ?? Date.now());
  const weakness = opts.weakness ?? {};
  const bank = opts.bank ?? Q1_BANK;
  const n = Q1_GAMES.find((g) => g.id === game)!.rounds;
  const items = shuffle(bank, rng);
  // Small banks repeat papers rather than serve a short round.
  const cycle = (k: number) => Array.from({ length: k }, (_, i) => items[i % items.length]);

  const one = (id: Exclude<Q1GameId, 'q1-mixed'>, k: number, offset = 0): Q1Question[] => {
    switch (id) {
      case 'q1-pinpoint': return cycle(k).map((it, i) => pinpoint(it, i + offset, rng));
      case 'q1-name-it': return pickWeighted(stmtPool(bank), k, rng, weakness).map(({ value: { item, s } }, i) => nameIt(item, s, i + offset, rng));
      case 'q1-signal': return pickWeighted(stmtPool(bank), k, rng, weakness).map(({ value: { item, s } }, i) => signal(item, s, i + offset));
      case 'q1-level': return pickWeighted(voicePool(bank), k, rng, weakness).map(({ value: { item, v } }, i) => level(item, v, i + offset, rng));
      case 'q1-element': return pickWeighted(pointPool(bank), k, rng, weakness).map(({ value: { item, p } }, i) => element(item, p, i + offset, rng));
      case 'q1-which-test': return pickWeighted(optPool(bank), k, rng, weakness).map(({ value: { item, o } }, i) => whichTest(item, o, i + offset, rng));
      case 'q1-level-up': return cycle(k).map((it, i) => levelUp(it, i + offset, rng));
    }
  };

  if (game !== 'q1-mixed') return one(game, n);

  // Mixed: weakest games get the extra questions.
  const parts: [Exclude<Q1GameId, 'q1-mixed'>, number][] = [
    ['q1-pinpoint', 1], ['q1-name-it', 2], ['q1-signal', 1], ['q1-level', 1], ['q1-element', 2], ['q1-which-test', 2], ['q1-level-up', 1],
  ];
  let offset = 0;
  const qs: Q1Question[] = [];
  for (const [id, k] of parts) { qs.push(...one(id, k, offset)); offset += k; }
  return shuffle(qs, rng).slice(0, n);
}

/* ── Checking the signal-word game ── */

/** Words of a quote with their character spans, for tapping. */
export function wordSpans(text: string): { word: string; start: number; end: number }[] {
  const out: { word: string; start: number; end: number }[] = [];
  const re = /\S+/g;
  for (let m = re.exec(text); m; m = re.exec(text)) out.push({ word: m[0], start: m.index, end: m.index + m[0].length });
  return out;
}

/** Indexes of the quote's words that sit inside the signal phrase. */
export function signalWordIndexes(quote: string, signal: string): number[] {
  const at = quote.indexOf(signal);
  if (at < 0) return [];
  const end = at + signal.length;
  return wordSpans(quote).flatMap((w, i) => (w.start < end && w.end > at ? [i] : []));
}
