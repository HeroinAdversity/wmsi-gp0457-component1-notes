import { BANK } from '../pages/research/data/bank';
import { DESIGN_TRAPS } from '../pages/research/data/design';
import { EVALUATE_TRAPS } from '../pages/research/data/evaluate';
import { GLOSSARY, METHODS, RELIABILITY, RESEARCH_DESIGN_CHECK, SOURCES, TESTING_CUES } from '../pages/research/data/toolkit';
import { CONCEPT_CARDS } from '../pages/types-of-statements/statementTypesData';
import { FIVE_ELEMENTS, LEVEL_DEFS } from '../pages/identifying-perspectives/data';
import { CRITERIA } from '../pages/identifying-perspectives/weighingRoomData';
import { GROUPS } from './siteMap';

export type SearchFilter = 'Q1' | 'Q2' | 'Glossary' | 'Practice';
export type SearchGroup = 'Pages & sections' | 'Ideas' | 'Glossary' | 'Practice papers';

export interface SearchEntry {
  group: SearchGroup;
  filter: SearchFilter;
  badge: string;
  color: string;
  title: string;
  detail: string;
  to: string;
  /** Lower-cased text the query is matched against. */
  hay: string;
}

const Q2 = { storm: 'var(--color-q2-storm)', night: 'var(--color-q2-night)', sage: 'var(--color-q2-sage)', sea: 'var(--color-q2-sea)', olive: 'var(--color-q2-olive)' };

function entry(e: Omit<SearchEntry, 'hay'>, extra = ''): SearchEntry {
  return { ...e, hay: `${e.title} ${e.detail} ${extra}`.toLowerCase() };
}

let cache: SearchEntry[] | null = null;

