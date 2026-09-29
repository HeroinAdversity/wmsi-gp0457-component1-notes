import { describe, expect, it } from 'vitest';

describe('test runner', () => {
  it('has CompressionStream available (needed by resultCode)', () => {
    expect(typeof CompressionStream).toBe('function');
  });
});
