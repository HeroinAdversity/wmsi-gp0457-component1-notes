import type { QuizQuestion } from './toolkit';
import type { PartId } from './types';

export const PART_STYLE: Record<PartId, { bg: string; underline: string; label: string }> = {
  1: { bg: 'bg-[color:var(--color-q2-storm)]', underline: 'shadow-[inset_0_-3px_0_var(--color-q2-storm)]', label: '1' },
  2: { bg: 'bg-[color:var(--color-q2-sage)]', underline: 'shadow-[inset_0_-3px_0_var(--color-q2-sage)]', label: '2' },
  3: { bg: 'bg-[color:var(--color-q2-olive)]', underline: 'shadow-[inset_0_-3px_0_var(--color-q2-olive)]', label: '3' },
};

export const DESIGN_TRAPS = [
  { id: 'assert', title: 'Naming methods without reasons', source: 'Principal Examiner Report · June 2026',
    quote: 'Some candidates simply asserted some methods and sources without explanation.',
    before: 'I would use a survey, an interview and the internet.',
    after: 'I would survey drivers in five regions, because victims across the country can tell me whether they have experienced vehicle crime more recently.' },
  { id: 'half-claim', title: 'Testing only part of the claim', source: 'Principal Examiner Report · June 2026',
    quote: 'This included both aspects of the claim – vehicle crime and increasing nationally.',
    before: 'I would interview a police officer about vehicle crime.',
    after: 'I would analyse ten years of national police figures, which tests both the amount of crime and whether it is increasing across the country.' },
  { id: 'argue', title: 'Arguing the issue', source: 'Principal Examiner Report · June 2026',
    quote: 'Some candidates discussed the issue of crime in general and gave reasons for and against trying to prevent vehicle crime.',
    before: 'Vehicle crime is increasing because cars are easier to steal.',
    after: 'Design the test. Whether the claim is true is what your research will find out.' },
  { id: 'critique', title: 'Critiquing your own methods', source: 'Teacher guidance, checked against Table D',
    quote: 'Table D rewards methods and evidence clearly related to testing the claim — not their limitations.',
    before: 'Interviews could be biased, however they are useful.',
    after: 'Interviews with insurance managers give a second count of crime, because victims claim even when they do not report to police.' },
  { id: 'vague-who', title: 'A vague "who"', source: 'Principal Examiner Report · June 2026',
    quote: 'Discussions and consultations with experts on patterns of vehicle crime, for example with the police, government authorities and university researchers.',
    before: 'I would ask people.',
    after: 'I would interview a criminology researcher at a university and a police data analyst.' },
];

export const DESIGN_LEVELS = [
  { level: 1 as const, marks: '1–2', descriptor: 'Limited: methods or evidence listed, not connected to the claim.',
    answer: 'I would do a survey and look on the internet.', why: 'Two methods named; no evidence, no link to the claim.' },
  { level: 2 as const, marks: '3–4', descriptor: 'Partly justified: methods and/or evidence mostly described.',
    answer: 'I would survey people about vehicle crime, interview a police officer and search the internet for statistics. This would tell me about vehicle crime.',
    why: 'Methods and one evidence type, but "national" and "increasing" are not addressed.' },
  { level: 3 as const, marks: '5–6', descriptor: 'Justified: a range of methods and evidence explained, mostly related to the claim.',
    answer: 'I would look at national police statistics for the last ten years, because these show whether the number of vehicle crimes is rising across the country. I would also interview an insurance manager, because victims claim even if they do not report to police. A survey of drivers would show how many people have been victims recently.',
    why: 'Three methods with reasons; the survey’s scope and evidence type are unclear; no comparison.' },
  { level: 4 as const, marks: '7–8', descriptor: 'Fully justified: a wide range of methods and evidence, clearly related to testing the claim.',
    answer: 'First I would analyse official police statistics on vehicle theft for the last ten years. This secondary, quantitative data covers the whole country over time, so it tests directly whether vehicle crime is increasing nationally. Second, I would interview claims managers at two national insurance companies and ask for yearly claim numbers by region, because some crimes are never reported to police but victims still claim, giving a second count. Third, I would run an online survey of drivers in five regions asking whether they had been victims this year and three years ago; this primary data shows whether experiences are changing in different parts of the country. Finally, I would compare all three: if police figures, insurance claims and survey results all rise, the claim is well supported.',
    why: 'Four developed rows, each naming evidence, covering what/change/scope, plus triangulation.' },
];

export const DESIGN_CHECKLIST = [
  'I split the claim into its parts before planning.',
  'I have at least 3 fully explained methods (4 is safer).',
  'Each method says WHO I would get it from and HOW.',
  'Each method says WHAT I would find out and the evidence type.',
  'Each method says WHY it tests a part of the claim — every part is covered.',
  'I finished by comparing the results, and I did not argue the issue or critique my methods.',
];

export const SPLIT_QUIZ: QuizQuestion[] = [
  { id: 'c1', prompt: '"Sharing profits makes people work harder." What kind of claim is it?', options: ['A trend over time', 'Cause and effect', 'A national amount', 'A single fact'], answer: 1, why: 'It says one thing causes another — you need a comparison of workers with and without profit sharing.' },
  { id: 'c2', prompt: '"Families mostly migrate to cities to get jobs." Which word sets the scope you must test?', options: ['Families', 'mostly', 'cities', 'jobs'], answer: 1, why: '"Mostly" means more than half — you need a large sample to count reasons.' },
  { id: 'c3', prompt: '"Many schools recycle waste food." What must your evidence show?', options: ['Why schools recycle', 'How many schools recycle', 'That recycling is good', 'Food prices'], answer: 1, why: '"Many" is about numbers of schools.' },
  { id: 'c4', prompt: '"Participating in sports improves academic performance." Best core method?', options: ['One interview', 'Compare grades of students who do and do not play sport', 'Internet opinions', 'Observe a match'], answer: 1, why: 'Cause-effect needs a comparison between groups.' },
  { id: 'c5', prompt: '"Social media affects the opinions of young people more than older people." What must be compared?', options: ['Two age groups', 'Two countries', 'Two apps', 'Two years'], answer: 0, why: 'It is a comparison between age groups.' },
  { id: 'c6', prompt: '"Some people still enjoy going to local shops." Which part needs qualitative evidence?', options: ['Some people', 'still', 'enjoy', 'local shops'], answer: 2, why: 'Enjoyment is a feeling — interviews or open survey questions.' },
];
