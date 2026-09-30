import { describe, expect, it } from 'vitest';
import { getQ1Item } from '../data/bank';
import { Q1_GAMES, Q1_IDEAS, buildQ1Round, sentenceAround, signalWordIndexes } from './generate';

describe('Q1 games', () => {
  it.each(Q1_GAMES.map((g) => g.id))('builds a full round for %s', (id) => {
    const qs = buildQ1Round(id, { seed: 3 });
    expect(qs.length).toBe(Q1_GAMES.find((g) => g.id === id)!.rounds);
    expect(new Set(qs.map((q) => q.key)).size).toBe(qs.length);
    for (const q of qs) {
      expect(Q1_IDEAS[q.idea], q.idea).toBeTruthy();
      if (q.type === 'choice') {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(new Set(q.options).size).toBe(q.options.length);
      } else {
        expect(signalWordIndexes(q.quote, q.signal).length).toBeGreaterThan(0);
      }
    }
  });

  it('serves weak ideas more often', () => {
    const count = (w: Partial<Record<string, number>>) => {
      let n = 0;
      for (let seed = 1; seed <= 40; seed++) n += buildQ1Round('q1-name-it', { seed, weakness: w }).filter((q) => q.idea === 'q1-type-fact').length;
      return n;
    };
    expect(count({ 'q1-type-fact': 1 })).toBeGreaterThan(count({}));
  });

  it('finds the whole sentence around a short quote', () => {
    const s2 = getQ1Item('q1r-j26-12')!.source2.paragraphs.join('\n\n');
    expect(sentenceAround(s2, 'Theft is a serious problem')).toBe('Theft is a serious problem.');
  });

  it('marks every word the signal touches', () => {
    expect(signalWordIndexes('vehicle theft will only be beaten', 'only')).toEqual([3]);
    expect(signalWordIndexes('help to cut this crime', 'help to cut')).toEqual([0, 1, 2]);
  });
});
