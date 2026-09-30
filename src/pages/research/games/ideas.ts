import type { ClaimPart, Feature } from '../data/types';

/**
 * The ideas a round reports on. 2(a) features are sorted into one of nine
 * research-design ideas; 2(b) questions report on the kind of claim part.
 */
export const IDEAS = {
  aim: 'Clear aim',
  sample: 'Sample and who was asked',
  expertise: 'Expertise and experience',
  setting: 'Setting and honest answers',
  bias: 'Bias and vested interest',
  ethics: 'Ethics and privacy',
  records: 'Accurate records and measurement',
  methods: 'Methods and triangulation',
  conclusion: 'Conclusion fits the data',
  'part-what': 'What is measured',
  'part-change': 'Change over time',
  'part-comparison': 'Comparisons',
  'part-scope': 'Scope words',
  'part-group': 'The group',
  'part-cause': 'Cause and effect',
} as const;

export type IdeaId = keyof typeof IDEAS;

// Checked in order: the first rule that matches wins.
const RULES: [IdeaId, RegExp][] = [
  ['ethics', /ethic|permission|consent|confidential|anonym|privacy/],
  ['bias', /vested|bias|tamper|relative|knows participants|supervis|forewarned|leading|personal interest|manager control|owner chose/],
  ['conclusion', /conclu|generalis|over-claim|unsupported|cause not|beyond the data|success only|satisfaction is not|happiness is not|anecdotal/],
  ['methods', /second type|triangul|secondary \+ primary|two samples compared|before-and-after|comparison group/],
  ['aim', /\baims?\b|purpose|research question|questions unknown|method fits|relevant question/],
  ['setting', /setting|noisy|noise|interrupt|observer|distract|rushed|busy|quiet|timing|pressure|language|workplace|socially desirable|away from/],
  ['sample', /sample|representative|respon|typical|diverse|stakeholder|random|residents not|only \w+ (users )?asked|one (local |small )?(company|café|school|firm|shop|family|sector|group|event|march|festival|project)|only one|narrow|wrong experts|age not checked/],
  ['expertise', /experience|expert|knowledge|inexperienc|first-hand|testimony|cannot measure|may not know|directly involved|work with/],
  ['records', /record|systematic|measur|estimate|incomplete|comparable|structured|missing|notes|wrote answers|translation|questionnaire|open questions|validity/],
  ['methods', /method|peer|out of date|further research|time taken|two weeks|over time|background|cited|source|two things changed|field|observation|controlled|order effect|invented|stated vs actual/],
];

export function featureIdea(f: Feature): IdeaId {
  const hay = `${f.label} ${f.chain.what}`.toLowerCase();
  for (const [id, re] of RULES) if (re.test(hay)) return id;
  return 'methods';
}

export function partIdea(p: ClaimPart): IdeaId {
  return `part-${p.label.toLowerCase()}` as IdeaId;
}
