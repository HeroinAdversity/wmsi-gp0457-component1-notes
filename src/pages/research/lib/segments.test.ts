import { describe, expect, it } from 'vitest';
import { segmentText } from './segments';

const marks = [{ id: 'W1', quote: 'one firm' }, { id: 'S1', quote: 'recorded' }];

describe('segmentText', () => {
  it('splits a paragraph around every quote, in reading order', () => {
    expect(segmentText('It was recorded at one firm today.', marks)).toEqual([
      { text: 'It was ' }, { text: 'recorded', id: 'S1' }, { text: ' at ' }, { text: 'one firm', id: 'W1' }, { text: ' today.' },
    ]);
  });
  it('returns the whole text when no quote is present', () => {
    expect(segmentText('Nothing here.', marks)).toEqual([{ text: 'Nothing here.' }]);
  });
  it('skips a quote that overlaps an earlier one', () => {
    expect(segmentText('one firm recorded', [{ id: 'A', quote: 'one firm' }, { id: 'B', quote: 'firm recorded' }]))
      .toEqual([{ text: 'one firm', id: 'A' }, { text: ' recorded' }]);
  });
});
