import type { Q1BankItem } from '../../types';

export const N25_13_Q1_MIRROR_A: Q1BankItem = {
  id: 'q1m-n25-13-a',
  kind: 'mirror',
  parent: 'N25-13',
  title: 'Fast fashion',
  topic: 'Sustainable living',
  source1: {
    paragraphs: [
      'The world buys far more clothes than it did twenty years ago, and most are worn only a few times. The figures below show roughly what happens to clothes once they are thrown away.',
    ],
    list: {
      title: 'What happens to discarded clothes worldwide (approximate)',
      items: ['sent to landfill: 57%', 'burned: 25%', 'recycled into new fibres: 12%', 'reused or resold: 6%'],
    },
  },
  source2: {
    paragraphs: [
      'Stop the throwaway wardrobe!',
      'Buying clothes we hardly wear is wrong. Across the world, shoppers are treating clothes as disposable, wearing a T-shirt a few times and then binning it. This is a waste, because most of these clothes are still in good condition. Making one pair of jeans uses around 7,500 litres of water, and polyester clothes shed tiny plastic fibres every time they are washed.',
      'We want clothing brands to take back old clothes and recycle them. This will cut the amount of clothing in landfill. It will also save water and energy, and reduce the chemicals that pour into rivers from dye factories.',
    ],
    attribution: 'Adapted from the website of a sustainable fashion campaign group, 2024',
  },
  q1a: {
    stem: 'According to Source 1, what happens to the largest share of discarded clothes?',
    answer: 'Sent to landfill',
    accept: ['Landfill', 'They go to landfill'],
    distractors: [
      { text: 'Burned', why: 'Burning is second, at about 25%.' },
      { text: '57%', why: 'That is the percentage. The question asks what happens to the clothes.' },
      { text: 'Reused or resold', why: 'That is the smallest share, about 6%.' },
      { text: 'Thrown in the bin', why: 'Source 2 says clothes are binned, but the question asks where the largest share ends up.' },
    ],
  },
  statements: [
    { source: 2, quote: 'Across the world, shoppers are treating clothes as disposable', type: 'Generalisation', signal: 'Across the world',
      why: 'It applies to shoppers everywhere, with no evidence for all countries.' },
    { source: 2, quote: 'most of these clothes are still in good condition', type: 'Generalisation', signal: 'most',
      why: '"Most" is not measured. It stretches a belief to all thrown-away clothes.' },
    { source: 2, quote: 'Buying clothes we hardly wear is wrong', type: 'Value', signal: 'wrong',
      why: 'A moral belief.' },
    { source: 2, quote: 'Making one pair of jeans uses around 7,500 litres of water', type: 'Fact', signal: '7,500 litres',
      why: 'A measured figure that can be checked.' },
    { source: 2, quote: 'This will cut the amount of clothing in landfill', type: 'Prediction', signal: 'will cut',
      why: 'It says what will happen if brands recycle.' },
    { source: 2, quote: 'polyester clothes shed tiny plastic fibres every time they are washed', type: 'Claim', signal: 'every time',
      why: 'Stated as true for every wash, without evidence in the source.' },
    { source: 1, quote: 'most are worn only a few times', type: 'Claim', signal: 'most are worn',
      why: 'Stated as true with no figure given.' },
  ],
  q1b: {
    type: 'Generalisation',
    explain: '“Across the world, shoppers are treating clothes as disposable” is a generalisation because it says shoppers everywhere behave this way. It is only true of some shoppers, and no evidence is given for the whole world.',
    oneMark: 'It is a generalisation because it is about everyone.',
  },
  q1c: {
    holder: 'the campaign group',
    on: 'on clothing waste',
    level: 'GLOBAL',
    points: [
      { element: 'issues', quote: 'wearing a T-shirt a few times and then binning it', point: 'The issue is clothes being thrown away after little use.' },
      { element: 'values', quote: 'Buying clothes we hardly wear is wrong', point: 'They believe wasting clothes is wrong.' },
      { element: 'causes', quote: 'shoppers are treating clothes as disposable', point: 'Shoppers treat clothes as disposable.' },
      { element: 'consequences', quote: 'Making one pair of jeans uses around 7,500 litres of water', point: 'Each item wastes large amounts of water.' },
      { element: 'consequences', quote: 'shed tiny plastic fibres every time they are washed', point: 'Plastic fibres pollute water.' },
      { element: 'actions', quote: 'We want clothing brands to take back old clothes and recycle them', point: 'They want brands to take back and recycle clothes.' },
    ],
    model: 'The campaign group believes that “buying clothes we hardly wear is wrong”. The issue is clothes worn “a few times” and then binned. They blame shoppers who treat “clothes as disposable”. They describe the consequences: one pair of jeans uses “around 7,500 litres of water”, and polyester clothes “shed tiny plastic fibres” when washed. The action they want is for brands “to take back old clothes and recycle them”. They believe this “will cut the amount of clothing in landfill”, and will save water and energy and reduce the chemicals from dye factories.',
  },
  voices: [
    { who: 'A student', quote: 'I now buy second-hand and swap clothes with my friends.', level: 'PERSONAL', why: 'Her own habits.' },
    { who: 'A town charity shop manager', quote: 'We receive so many donations that we have to send bags to landfill every week.', level: 'LOCAL', why: 'One shop in one town.' },
    { who: 'An environment minister', quote: 'Clothing brands selling here will have to pay for recycling what they sell.', level: 'NATIONAL', why: 'A national rule.' },
    { who: 'A UN environment official', quote: 'The fashion industry produces around 10 per cent of the world’s carbon emissions.', level: 'GLOBAL', why: 'The whole world.' },
  ],
  q1d: {
    focus: 'consequence of clothing waste',
    lead: 'Sources 1 and 2 suggest some consequences of clothing waste.',
    options: [
      { label: 'Clothes filling landfill', source: 1, quote: 'sent to landfill: 57%', test: 'stuck',
        why: 'Synthetic fabrics can take hundreds of years to break down.' },
      { label: 'Wasted water', source: 2, quote: 'uses around 7,500 litres of water', test: 'crowd',
        why: 'Water wasted on clothes is taken from farms and families in dry regions.' },
      { label: 'Plastic fibres in water', source: 2, quote: 'shed tiny plastic fibres', test: 'domino',
        why: 'Fibres enter rivers, fish and then the food we eat.' },
      { label: 'Chemicals from dye factories', source: 2, quote: 'the chemicals that pour into rivers from dye factories', test: 'hurt',
        why: 'Poisoned rivers damage the health of people who live near them.' },
    ],
    model: 'I think clothes filling landfill is the most significant consequence, because the damage lasts for centuries. Source 1 shows that about 57% of discarded clothes are “sent to landfill”, far more than any other outcome. Many are made of synthetic fabrics that can take hundreds of years to break down. Wasted water is also serious, especially in dry regions. But water can be saved from now on if people buy less, whereas clothes already in landfill will stay there for generations. So landfill is the most significant consequence.',
    levelUp: {
      base: 'Landfill is the worst consequence because there is a lot of it.',
      right: 'Use the figure (about 57% “sent to landfill”), explain why the damage lasts for centuries, and compare with wasted water, which can be saved from now on.',
      wrong: [
        { text: 'Add that buying clothes we hardly wear is wrong.', why: 'That is the group’s value, not a reason this consequence matters most.' },
        { text: 'Describe the take-back scheme.', why: 'A solution, not a justification of the consequence.' },
        { text: 'List all four figures from Source 1.', why: 'Figures must support a point, not just be copied.' },
      ],
    },
  },
};
