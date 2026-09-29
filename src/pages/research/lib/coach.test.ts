import { describe, expect, it } from 'vitest';
import { checkChain, coverage, findCritique, matrixAdvice, rowDeveloped, tally, type ChainDraft, type MatrixDraft } from './coach';

const KW = ['how much', 'food', 'restaurants', 'waste'];
const good: ChainDraft = {
  featureId: 'W1', kind: 'W',
  what: 'All the data comes from one small café.',
  effect: 'This means the sample is not representative of restaurants in general.',
  aim: 'So it cannot show how much food restaurants across the country waste.',
};

describe('2(a) coach', () => {
  it('passes a full chain', () => {
    expect(checkChain(good, KW)).toEqual({ linkedToSource: true, hasEffect: true, hasAimLink: true, complete: true });
  });
  it('flags a missing effect connective, a missing aim link and an unlinked point', () => {
    const c = checkChain({ ...good, featureId: null, effect: 'Small sample.', aim: 'Bad.' }, KW);
    expect(c).toEqual({ linkedToSource: false, hasEffect: false, hasAimLink: false, complete: false });
  });
  it('tallies only complete chains and applies the 2+2 minimum and 5-point Level 4 range', () => {
    const s = { ...good, kind: 'S' as const, featureId: 'S1' };
    expect(tally([good, good, s, s], KW)).toMatchObject({ s: 2, w: 2, bothSides: true, minimumMet: true, level4Range: false });
    expect(tally([good, good, s, s, s], KW)).toMatchObject({ level4Range: true });
    expect(tally([good, { ...good, aim: '' }], KW)).toMatchObject({ w: 1, bothSides: false, minimumMet: false });
  });
});

describe('2(b) coach', () => {
  const row: MatrixDraft = { who: 'Police statistics office', how: 'Secondary data analysis', what: 'Thefts per year', evidence: ['quantitative'], why: 'Whole-country figures over ten years show directly whether crime is rising.', tests: [1, 2, 3] };
  it('finds critique words on word boundaries only', () => {
    expect(findCritique('However, interviews can be biased but useful')).toEqual(['however', 'biased', 'but']);
    expect(findCritique('a butterfly survey is unbiased')).toEqual([]);
  });
  it('knows a developed row', () => {
    expect(rowDeveloped(row)).toBe(true);
    expect(rowDeveloped({ ...row, evidence: [] })).toBe(false);
    expect(rowDeveloped({ ...row, why: 'Because.' })).toBe(false);
  });
  it('counts coverage of claim parts from developed rows only', () => {
    expect(coverage([row, { ...row, tests: [1] }, { ...row, why: '' }], [1, 2, 3])).toEqual({ 1: 2, 2: 1, 3: 1 });
  });
  it('gives targeted advice', () => {
    const adv = matrixAdvice([row, { ...row, tests: [1], why: 'However this could be biased and unreliable for sure.' }], [1, 2, 3], false);
    expect(adv).toContain('Add a third fully explained row (four is safer).');
    expect(adv).toContain('Part 2 of the claim is tested by only 1 row — aim for 2.');
    expect(adv).toContain('Row 2 “Why” critiques the method (however, biased, unreliable). Justify why it helps test the claim instead — a limitation only belongs here if it explains why you add another method.');
    expect(adv).toContain('Add one line comparing your results (triangulation).');
  });
});
