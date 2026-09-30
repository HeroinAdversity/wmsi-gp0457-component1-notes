/**
 * One map of the whole site. The header dropdowns, the phone menu, the footer
 * site map, the Question 2 section bar and the search index all read from here,
 * so a new page or tab only needs adding once.
 */

export interface Branch { label: string; to: string }

export interface SitePage {
  /** Short badge shown before the title, e.g. "1(b)" or "2(a)". */
  badge: string;
  /** CSS colour for the badge. */
  color: string;
  title: string;
  /** One line under the title in menus, e.g. "Name the type of statement · 3 marks". */
  blurb: string;
  /** Meta line in the dropdown pane. */
  meta: string;
  to: string;
  /** What this part tests; shown in the dropdown pane and indexed by search. */
  tests: string[];
  /** Tabs or sub-pages, linked from the dropdown pane and indexed by search. */
  branches: Branch[];
}

export interface SiteGroup {
  id: 'q1' | 'q2';
  label: string;
  /** Path prefixes that count as "inside" this group, for the active state. */
  match: (pathname: string, hash: string) => boolean;
  pages: SitePage[];
  foot: Branch;
}

const inWeigh = (hash: string) => hash === '#weigh' || hash.startsWith('#weigh-');

export const Q1_GROUP: SiteGroup = {
  id: 'q1',
  label: 'Perspectives · Q1',
  match: (p) => ['/source-recall', '/statements', '/perspectives'].some((x) => p.startsWith(x)),
  foot: { label: 'Question 1 revision sheets →', to: '/revision' },
  pages: [
    {
      badge: '1(a)', color: 'var(--color-violet)', title: 'First Read', to: '/source-recall',
      blurb: 'Find information in Source 1 · 1 mark', meta: 'Paper 1 · Q1(a) · 1 mark · ~2 min',
      tests: ['Locating a detail in Source 1', 'Copying only what the question asks', 'Spotting distractor details', 'Answering in two lines'],
      branches: [
        { label: 'Overview', to: '/source-recall#overview' },
        { label: 'Anatomy', to: '/source-recall#anatomy' },
        { label: 'Traps', to: '/source-recall#traps' },
        { label: 'Worked examples', to: '/source-recall#worked' },
        { label: 'Practice', to: '/source-recall#practice' },
        { label: 'Checklist', to: '/source-recall#checklist' },
      ],
    },
    {
      badge: '1(b)', color: 'var(--color-cobalt)', title: 'Statements', to: '/statements',
      blurb: 'Name the type of statement · 3 marks', meta: 'Paper 1 · Q1(b) · 3 marks · ~4 min',
      tests: ['Eight statement types (fact, opinion, prediction…)', 'Fact vs claim vs generalisation', 'Pointing to the signal word', 'Bias and vested interest'],
      branches: [
        { label: 'Overview', to: '/statements#overview' },
        { label: 'The Eight Terms', to: '/statements#terms' },
        { label: 'Sort & Classify', to: '/statements#sort' },
        { label: 'Generalisation Drill', to: '/statements#drill' },
        { label: 'Mixed Arena', to: '/statements#arena' },
        { label: 'Exit Check', to: '/statements#exit' },
        { label: 'Mind map', to: '/statements/mindmap' },
        { label: 'Claim vs evidence', to: '/statements/claim-vs-evidence' },
        { label: 'Find your gap', to: '/statements/diagnostic' },
        { label: 'Intensive', to: '/statements/intensive' },
      ],
    },
    {
      badge: '1(c)', color: 'var(--color-amber)', title: 'Perspectives', to: '/perspectives',
      blurb: 'Describe a perspective · 6 marks', meta: 'Paper 1 · Q1(c) · 6 marks · ~7 min',
      tests: ['Four levels: global, national, local, personal', 'Five elements: issues, values, causes, consequences, actions', 'Anchoring every point to the source', 'Command word: describe'],
      branches: [
        { label: 'Overview', to: '/perspectives#overview' },
        { label: 'Framework', to: '/perspectives#framework' },
        { label: 'Case study', to: '/perspectives#case' },
        { label: 'Classify & explain', to: '/perspectives#practice' },
        { label: 'Exam practice', to: '/perspectives#examprep' },
        { label: 'Your turn', to: '/perspectives#yourturn' },
        { label: 'Checklist', to: '/perspectives#checklist' },
      ],
    },
    {
      badge: '1(d)', color: 'var(--color-forest)', title: 'Significance', to: '/perspectives#weigh',
      blurb: 'Judge the most significant · 8 marks', meta: 'Paper 1 · Q1(d) · 8 marks · ~10 min',
      tests: ['Five tests: crowd, hurt, fair, domino, stuck', 'Backing a choice with source detail', 'Comparing against an alternative (Level 4)', 'Four disguises of the same question'],
      branches: [
        { label: 'Overview', to: '/perspectives#weigh' },
        { label: 'Toolkit', to: '/perspectives#weigh-toolkit' },
        { label: 'Model answer', to: '/perspectives#weigh-model' },
        { label: 'Level up', to: '/perspectives#weigh-levelup' },
        { label: 'Practice', to: '/perspectives#weigh-practice' },
        { label: 'Journal', to: '/perspectives#weigh-journal' },
      ],
    },
  ],
};

