import type { EvidenceTag } from './types';

export interface Method { id: string; name: string; what: string; data: string; tags: EvidenceTag[]; pros: string[]; cons: string[]; useIn2b: string }
export interface InfoSource { id: string; name: string; reliability: string; accessibility: string; breadthDepth: string; whoExamples: string[] }
export interface CheckItem { id: string; question: string; strengthIf: string; weaknessIf: string }
export interface QuizQuestion { id: string; prompt: string; options: string[]; answer: number; why: string }

export const METHODS: Method[] = [
  { id: 'survey', name: 'Survey / questionnaire', what: 'The same set of questions given to many people, on paper or online.', data: 'Mostly numbers (how many said yes, ratings), plus short written answers.', tags: ['quantitative', 'primary'],
    pros: ['Reaches a large sample quickly and cheaply.', 'Answers can be counted and compared between groups.'],
    cons: ['People may not answer honestly or may misunderstand questions.', 'Little depth — you learn what, not why.'],
    useIn2b: 'Use when the claim is about "many", "most" or a comparison between groups.' },
  { id: 'interview', name: 'Interview', what: 'A conversation with one person, asking open questions.', data: 'Detailed opinions, reasons and experiences (words).', tags: ['qualitative', 'primary'],
    pros: ['Depth: you can ask follow-up questions.', 'Experts or people with experience can explain why.'],
    cons: ['Small sample, so hard to generalise.', 'The interviewee may be biased or have a vested interest.'],
    useIn2b: 'Use to explain why something happens, or to get expert knowledge.' },
  { id: 'observation', name: 'Observation', what: 'Watching and recording what people actually do.', data: 'Counts of behaviour (tallies) and notes on what was seen.', tags: ['quantitative', 'qualitative', 'primary'],
    pros: ['Shows real behaviour, not what people say they do.', 'Can be repeated at different times or places.'],
    cons: ['People may act differently if they know they are watched.', 'Takes time; only covers the places observed.'],
    useIn2b: 'Use when the claim is about what people do (e.g. "many schools recycle food").' },
  { id: 'experiment', name: 'Experiment', what: 'Changing one thing and measuring the effect, keeping everything else the same.', data: 'Measurements comparing two groups or conditions.', tags: ['quantitative', 'primary'],
    pros: ['Can show cause and effect.', 'Results can be measured precisely.'],
    cons: ['Hard to control everything in real life.', 'May raise ethical issues with people.'],
    useIn2b: 'Use when the claim is about cause and effect (e.g. "sport improves grades").' },
  { id: 'case-study', name: 'Case study', what: 'An in-depth look at one person, place, school or organisation.', data: 'Rich detail from several sources about one case.', tags: ['qualitative', 'primary', 'secondary'],
    pros: ['Very detailed picture of a real example.', 'Shows how things happen in practice.'],
    cons: ['One case may not be typical.', 'Hard to compare with other cases.'],
    useIn2b: 'Use to show a clear real example — pair it with a larger method for scope.' },
  { id: 'secondary', name: 'Secondary data analysis', what: 'Using data someone else collected: official statistics, published studies, reports.', data: 'Large data sets, often national and over many years.', tags: ['quantitative', 'secondary'],
    pros: ['Large, national samples you could not collect yourself.', 'Shows change over time.'],
    cons: ['Collected for a different purpose, so it may not fit your question exactly.', 'May be out of date or from a biased organisation.'],
    useIn2b: 'Use when the claim is national, global, or about a trend ("increasing").' },
  { id: 'internet-media', name: 'Internet & media search', what: 'Searching websites, news and social media for information on the topic.', data: 'Articles, reports, statistics and opinions of mixed quality.', tags: ['qualitative', 'quantitative', 'secondary'],
    pros: ['Fast and easy to access.', 'Shows a wide range of views and recent events.'],
    cons: ['Quality varies — check author, date and purpose.', 'Media may exaggerate or be biased.'],
    useIn2b: 'Use to find what is already known, then check it against reputable sources.' },
  { id: 'mixed', name: 'Mixed methods (triangulation)', what: 'Using two or more methods and comparing what they show.', data: 'Numbers and words that can be checked against each other.', tags: ['quantitative', 'qualitative', 'primary', 'secondary'],
    pros: ['If different methods agree, the conclusion is more reliable.', 'Numbers show what; interviews show why.'],
    cons: ['Takes more time and planning.', 'Results may conflict and need explaining.'],
    useIn2b: 'Always finish 2(b) with one line comparing your methods’ results.' },
];

