export type NodeCol = 'skill' | 'q2' | 'pays';
export interface MapNode { id: string; col: NodeCol; title: string; lines: string[]; tone?: 'a' | 'b' }
export interface MapLink { from: string; to: string; kind: 'a' | 'b' | 'support' }

export const MAP_NODES: MapNode[] = [
  { id: 'r1', col: 'skill', title: 'Set a research question', lines: [] },
  { id: 'r2', col: 'skill', title: 'Choose research methods', lines: [] },
  { id: 'r3', col: 'skill', title: 'Choose sources of information', lines: [] },
  { id: 'e1', col: 'skill', title: 'Judge reliability & bias', lines: [] },
  { id: 'e2', col: 'skill', title: 'Judge if research fits its aim', lines: [] },
  { id: 'a1', col: 'skill', title: 'Break a claim into parts', lines: [] },
  { id: 'c1', col: 'skill', title: 'Explain in a chain', lines: [] },
  { id: 'a', col: 'q2', tone: 'a', title: 'Strong or Shaky?', lines: ['2(a) · TABLE C · 8', 'Strengths + weaknesses,', 'tied to the research aim'] },
  { id: 'b', col: 'q2', tone: 'b', title: 'The Test Bench', lines: ['2(b) · TABLE D · 8', 'Who · How · What · Why', 'for every part of the claim'] },
  { id: 'q3', col: 'pays', title: 'Paper 1 · Question 3', lines: ['Same checklist: expertise, bias, evidence'] },
  { id: 'c2', col: 'pays', title: 'Individual Report', lines: ['Table E: judge your evidence & sources', '(4 developed points → 9–10 marks)', '+ design your own research'] },
  { id: 'c3', col: 'pays', title: 'Team Project', lines: ['Table A: plan how your action will be', 'evidenced and success measured', 'Table E: evaluate the action and', 'its evidence (Reflective Paper)'] },
];

export const MAP_LINKS: MapLink[] = [
  { from: 'r1', to: 'a', kind: 'a' }, { from: 'r2', to: 'a', kind: 'a' }, { from: 'r2', to: 'b', kind: 'b' },
  { from: 'r3', to: 'b', kind: 'b' }, { from: 'r3', to: 'a', kind: 'a' }, { from: 'e1', to: 'a', kind: 'a' },
  { from: 'e2', to: 'a', kind: 'a' }, { from: 'a1', to: 'b', kind: 'b' },
  { from: 'c1', to: 'a', kind: 'support' }, { from: 'c1', to: 'b', kind: 'support' },
  { from: 'a', to: 'q3', kind: 'a' }, { from: 'a', to: 'c2', kind: 'a' }, { from: 'b', to: 'c2', kind: 'b' },
  { from: 'b', to: 'c3', kind: 'b' }, { from: 'a', to: 'c3', kind: 'support' },
];

export function linkedIds(id: string): Set<string> {
  const out = new Set<string>([id]);
  for (const l of MAP_LINKS) { if (l.from === id) out.add(l.to); if (l.to === id) out.add(l.from); }
  return out;
}
