import type { Q1BankItem } from '../../types';

export const M26_12_Q1_MIRROR_B: Q1BankItem = {
  id: 'q1m-m26-12-b',
  kind: 'mirror',
  parent: 'M26-12',
  title: 'Leaving the village',
  topic: 'Changing communities',
  source1: {
    paragraphs: [
      'Across the world, young people are leaving the countryside. In 1960 about two-thirds of the world’s people lived in rural areas. By 2020 it was fewer than half. It has fallen steadily.',
    ],
    list: {
      title: 'Why young people leave villages',
      items: ['few jobs apart from farming', 'no secondary school or college nearby', 'poor internet and transport', 'low farm incomes', 'wanting a more exciting life', 'family already living in the city'],
    },
  },
  source2: {
    paragraphs: [
      'Villages Alive is a not-for-profit organisation working in rural communities. Every village loses its future when its young people go. Farming cannot survive without new generations, and it keeps whole countries fed.',
      'We think it is unjust that growing up in a village should mean fewer chances in life. Working with local councils and farmers’ groups, we bring fast internet, training courses and small business loans to rural areas. Our projects show that young people will stay if they can build a good life at home.',
      'Please support our village enterprise fund.',
    ],
    attribution: 'Extract from the Villages Alive annual report',
  },
  q1a: {
    stem: 'Using Source 1, identify the trend in the share of the world’s people living in rural areas.',
    answer: 'It has fallen steadily',
    accept: ['Falling', 'Decreasing', 'Going down'],
    distractors: [
      { text: 'Fewer than half', why: 'That is the 2020 figure, not the trend.' },
      { text: 'About two-thirds', why: 'That is the 1960 figure.' },
      { text: 'Few jobs apart from farming', why: 'That is a reason for leaving, not the trend.' },
      { text: 'It has risen', why: 'The share went down, from two-thirds to fewer than half.' },
    ],
  },
  statements: [
    { source: 2, quote: 'Every village loses its future when its young people go', type: 'Generalisation', signal: 'Every village',
      why: '"Every village" makes it true everywhere.' },
    { source: 2, quote: 'young people will stay if they can build a good life at home', type: 'Generalisation', signal: 'young people will stay',
      why: 'It assumes all young people would decide the same way.' },
    { source: 2, quote: 'We think it is unjust that growing up in a village should mean fewer chances in life', type: 'Value', signal: 'unjust',
      why: 'A belief about fairness.' },
    { source: 2, quote: 'Farming cannot survive without new generations', type: 'Claim', signal: 'cannot survive',
      why: 'Stated as certain with no evidence.' },
    { source: 2, quote: 'it keeps whole countries fed', type: 'Claim', signal: 'keeps whole countries fed',
      why: 'Put forward as true without figures.' },
    { source: 1, quote: 'In 1960 about two-thirds of the world’s people lived in rural areas', type: 'Fact', signal: 'two-thirds',
      why: 'A dated figure that can be checked.' },
    { source: 2, quote: 'Please support our village enterprise fund', type: 'Vested interest', signal: 'support our',
      why: 'The organisation wants funding, so it may present the problem strongly.' },
  ],
  q1b: {
    type: 'Generalisation',
    explain: '“Every village loses its future when its young people go” is a generalisation because it says this happens to every village, when some villages grow or change in other ways.',
    oneMark: 'It is a generalisation because it says “every”.',
  },
  q1c: {
    holder: 'the organisation',
    on: 'on young people leaving villages',
    level: 'NATIONAL',
    points: [
      { element: 'issues', quote: 'Every village loses its future when its young people go', point: 'The issue is young people leaving villages.' },
      { element: 'consequences', quote: 'Farming cannot survive without new generations', point: 'Farming, and the food supply, are at risk.' },
      { element: 'values', quote: 'We think it is unjust that growing up in a village should mean fewer chances in life', point: 'They believe rural young people deserve equal chances.' },
      { element: 'causes', quote: 'growing up in a village should mean fewer chances in life', point: 'Villages offer fewer chances, which drives young people away.' },
      { element: 'actions', quote: 'we bring fast internet, training courses and small business loans to rural areas', point: 'They bring internet, training and loans to villages.' },
      { element: 'actions', quote: 'Please support our village enterprise fund', point: 'They ask for support for their fund.' },
    ],
    model: 'Villages Alive believes that “every village loses its future when its young people go”. The issue is young people leaving the countryside. They see the cause as villages offering “fewer chances in life”, which they think is “unjust”. The consequences are serious: “farming cannot survive without new generations”, and farming “keeps whole countries fed”. Their actions, with local councils and farmers’ groups, are to “bring fast internet, training courses and small business loans to rural areas”. They believe young people “will stay if they can build a good life at home”.',
  },
  voices: [
    { who: 'A 19-year-old who moved to the city', quote: 'I miss my family, but there was no work for me back home.', level: 'PERSONAL', why: 'His own move.' },
    { who: 'A village head', quote: 'Our village school has closed because there are only eleven children left.', level: 'LOCAL', why: 'One village.' },
    { who: 'An agriculture minister', quote: 'Young farmers across the country will get free land for their first five years.', level: 'NATIONAL', why: 'A national scheme.' },
    { who: 'A UN food official', quote: 'The average farmer worldwide is now over 55 years old.', level: 'GLOBAL', why: 'Farmers worldwide.' },
  ],
  q1d: {
    focus: 'reason for leaving villages',
    lead: 'Source 1 suggests reasons why young people leave villages.',
    options: [
      { label: 'Few jobs apart from farming', source: 1, quote: 'few jobs apart from farming', test: 'crowd',
        why: 'Almost every young person in a village faces this.' },
      { label: 'No secondary school or college nearby', source: 1, quote: 'no secondary school or college nearby', test: 'fair',
        why: 'Rural young people lose the education city children take for granted.' },
      { label: 'Low farm incomes', source: 1, quote: 'low farm incomes', test: 'domino',
        why: 'Poor incomes leave families unable to invest, so farms decline further.' },
      { label: 'Poor internet and transport', source: 1, quote: 'poor internet and transport', test: 'stuck',
        why: 'Without infrastructure, a village stays cut off for years.' },
      { label: 'Wanting a more exciting life', source: 1, quote: 'wanting a more exciting life', test: 'hurt',
        why: 'Young people feel trapped and unhappy.' },
    ],
    model: 'I think the most significant reason is that there are “few jobs apart from farming”, because it affects almost every young person in a village. Without work, young people cannot earn a living or start a family at home, so leaving becomes a necessity, not a choice. Villages Alive’s own response supports this: they offer “training courses and small business loans” to create jobs. Wanting a more exciting life is also a reason, but it is a choice some people make. Lack of jobs forces people out. So few jobs is the most significant reason.',
    levelUp: {
      base: 'Jobs are the main reason because young people need work.',
      right: 'Explain why it forces people out (no income, no future at home), use Source 2 (they offer “small business loans” to create jobs), and compare with wanting an exciting life, which is a choice.',
      wrong: [
        { text: 'Add that the rural share fell from two-thirds to under half.', why: 'A trend figure, not a reason this cause matters most.' },
        { text: 'Say that villages are boring.', why: 'An opinion with no support.' },
        { text: 'List all six reasons.', why: 'Listing is not judging.' },
      ],
    },
  },
};
