import { describe, expect, it } from 'vitest';
import { Q1_BANK, sourceBody, sourceOf, wordCount } from './index';
import { SESSIONS } from '../../../research/data/types';

describe('Q1 bank audit', () => {
  it('has unique ids', () => {
    const ids = Q1_BANK.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has one reworded item and two mirrors per session', () => {
    for (const s of Object.keys(SESSIONS)) {
      expect(Q1_BANK.filter((b) => b.kind === 'reworded' && b.parent === s)).toHaveLength(1);
      expect(Q1_BANK.filter((b) => b.kind === 'mirror' && b.parent === s)).toHaveLength(2);
    }
  });

  it('is complete: 11 reworded + 22 mirrors', () => {
    expect(Q1_BANK.filter((b) => b.kind === 'reworded')).toHaveLength(11);
    expect(Q1_BANK.filter((b) => b.kind === 'mirror')).toHaveLength(22);
  });

  for (const item of Q1_BANK) {
    describe(item.id, () => {
      const s1 = sourceOf(item, 1);
      const s2 = sourceOf(item, 2);

      it('has a known parent session', () => {
        expect(Object.keys(SESSIONS)).toContain(item.parent);
      });

      it('has sources of exam length', () => {
        const n1 = wordCount(sourceBody(item.source1));
        const n2 = wordCount(sourceBody(item.source2));
        expect(n1, 'Source 1 words').toBeGreaterThanOrEqual(45);
        expect(n1, 'Source 1 words').toBeLessThanOrEqual(150);
        expect(n2, 'Source 2 words').toBeGreaterThanOrEqual(70);
        expect(n2, 'Source 2 words').toBeLessThanOrEqual(170);
        expect(item.source2.attribution).toBeTruthy();
      });

      it('1(a): the answer is in Source 1 and there are at least 3 distractors', () => {
        const key = item.q1a.answer.replace(/[.]$/, '');
        expect(s1.toLowerCase()).toContain(key.toLowerCase());
        expect(item.q1a.distractors.length).toBeGreaterThanOrEqual(3);
        for (const d of item.q1a.distractors) expect(d.text.toLowerCase()).not.toBe(item.q1a.answer.toLowerCase());
      });

      it('tags at least 6 statements, of at least 3 types, quoted verbatim with the signal inside', () => {
        expect(item.statements.length).toBeGreaterThanOrEqual(6);
        expect(new Set(item.statements.map((s) => s.type)).size).toBeGreaterThanOrEqual(3);
        for (const s of item.statements) {
          expect(s.source === 1 ? s1 : s2, s.quote).toContain(s.quote);
          expect(s.quote, `signal "${s.signal}"`).toContain(s.signal);
        }
      });

      it('1(b): at least two Source 2 statements of the asked type', () => {
        const hits = item.statements.filter((s) => s.source === 2 && s.type === item.q1b.type);
        expect(hits.length).toBeGreaterThanOrEqual(2);
        expect(item.q1b.explain).toContain(hits[0].quote);
      });

      it('1(c): points quote Source 2 and cover at least 4 elements', () => {
        for (const p of item.q1c.points) expect(s2, p.quote).toContain(p.quote);
        expect(new Set(item.q1c.points.map((p) => p.element)).size).toBeGreaterThanOrEqual(4);
        expect(wordCount(item.q1c.model)).toBeGreaterThanOrEqual(80);
      });

      it('has voices at 3 or more levels', () => {
        expect(item.voices.length).toBeGreaterThanOrEqual(4);
        expect(new Set(item.voices.map((v) => v.level)).size).toBeGreaterThanOrEqual(3);
      });

      it('1(d): at least 4 options using 3 tests, quoted verbatim, with 3 wrong level-up edits', () => {
        const { options, levelUp, model } = item.q1d;
        expect(options.length).toBeGreaterThanOrEqual(4);
        expect(new Set(options.map((o) => o.test)).size).toBeGreaterThanOrEqual(3);
        for (const o of options) expect(o.source === 1 ? s1 : s2, o.quote).toContain(o.quote);
        expect(levelUp.wrong).toHaveLength(3);
        expect(wordCount(model)).toBeGreaterThanOrEqual(70);
      });
    });
  }
});
