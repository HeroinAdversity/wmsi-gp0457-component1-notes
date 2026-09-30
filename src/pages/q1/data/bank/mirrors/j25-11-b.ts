import type { Q1BankItem } from '../../types';

export const J25_11_Q1_MIRROR_B: Q1BankItem = {
  id: 'q1m-j25-11-b',
  kind: 'mirror',
  parent: 'J25-11',
  title: 'Endangered languages',
  topic: 'Tradition, culture and identity',
  source1: {
    paragraphs: [
      'About 7,000 languages are spoken in the world today, but around 40 per cent of them are endangered. A language usually dies when children stop learning it at home.',
      'Communities are finding new ways to keep their languages alive. Much of this work is done by volunteers, often older speakers teaching younger people.',
    ],
    list: {
      title: 'Ways communities protect their languages',
      items: ['teaching the language in local schools', 'recording older speakers telling stories', 'creating language-learning apps', 'using the language on signs and radio'],
    },
  },
  source2: {
    paragraphs: [
      'When a language dies, a whole way of seeing the world dies with it. Songs, medicines, farming knowledge and family history are lost for ever.',
      'Every two weeks, somewhere in the world, the last speaker of a language passes away. If nothing changes, half of today’s languages will have disappeared by 2100.',
      'Big languages like English are pushing small ones aside. Young people will stop speaking their grandparents’ language unless schools value it. We believe every language deserves respect. Support our recording projects and help us save these voices before it is too late.',
    ],
    attribution: 'Adapted from the website of an international language heritage network',
  },
  q1a: {
    stem: 'According to Source 1, what percentage of the world’s languages are endangered?',
    answer: '40 per cent',
    accept: ['Around 40 per cent', '40%'],
    distractors: [
      { text: '7,000', why: 'That is the number of languages spoken, not the percentage endangered.' },
      { text: 'Half', why: 'That is Source 2’s prediction for 2100, not today’s figure.' },
      { text: '40', why: 'Include “per cent”, or the number means nothing here.' },
      { text: 'When children stop learning it at home', why: 'That is how a language dies, not the percentage.' },
    ],
  },
  statements: [
    { source: 2, quote: 'If nothing changes, half of today’s languages will have disappeared by 2100', type: 'Prediction', signal: 'will have disappeared',
      why: 'It says what will happen by a future date.' },
    { source: 2, quote: 'Young people will stop speaking their grandparents’ language unless schools value it', type: 'Prediction', signal: 'will stop',
      why: 'A forecast of what young people will do if schools do not act.' },
    { source: 2, quote: 'We believe every language deserves respect', type: 'Value', signal: 'deserves respect',
      why: 'It states what the network thinks is right and important.' },
    { source: 2, quote: 'When a language dies, a whole way of seeing the world dies with it', type: 'Generalisation', signal: 'When a language dies',
      why: 'It says this happens with every language, every time.' },
    { source: 2, quote: 'Big languages like English are pushing small ones aside', type: 'Claim', signal: 'pushing small ones aside',
      why: 'A cause stated as true without evidence.' },
    { source: 1, quote: 'About 7,000 languages are spoken in the world today', type: 'Fact', signal: '7,000',
      why: 'A figure that can be checked.' },
    { source: 2, quote: 'Support our recording projects', type: 'Vested interest', signal: 'Support our',
      why: 'The network wants support, so it has a reason to stress how urgent the problem is.' },
  ],
  q1b: {
    type: 'Prediction',
    explain: '“If nothing changes, half of today’s languages will have disappeared by 2100” is a prediction because it states what will happen at a future date. It cannot be proved until 2100.',
    oneMark: 'It is a prediction because it is about the future.',
  },
  q1c: {
    holder: 'the writer',
    on: '',
    level: 'GLOBAL',
    points: [
      { element: 'issues', quote: 'the last speaker of a language passes away', point: 'The issue is languages dying out around the world.' },
      { element: 'causes', quote: 'Big languages like English are pushing small ones aside', point: 'Big world languages push small ones out.' },
      { element: 'consequences', quote: 'Songs, medicines, farming knowledge and family history are lost for ever', point: 'Knowledge and culture are lost for ever.' },
      { element: 'consequences', quote: 'half of today’s languages will have disappeared by 2100', point: 'Half of all languages could vanish.' },
      { element: 'values', quote: 'We believe every language deserves respect', point: 'They believe every language deserves respect.' },
      { element: 'actions', quote: 'Support our recording projects', point: 'They record speakers and ask for support.' },
    ],
    model: 'The network believes that “every language deserves respect”. The issue is languages dying: “every two weeks” the last speaker of a language dies. They blame big languages like English, which are “pushing small ones aside”. The consequences are serious, because “songs, medicines, farming knowledge and family history are lost for ever”, and they predict that half of today’s languages “will have disappeared by 2100”. Their action is running recording projects, and they ask readers to “support” these projects “before it is too late”.',
  },
  voices: [
    { who: 'A grandmother who speaks Semai', quote: 'My grandchildren answer me in Malay. I worry my stories will die with me.', level: 'PERSONAL', why: 'Her own family.' },
    { who: 'A village school teacher', quote: 'Our school now teaches one lesson a day in the local language.', level: 'LOCAL', why: 'One village school.' },
    { who: 'A national culture minister', quote: 'All ten of our country’s indigenous languages will be taught in state schools.', level: 'NATIONAL', why: 'A national policy.' },
    { who: 'A UNESCO official', quote: 'The world loses a language every few weeks, and with it a library of knowledge.', level: 'GLOBAL', why: 'The whole world.' },
  ],
  q1d: {
    focus: 'threat to languages',
    lead: 'Sources 1 and 2 suggest threats to languages.',
    options: [
      { label: 'Children not learning it at home', source: 1, quote: 'children stop learning it at home', test: 'stuck',
        why: 'Once a generation stops speaking it, it is almost impossible to bring back.' },
      { label: 'Big languages pushing small ones aside', source: 2, quote: 'Big languages like English are pushing small ones aside', test: 'crowd',
        why: 'It affects thousands of small languages in every country at once.' },
      { label: 'Schools not valuing it', source: 2, quote: 'unless schools value it', test: 'domino',
        why: 'If school ignores a language, children see it as useless and stop using it at home too.' },
      { label: 'Older speakers dying', source: 2, quote: 'the last speaker of a language passes away', test: 'hurt',
        why: 'With the last speaker, a whole community loses its link to its past.' },
    ],
    model: 'I think the most significant threat is children no longer learning the language at home. Source 1 says this is how “a language usually dies”. Once one generation stops speaking it, there is nobody to pass it on to, so the damage is almost impossible to undo. Big languages like English pushing small ones aside is also a serious threat, and it affects many languages. But that pressure only kills a language if families give up using it at home. So children not learning it at home is the most significant threat.',
    levelUp: {
      base: 'Children not learning it is the biggest threat because then nobody speaks it.',
      right: 'Quote Source 1 (“a language usually dies when children stop learning it at home”), explain why the damage cannot be undone, and compare with pressure from big languages, which only works if families give up.',
      wrong: [
        { text: 'Add the figure of 7,000 languages.', why: 'The number does not show why this threat matters most.' },
        { text: 'Describe the language apps in Source 1.', why: 'Apps are a solution, not a reason this threat is most significant.' },
        { text: 'Say that all the threats are equally bad.', why: 'The question needs one choice, clearly justified.' },
      ],
    },
  },
};