export const SOURCES: InfoSource[] = [
  { id: 'internet', name: 'The internet', reliability: 'Varies — check who wrote it, when, and why. Anyone can publish.', accessibility: 'Very easy and fast.', breadthDepth: 'Broad coverage; depth depends on the site.', whoExamples: ['Official statistics websites', 'News websites', 'Online databases'] },
  { id: 'experts', name: 'Experts', reliability: 'Usually high — they have knowledge and training — but may have a vested interest.', accessibility: 'Harder: you need to contact and arrange time with them.', breadthDepth: 'Deep knowledge of one area.', whoExamples: ['University researchers', 'Doctors, police officers, economists', 'Charity specialists'] },
  { id: 'published', name: 'Books, articles, research papers', reliability: 'High if peer-reviewed or from a reputable publisher; check the date.', accessibility: 'Libraries and online journals; some are paywalled.', breadthDepth: 'Deep and well evidenced.', whoExamples: ['Academic journals', 'Textbooks', 'Research reports'] },
  { id: 'stakeholders', name: 'Stakeholders', reliability: 'Real experience, but they may be biased towards their own interests.', accessibility: 'Often easy to reach locally.', breadthDepth: 'Depth about their own experience; narrow overall.', whoExamples: ['Workers, customers, residents', 'Victims or users', 'Parents and students'] },
  { id: 'organisations', name: 'Organisations & institutions', reliability: 'High for governments, UN agencies and established charities; watch for campaign bias.', accessibility: 'Reports are often free online.', breadthDepth: 'Broad — national or global data.', whoExamples: ['Government departments', 'The UN, WHO, World Bank', 'NGOs and charities'] },
];

export const RELIABILITY = [
  { id: 'expertise', label: 'Expertise / experience', ask: 'Does this person know about the topic?', model: 'As a police officer, she has direct experience of vehicle crime, so her view is likely to be informed.' },
  { id: 'accuracy', label: 'Accuracy of facts', ask: 'Can the facts be checked?', model: 'The figure is from an official report, so it can be verified.' },
  { id: 'type', label: 'Type of information', ask: 'Is it fact, opinion, prediction or anecdote?', model: 'This is one personal story, so it cannot show a general pattern.' },
  { id: 'logic', label: 'Logic and reasoning', ask: 'Does the conclusion follow from the evidence?', model: 'One theft does not show that crime is rising nationally.' },
  { id: 'evidence', label: 'Use of evidence', ask: 'Is there enough evidence, and is it relevant and recent?', model: 'No data or dates are given, so the claim is weakly supported.' },
  { id: 'bias', label: 'Sources of bias / vested interest', ask: 'Would they gain from people believing this?', model: 'He sells car alarms, so he benefits if people think theft is rising.' },
  { id: 'tone', label: 'Tone', ask: 'Is the language measured or emotive and exaggerated?', model: 'Words like "epidemic" exaggerate, which weakens the argument.' },
  { id: 'lie', label: 'Reason to lie?', ask: 'Could they want to hide or exaggerate something?', model: 'The owner may play down waste to protect the business’s reputation.' },
];

export const RESEARCH_DESIGN_CHECK: CheckItem[] = [
  { id: 'aim', question: 'Is there a clear aim or research question?', strengthIf: 'A clear aim keeps the research focused.', weaknessIf: 'No clear question, so the research may lose focus.' },
  { id: 'who', question: 'Who was asked, and how many?', strengthIf: 'A large or well-chosen sample is more representative.', weaknessIf: 'A small or one-person sample is not representative.' },
  { id: 'expert', question: 'Did the people asked have knowledge or a vested interest?', strengthIf: 'Experienced people give informed answers.', weaknessIf: 'Inexperienced or biased people may give incomplete or slanted answers.' },
  { id: 'setting', question: 'Where and when was it done?', strengthIf: 'A quiet, private setting allows honest, complete answers.', weaknessIf: 'A noisy or public setting may lead to misheard or guarded answers.' },
  { id: 'record', question: 'How was the data recorded?', strengthIf: 'A recording or careful notes keep data accurate.', weaknessIf: 'Memory or rough notes may be inaccurate.' },
  { id: 'ethics', question: 'Was it ethical (permission, confidentiality)?', strengthIf: 'Permission and confidentiality are ethical and encourage honesty.', weaknessIf: 'No consent or privacy may be unethical and discourage honesty.' },
  { id: 'methods', question: 'One method or several? Does the conclusion fit the data?', strengthIf: 'Several methods allow triangulation.', weaknessIf: 'One method, and a conclusion wider than the data supports.' },
];

