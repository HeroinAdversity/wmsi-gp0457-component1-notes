import type { SessionCode } from '../../research/data/types';
import type { StatementType } from '../../types-of-statements/statementTypesData';
import type { LevelKey } from '../../identifying-perspectives/data';

export type { SessionCode, StatementType, LevelKey };

export type ElementId = 'issues' | 'values' | 'causes' | 'consequences' | 'actions';
export type SigTest = 'crowd' | 'hurt' | 'fair' | 'domino' | 'stuck';
export type SourceNo = 1 | 2;

export interface Q1Source {
  paragraphs: string[];
  /** An optional bulleted list, e.g. "Causes of vehicle theft". */
  list?: { title: string; items: string[] };
  /** Who published it, printed under Source 2. */
  attribution?: string;
}

/** 1(a): find one detail in Source 1. */
export interface Q1aTask {
  stem: string;
  /** The model answer, as a student would write it. */
  answer: string;
  /** Other answers that also score. */
  accept: string[];
  /** Tempting wrong answers for the Pinpoint game, each with the reason it scores 0. */
  distractors: { text: string; why: string }[];
  /** Marking note, e.g. "units must be included". */
  note?: string;
}

/** A statement in a source, tagged with its type and the words that give it away. */
export interface TaggedStatement {
  source: SourceNo;
  /** Verbatim from the source. */
  quote: string;
  type: StatementType;
  /** Verbatim from the quote: the word or words that signal the type. */
  signal: string;
  why: string;
}

/** 1(b): identify one example of a type, then explain it. */
export interface Q1bTask {
  type: StatementType;
  /** Model 2-mark explanation for the first accepted example. */
  explain: string;
  /** A 1-mark explanation: shows the idea but doesn't tie it to the example. */
  oneMark: string;
}

/** A point for 1(c): one element of the perspective, anchored to Source 2. */
export interface ElementPoint {
  element: ElementId;
  /** Verbatim from Source 2. */
  quote: string;
  point: string;
}

/** 1(c): describe the perspective of the Source 2 writer. */
export interface Q1cTask {
  /** Whose perspective, as the question names it, e.g. "the international police organisation". */
  holder: string;
  /** e.g. "on vehicle crime"; empty when the question has no topic phrase. */
  on: string;
  level: LevelKey;
  points: ElementPoint[];
  /** A Level 3 (5–6 mark) answer. */
  model: string;
}

/** A short line from someone else on the topic, for the "Which level?" game. */
export interface Voice {
  who: string;
  quote: string;
  level: LevelKey;
  why: string;
}

/** One choice a student could argue is the most significant in 1(d). */
export interface SigOption {
  label: string;
  source: SourceNo;
  /** Verbatim from that source. */
  quote: string;
  /** The test that best shows why it matters. */
  test: SigTest;
  why: string;
}

/** 1(d): which one is the most significant? */
export interface Q1dTask {
  /** The noun the question asks about, e.g. "cause of vehicle crime". */
  focus: string;
  /** The sentence before the question, e.g. "Sources 1 and 2 suggest causes of vehicle crime." */
  lead: string;
  options: SigOption[];
  /** A Level 4 (7–8 mark) answer. */
  model: string;
  levelUp: {
    /** A Level 2 answer: a choice with thin support. */
    base: string;
    /** The edit that lifts it: source support plus a comparison with an alternative. */
    right: string;
    wrong: { text: string; why: string }[];
  };
}

export interface Q1BankItem {
  id: string;
  kind: 'reworded' | 'mirror';
  parent: SessionCode;
  title: string;
  topic: string;
  source1: Q1Source;
  source2: Q1Source;
  q1a: Q1aTask;
  statements: TaggedStatement[];
  q1b: Q1bTask;
  q1c: Q1cTask;
  voices: Voice[];
  q1d: Q1dTask;
}

export const ELEMENT_LABEL: Record<ElementId, string> = {
  issues: 'Issue', values: 'Value', causes: 'Cause', consequences: 'Consequence', actions: 'Action',
};

export const TEST_LABEL: Record<SigTest, string> = {
  crowd: 'Crowd', hurt: 'Hurt', fair: 'Fair', domino: 'Domino', stuck: 'Stuck',
};

export const TEST_QUESTION: Record<SigTest, string> = {
  crowd: 'Does it affect many people?',
  hurt: 'Does it really damage lives?',
  fair: 'Is it a right-or-wrong issue?',
  domino: 'Does it cause other problems?',
  stuck: 'Is it hard to undo?',
};

/** "a prediction", "an opinion". */
export function withArticle(t: StatementType): string {
  const w = t.toLowerCase();
  return /^[aeiou]/.test(w) ? `an ${w}` : `a ${w}`;
}

export function questionText(item: Q1BankItem) {
  const { q1a, q1b, q1c, q1d } = item;
  const type = withArticle(q1b.type);
  return {
    a: q1a.stem,
    bi: `Identify one example of ${type} from Source 2.`,
    bii: `Explain why the example you identified is ${type}.`,
    c: `From Source 2, describe ${q1c.holder}’s perspective${q1c.on ? ` ${q1c.on}` : ''}.`,
    d: `${q1d.lead} Which ${q1d.focus} do you think is the most significant? Explain why.`,
  };
}
