import type { Q1BankItem } from '../../types';

export const M26_12_Q1_REWORDED: Q1BankItem = {
  id: 'q1r-m26-12',
  kind: 'reworded',
  parent: 'M26-12',
  title: 'Moving to cities',
  topic: 'Migration and urbanisation',
  source1: {
    paragraphs: [
      'Our world is being shaped by migration and the growth of cities. Large numbers of people are relocating to urban areas, and the United Nations expects 68 per cent of people worldwide to live in cities by 2050.',
      'The share of the world’s people living in cities went from about a third in 1960 to over half in 2020. It has risen steadily.',
    ],
    list: {
      title: 'Why people move to cities',
      items: ['more job opportunities', 'better health services', 'the chance of a better education', 'more culture and leisure', 'more networking and social contacts', 'better infrastructure and technology', 'easier travel', 'better living conditions'],
    },
  },
  source2: {
    paragraphs: [
      'According to the International Organization for Migration (IOM), there are about 272 million international migrants. Migration links all of us, so countries must cooperate instead of only looking after their own interests. That is why we set up the Global Migration and Urbanisation Initiative (GMUI), a not-for-profit group supporting sustainable development in cities that migration has changed.',
      'In our view it is wrong for people to fall into poverty when they move to cities full of opportunity. Alongside governments and local communities, we run programmes that improve infrastructure, encourage cooperation and give migrants in cities the basic services they need. GMUI proves that action can turn urbanisation into a force for good. Please give your money and time to cut poverty in cities and make migrants’ lives better.',
    ],
    attribution: 'Extract from the mission statement of a not-for-profit organisation',
  },
  q1a: {
    stem: 'Using Source 1, identify the trend in the share of the world’s people living in cities.',
    answer: 'It has risen steadily',
    accept: ['Increasing', 'Rising', 'Going up'],
    distractors: [
      { text: '68 per cent', why: 'That is a prediction for 2050, not the trend.' },
      { text: 'About a third', why: 'That is one point in 1960. A trend describes the direction of change.' },
      { text: 'More job opportunities', why: 'That is a reason for moving, not the trend.' },
      { text: 'It has stayed about the same', why: 'Source 1 says it rose from a third to over half.' },
    ],
  },
  statements: [
    { source: 2, quote: 'Migration links all of us', type: 'Generalisation', signal: 'all of us',
      why: '"All of us" applies it to every person, without evidence.' },
    { source: 2, quote: 'GMUI proves that action can turn urbanisation into a force for good', type: 'Claim', signal: 'proves',
      why: 'It says it "proves" something, but no results are shown.' },
    { source: 2, quote: 'In our view it is wrong for people to fall into poverty', type: 'Value', signal: 'wrong',
      why: 'A moral belief about what is right.' },
    { source: 2, quote: 'cities full of opportunity', type: 'Generalisation', signal: 'full of opportunity',
      why: 'It treats every city as full of opportunity, which is not true for everyone.' },
    { source: 2, quote: 'there are about 272 million international migrants', type: 'Fact', signal: '272 million',
      why: 'A figure from a named organisation, so it can be checked.' },
    { source: 1, quote: 'the United Nations expects 68 per cent of people worldwide to live in cities by 2050', type: 'Prediction', signal: 'by 2050',
      why: 'A forecast about the future.' },
    { source: 2, quote: 'Please give your money and time', type: 'Vested interest', signal: 'give your money',
      why: 'The group asks for donations, so it has a reason to present its work in the best light.' },
  ],
  q1b: {
    type: 'Generalisation',
    explain: '“Migration links all of us” is a generalisation because it says migration affects every single person, with no evidence. It takes something true for some people and applies it to everyone.',
    oneMark: 'It is a generalisation because it says “all”.',
  },
  q1c: {
    holder: 'the organisation',
    on: 'on migrants living in cities',
    level: 'GLOBAL',
    points: [
      { element: 'issues', quote: 'fall into poverty when they move to cities', point: 'The issue is migrants falling into poverty in cities.' },
      { element: 'values', quote: 'countries must cooperate instead of only looking after their own interests', point: 'They value international cooperation over national self-interest.' },
      { element: 'values', quote: 'In our view it is wrong for people to fall into poverty', point: 'They believe it is wrong for migrants to live in poverty.' },
      { element: 'causes', quote: 'Migration links all of us', point: 'Migration connects countries, which is why cooperation is needed.' },
      { element: 'actions', quote: 'we run programmes that improve infrastructure', point: 'They run programmes on infrastructure and basic services.' },
      { element: 'actions', quote: 'Please give your money and time', point: 'They ask for donations and volunteers.' },
      { element: 'consequences', quote: 'turn urbanisation into a force for good', point: 'Action can make city growth a positive force.' },
    ],
    model: 'The GMUI is a not-for-profit group with a global perspective. The issue is migrants who “fall into poverty when they move to cities”. They think this is wrong, and they value cooperation: “countries must cooperate instead of only looking after their own interests”. They believe migration “links all of us”, and they give the figure of 272 million international migrants. Their actions are programmes that “improve infrastructure” and give migrants “basic services”. They also ask for “money and time”. They believe the consequence of action is that urbanisation becomes “a force for good”.',
  },
  voices: [
    { who: 'A young man who moved from a village', quote: 'I came to the city for work. I share one room with five others.', level: 'PERSONAL', why: 'His own move and living conditions.' },
    { who: 'A city councillor', quote: 'Our city will build 2,000 low-cost flats near the new train line.', level: 'LOCAL', why: 'One city’s housing plan.' },
    { who: 'A government planning minister', quote: 'We will build three new cities so the capital does not become overcrowded.', level: 'NATIONAL', why: 'A national plan.' },
    { who: 'A UN migration official', quote: 'Countries must share responsibility for the millions who cross borders each year.', level: 'GLOBAL', why: 'Migration between countries worldwide.' },
  ],
  q1d: {
    focus: 'reason for moving to cities',
    lead: 'Source 1 suggests reasons for moving to cities.',
    options: [
      { label: 'More job opportunities', source: 1, quote: 'more job opportunities', test: 'domino',
        why: 'A job brings income, which pays for housing, food, health care and school fees.' },
      { label: 'Better health services', source: 1, quote: 'better health services', test: 'hurt',
        why: 'Access to doctors and hospitals can be life or death.' },
      { label: 'The chance of a better education', source: 1, quote: 'the chance of a better education', test: 'stuck',
        why: 'Education changes a family’s future for generations.' },
      { label: 'Better living conditions', source: 1, quote: 'better living conditions', test: 'crowd',
        why: 'Clean water and housing affect every member of a household.' },
    ],
    model: 'I think more job opportunities is the most significant reason for moving to cities, because most of the other benefits depend on it. With a job, a family earns an income that pays for “better living conditions”, health care and education. Without work, migrants can “fall into poverty”, as Source 2 warns, even in a city full of services. Better health services are also important, because they can save lives. However, many health services cost money, so migrants usually need a job first to use them. Because a job opens the door to everything else, it is the most significant reason.',
    levelUp: {
      base: 'Jobs are the most significant reason because people need money.',
      right: 'Explain the chain (a job pays for housing, health and education), use Source 2’s warning about poverty, then compare with health services, which often need an income first.',
      wrong: [
        { text: 'Add that 68 per cent of people will live in cities by 2050.', why: 'A true figure, but it does not explain why jobs matter most.' },
        { text: 'Describe the GMUI programmes.', why: 'That is 1(c) material, not a justification for this choice.' },
        { text: 'Add “Everyone knows that jobs are important.”', why: 'An assertion, not support or comparison.' },
      ],
    },
  },
};
