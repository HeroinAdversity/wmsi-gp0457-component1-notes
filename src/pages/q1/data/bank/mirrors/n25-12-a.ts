import type { Q1BankItem } from '../../types';

export const N25_12_Q1_MIRROR_A: Q1BankItem = {
  id: 'q1m-n25-12-a',
  kind: 'mirror',
  parent: 'N25-12',
  title: 'Food delivery apps',
  topic: 'Digital world',
  source1: {
    paragraphs: [
      'Smartphones have changed the way we eat. In 2022, people around the world spent $150 billion on meals ordered through delivery apps. This is predicted to grow by 40 per cent, reaching $210 billion by 2027, which shows how popular the apps have become.',
    ],
    list: {
      title: 'Advantages of food delivery apps',
      items: ['for customers: food brought to the door, many restaurants in one place, easy payment, tracking the order', 'for restaurants: new customers, no need for more tables, sales late at night, free advertising on the app'],
    },
  },
  source2: {
    paragraphs: [
      'I have run a family restaurant for twenty years. The apps bring us orders, but they also bring many problems. They take up to 30 per cent of the price of every meal, and customers blame us when the rider is late.',
      'Food arrives cold, and we never meet the people who eat it. Riders are paid very little and work long hours in dangerous traffic. In my opinion, the apps care more about profit than about people. It is only fair that the apps pay riders properly and charge restaurants less.',
      'I tell other owners to set up their own ordering website and to keep loyal customers coming through the door.',
    ],
    attribution: 'Adapted from an article by a restaurant owner in a business magazine',
  },
  q1a: {
    stem: 'According to Source 1, by what percentage is spending on delivery apps predicted to grow between 2022 and 2027?',
    answer: '40 per cent',
    accept: ['40%'],
    distractors: [
      { text: '$210 billion', why: 'That is the predicted total in 2027, not the percentage growth.' },
      { text: '30 per cent', why: 'That is how much the apps take from each meal, from Source 2.' },
      { text: '$150 billion', why: 'That is the 2022 figure.' },
      { text: '$60 billion', why: 'That is the growth in dollars. The question asks for the percentage.' },
    ],
  },
  statements: [
    { source: 2, quote: 'In my opinion, the apps care more about profit than about people', type: 'Opinion', signal: 'In my opinion',
      why: '"In my opinion" shows a personal judgement.' },
    { source: 2, quote: 'The apps bring us orders, but they also bring many problems', type: 'Opinion', signal: 'many problems',
      why: 'How many problems count as "many" is the writer’s judgement.' },
    { source: 2, quote: 'It is only fair that the apps pay riders properly and charge restaurants less', type: 'Value', signal: 'only fair',
      why: 'It shows what the writer believes is right.' },
    { source: 2, quote: 'Food arrives cold', type: 'Generalisation', signal: 'Food arrives cold',
      why: 'Said of all deliveries, though much food arrives hot.' },
    { source: 2, quote: 'They take up to 30 per cent of the price of every meal', type: 'Fact', signal: '30 per cent',
      why: 'A figure that can be checked against the apps’ fees.' },
    { source: 1, quote: 'This is predicted to grow by 40 per cent', type: 'Prediction', signal: 'predicted to grow',
      why: 'A forecast for 2027.' },
    { source: 2, quote: 'I have run a family restaurant for twenty years', type: 'Vested interest', signal: 'family restaurant',
      why: 'The writer loses money to the apps, which may colour their view.' },
  ],
  q1b: {
    type: 'Opinion',
    explain: '“In my opinion, the apps care more about profit than about people” is an opinion because it is the writer’s own judgement, shown by “in my opinion”. It cannot be proved true or false.',
    oneMark: 'It is an opinion because it is a personal view.',
  },
  q1c: {
    holder: 'the author',
    on: 'on food delivery apps',
    level: 'PERSONAL',
    points: [
      { element: 'issues', quote: 'they also bring many problems', point: 'The issue is the problems delivery apps bring to restaurants.' },
      { element: 'causes', quote: 'They take up to 30 per cent of the price of every meal', point: 'The apps’ high fees cut restaurants’ income.' },
      { element: 'consequences', quote: 'customers blame us when the rider is late', point: 'Restaurants are blamed for late deliveries.' },
      { element: 'consequences', quote: 'we never meet the people who eat it', point: 'They lose contact with customers.' },
      { element: 'values', quote: 'It is only fair that the apps pay riders properly', point: 'They value fair treatment for riders and restaurants.' },
      { element: 'actions', quote: 'I tell other owners to set up their own ordering website', point: 'They advise owners to set up their own ordering websites.' },
    ],
    model: 'The author is a restaurant owner who accepts that the apps “bring us orders”, but focuses on their “many problems”. The cause is that the apps “take up to 30 per cent of the price of every meal”. The consequences are that “customers blame us when the rider is late”, food arrives cold and “we never meet the people who eat it”. They value fairness: “it is only fair that the apps pay riders properly and charge restaurants less”. Their action is advice: other owners should “set up their own ordering website” and keep loyal customers.',
  },
  voices: [
    { who: 'A delivery rider', quote: 'I ride twelve hours a day and still can’t pay my rent.', level: 'PERSONAL', why: 'His own work.' },
    { who: 'A town street-food association', quote: 'Half the stalls on our night market now sell mostly through apps.', level: 'LOCAL', why: 'One market.' },
    { who: 'A labour minister', quote: 'Delivery riders across the country will be entitled to a minimum wage.', level: 'NATIONAL', why: 'A national law.' },
    { who: 'An international labour researcher', quote: 'Millions of app workers worldwide have no sick pay or insurance.', level: 'GLOBAL', why: 'Workers worldwide.' },
  ],
  q1d: {
    focus: 'advantage of food delivery apps',
    lead: 'Source 1 suggests advantages of food delivery apps.',
    options: [
      { label: 'Food brought to the door', source: 1, quote: 'food brought to the door', test: 'crowd',
        why: 'Elderly, ill and busy people can all get a meal.' },
      { label: 'New customers for restaurants', source: 1, quote: 'new customers', test: 'domino',
        why: 'More sales keep small restaurants open and protect their staff’s jobs.' },
      { label: 'Free advertising on the app', source: 1, quote: 'free advertising on the app', test: 'fair',
        why: 'Small restaurants get the same visibility as big chains.' },
      { label: 'Sales late at night', source: 1, quote: 'sales late at night', test: 'stuck',
        why: 'Extra income every night helps a restaurant survive for the long term.' },
      { label: 'Tracking the order', source: 1, quote: 'tracking the order', test: 'hurt',
        why: 'People know exactly when food will arrive, which matters for those who cannot wait.' },
    ],
    model: 'I think new customers is the most significant advantage, because it keeps restaurants in business. A small restaurant can now reach people who would never have walked past its door. More sales protect the jobs of cooks and waiters, so the benefit spreads beyond one owner. Food brought to the door is also useful, especially for elderly people. But the restaurant owner in Source 2 shows the apps “take up to 30 per cent” of each meal. Without new customers, many restaurants could not survive those fees at all. So new customers is the most significant advantage.',
    levelUp: {
      base: 'New customers is the best advantage because restaurants want customers.',
      right: 'Explain the knock-on effect (sales protect restaurants and jobs), use Source 2 (apps take “up to 30 per cent”), and compare with delivery to the door.',
      wrong: [
        { text: 'Add that riders are paid very little.', why: 'A disadvantage, added without linking it to the chosen advantage.' },
        { text: 'Add the $210 billion prediction.', why: 'A market figure does not show why this advantage matters most.' },
        { text: 'Say that the apps are good and bad.', why: 'The question asks for one advantage, justified.' },
      ],
    },
  },
};