export function buildIndex(): SearchEntry[] {
  if (cache) return cache;
  const out: SearchEntry[] = [];

  // Every page and tab from the site map.
  for (const g of GROUPS) {
    for (const p of g.pages) {
      const filter: SearchFilter = g.id === 'q1' ? 'Q1' : g.id === 'q2' ? 'Q2' : p.badge.startsWith('2') ? 'Q2' : 'Q1';
      out.push(entry({ group: 'Pages & sections', filter, badge: p.badge, color: p.color, title: p.title, detail: p.blurb, to: p.to }, p.tests.join(' ')));
      for (const b of p.branches) {
        if (b.to === p.to) continue;
        out.push(entry({ group: 'Pages & sections', filter, badge: p.badge, color: p.color, title: `${p.title} → ${b.label}`, detail: p.meta, to: b.to }));
      }
    }
  }

  // Question 1 ideas.
  for (const c of CONCEPT_CARDS) {
    out.push(entry({ group: 'Ideas', filter: 'Q1', badge: '1(b)', color: 'var(--color-cobalt)', title: `Statements → ${c.name}`, detail: c.def, to: '/statements#terms' }, (c.signalWords ?? []).join(' ')));
  }
  for (const l of LEVEL_DEFS) {
    const name = l.en.name.charAt(0) + l.en.name.slice(1).toLowerCase();
    out.push(entry({ group: 'Ideas', filter: 'Q1', badge: '1(c)', color: 'var(--color-amber)', title: `Perspectives → ${name} level`, detail: l.en.def, to: '/perspectives#framework' }, 'perspective level'));
  }
  for (const e of FIVE_ELEMENTS) {
    out.push(entry({ group: 'Ideas', filter: 'Q1', badge: '1(c)', color: 'var(--color-amber)', title: `Perspectives → ${e.labelEn}`, detail: e.descEn, to: '/perspectives#framework' }, `element ${e.signalsEn}`));
  }
  for (const c of CRITERIA) {
    out.push(entry({ group: 'Ideas', filter: 'Q1', badge: '1(d)', color: 'var(--color-forest)', title: `Significance → ${c.labelEn}`, detail: c.defEn, to: '/perspectives#weigh-toolkit' }, 'significance test'));
  }

  // Question 2 ideas.
  for (const m of METHODS) {
    out.push(entry({ group: 'Ideas', filter: 'Q2', badge: 'Kit', color: Q2.storm, title: `Methods → ${m.name}`, detail: m.what, to: '/research/toolkit#methods' }, `${m.data} ${m.tags.join(' ')} ${m.useIn2b}`));
  }
  for (const s of SOURCES) {
    out.push(entry({ group: 'Ideas', filter: 'Q2', badge: 'Kit', color: Q2.storm, title: `Sources → ${s.name}`, detail: s.reliability, to: '/research/toolkit#sources' }, s.whoExamples.join(' ')));
  }
  for (const r of RELIABILITY) {
    out.push(entry({ group: 'Ideas', filter: 'Q2', badge: 'Kit', color: Q2.storm, title: `Reliability → ${r.label}`, detail: r.ask, to: '/research/toolkit#reliability' }, r.model));
  }
  for (const c of RESEARCH_DESIGN_CHECK) {
    out.push(entry({ group: 'Ideas', filter: 'Q2', badge: '2(a)', color: Q2.night, title: `Where to look → ${c.question}`, detail: c.weaknessIf, to: '/research/toolkit#design-check' }, c.strengthIf));
  }
  for (const c of TESTING_CUES) {
    out.push(entry({ group: 'Ideas', filter: 'Q2', badge: '2(b)', color: Q2.sage, title: `Testing a claim → ${c.title}`, detail: c.ask, to: '/research/toolkit#testing' }, c.example));
  }
  for (const t of EVALUATE_TRAPS) {
    out.push(entry({ group: 'Ideas', filter: 'Q2', badge: '2(a)', color: Q2.night, title: `2(a) trap → ${t.title}`, detail: t.quote, to: '/research/evaluate#traps' }, t.after));
  }
  for (const t of DESIGN_TRAPS) {
    out.push(entry({ group: 'Ideas', filter: 'Q2', badge: '2(b)', color: Q2.sage, title: `2(b) trap → ${t.title}`, detail: t.quote, to: '/research/design#traps' }, t.after));
  }

  for (const g of GLOSSARY) {
    out.push(entry({ group: 'Glossary', filter: 'Glossary', badge: 'Term', color: Q2.olive, title: g.term, detail: g.meaning, to: '/research/toolkit#glossary' }));
  }

  for (const b of BANK) {
    const badge = b.kind === 'reworded' ? b.parent.split('-')[0] : 'Mirror';
    out.push(entry({ group: 'Practice papers', filter: 'Practice', badge, color: Q2.sea, title: b.title, detail: `${b.topic} · claim: “${b.claim.text}”`, to: `/research/practice/${b.id}` }, `${b.source.paragraphs.join(' ')} ${b.features.map((f) => f.label).join(' ')}`));
  }

  cache = out;
  return out;
}

const GROUP_ORDER: SearchGroup[] = ['Pages & sections', 'Ideas', 'Glossary', 'Practice papers'];

/**
 * Every word of the query must appear. Title hits rank above body hits;
 * results come back grouped in a fixed order.
 */
export function search(query: string, filter: SearchFilter | 'all', limit = 40): { group: SearchGroup; hits: SearchEntry[] }[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const pool = buildIndex().filter((e) => filter === 'all' || e.filter === filter);
  const scored = words.length === 0
    ? pool.filter((e) => e.group === 'Pages & sections' && !e.title.includes('→')).map((e) => ({ e, s: 0 }))
    : pool
      .filter((e) => words.every((w) => e.hay.includes(w)))
      .map((e) => {
        const t = e.title.toLowerCase();
        let s = 0;
        for (const w of words) s += t.includes(w) ? (t.startsWith(w) || t.includes(` ${w}`) || t.includes(`→ ${w}`) ? 3 : 2) : 1;
        return { e, s };
      })
      .sort((a, b) => b.s - a.s);
  const top = scored.slice(0, limit).map((x) => x.e);
  return GROUP_ORDER.map((group) => ({ group, hits: top.filter((e) => e.group === group) })).filter((g) => g.hits.length > 0);
}
