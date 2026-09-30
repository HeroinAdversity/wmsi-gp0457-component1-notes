import type { Q1BankItem } from '../../types';

export const N25_13_Q1_REWORDED: Q1BankItem = {
  id: 'q1r-n25-13',
  kind: 'reworded',
  parent: 'N25-13',
  title: 'Food waste',
  topic: 'Water, food and agriculture',
  source1: {
    paragraphs: [
      'Wasted food is one of the biggest reasons that there is not enough food. The figures below show roughly how much of each food type was wasted worldwide in 2023.',
    ],
    list: {
      title: 'Share of each food type wasted worldwide, 2023 (approximate)',
      items: ['fruits and vegetables: 45%', 'seafood: 35%', 'cereals: 30%', 'dairy: 20%', 'meat: 20%'],
    },
  },
  source2: {
    paragraphs: [
      'Stop food waste now!',
      'It is wrong to waste food. Around the world, more and more “ugly” food is being thrown away, like oddly shaped potatoes or cucumbers that bend too much. This is a pity, because it is perfectly good to eat. In the US, over half of all food waste happens because food is the “wrong” shape, and about 60 million tonnes of fruit and vegetables are thrown away every year. This adds to food shortages.',
      'The UN Sustainable Development Goals aim to cut global food waste by half, reducing waste as food is grown, processed and eaten. This will help the environment, for example by using less water on crops. It will also save fertiliser and transport, which both give off large amounts of carbon and add to global warming.',
    ],
    attribution: 'Adapted from an environmental group’s website, accessed 2022',
  },
  q1a: {
    stem: 'According to Source 1, which food type has the highest percentage of food wasted?',
    answer: 'Fruits and vegetables',
    accept: ['Fruit and vegetables'],
    distractors: [
      { text: 'Seafood', why: 'Seafood is second, at about 35%.' },
      { text: 'Potatoes and cucumbers', why: 'Those are examples from Source 2, not a food type in Source 1.' },
      { text: '45%', why: 'That is the percentage. The question asks which food type.' },
      { text: 'Meat', why: 'Meat is one of the lowest, at about 20%.' },
    ],
  },
  statements: [
    { source: 2, quote: 'Around the world, more and more “ugly” food is being thrown away', type: 'Generalisation', signal: 'Around the world',
      why: 'A trend stated for the whole world with no worldwide evidence. It is only shown for the US.' },
    { source: 2, quote: 'This is a pity, because it is perfectly good to eat', type: 'Generalisation', signal: 'perfectly good',
      why: 'It assumes all odd-shaped food is fine to eat.' },
    { source: 2, quote: 'It is wrong to waste food', type: 'Value', signal: 'wrong',
      why: 'A moral belief about right and wrong.' },
    { source: 2, quote: 'about 60 million tonnes of fruit and vegetables are thrown away every year', type: 'Fact', signal: '60 million tonnes',
      why: 'A measured figure that can be checked.' },
    { source: 2, quote: 'This will help the environment', type: 'Prediction', signal: 'will help',
      why: 'It says what will happen if waste is halved.' },
    { source: 2, quote: 'This adds to food shortages', type: 'Claim', signal: 'adds to',
      why: 'A cause and effect stated as true, without evidence.' },
    { source: 1, quote: 'Wasted food is one of the biggest reasons that there is not enough food', type: 'Claim', signal: 'one of the biggest reasons',
      why: 'Stated as true, but no comparison with other reasons is given.' },
  ],
  q1b: {
    type: 'Generalisation',
    explain: '“Around the world, more and more “ugly” food is being thrown away” is a generalisation because it says this happens everywhere, when the only evidence is from the US. It stretches what is true in one place to the whole world.',
    oneMark: 'It is a generalisation because it talks about the whole world.',
  },
  q1c: {
    holder: 'the environmental group',
    on: 'on food waste',
    level: 'GLOBAL',
    points: [
      { element: 'issues', quote: 'more and more “ugly” food is being thrown away', point: 'The issue is good food being thrown away, often for its shape.' },
      { element: 'values', quote: 'It is wrong to waste food', point: 'They believe wasting food is morally wrong.' },
      { element: 'causes', quote: 'over half of all food waste happens because food is the “wrong” shape', point: 'Food is rejected for looking “wrong”.' },
      { element: 'consequences', quote: 'This adds to food shortages', point: 'Waste adds to food shortages.' },
      { element: 'consequences', quote: 'add to global warming', point: 'Wasted fertiliser and transport add to global warming.' },
      { element: 'actions', quote: 'The UN Sustainable Development Goals aim to cut global food waste by half', point: 'They support the UN aim to halve food waste.' },
    ],
    model: 'The environmental group believes “it is wrong to waste food”. The issue is good food being thrown away because it is “ugly”. They see the cause as food being the “wrong” shape, which accounts for over half of US food waste. The consequences are serious: “this adds to food shortages”, and wasted fertiliser and transport “add to global warming”. The action they support is the UN goal to “cut global food waste by half”. They believe this “will help the environment” by saving water, fertiliser and transport.',
  },
  voices: [
    { who: 'A student', quote: 'I used to throw away bruised bananas. Now I freeze them for smoothies.', level: 'PERSONAL', why: 'Her own habits.' },
    { who: 'The manager of a town food bank', quote: 'Our local supermarkets now give us their unsold bread every evening.', level: 'LOCAL', why: 'One town and its shops.' },
    { who: 'A national agriculture minister', quote: 'Supermarkets across the country will be fined if they throw away edible food.', level: 'NATIONAL', why: 'A national law.' },
    { who: 'A UN food official', quote: 'A third of all food produced on Earth is never eaten.', level: 'GLOBAL', why: 'All food on Earth.' },
  ],
  q1d: {
    focus: 'consequence of food waste',
    lead: 'Sources 1 and 2 suggest some consequences of food waste.',
    options: [
      { label: 'Food shortages', source: 2, quote: 'This adds to food shortages', test: 'hurt',
        why: 'Shortages mean hunger and malnutrition, which damage health and can kill.' },
      { label: 'Adding to global warming', source: 2, quote: 'add to global warming', test: 'stuck',
        why: 'Carbon stays in the atmosphere for many years, so the damage lasts.' },
      { label: 'Wasting water on crops', source: 2, quote: 'using less water on crops', test: 'domino',
        why: 'Water used on food that is thrown away leaves less for drinking and farming.' },
      { label: 'Wasting fertiliser and transport', source: 2, quote: 'save fertiliser and transport', test: 'crowd',
        why: 'Wasted resources raise food costs for everyone.' },
    ],
    model: 'I think food shortages are the most significant consequence, because they harm people most directly. Source 2 says waste “adds to food shortages”. Source 1 shows that about 45% of fruits and vegetables are wasted, and these are foods people need for a healthy diet. Shortages can lead to hunger and malnutrition, which can kill. Global warming is also very serious, and the damage lasts a long time. But its effects on people build up over years, while a food shortage hurts people straight away. So food shortages are the most significant consequence.',
    levelUp: {
      base: 'Food shortages are the most significant because people need food.',
      right: 'Add evidence (“adds to food shortages”, and 45% of fruit and vegetables wasted), explain the harm (hunger and malnutrition), then compare with global warming, whose effects build up more slowly.',
      wrong: [
        { text: 'Explain why supermarkets reject “ugly” food.', why: 'That is a cause, not a reason why this consequence matters most.' },
        { text: 'Add that food waste is wrong.', why: 'A value repeated from the source is not a justification or comparison.' },
        { text: 'List all the percentages from Source 1.', why: 'Figures need to be used to support a point, not just listed.' },
      ],
    },
  },
};
