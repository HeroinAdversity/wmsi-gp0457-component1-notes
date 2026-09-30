import type { Q1BankItem } from '../../types';

export const J26_13_Q1_MIRROR_B: Q1BankItem = {
  id: 'q1m-j26-13-b',
  kind: 'mirror',
  parent: 'J26-13',
  title: 'Reading for pleasure',
  topic: 'Education for all',
  source1: {
    paragraphs: [
      'A 2023 survey by the Global Publishers Forum found that people worldwide spent $18 billion on children’s books in 2022. At the same time, the share of teenagers who say they read for pleasure every week has fallen by 20 per cent in ten years.',
    ],
    list: {
      title: 'Benefits of reading for pleasure',
      items: ['a wider vocabulary', 'better writing', 'empathy for other people', 'lower stress', 'better results across subjects', 'a lifelong habit of learning'],
    },
  },
  source2: {
    paragraphs: [
      'A book can open any door! ReadWorld is an international charity that puts books into the hands of children who have none. We believe every child deserves a library.',
      'We launched BookBox in 2020, when school closures left millions of children without books at home. We rely on donations and work with teachers, libraries and parents to set up small reading corners in villages and city estates. Our reading corners have turned reluctant children into keen readers. They have improved exam results in the schools we work with.',
    ],
    attribution: 'Extract from ReadWorld’s annual newsletter',
  },
  q1a: {
    stem: 'According to Source 1, how much did people worldwide spend on children’s books in 2022?',
    answer: '$18 billion',
    accept: ['18 billion dollars'],
    distractors: [
      { text: '20 per cent', why: 'That is the fall in teenagers reading for pleasure.' },
      { text: '18 billion', why: 'Units needed: $ or dollars.' },
      { text: 'Ten years', why: 'That is the time period of the fall.' },
      { text: '$18 million', why: 'The source says billion.' },
    ],
  },
  statements: [
    { source: 2, quote: 'Our reading corners have turned reluctant children into keen readers', type: 'Claim', signal: 'have turned',
      why: 'A result stated with no evidence.' },
    { source: 2, quote: 'They have improved exam results in the schools we work with', type: 'Claim', signal: 'have improved',
      why: 'No results are shown to prove it.' },
    { source: 2, quote: 'We believe every child deserves a library', type: 'Value', signal: 'deserves',
      why: 'A belief about what is right.' },
    { source: 2, quote: 'A book can open any door!', type: 'Generalisation', signal: 'any door',
      why: '"Any door" is a sweeping exaggeration.' },
    { source: 2, quote: 'We rely on donations', type: 'Vested interest', signal: 'rely on donations',
      why: 'Needing donations gives the charity a reason to present its work positively.' },
    { source: 1, quote: 'people worldwide spent $18 billion on children’s books in 2022', type: 'Fact', signal: '$18 billion',
      why: 'A dated figure from a named survey.' },
    { source: 2, quote: 'school closures left millions of children without books at home', type: 'Claim', signal: 'millions',
      why: 'No source is given for the number.' },
  ],
  q1b: {
    type: 'Claim',
    explain: '“Our reading corners have turned reluctant children into keen readers” is a claim because ReadWorld states it as true, but gives no evidence, such as reading surveys, to show it happened.',
    oneMark: 'It is a claim because it may not be true.',
  },
  q1c: {
    holder: 'the charity',
    on: 'on reading',
    level: 'GLOBAL',
    points: [
      { element: 'issues', quote: 'children who have none', point: 'The issue is children with no books.' },
      { element: 'causes', quote: 'school closures left millions of children without books at home', point: 'School closures left children without books.' },
      { element: 'values', quote: 'We believe every child deserves a library', point: 'They believe every child deserves books.' },
      { element: 'actions', quote: 'We launched BookBox in 2020', point: 'They launched BookBox.' },
      { element: 'actions', quote: 'set up small reading corners in villages and city estates', point: 'They set up reading corners.' },
      { element: 'consequences', quote: 'turned reluctant children into keen readers', point: 'Reluctant children become keen readers.' },
      { element: 'consequences', quote: 'They have improved exam results', point: 'Exam results have improved.' },
    ],
    model: 'ReadWorld believes “a book can open any door” and that “every child deserves a library”. The issue is children who have no books. The cause they point to is that “school closures left millions of children without books at home”. Their action was to launch BookBox in 2020, working with teachers, libraries and parents to “set up small reading corners in villages and city estates”. They say the consequences have been good: reluctant children became “keen readers”, and exam results improved. They rely on donations.',
  },
  voices: [
    { who: 'A 12-year-old boy', quote: 'I read my first whole book last month. It was about football.', level: 'PERSONAL', why: 'His own reading.' },
    { who: 'A town librarian', quote: 'Our library’s Saturday story club now has a waiting list.', level: 'LOCAL', why: 'One town library.' },
    { who: 'An education minister', quote: 'Every primary school in the country will receive 500 new books.', level: 'NATIONAL', why: 'A national programme.' },
    { who: 'A UNESCO literacy expert', quote: 'Around 250 million children worldwide cannot read a simple sentence.', level: 'GLOBAL', why: 'Children worldwide.' },
  ],
  q1d: {
    focus: 'benefit of reading for pleasure',
    lead: 'Sources 1 and 2 suggest benefits of reading for pleasure.',
    options: [
      { label: 'A lifelong habit of learning', source: 1, quote: 'a lifelong habit of learning', test: 'stuck',
        why: 'A habit formed young lasts for life.' },
      { label: 'Better results across subjects', source: 1, quote: 'better results across subjects', test: 'domino',
        why: 'Better results open doors to further study and jobs.' },
      { label: 'Empathy for other people', source: 1, quote: 'empathy for other people', test: 'fair',
        why: 'Understanding others leads to fairer treatment of them.' },
      { label: 'Lower stress', source: 1, quote: 'lower stress', test: 'hurt',
        why: 'Stress damages health and happiness.' },
      { label: 'A wider vocabulary', source: 1, quote: 'a wider vocabulary', test: 'crowd',
        why: 'It helps every reader in every subject.' },
    ],
    model: 'I think a lifelong habit of learning is the most significant benefit, because it lasts the longest. A child who enjoys reading keeps reading as an adult, so they keep learning long after school ends. This matters because Source 1 shows the share of teenagers reading for pleasure “has fallen by 20 per cent”. Once the habit is lost, it is hard to rebuild. Better results across subjects is also important. But results matter mainly while you are at school, while the reading habit helps for a whole lifetime. So a lifelong habit of learning is the most significant benefit.',
    levelUp: {
      base: 'A reading habit is the best benefit because reading is good.',
      right: 'Explain why it lasts (people keep learning for life), use Source 1 (reading for pleasure “has fallen by 20 per cent”), and compare with better results, which matter mainly at school.',
      wrong: [
        { text: 'Add the $18 billion spending figure.', why: 'Spending does not justify this benefit.' },
        { text: 'Describe the reading corners.', why: 'That is 1(c) material.' },
        { text: 'Say that everyone should read more.', why: 'A call to action, not a justification.' },
      ],
    },
  },
};
