import type { Q1BankItem } from '../../types';

export const J26_13_Q1_REWORDED: Q1BankItem = {
  id: 'q1r-j26-13',
  kind: 'reworded',
  parent: 'J26-13',
  title: 'Sport and society',
  topic: 'Sport and recreation',
  source1: {
    paragraphs: [
      'Recent worldwide figures from the International Sports Statistics Association (ISSA) show that sport helps to shape societies and improve well-being. In 2022, global spending on sports activities hit a record $1.5 trillion, which shows how important sport is around the world. Women’s involvement in sport has also grown by 10 per cent, as players, as fans and as workers in the sports industry.',
    ],
    list: {
      title: 'Benefits of taking part in sport',
      items: ['physical health', 'mental well-being', 'skills and teamwork', 'confidence and empowerment', 'better school results', 'career opportunities'],
    },
  },
  source2: {
    paragraphs: [
      'Never underestimate what sport can do! At the Global Sports Organisation (GSO) we work across borders to develop and promote sport and activity. We believe sport helps people understand each other’s societies and cultures.',
      'In 2022 we launched PlayConnectRise to tackle the lasting effects of the Covid-19 pandemic, such as poor fitness, loneliness and insecurity. We rely on donations, and we work with local governments, charities and communities to build sports programmes for everyone that last. Our programmes focus on inclusion and have brought minority groups into sport. They have improved local people’s health.',
    ],
    attribution: 'Extract from the Global Sports Organisation’s newsletter',
  },
  q1a: {
    stem: 'According to Source 1, how much was spent worldwide on sports activities in 2022?',
    answer: '$1.5 trillion',
    accept: ['1.5 trillion dollars'],
    distractors: [
      { text: '10 per cent', why: 'That is the growth in women’s involvement, not spending.' },
      { text: '1.5 trillion', why: 'Units needed: $ or dollars.' },
      { text: 'A record amount', why: 'Too vague. The question asks how much.' },
      { text: '$1.5 billion', why: 'Wrong unit: the source says trillion, a thousand times more.' },
    ],
  },
  statements: [
    { source: 2, quote: 'Our programmes focus on inclusion and have brought minority groups into sport', type: 'Claim', signal: 'have brought',
      why: 'Stated as a success, with no figures to show it.' },
    { source: 2, quote: 'They have improved local people’s health', type: 'Claim', signal: 'have improved',
      why: 'A result is claimed but not measured.' },
    { source: 2, quote: 'We believe sport helps people understand each other’s societies and cultures', type: 'Opinion', signal: 'We believe',
      why: '"We believe" shows a view, not a proven fact.' },
    { source: 2, quote: 'Never underestimate what sport can do!', type: 'Opinion', signal: 'Never underestimate',
      why: 'A strong personal judgement.' },
    { source: 2, quote: 'We rely on donations', type: 'Vested interest', signal: 'rely on donations',
      why: 'Because they need donations, they have a reason to present their work positively.' },
    { source: 1, quote: 'global spending on sports activities hit a record $1.5 trillion', type: 'Fact', signal: '$1.5 trillion',
      why: 'A dated figure from a named body that can be checked.' },
    { source: 1, quote: 'which shows how important sport is around the world', type: 'Claim', signal: 'shows',
      why: 'Spending is taken to prove importance. That is a claim, not a fact.' },
  ],
  q1b: {
    type: 'Claim',
    explain: '“Our programmes focus on inclusion and have brought minority groups into sport” is a claim because it is stated as true, but no evidence such as numbers of people is given. It could be checked, but the source does not check it.',
    oneMark: 'It is a claim because it might not be true.',
  },
  q1c: {
    holder: 'the organisation',
    on: 'on sports',
    level: 'GLOBAL',
    points: [
      { element: 'issues', quote: 'the lasting effects of the Covid-19 pandemic', point: 'The issue is the lasting damage from the pandemic.' },
      { element: 'causes', quote: 'poor fitness, loneliness and insecurity', point: 'The pandemic left poor fitness, loneliness and insecurity.' },
      { element: 'values', quote: 'We believe sport helps people understand each other’s societies and cultures', point: 'They value cultural understanding through sport.' },
      { element: 'values', quote: 'Our programmes focus on inclusion', point: 'They value inclusion of minority groups.' },
      { element: 'actions', quote: 'In 2022 we launched PlayConnectRise', point: 'They launched PlayConnectRise.' },
      { element: 'actions', quote: 'we work with local governments, charities and communities', point: 'They work with governments, charities and communities.' },
      { element: 'consequences', quote: 'They have improved local people’s health', point: 'Local people’s health has improved.' },
    ],
    model: 'The GSO is an international group that believes you should “never underestimate what sport can do”. The issue is “the lasting effects of the Covid-19 pandemic”, such as “poor fitness, loneliness and insecurity”. They value understanding between cultures and inclusion, and their programmes “focus on inclusion”. Their action was to launch PlayConnectRise, working “with local governments, charities and communities”. They say the consequences have been good: minority groups have been brought into sport, and the programmes “have improved local people’s health”.',
  },
  voices: [
    { who: 'A teenager who joined a football club', quote: 'After lockdown I had no friends at school. The team changed that.', level: 'PERSONAL', why: 'His own experience.' },
    { who: 'A town sports centre manager', quote: 'Our free Saturday sessions now bring 300 children to the centre every week.', level: 'LOCAL', why: 'One town’s centre.' },
    { who: 'A national sports minister', quote: 'Every school in the country must offer two hours of PE a week.', level: 'NATIONAL', why: 'A national rule.' },
    { who: 'An Olympic committee spokesperson', quote: 'Sport brings together athletes from over 200 nations in peace.', level: 'GLOBAL', why: 'Nations worldwide.' },
  ],
  q1d: {
    focus: 'benefit of taking part in sport',
    lead: 'Sources 1 and 2 suggest benefits of taking part in sport.',
    options: [
      { label: 'Mental well-being', source: 1, quote: 'mental well-being', test: 'hurt',
        why: 'Loneliness and anxiety can badly damage a person’s life, as the pandemic showed.' },
      { label: 'Physical health', source: 1, quote: 'physical health', test: 'domino',
        why: 'Good health lowers disease, which cuts health costs and time off school or work.' },
      { label: 'Confidence and empowerment', source: 1, quote: 'confidence and empowerment', test: 'fair',
        why: 'It helps groups who are often left out, such as women and minorities, to take part equally.' },
      { label: 'Skills and teamwork', source: 1, quote: 'skills and teamwork', test: 'stuck',
        why: 'Teamwork skills last a lifetime and carry into every job.' },
      { label: 'Career opportunities', source: 1, quote: 'career opportunities', test: 'crowd',
        why: 'A $1.5 trillion industry employs huge numbers of people.' },
    ],
    model: 'I think mental well-being is the most significant benefit, because poor mental health can damage every part of someone’s life. Source 2 describes the “loneliness and insecurity” left by the pandemic, and sport tackles this directly by bringing people together. Physical health is also important, because it cuts disease. However, a person can be physically fit and still be isolated and unhappy, and that affects their schooling, work and relationships. Sport treats a problem that many people were left with after Covid-19, so mental well-being is the most significant benefit.',
    levelUp: {
      base: 'Mental well-being matters most because it helps people feel happy.',
      right: 'Link it to Source 2 (“loneliness and insecurity” after the pandemic), explain the wider damage poor mental health causes, and compare it with physical health.',
      wrong: [
        { text: 'Add the $1.5 trillion spending figure.', why: 'Spending is not linked to why well-being matters most.' },
        { text: 'Describe PlayConnectRise.', why: 'That is 1(c) material, not justification.' },
        { text: 'List all six benefits and say sport is good for everyone.', why: 'This avoids making a judgement.' },
      ],
    },
  },
};