export const Q2_GROUP: SiteGroup = {
  id: 'q2',
  label: 'Research · Q2',
  match: (p) => p.startsWith('/research') || p === '/revision/research',
  foot: { label: 'Research hub →', to: '/research' },
  pages: [
    {
      badge: 'Q2', color: 'var(--color-q2-storm)', title: 'Research hub', to: '/research',
      blurb: 'Map of skills · where they pay again', meta: 'Paper 1 · Q2 · 16 marks',
      tests: ['How 2(a) and 2(b) link to Q3', 'Links to the Individual Report (Table E)', 'Links to the Team Project (Table A)', 'Your path through Question 2'],
      branches: [{ label: 'Skills map', to: '/research' }],
    },
    {
      badge: 'Kit', color: 'var(--color-q2-storm)', title: 'The Toolkit', to: '/research/toolkit',
      blurb: 'Methods, sources, reliability, glossary', meta: 'Used in 2(a), 2(b), Q3, Report, Project',
      tests: ['Eight research methods and the data they give', 'Five sources of information', 'Reliability checklist (Q3)', 'Primary / secondary, quantitative / qualitative'],
      branches: [
        { label: 'Methods', to: '/research/toolkit#methods' },
        { label: 'Sources', to: '/research/toolkit#sources' },
        { label: 'Reliability (Q3)', to: '/research/toolkit#reliability' },
        { label: 'Research-design check', to: '/research/toolkit#design-check' },
        { label: 'Testing a claim', to: '/research/toolkit#testing' },
        { label: 'Glossary', to: '/research/toolkit#glossary' },
        { label: 'Quiz', to: '/research/toolkit#quiz' },
      ],
    },
    {
      badge: '2(a)', color: 'var(--color-q2-night)', title: 'Strong or Shaky?', to: '/research/evaluate',
      blurb: 'Evaluate research · 8 marks', meta: 'Paper 1 · Q2(a) · 8 marks · Table C · ~10 min',
      tests: ['Spotting strengths and weaknesses in Source 3', 'The three-step chain: what → effect → aim', 'Judging only what the source did', 'Covering both sides for Level 4'],
      branches: [
        { label: 'Overview', to: '/research/evaluate#overview' },
        { label: 'The move', to: '/research/evaluate#move' },
        { label: 'Traps', to: '/research/evaluate#traps' },
        { label: 'Worked examples', to: '/research/evaluate#worked' },
        { label: 'Practice', to: '/research/evaluate#practice' },
        { label: 'Checklist', to: '/research/evaluate#checklist' },
      ],
    },
    {
      badge: '2(b)', color: 'var(--color-q2-sage)', title: 'The Test Bench', to: '/research/design',
      blurb: 'Design research · 8 marks', meta: 'Paper 1 · Q2(b) · 8 marks · Table D · ~10 min',
      tests: ['Splitting a claim into parts', 'Who · How · What · Why for each method', 'Naming the evidence type', 'A compare line (triangulation)'],
      branches: [
        { label: 'Overview', to: '/research/design#overview' },
        { label: 'Split the claim', to: '/research/design#split' },
        { label: 'The matrix', to: '/research/design#matrix' },
        { label: 'Traps', to: '/research/design#traps' },
        { label: 'Worked examples', to: '/research/design#worked' },
        { label: 'Practice', to: '/research/design#practice' },
        { label: 'Checklist', to: '/research/design#checklist' },
      ],
    },
    {
      badge: '33', color: 'var(--color-q2-sea)', title: 'Practice bank', to: '/research/practice',
      blurb: '33 Source 3s with answer schemes', meta: '11 reworded past papers · 22 mirror papers',
      tests: ['Full 2(a) + 2(b) on a fresh Source 3', 'Answer scheme after you write', 'Print any paper as a mock', 'Filter by topic or session'],
      branches: [{ label: 'All papers', to: '/research/practice' }],
    },
    {
      badge: 'Play', color: 'var(--color-q2-olive)', title: 'Practice games', to: '/research/games',
      blurb: 'Quick drills, fresh questions each round', meta: '5–10 questions a round · scores go to My learning',
      tests: ['2(a): Chain order, Missing link, Fix it, Spot it', '2(b): Claim splitter, Method match, What’s untested?', 'Questions drawn from all 33 papers', 'Weakest skill served first'],
      branches: [
        { label: 'Game hub', to: '/research/games' },
        { label: 'Chain order', to: '/research/games/chain-order' },
        { label: 'Missing link', to: '/research/games/missing-link' },
        { label: 'Fix it', to: '/research/games/fix-it' },
        { label: 'Spot it', to: '/research/games/spot-it' },
        { label: 'Claim splitter', to: '/research/games/claim-splitter' },
        { label: 'Method match', to: '/research/games/method-match' },
        { label: 'What’s untested?', to: '/research/games/untested' },
        { label: 'Daily mixed round', to: '/research/games/mixed' },
      ],
    },
    {
      badge: 'A4', color: 'var(--color-ink-3)', title: 'Revision sheet', to: '/revision/research',
      blurb: 'Two printable A4 pages', meta: 'Print from the sheet',
      tests: ['2(a) chain and where to look', '2(b) matrix with a worked row', 'Methods, sources, reliability', 'Traps for both parts'],
      branches: [{ label: 'Open sheet', to: '/revision/research' }],
    },
  ],
};

