import { describe, expect, it } from 'vitest';
import { countByTab, findAnchor, makeAnchor, parseMarks, type Mark } from './marks';

const text = 'Aim for five points. Every point is a chain. Every point links to the aim. Every point is a chain again.';

describe('anchoring', () => {
  it('finds a unique quote', () => {
    const start = text.indexOf('links to');
    const a = makeAnchor(text, start, start + 8);
    expect(findAnchor(text, a)).toEqual({ start, end: start + 8 });
  });

  it('picks the right copy of a repeated phrase using its context', () => {
    const second = text.lastIndexOf('Every point is a chain');
    const a = makeAnchor(text, second, second + 22);
    expect(findAnchor(text, a)?.start).toBe(second);
    const first = text.indexOf('Every point is a chain');
    expect(findAnchor(text, makeAnchor(text, first, first + 22))?.start).toBe(first);
  });

  it('still finds the quote when the text around it changes', () => {
    const start = text.indexOf('links to the aim');
    const a = makeAnchor(text, start, start + 16);
    const edited = `New intro sentence. ${text.replace('Aim for five', 'Aim for about five')}`;
    expect(edited.slice(findAnchor(edited, a)!.start, findAnchor(edited, a)!.end)).toBe('links to the aim');
  });

  it('returns null when the quote is gone', () => {
    expect(findAnchor('nothing here', { quote: 'chain', prefix: '', suffix: '' })).toBeNull();
  });
});

describe('store helpers', () => {
  it('repairs or rejects bad saved data', () => {
    expect(parseMarks('not json').marks).toEqual([]);
    expect(parseMarks(JSON.stringify({ version: 2, marks: [] })).marks).toEqual([]);
    const ok = parseMarks(JSON.stringify({ version: 1, marks: [{ id: 'a', page: '/x', quote: 'hi', color: 'zz' }, { id: 'b' }] }));
    expect(ok.marks).toHaveLength(1);
    expect(ok.marks[0]).toMatchObject({ color: 'y', note: '', tab: '' });
  });

  it('counts marks per tab on one page', () => {
    const m = (page: string, tab: string) => ({ id: page + tab + Math.random(), page, tab } as Mark);
    expect(countByTab([m('/a', 'x'), m('/a', 'x'), m('/a', 'y'), m('/b', 'x')], '/a')).toEqual({ x: 2, y: 1 });
  });
});
