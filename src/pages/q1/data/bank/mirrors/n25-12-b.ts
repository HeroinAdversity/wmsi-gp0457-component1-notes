import type { Q1BankItem } from '../../types';

export const N25_12_Q1_MIRROR_B: Q1BankItem = {
  id: 'q1m-n25-12-b',
  kind: 'mirror',
  parent: 'N25-12',
  title: 'Music streaming',
  topic: 'Digital world',
  source1: {
    paragraphs: [
      'Most people now listen to music by streaming it rather than buying it. In 2023, streaming earned the music industry $19 billion worldwide. Streaming income is predicted to rise by 25 per cent by 2028, which shows how completely it has changed the way we listen.',
    ],
    list: {
      title: 'Advantages of music streaming',
      items: ['for listeners: millions of songs, low monthly cost, music on any device, new music suggestions', 'for musicians: fans in every country, no need for a record shop, instant release of new songs, data about listeners'],
    },
  },
  source2: {
    paragraphs: [
      'I am an independent musician. Streaming lets people hear my songs in countries I will never visit, but it pays almost nothing. I earn less than one cent each time a song is played.',
      'A few famous stars take most of the money. New artists are buried under thousands of new songs uploaded every day. Albums are forgotten after a week. I feel that music has lost its value. It is right that the people who write the songs should earn a fair living from them.',
      'I advise other musicians to sell merchandise, play live shows and ask fans to support them directly.',
    ],
    attribution: 'Adapted from a blog post by an independent musician',
  },
  q1a: {
    stem: 'According to Source 1, by what percentage is streaming income predicted to rise by 2028?',
    answer: '25 per cent',
    accept: ['25%'],
    distractors: [
      { text: '$19 billion', why: 'That is the 2023 income, not the predicted rise.' },
      { text: 'Less than one cent', why: 'That is what the musician earns per play, from Source 2.' },
      { text: '25', why: 'Include “per cent”.' },
      { text: 'Millions of songs', why: 'That is an advantage for listeners, not a figure for growth.' },
    ],
  },
  statements: [
    { source: 2, quote: 'I feel that music has lost its value', type: 'Opinion', signal: 'I feel',
      why: '"I feel" shows a personal view.' },
    { source: 2, quote: 'it pays almost nothing', type: 'Opinion', signal: 'almost nothing',
      why: 'Whether the pay is "almost nothing" is the writer’s judgement.' },
    { source: 2, quote: 'It is right that the people who write the songs should earn a fair living from them', type: 'Value', signal: 'It is right',
      why: 'A belief about fairness.' },
    { source: 2, quote: 'Albums are forgotten after a week', type: 'Generalisation', signal: 'Albums are forgotten',
      why: 'Said of all albums, though many are played for years.' },
    { source: 2, quote: 'I earn less than one cent each time a song is played', type: 'Fact', signal: 'less than one cent',
      why: 'A figure the writer can check from their payments.' },
    { source: 1, quote: 'Streaming income is predicted to rise by 25 per cent by 2028', type: 'Prediction', signal: 'predicted to rise',
      why: 'A forecast about the future.' },
    { source: 2, quote: 'A few famous stars take most of the money', type: 'Claim', signal: 'take most of the money',
      why: 'Stated as true with no figures to back it.' },
  ],
  q1b: {
    type: 'Opinion',
    explain: '“I feel that music has lost its value” is an opinion because it is the writer’s own feeling, shown by “I feel”. It cannot be proved, and many listeners would disagree.',
    oneMark: 'It is an opinion because it is a feeling.',
  },
  q1c: {
    holder: 'the author',
    on: 'on music streaming',
    level: 'PERSONAL',
    points: [
      { element: 'issues', quote: 'it pays almost nothing', point: 'The issue is the low pay musicians get from streaming.' },
      { element: 'causes', quote: 'A few famous stars take most of the money', point: 'Most of the money goes to a few stars.' },
      { element: 'consequences', quote: 'New artists are buried under thousands of new songs', point: 'New artists struggle to be noticed.' },
      { element: 'consequences', quote: 'Albums are forgotten after a week', point: 'Music is quickly forgotten.' },
      { element: 'values', quote: 'should earn a fair living from them', point: 'They believe songwriters deserve a fair living.' },
      { element: 'actions', quote: 'I advise other musicians to sell merchandise, play live shows', point: 'They advise selling merchandise and playing live.' },
    ],
    model: 'The author is an independent musician. They like that streaming lets people hear their songs worldwide, but the issue is that “it pays almost nothing”: “less than one cent” per play. They blame the way “a few famous stars take most of the money”. The consequences are that “new artists are buried under thousands of new songs” and “albums are forgotten after a week”. They value fairness, believing songwriters “should earn a fair living”. Their action is advice to other musicians: “sell merchandise, play live shows” and ask fans for direct support.',
  },
  voices: [
    { who: 'A teenage listener', quote: 'I found my favourite band from a playlist the app made for me.', level: 'PERSONAL', why: 'His own listening.' },
    { who: 'The owner of a city record shop', quote: 'Our shop survives by selling vinyl to collectors in the neighbourhood.', level: 'LOCAL', why: 'One shop.' },
    { who: 'A culture minister', quote: 'Streaming firms must pay a fee to fund music in our country’s schools.', level: 'NATIONAL', why: 'A national rule.' },
    { who: 'A global music industry analyst', quote: 'Streaming now makes up two-thirds of music income worldwide.', level: 'GLOBAL', why: 'Worldwide income.' },
  ],
  q1d: {
    focus: 'advantage of music streaming',
    lead: 'Source 1 suggests advantages of music streaming.',
    options: [
      { label: 'Fans in every country', source: 1, quote: 'fans in every country', test: 'crowd',
        why: 'An unknown musician can reach listeners across the world.' },
      { label: 'Low monthly cost', source: 1, quote: 'low monthly cost', test: 'fair',
        why: 'People on low incomes can enjoy as much music as anyone else.' },
      { label: 'New music suggestions', source: 1, quote: 'new music suggestions', test: 'domino',
        why: 'Listeners discover new artists, who then gain fans and income.' },
      { label: 'Instant release of new songs', source: 1, quote: 'instant release of new songs', test: 'stuck',
        why: 'Songs stay available for ever instead of going out of print.' },
      { label: 'Millions of songs', source: 1, quote: 'millions of songs', test: 'crowd',
        why: 'Every listener has almost any song they want.' },
    ],
    model: 'I think fans in every country is the most significant advantage, because it changes what a small musician can achieve. The author says streaming lets people hear “my songs in countries I will never visit”. Before streaming, only artists with a big record company could reach the world. Low monthly cost also matters, because it makes music affordable for everyone. But cheap music mainly helps listeners, and the author shows it pays artists “almost nothing”. A worldwide audience gives artists a chance to build a career. So fans in every country is the most significant advantage.',
    levelUp: {
      base: 'Fans in every country is the best advantage because it is global.',
      right: 'Use Source 2 (“countries I will never visit”), explain how it opens careers to unknown artists, and compare with low monthly cost, which mainly helps listeners.',
      wrong: [
        { text: 'Add that musicians earn less than one cent per play.', why: 'A disadvantage, added without being used to compare.' },
        { text: 'Add the $19 billion figure.', why: 'The industry total does not justify this advantage.' },
        { text: 'Say that streaming is better than CDs.', why: 'Too general, with no support.' },
      ],
    },
  },
};
