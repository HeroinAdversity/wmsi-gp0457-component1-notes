import type { Q1BankItem } from '../../types';

export const N25_13_Q1_MIRROR_B: Q1BankItem = {
  id: 'q1m-n25-13-b',
  kind: 'mirror',
  parent: 'N25-13',
  title: 'Electronic waste',
  topic: 'Sustainable living',
  source1: {
    paragraphs: [
      'Old phones, laptops and fridges make up the fastest-growing type of household waste. In 2022 the world threw away about 62 million tonnes of electronic waste. The figures below show roughly where it was produced.',
    ],
    list: {
      title: 'Share of the world’s e-waste by region, 2022 (approximate)',
      items: ['Asia: 49%', 'Europe: 21%', 'the Americas: 23%', 'Africa: 5%', 'Oceania: 2%'],
    },
  },
  source2: {
    paragraphs: [
      'Fix it, don’t bin it!',
      'Throwing away devices that could be repaired is wrong. People everywhere are replacing phones every two years, just to have the newest model. This is a shame, because old phones contain gold, copper and rare metals that can be used again. Less than a quarter of e-waste is recycled properly, and much of the rest is shipped to poorer countries.',
      'We are campaigning for a “right to repair” law, so that spare parts and repair guides must be available. This will help keep devices working for longer. It will also protect the workers, often children, who burn cables to recover copper and breathe in toxic smoke.',
    ],
    attribution: 'Adapted from the website of a repair campaign group, 2023',
  },
  q1a: {
    stem: 'According to Source 1, which region produced the largest share of the world’s e-waste?',
    answer: 'Asia',
    accept: ['Asia (49%)'],
    distractors: [
      { text: 'The Americas', why: 'The Americas are second, at about 23%.' },
      { text: '49%', why: 'That is the share. The question asks which region.' },
      { text: 'Poorer countries', why: 'Source 2 says e-waste is shipped there. That is not where it is produced.' },
      { text: 'Europe', why: 'Europe produced about 21%, less than Asia.' },
    ],
  },
  statements: [
    { source: 2, quote: 'People everywhere are replacing phones every two years', type: 'Generalisation', signal: 'People everywhere',
      why: '"Everywhere" applies the habit to all people.' },
    { source: 2, quote: 'just to have the newest model', type: 'Generalisation', signal: 'just to have',
      why: 'It assumes everyone upgrades for the same reason.' },
    { source: 2, quote: 'Throwing away devices that could be repaired is wrong', type: 'Value', signal: 'wrong',
      why: 'A moral belief.' },
    { source: 2, quote: 'Less than a quarter of e-waste is recycled properly', type: 'Fact', signal: 'Less than a quarter',
      why: 'A figure that can be checked.' },
    { source: 2, quote: 'This will help keep devices working for longer', type: 'Prediction', signal: 'will help',
      why: 'A forecast of what the law will do.' },
    { source: 2, quote: 'much of the rest is shipped to poorer countries', type: 'Claim', signal: 'much of the rest',
      why: '"Much" is not measured, so this is stated without evidence.' },
    { source: 1, quote: 'In 2022 the world threw away about 62 million tonnes of electronic waste', type: 'Fact', signal: '62 million tonnes',
      why: 'A dated figure that can be checked.' },
  ],
  q1b: {
    type: 'Generalisation',
    explain: '“People everywhere are replacing phones every two years” is a generalisation because it says everyone does this. Many people keep their phones much longer, so it is only true of some.',
    oneMark: 'It is a generalisation because it says “everywhere”.',
  },
  q1c: {
    holder: 'the campaign group',
    on: 'on electronic waste',
    level: 'GLOBAL',
    points: [
      { element: 'issues', quote: 'Throwing away devices that could be repaired', point: 'The issue is working devices being thrown away.' },
      { element: 'values', quote: 'Throwing away devices that could be repaired is wrong', point: 'They believe throwing repairable devices away is wrong.' },
      { element: 'causes', quote: 'just to have the newest model', point: 'People upgrade to have the newest model.' },
      { element: 'consequences', quote: 'much of the rest is shipped to poorer countries', point: 'E-waste is dumped on poorer countries.' },
      { element: 'consequences', quote: 'breathe in toxic smoke', point: 'Workers, often children, breathe toxic smoke.' },
      { element: 'actions', quote: 'We are campaigning for a “right to repair” law', point: 'They campaign for a right-to-repair law.' },
    ],
    model: 'The campaign group believes that “throwing away devices that could be repaired is wrong”. The issue is working phones and laptops being thrown away. They see the cause as people replacing phones “just to have the newest model”. The consequences are serious: “less than a quarter of e-waste is recycled properly”, much is “shipped to poorer countries”, and workers there, often children, “breathe in toxic smoke”. Their action is campaigning for a “right to repair” law. They believe it “will help keep devices working for longer” and protect those workers.',
  },
  voices: [
    { who: 'A teenager', quote: 'I got my cracked screen fixed for a tenth of the price of a new phone.', level: 'PERSONAL', why: 'His own phone.' },
    { who: 'A repair café volunteer', quote: 'Every Saturday our town repair café fixes about forty devices.', level: 'LOCAL', why: 'One town.' },
    { who: 'A trade minister', quote: 'All phones sold in our country must have replaceable batteries from 2027.', level: 'NATIONAL', why: 'A national law.' },
    { who: 'A UN environment researcher', quote: 'E-waste is growing five times faster than it is recycled worldwide.', level: 'GLOBAL', why: 'Worldwide.' },
  ],
  q1d: {
    focus: 'consequence of electronic waste',
    lead: 'Sources 1 and 2 suggest some consequences of electronic waste.',
    options: [
      { label: 'Workers breathing toxic smoke', source: 2, quote: 'breathe in toxic smoke', test: 'hurt',
        why: 'It damages the health of workers, including children.' },
      { label: 'Waste shipped to poorer countries', source: 2, quote: 'shipped to poorer countries', test: 'fair',
        why: 'Rich countries push their pollution onto poorer ones.' },
      { label: 'Metals wasted', source: 2, quote: 'gold, copper and rare metals that can be used again', test: 'stuck',
        why: 'Rare metals are limited; once lost in landfill they are gone.' },
      { label: 'Growing mountains of waste', source: 1, quote: '62 million tonnes of electronic waste', test: 'crowd',
        why: 'The sheer amount affects every country.' },
    ],
    model: 'I think the most significant consequence is that workers “breathe in toxic smoke”, because it harms people directly. Source 2 says these workers are “often children”, burning cables to recover copper. Toxic smoke can damage their lungs and health for life. Wasted metals are also a problem, because rare metals are limited. But losing metals harms the economy, while toxic smoke harms human bodies, and the victims are children who did not create the waste. So the damage to workers’ health is the most significant consequence.',
    levelUp: {
      base: 'Toxic smoke is the worst consequence because smoke is bad.',
      right: 'Use Source 2 (the workers are “often children”), explain the lasting harm to health, and compare with wasted metals, which harm the economy rather than people.',
      wrong: [
        { text: 'Add that Asia produces 49% of e-waste.', why: 'A figure not linked to why this consequence matters most.' },
        { text: 'Explain the right-to-repair law.', why: 'A solution, not a justification.' },
        { text: 'Say that phones are too expensive.', why: 'Off the question.' },
      ],
    },
  },
};
