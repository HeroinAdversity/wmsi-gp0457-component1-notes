import { describe, expect, it } from 'vitest';
import { BANK } from '../data/bank';
import { featureIdea, IDEAS } from './ideas';
import { GAMES, buildRound, contextOf, checkSplit, claimWords, partWordIndexes, unitsOf, type ChoiceQ, type SplitQ } from './generate';
import { applyRound, DAILY_POINT_CAP, weaknessMap } from './stats';
import type { PartId } from '../data/types';

describe('ideas', () => {
  it('puts every bank feature under a known idea', () => {
    for (const b of BANK) for (const f of b.features) expect(IDEAS[featureIdea(f)]).toBeTruthy();
  });

  it('files the obvious ones correctly', () => {
    const byLabel = (label: string) => BANK.flatMap((b) => b.features).find((f) => f.label === label)!;
    expect(featureIdea(byLabel('Small sample'))).toBe('sample');
    expect(featureIdea(byLabel('Vested interest'))).toBe('bias');
    expect(featureIdea(byLabel('Noisy setting'))).toBe('setting');
    expect(featureIdea(byLabel('Clear research question'))).toBe('aim');
    expect(featureIdea(byLabel('Over-claimed conclusion'))).toBe('conclusion');
  });
});

describe('buildRound', () => {
  it.each(GAMES.map((g) => g.id))('builds a full round for %s', (id) => {
    const qs = buildRound(id, { seed: 7 });
    expect(qs.length).toBeGreaterThan(0);
    const expected = id === 'mixed' ? 10 : GAMES.find((g) => g.id === id)!.rounds;
    expect(qs.length).toBe(expected);
    expect(new Set(qs.map((q) => q.key)).size).toBe(qs.length);
  });

  it('is repeatable from a seed and differs between seeds', () => {
    const a = buildRound('missing-link', { seed: 1 }).map((q) => q.key);
    expect(buildRound('missing-link', { seed: 1 }).map((q) => q.key)).toEqual(a);
    expect(buildRound('missing-link', { seed: 2 }).map((q) => q.key)).not.toEqual(a);
  });

  it('gives choice questions one right answer among distinct options', () => {
    for (const seed of [1, 2, 3]) {
      for (const q of [...buildRound('missing-link', { seed }), ...buildRound('fix-it', { seed })] as ChoiceQ[]) {
        expect(new Set(q.options).size).toBe(q.options.length);
        expect(q.options[q.answer]).toBe(q.right);
      }
    }
  });

  it('serves weak ideas more often', () => {
    let hits = 0;
    for (let seed = 1; seed <= 20; seed++) hits += buildRound('missing-link', { seed, weakness: { ethics: 1 } }).filter((q) => q.idea === 'ethics').length;
    let base = 0;
    for (let seed = 1; seed <= 20; seed++) base += buildRound('missing-link', { seed }).filter((q) => q.idea === 'ethics').length;
    expect(hits).toBeGreaterThan(base);
  });

  it('never asks about a part the plan actually tests', () => {
    for (const q of buildRound('untested', { seed: 5 })) {
      if (q.type !== 'untested') continue;
      const item = BANK.find((b) => b.id === q.itemId)!;
      const shown = item.scheme.modelMatrix.filter((r) => q.rows.some((x) => x.how === r.how && x.who === r.who));
      expect(shown.every((r) => !r.tests.includes(q.answer))).toBe(true);
    }
  });
});

describe('contextOf', () => {
  it('returns a whole sentence that contains every quote', () => {
    for (const b of BANK) for (const f of b.features) {
      const c = contextOf(b, f.quote);
      expect(c).toContain(f.quote);
      expect(c.length).toBeLessThan(400);
    }
  });
});

describe('claim splitter', () => {
  it('can locate every part of every claim', () => {
    for (const b of BANK) {
      const q: SplitQ = { key: b.id, itemId: b.id, itemTitle: b.title, idea: 'part-what', type: 'claim-splitter', claim: b.claim.text, parts: b.claim.parts };
      const idx = partWordIndexes(q);
      for (const p of b.claim.parts) expect(idx[p.id].length, `${b.id} part ${p.id} “${p.phrase}”`).toBeGreaterThan(0);
    }
  });

  it('marks exact tags right and partial tags wrong', () => {
    const b = BANK.find((x) => x.id === 'r-j26-12')!;
    const q: SplitQ = { key: 'k', itemId: b.id, itemTitle: b.title, idea: 'part-what', type: 'claim-splitter', claim: b.claim.text, parts: b.claim.parts };
    const idx = partWordIndexes(q);
    const tags: Record<number, PartId> = {};
    for (const p of b.claim.parts) for (const k of idx[p.id]) tags[k] = p.id;
    expect(Object.values(checkSplit(q, tags)).every(Boolean)).toBe(true);
    // "the country" (2 of 3 words) still counts; "country" alone (1 of 3) does not.
    delete tags[idx[3][0]];
    expect(checkSplit(q, tags)[3]).toBe(true);
    delete tags[idx[3][1]];
    expect(checkSplit(q, tags)[3]).toBe(false);
    // A word from outside the phrase makes the part wrong.
    const withStray = { ...tags, [idx[1][0]]: 3 as PartId };
    expect(checkSplit(q, withStray)[3]).toBe(false);
    expect(claimWords(b.claim.text).length).toBeGreaterThan(3);
  });
});

describe('stats', () => {
  it('caps points per day but keeps counting accuracy', () => {
    const day = new Date('2026-10-01T10:00:00Z');
    let s = applyRound(undefined, { correct: 20, total: 20, ideas: { sample: [2, 3] } }, day);
    s = applyRound(s, { correct: 20, total: 20, ideas: { sample: [1, 1] } }, day);
    expect(s.p).toBe(DAILY_POINT_CAP);
    expect(s.c).toBe(40);
    expect(s.i.sample).toEqual([3, 4]);
    const next = applyRound(s, { correct: 5, total: 10, ideas: {} }, new Date('2026-10-02T10:00:00Z'));
    expect(next.p).toBe(DAILY_POINT_CAP + 5);
    expect(next.a0).toBe(1);
    expect(next.b).toBe(20);
  });

  it('turns per-idea misses into weakness', () => {
    const s = applyRound(undefined, { correct: 1, total: 4, ideas: { bias: [0, 3], aim: [1, 1] } });
    const w = weaknessMap([s]);
    expect(w.bias).toBe(1);
    expect(w.aim).toBeUndefined();
  });

  it('counts each claim part as one unit', () => {
    const q = buildRound('claim-splitter', { seed: 3 })[0];
    expect(unitsOf(q)).toBe(q.type === 'claim-splitter' ? q.parts.length : 1);
  });
});
