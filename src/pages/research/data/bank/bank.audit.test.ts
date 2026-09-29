import { describe, expect, it } from 'vitest';
import { BANK, sourceText, wordCount } from './index';
import { SESSIONS } from '../types';

describe('practice bank audit', () => {
  it('has unique ids', () => {
    const ids = BANK.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const item of BANK) {
    describe(item.id, () => {
      const text = sourceText(item);

      it('has a known parent session', () => {
        expect(Object.keys(SESSIONS)).toContain(item.parent);
      });

      it('has a source length in range', () => {
        const n = wordCount(text);
        if (item.kind === 'mirror') {
          expect(n).toBeGreaterThanOrEqual(180);
          expect(n).toBeLessThanOrEqual(220);
        } else {
          expect(n).toBeGreaterThanOrEqual(110);
          expect(n).toBeLessThanOrEqual(230);
        }
      });

      it('quotes every feature verbatim from the source', () => {
        for (const f of item.features) expect(text).toContain(f.quote);
      });

      it('has at least 3 strength and 4 weakness features', () => {
        expect(item.features.filter((f) => f.kind === 'S').length).toBeGreaterThanOrEqual(3);
        expect(item.features.filter((f) => f.kind === 'W').length).toBeGreaterThanOrEqual(4);
      });

      it('has claim parts that are substrings of the claim, ids 1..n', () => {
        expect(item.claim.parts.length).toBeGreaterThanOrEqual(2);
        item.claim.parts.forEach((p, i) => {
          expect(p.id).toBe(i + 1);
          expect(item.claim.text).toContain(p.phrase);
        });
      });

      it('has a full answer scheme', () => {
        const s = item.scheme;
        expect(s.strengths.length).toBeGreaterThanOrEqual(4);
        expect(s.weaknesses.length).toBeGreaterThanOrEqual(5);
        expect(s.chainsWritten.length).toBeGreaterThanOrEqual(2);
        expect(s.modelMatrix.length).toBeGreaterThanOrEqual(3);
        for (const row of s.modelMatrix) {
          expect(row.evidence.length).toBeGreaterThanOrEqual(1);
          expect(row.tests.length).toBeGreaterThanOrEqual(1);
        }
        const partIds = item.claim.parts.map((p) => p.id);
        for (const id of partIds) {
          const rows = s.modelMatrix.filter((r) => r.tests.includes(id)).length;
          expect(rows, `claim part ${id} tested by ≥2 model rows`).toBeGreaterThanOrEqual(2);
        }
        for (const str of [s.levelNote2a, s.level2Example2a, s.compareLine, s.modelParagraph2b, s.level2Example2b]) {
          expect(str.trim().length).toBeGreaterThan(20);
        }
      });

      it('has aim keywords that appear in the aim', () => {
        expect(item.aimKeywords.length).toBeGreaterThanOrEqual(2);
        for (const k of item.aimKeywords) expect(item.aim.toLowerCase()).toContain(k.toLowerCase());
      });
    });
  }
});
