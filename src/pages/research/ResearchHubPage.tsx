import { Link } from 'react-router-dom';
import { Container } from '../../components/primitives';
import { Q2Header } from './components/Q2Header';
import { SkillsMap } from './components/SkillsMap';

const LINK_TABLE: { skill: string; cells: string[] }[] = [
  { skill: 'Set a research question', cells: ['● judge the aim', '● the claim is the aim', '', '●', '● Table A'] },
  { skill: 'Choose research methods', cells: ['● judge the method', '● How', '', '●', '● Table A'] },
  { skill: 'Choose sources of information', cells: ['● who was asked', '● Who', '○', '● Table E', '●'] },
  { skill: 'Judge reliability & bias', cells: ['●', '', '●', '● Table E', '● Table E'] },
  { skill: 'Judge if research fits its aim', cells: ['● link to aim', '○ Why', '', '● Table E', '● Table E'] },
  { skill: 'Break a claim into parts', cells: ['', '●', '○', '●', '○'] },
  { skill: 'Explain in a chain', cells: ['●', '●', '●', '●', '●'] },
];

const BRIDGES = [
  { a: '2(a)', aStyle: 'bg-[color:var(--color-q2-night)] text-[color:var(--color-q2-ivory)]', b: 'Report · Table E',
    title: 'Judging research = judging your sources.',
    body: 'Same move, different research: a stranger’s interview in the exam, your own websites and studies in the Report.',
    same: '“Because ___, the evidence may be ___, so it is less useful for finding out ___.”' },
  { a: '2(b)', aStyle: 'bg-[color:var(--color-q2-sage)] text-white', b: 'Project · Table A',
    title: 'Testing a claim = planning your evidence.',
    body: 'Table A rewards a plan that says how the action will be evidenced and how success will be measured.',
    same: 'Same matrix: Who? How? What? Why does it prove it?' },
  { a: 'Q2', aStyle: 'bg-[color:var(--color-q2-storm)] text-white', b: 'Q3',
    title: 'One reliability checklist, four places.',
    body: 'Expertise, bias, vested interest, “reason to lie?” Learn it once in the Toolkit.',
    same: 'Used in 2(a), Q3, the Report and the Project.' },
];

const PATH = [
  { to: '/research/toolkit', step: 'Start here', title: 'The Toolkit', body: '8 methods, 5 sources, reliability checks — the words both parts need.' },
  { to: '/research/evaluate', step: 'Q2(a)', title: 'Strong or Shaky?', body: 'Annotate Source 3 and build strength/weakness chains.' },
  { to: '/research/design', step: 'Q2(b)', title: 'The Test Bench', body: 'Split the claim, then fill the Who · How · What · Why matrix.' },
  { to: '/research/practice', step: 'Practise', title: 'Practice bank', body: '33 Source 3s with answer schemes. Print any as a mock paper.' },
  { to: '/revision/research', step: 'Revise', title: 'Revision sheet', body: 'One printable page for the week before the exam.' },
];

export function ResearchHubPage() {
  return (
    <div className="q2-page pb-20">
      <Q2Header
        tone="hub"
        label="Paper 1 · Question 2 · 16 marks"
        title="Research, inside out."
        lede={<p>Question 2 never asks what you think about the issue. It asks how we would <em>know</em>. In 2(a) you judge someone else’s research; in 2(b) you design your own. You will use the same skills again in your Individual Report and your Team Project.</p>}
      />
      <Container size="wide">
        <SkillsMap />

        <details className="mt-6 rounded-[8px] border border-[color:var(--color-line)] bg-white">
          <summary className="cursor-pointer px-4 py-3 text-[14px] font-semibold text-[color:var(--color-q2-sea)]">How each skill links (table)</summary>
          <div className="overflow-x-auto px-4 pb-4">
            <table className="w-full min-w-[640px] border-collapse text-[13px]">
              <thead>
                <tr className="text-left font-mono text-[10px] uppercase tracking-[0.1em] text-[color:var(--color-ink-3)]">
                  {['Skill', '2(a)', '2(b)', 'Q3', 'Report', 'Project'].map((h) => (
                    <th key={h} className="border-b border-[color:var(--color-q2-sea)] px-2 py-2 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LINK_TABLE.map((r) => (
                  <tr key={r.skill}>
                    <td className="border-b border-[color:var(--color-line)] px-2 py-2 font-semibold">{r.skill}</td>
                    {r.cells.map((c, i) => <td key={i} className="border-b border-[color:var(--color-line)] px-2 py-2">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-[12px] text-[color:var(--color-ink-3)]">● the same skill is marked again · ○ supporting link</p>
          </div>
        </details>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {BRIDGES.map((b) => (
            <article key={b.title} className="rounded-[8px] border border-[color:var(--color-line)] bg-white px-5 py-[18px]">
              <p className="flex items-center gap-2 font-mono text-[11px] font-semibold">
                <span className={`rounded-[3px] px-1.5 py-0.5 ${b.aStyle}`}>{b.a}</span>↔
                <span className="rounded-[3px] bg-[color:var(--color-q2-arctic)] px-1.5 py-0.5">{b.b}</span>
              </p>
              <h3 className="mt-2.5 font-display text-[21px] leading-[1.2] text-[color:var(--color-q2-sea)]">{b.title}</h3>
              <p className="mt-1.5 text-[13.5px] text-[color:var(--color-ink-2)]">{b.body}</p>
              <p className="mt-3 rounded-[5px] bg-[color:var(--color-q2-arctic)] px-3 py-2 text-[13px] text-[color:var(--color-q2-sea)]">{b.same}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-12 font-display text-[26px] md:text-[32px] text-[color:var(--color-q2-sea)]">Your path through Question 2</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PATH.map((p) => (
            <Link key={p.to} to={p.to} className="group rounded-[6px] border border-[color:var(--color-line)] bg-white px-4 py-4 transition-colors hover:border-[color:var(--color-q2-storm)]">
              <span className="font-mono text-[11px] text-[color:var(--color-q2-storm)]">{p.step}</span>
              <h3 className="mt-1 font-display text-[19px] text-[color:var(--color-q2-sea)] group-hover:underline">{p.title}</h3>
              <p className="mt-1 text-[13px] text-[color:var(--color-ink-2)]">{p.body}</p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