export const GROUPS = [Q1_GROUP, Q2_GROUP];

/** Plain top-level links that sit either side of the two dropdowns. */
export const PLAIN_LINKS: { to: string; label: string; end?: boolean }[] = [
  { to: '/revision', label: 'Revision sheets', end: true },
  { to: '/my-learning', label: 'My learning' },
  { to: '/teachers', label: 'Teachers' },
];

/** The footer site map. */
export const FOOTER_MAP: { heading: string; links: (Branch & { sub?: boolean })[] }[] = [
  {
    heading: 'Perspectives · Question 1',
    links: [
      { label: '1(a) First Read', to: '/source-recall' },
      { label: '1(b) Statements', to: '/statements' },
      { label: 'Mind map', to: '/statements/mindmap', sub: true },
      { label: 'Claim vs evidence', to: '/statements/claim-vs-evidence', sub: true },
      { label: 'Find your gap', to: '/statements/diagnostic', sub: true },
      { label: '1(c) Perspectives', to: '/perspectives' },
      { label: '1(d) Significance', to: '/perspectives#weigh' },
    ],
  },
  { heading: 'Question 2 · Research', links: Q2_GROUP.pages.filter((p) => p.to !== '/revision/research').map((p) => ({ label: p.title, to: p.to })) },
  {
    heading: 'Revision sheets',
    links: [
      { label: 'Statement Types', to: '/revision/statements' },
      { label: 'Perspectives', to: '/revision/perspectives' },
      { label: 'Significance', to: '/revision/significance' },
      { label: 'Research', to: '/revision/research' },
    ],
  },
  { heading: 'Your work', links: [{ label: 'My learning', to: '/my-learning' }] },
  {
    heading: 'Teachers',
    links: [
      { label: 'Teacher hub', to: '/teachers' },
      { label: 'Class tracker', to: '/teachers/tracker' },
      { label: 'Leaderboard', to: '/teachers/tracker#leaderboard' },
    ],
  },
];

