import type { Q1BankItem } from '../../types';

export const J26_13_Q1_MIRROR_A: Q1BankItem = {
  id: 'q1m-j26-13-a',
  kind: 'mirror',
  parent: 'J26-13',
  title: 'Learning music',
  topic: 'Tradition, culture and identity',
  source1: {
    paragraphs: [
      'According to a 2023 report by the International Music Education Council, families around the world spent $42 billion on music lessons and instruments in 2022. Online lessons have made learning cheaper, and the number of adults taking up an instrument has grown by 15 per cent.',
    ],
    list: {
      title: 'Benefits of learning music',
      items: ['memory and concentration', 'confidence on stage', 'teamwork in bands and choirs', 'a way to relax', 'understanding other cultures', 'careers in music'],
    },
  },
  source2: {
    paragraphs: [
      'Music changes lives! The World Music Foundation (WMF) is an international charity that brings music to children who could never afford lessons. We believe music is a language that everyone can share.',
      'In 2021 we started SoundStart after noticing how many schools had cut music to save money. We depend on donations, and we work with schools, local councils and musicians to give free lessons and instruments to children in poor areas. Our programmes have raised children’s maths scores. They have kept teenagers out of trouble.',
    ],
    attribution: 'Extract from the World Music Foundation’s newsletter',
  },
  q1a: {
    stem: 'According to Source 1, how much did families around the world spend on music lessons and instruments in 2022?',
    answer: '$42 billion',
    accept: ['42 billion dollars'],
    distractors: [
      { text: '15 per cent', why: 'That is the growth in adults taking up an instrument.' },
      { text: '42 billion', why: 'Units needed: $ or dollars.' },
      { text: '$42 million', why: 'The source says billion, a thousand times more.' },
      { text: 'Less, because of online lessons', why: 'Source 1 says lessons got cheaper, but the question asks how much was spent.' },
    ],
  },
  statements: [
    { source: 2, quote: 'Our programmes have raised children’s maths scores', type: 'Claim', signal: 'have raised',
      why: 'A result claimed with no figures.' },
    { source: 2, quote: 'They have kept teenagers out of trouble', type: 'Claim', signal: 'have kept',
      why: 'A result stated as true without evidence.' },
    { source: 2, quote: 'We believe music is a language that everyone can share', type: 'Opinion', signal: 'We believe',
      why: '"We believe" shows a view.' },
    { source: 2, quote: 'Music changes lives!', type: 'Generalisation', signal: 'changes lives',
      why: 'A sweeping statement said to be always true.' },
    { source: 2, quote: 'We depend on donations', type: 'Vested interest', signal: 'depend on donations',
      why: 'Needing donations gives the charity a reason to present its work positively.' },
    { source: 1, quote: 'families around the world spent $42 billion on music lessons and instruments in 2022', type: 'Fact', signal: '$42 billion',
      why: 'A dated figure from a named report.' },
    { source: 2, quote: 'how many schools had cut music to save money', type: 'Claim', signal: 'how many schools',
      why: 'No number of schools is given.' },
  ],
  q1b: {
    type: 'Claim',
    explain: '“Our programmes have raised children’s maths scores” is a claim because the charity states it as true, but gives no scores or comparison to prove it. It could be checked, but the source does not check it.',
    oneMark: 'It is a claim because there is no evidence.',
  },
  q1c: {
    holder: 'the charity',
    on: 'on learning music',
    level: 'GLOBAL',
    points: [
      { element: 'issues', quote: 'children who could never afford lessons', point: 'The issue is children who cannot afford music lessons.' },
      { element: 'causes', quote: 'schools had cut music to save money', point: 'Schools cutting music to save money.' },
      { element: 'values', quote: 'We believe music is a language that everyone can share', point: 'They believe music belongs to everyone.' },
      { element: 'actions', quote: 'In 2021 we started SoundStart', point: 'They started the SoundStart programme.' },
      { element: 'actions', quote: 'give free lessons and instruments to children in poor areas', point: 'They give free lessons and instruments.' },
      { element: 'consequences', quote: 'Our programmes have raised children’s maths scores', point: 'Children’s maths scores have risen.' },
      { element: 'consequences', quote: 'They have kept teenagers out of trouble', point: 'Teenagers stay out of trouble.' },
    ],
    model: 'The World Music Foundation believes “music changes lives” and that it is “a language that everyone can share”. The issue is “children who could never afford lessons”. The cause is that schools “had cut music to save money”. Their action was to start SoundStart in 2021, working with schools, councils and musicians to “give free lessons and instruments to children in poor areas”. They say the consequences have been good: the programmes “have raised children’s maths scores” and “kept teenagers out of trouble”. They depend on donations.',
  },
  voices: [
    { who: 'A 13-year-old violinist', quote: 'Before SoundStart I had never touched an instrument. Now I play in the school orchestra.', level: 'PERSONAL', why: 'Her own experience.' },
    { who: 'A school head of music', quote: 'Our school’s steel band now plays at every town festival.', level: 'LOCAL', why: 'One school and town.' },
    { who: 'An education minister', quote: 'Music will be compulsory in all primary schools across the country.', level: 'NATIONAL', why: 'A national rule.' },
    { who: 'A UNESCO culture adviser', quote: 'Music education helps protect cultural traditions in every part of the world.', level: 'GLOBAL', why: 'The whole world.' },
  ],
  q1d: {
    focus: 'benefit of learning music',
    lead: 'Sources 1 and 2 suggest benefits of learning music.',
    options: [
      { label: 'Memory and concentration', source: 1, quote: 'memory and concentration', test: 'domino',
        why: 'Better concentration improves learning in every subject.' },
      { label: 'Confidence on stage', source: 1, quote: 'confidence on stage', test: 'stuck',
        why: 'Confidence built young lasts into adult life.' },
      { label: 'Teamwork', source: 1, quote: 'teamwork in bands and choirs', test: 'crowd',
        why: 'Whole groups learn to work together.' },
      { label: 'Keeping teenagers out of trouble', source: 2, quote: 'kept teenagers out of trouble', test: 'hurt',
        why: 'Trouble with the law can damage a young person’s whole future.' },
      { label: 'A way to relax', source: 1, quote: 'a way to relax', test: 'hurt',
        why: 'Stress harms health and well-being.' },
    ],
    model: 'I think memory and concentration is the most significant benefit, because it helps in every other subject. A student who concentrates better learns more in maths, science and languages, so the benefit spreads across all their schooling. The charity’s claim that its programmes “raised children’s maths scores” supports this. Confidence on stage is also valuable, and it lasts. But not every student will perform, while every student needs to concentrate in every lesson. So memory and concentration is the most significant benefit.',
    levelUp: {
      base: 'Concentration is the best benefit because it helps you focus.',
      right: 'Explain the knock-on effect (better learning in every subject), use Source 2 (“raised children’s maths scores”), and compare with confidence on stage, which not every student needs.',
      wrong: [
        { text: 'Add the $42 billion spending figure.', why: 'Spending does not justify this benefit.' },
        { text: 'Describe SoundStart.', why: 'That is 1(c) material.' },
        { text: 'Say that music is enjoyable.', why: 'An opinion, with no support.' },
      ],
    },
  },
};
