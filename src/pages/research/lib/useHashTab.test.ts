import { describe, expect, it } from 'vitest';
import { resolveTab } from './useHashTab';

const IDS = ['overview', 'move', 'traps'] as const;
describe('resolveTab', () => {
  it('reads the hash, ignoring # and case', () => expect(resolveTab('#Move', IDS, 'overview')).toBe('move'));
  it('falls back on unknown or empty hashes', () => {
    expect(resolveTab('#weigh', IDS, 'overview')).toBe('overview');
    expect(resolveTab('', IDS, 'overview')).toBe('overview');
  });
});