export const TESTING_PROMPTS = [
  'Is the information from a reputable organisation with research expertise?',
  'Does the source cite where its data comes from, so it can be checked?',
  'Does the person or group have expertise or direct experience?',
  'Does the evidence cover the whole scope of the claim (national? many? over time?)',
  'Can the numbers be compared between groups or years?',
  'Will you compare two methods to check they agree (triangulation)?',
];

export const GLOSSARY = [
  { term: 'Sample', meaning: 'The people or cases you collect data from.' },
  { term: 'Representative', meaning: 'A sample that is like the wider group you want to know about.' },
  { term: 'Reliable', meaning: 'Would give the same results if repeated; trustworthy.' },
  { term: 'Valid', meaning: 'Actually measures what it claims to measure.' },
  { term: 'Primary data', meaning: 'Data you collect yourself.' },
  { term: 'Secondary data', meaning: 'Data someone else collected.' },
  { term: 'Quantitative', meaning: 'Numbers that can be counted or measured.' },
  { term: 'Qualitative', meaning: 'Words, opinions and experiences.' },
  { term: 'Triangulation', meaning: 'Checking a finding with two or more methods or sources.' },
  { term: 'Vested interest', meaning: 'Someone gains if people believe a particular view.' },
  { term: 'Bias', meaning: 'A one-sided view that leaves out or distorts information.' },
  { term: 'Ethics', meaning: 'Doing research fairly: consent, privacy, no harm.' },
  { term: 'Recency', meaning: 'How up to date the information is.' },
  { term: 'Fitness for purpose', meaning: 'Whether the research design suits what it was trying to find out.' },
];

export const METHOD_QUIZ: QuizQuestion[] = [
  { id: 'q1', prompt: 'You want national figures on crime over the last ten years. Best method?', options: ['Interview', 'Secondary data analysis', 'Observation', 'Case study'], answer: 1, why: 'Official statistics give national data over time.' },
  { id: 'q2', prompt: 'You want to know WHY families move to cities. Best method?', options: ['Interview', 'Experiment', 'Secondary data analysis', 'Observation'], answer: 0, why: 'Interviews give reasons and experiences.' },
  { id: 'q3', prompt: 'Which method best shows cause and effect?', options: ['Survey', 'Case study', 'Experiment', 'Internet search'], answer: 2, why: 'An experiment changes one thing and measures the effect.' },
  { id: 'q4', prompt: 'A survey of 500 people mainly gives…', options: ['Qualitative, secondary data', 'Quantitative, primary data', 'Qualitative, primary data', 'Quantitative, secondary data'], answer: 1, why: 'You collect it yourself (primary) and it can be counted (quantitative).' },
  { id: 'q5', prompt: 'You want to see whether schools actually recycle food waste, not just say they do. Best method?', options: ['Observation', 'Interview', 'Survey', 'Internet search'], answer: 0, why: 'Observation shows real behaviour.' },
  { id: 'q6', prompt: 'Checking a finding with two different methods is called…', options: ['Sampling', 'Triangulation', 'Generalisation', 'Recency'], answer: 1, why: 'Triangulation increases confidence in a conclusion.' },
  { id: 'q7', prompt: 'A weakness of a case study is that…', options: ['It has no detail', 'One case may not be typical', 'It is always biased', 'It cannot use interviews'], answer: 1, why: 'One case is not representative.' },
  { id: 'q8', prompt: 'Data from a UN report you read online is…', options: ['Primary', 'Secondary', 'Qualitative only', 'An experiment'], answer: 1, why: 'Someone else collected it.' },
];
