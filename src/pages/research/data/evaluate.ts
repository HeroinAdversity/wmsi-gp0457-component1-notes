import type { QuizQuestion } from './toolkit';

export const EVALUATE_TRAPS = [
  { id: 'one-side', title: 'Only strengths, or only weaknesses', source: 'Principal Examiner Report · June 2026',
    quote: 'Some candidates focused only on strengths or weaknesses of the research and therefore omitted part of the question.',
    before: 'The research is weak because it only used one firm, the manager was new and the café was noisy.',
    after: 'A strength is that the meeting was recorded with permission, so answers were captured accurately… However, only one firm was used, so…' },
  { id: 'list', title: 'A list with no explanation', source: 'Principal Examiner Report · June 2026',
    quote: 'Some candidates listed a very wide range of strengths and weaknesses without explanation.',
    before: 'Small sample. Biased. Noisy. Not recorded.',
    after: 'Only one firm was asked. This means the sample is not representative, so it cannot show how much vehicle crime there is nationally.' },
  { id: 'not-in-source', title: 'Judging methods the source never used', source: 'Principal Examiner Report · June 2026',
    quote: 'Some candidates discussed general strengths and weaknesses of different methods, some of which were not part of the research in the source.',
    before: 'Surveys are good because they reach many people.',
    after: 'The student only used an interview, so there was no way to check the findings against other data (no triangulation).' },
  { id: 'speculate', title: 'Guessing beyond the source', source: 'Principal Examiner Report · June 2026',
    quote: 'Some candidates speculated about potential strengths and weaknesses when there was no evidence or reason in the source to support the evaluation.',
    before: 'The questions were probably leading.',
    after: 'The source does not tell us the questions, so judge only what it does say — for example the noisy setting.' },
  { id: 'topic', title: 'Judging the topic, not the research', source: 'Marking workshop guidance',
    quote: 'Level 1 answers may describe the purpose of the research, describe research methods and/or evidence but do not connect the two.',
    before: 'Vehicle crime is a serious problem in many countries.',
    after: 'Talk about how the research was done — who, how, where, how recorded — and what that does to the evidence.' },
];

export const EVALUATE_LEVELS = [
  { level: 1 as const, marks: '1–2', descriptor: 'Limited evaluation: points asserted, or the research only described.',
    answer: 'The student interviewed a manager at a building firm in a café. It was noisy. The research is not very good.',
    why: 'Describes the research and asserts one weakness with no effect or link to the aim.' },
  { level: 2 as const, marks: '3–4', descriptor: 'Partly evaluative: a range of points, mostly descriptive with little explanation.',
    answer: 'A strength is that the interview was recorded. A weakness is that only one firm was used, the manager was new and the café was noisy, so it is not reliable.',
    why: 'Four points, but only "not reliable" as explanation — no effect on the evidence, no link to the aim.' },
  { level: 3 as const, marks: '5–6', descriptor: 'Mainly evaluative: a range of explained points, mostly supported and related to the purpose.',
    answer: 'The meeting was recorded with permission, so the answers were captured accurately. The confidentiality agreement may have made the manager more honest. However, only one building company was asked, which is not representative, so it cannot show how much vehicle crime there is. The manager had only been there a month, so he may not know the firm’s history of crime.',
    why: 'Four explained points on both sides; most link to the aim; one lacks the aim link.' },
  { level: 4 as const, marks: '7–8', descriptor: 'Consistently evaluative: a wide range of reasoned points, both strengths and weaknesses, clearly related to the purpose.',
    answer: 'The research has a clear aim — how much vehicle crime there is — which keeps the interview focused. Recording the meeting with permission means the manager’s answers were captured exactly, so the evidence about crime at the firm is accurate. The confidentiality agreement is ethical and may have encouraged honest answers about thefts. However, only one local building company was used, so the sample is not representative and cannot show how much vehicle crime there is across the country. The manager had joined only a month earlier, so he may not know whether crime at the firm has risen, which is exactly what the student concluded. Finally, the noisy café may have caused answers to be misheard or guarded, making the evidence less complete. Overall, the student’s national conclusion is not supported by one interview.',
    why: 'Six chains (3 S + 3 W), each with effect + aim link, plus a judgement.' },
];

export const EVALUATE_CHECKLIST = [
  'I wrote about BOTH strengths and weaknesses.',
  'I made about five points (e.g. 3 + 2).',
  'Every point says what the researcher did (from Source 3).',
  'Every point says what that does to the evidence.',
  'Every point links back to what the research was trying to find out.',
  'I only judged things that are actually in the source.',
];

export const SPOT_QUIZ: QuizQuestion[] = [
  { id: 's1', prompt: '"The meeting was recorded with permission."', options: ['Strength', 'Weakness'], answer: 0, why: 'Accurate record + ethical.' },
  { id: 's2', prompt: '"Only one local firm was interviewed."', options: ['Strength', 'Weakness'], answer: 1, why: 'Sample not representative.' },
  { id: 's3', prompt: '"The interviewee had worked there for one month."', options: ['Strength', 'Weakness'], answer: 1, why: 'Limited knowledge.' },
  { id: 's4', prompt: '"200 workers from 10 cooperatives completed questionnaires."', options: ['Strength', 'Weakness'], answer: 0, why: 'Larger sample from several places.' },
  { id: 's5', prompt: '"Managers watched workers fill in the questionnaire."', options: ['Strength', 'Weakness'], answer: 1, why: 'Workers may not answer honestly (vested interest/pressure).' },
  { id: 's6', prompt: '"The student signed a confidentiality agreement."', options: ['Strength', 'Weakness'], answer: 0, why: 'Ethical; encourages honesty.' },
  { id: 's7', prompt: '"The interview took place in a noisy café."', options: ['Strength', 'Weakness'], answer: 1, why: 'Misheard or guarded answers.' },
  { id: 's8', prompt: '"The student compared the interview with official statistics."', options: ['Strength', 'Weakness'], answer: 0, why: 'Triangulation.' },
  { id: 's9', prompt: '"The student did not say what their research question was."', options: ['Strength', 'Weakness'], answer: 1, why: 'Research may lose focus.' },
  { id: 's10', prompt: '"From one theft, the student concluded crime is rising nationally."', options: ['Strength', 'Weakness'], answer: 1, why: 'Conclusion is wider than the data.' },
];