/** Order of the Question 2 section bar and its previous/next cards. */
export const Q2_SEQUENCE: { to: string; label: string; short: string }[] = [
  { to: '/research', label: 'Research hub', short: 'Hub' },
  { to: '/research/toolkit', label: 'The Toolkit', short: 'Toolkit' },
  { to: '/research/evaluate', label: 'Strong or Shaky? · 2(a)', short: '2(a) Strong or Shaky?' },
  { to: '/research/design', label: 'The Test Bench · 2(b)', short: '2(b) The Test Bench' },
  { to: '/research/practice', label: 'Practice bank', short: 'Practice bank' },
  { to: '/research/games', label: 'Practice games', short: 'Games' },
  { to: '/revision/research', label: 'Revision sheet', short: 'Revise' },
];

/** Which Q2 section a path belongs to (longest matching prefix). */
export function q2Index(pathname: string): number {
  let best = -1;
  let len = -1;
  Q2_SEQUENCE.forEach((s, i) => {
    const hit = s.to === '/research' ? pathname === '/research' : pathname === s.to || pathname.startsWith(`${s.to}/`);
    if (hit && s.to.length > len) { best = i; len = s.to.length; }
  });
  return best;
}

/** The page in a group the reader is on (longest path match; Significance wins on #weigh hashes). */
export function currentPage(g: SiteGroup, pathname: string, hash: string): SitePage | undefined {
  let best: SitePage | undefined;
  let len = -1;
  for (const p of g.pages) {
    const [path, h] = p.to.split('#');
    const pathHit = path === '/research' ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);
    if (!pathHit) continue;
    if (path === '/perspectives' && (h === 'weigh') !== inWeigh(hash)) continue;
    if (path.length > len) { best = p; len = path.length; }
  }
  return best;
}

/** Order of the Question 1 section bar and its previous/next cards. */
export const Q1_SEQUENCE: { to: string; label: string; short: string }[] = [
  { to: '/source-recall', label: 'First Read · 1(a)', short: '1(a) First Read' },
  { to: '/statements', label: 'Statements · 1(b)', short: '1(b) Statements' },
  { to: '/perspectives', label: 'Perspectives · 1(c)', short: '1(c) Perspectives' },
  { to: '/perspectives#weigh', label: 'Significance · 1(d)', short: '1(d) Significance' },
  { to: '/revision/statements', label: 'Revision sheets', short: 'Revise' },
];

const Q1_REVISION = ['/revision/statements', '/revision/perspectives', '/revision/significance'];

/** Which Q1 section a path belongs to. 1(c) and 1(d) share a page and differ by hash. */
export function q1Index(pathname: string, hash: string): number {
  if (pathname === '/source-recall') return 0;
  if (pathname === '/statements' || pathname.startsWith('/statements/')) return 1;
  if (pathname === '/perspectives') return inWeigh(hash) ? 3 : 2;
  if (Q1_REVISION.includes(pathname)) return 4;
  return -1;
}
