import { describe, expect, it } from 'vitest';
import { FOOTER_MAP, GROUPS, Q1_GROUP, Q2_GROUP, Q2_SEQUENCE, currentPage, q2Index } from './siteMap';
import { buildIndex, search } from './searchIndex';

describe('siteMap', () => {
  it('finds the Q2 section for nested paths', () => {
    expect(q2Index('/research')).toBe(0);
    expect(q2Index('/research/practice/r-j26-12')).toBe(4);
    expect(q2Index('/research/games/missing-link')).toBe(5);
    expect(q2Index('/revision/research')).toBe(6);
    expect(q2Index('/statements')).toBe(-1);
  });

  it('tells Perspectives and Significance apart by hash', () => {
    expect(currentPage(Q1_GROUP, '/perspectives', '')?.title).toBe('Perspectives');
    expect(currentPage(Q1_GROUP, '/perspectives', '#framework')?.title).toBe('Perspectives');
    expect(currentPage(Q1_GROUP, '/perspectives', '#weigh-toolkit')?.title).toBe('Significance');
  });

  it('does not treat every research page as the hub', () => {
    expect(currentPage(Q2_GROUP, '/research/design', '')?.title).toBe('The Test Bench');
    expect(currentPage(Q2_GROUP, '/research', '')?.title).toBe('Research hub');
  });

  it('marks the right group active', () => {
    expect(Q1_GROUP.match('/statements/mindmap', '')).toBe(true);
    expect(Q2_GROUP.match('/revision/research', '')).toBe(true);
    expect(Q2_GROUP.match('/revision/statements', '')).toBe(false);
  });

  it('keeps the section bar in step with the Q2 menu', () => {
    expect(Q2_SEQUENCE.map((s) => s.to)).toEqual(Q2_GROUP.pages.map((p) => p.to));
    expect(GROUPS).toHaveLength(2);
    expect(FOOTER_MAP.flatMap((c) => c.links).every((l) => l.to.startsWith('/'))).toBe(true);
  });
});

describe('search', () => {
  it('indexes pages, ideas, glossary and all 33 papers', () => {
    const idx = buildIndex();
    expect(idx.filter((e) => e.group === 'Practice papers')).toHaveLength(33);
    expect(idx.some((e) => e.title === 'Triangulation')).toBe(true);
  });

  it('needs every word and ranks title hits first', () => {
    const groups = search('vested interest', 'all');
    const titles = groups.flatMap((g) => g.hits.map((h) => h.title));
    expect(titles).toContain('Statements → Vested interest');
    expect(search('zzzz qqqq', 'all')).toEqual([]);
  });

  it('filters by area', () => {
    const only = search('bias', 'Glossary').flatMap((g) => g.hits);
    expect(only.length).toBeGreaterThan(0);
    expect(only.every((h) => h.filter === 'Glossary')).toBe(true);
  });

  it('shows the main pages for an empty query', () => {
    const hits = search('', 'all').flatMap((g) => g.hits);
    expect(hits.map((h) => h.title)).toContain('Strong or Shaky?');
    expect(hits.every((h) => !h.title.includes('→'))).toBe(true);
  });
});
