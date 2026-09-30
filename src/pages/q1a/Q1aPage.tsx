import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  DisplayH1,
  DisplayH2,
  DisplayH3,
  Eyebrow,
  Lede,
  Body,
  Callout,
} from '../../components/primitives';
import { Bi } from '../../lib/LanguageContext';
import { ExportFooter } from '../../components/ExportFooter';
import { useNotesExport, nx, usePersistentState } from '../../lib/useNotesExport';
import {
  ANATOMY_EXAMPLE_EN,
  ANATOMY_EXAMPLE_ZH,
  ANATOMY_PARTS,
  CHECKLIST,
  PRACTICE_ITEMS,
  TRAPS,
  WORKED_ITEMS,
} from './data';
import { TabNoteBadge } from '../../components/NotesLayer';
import { usePublishTab } from '../../lib/activeTab';

const TOOL_ID = 'q1a-source-recall';

const TABS = [
  { id: 'overview', en: 'Overview', zh: '概览' },
  { id: 'anatomy', en: 'Anatomy', zh: '结构拆解' },
  { id: 'traps', en: 'Traps', zh: '常见陷阱' },
  { id: 'worked', en: 'Worked examples', zh: '范例' },
  { id: 'practice', en: 'Practice', zh: '练习' },
  { id: 'checklist', en: 'Checklist', zh: '自查' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function Q1aPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initial: TabId = (location.hash.replace('#', '') as TabId) || 'overview';
  const [tab, setTab] = useState<TabId>(TABS.some((t) => t.id === initial) ? initial : 'overview');
  usePublishTab(tab, TABS.find((t) => t.id === tab)?.en ?? '');

  const setTabAndUrl = (t: TabId) => {
    setTab(t);
    navigate({ pathname: location.pathname, hash: `#${t}` }, { replace: true });
    window.scrollTo({ top: 260, behavior: 'smooth' });
  };

  useEffect(() => {
    const h = location.hash.replace('#', '') as TabId;
    if (TABS.some((t) => t.id === h) && h !== tab) setTab(h);
  }, [location.hash]); // eslint-disable-line react-hooks/exhaustive-deps

  useNotesExport({
    toolId: TOOL_ID,
    pageTitleEn: 'Q1(a) — Source Recall',
    subtitleEn: 'IGCSE Global Perspectives 0457 · Student worksheet',
    filenameStem: 'GP_Q1a',
    studentNameSelector: '#wne-student-name',
    exportDocxSelector: '#wne-export-docx',
    exportPdfSelector:  '#wne-export-pdf',
    openNotesSelector:  '#wne-open-notes',
    collect: () => collectQ1a(),
  });

  return (
    <>
      {/* HERO */}
      <section className="pt-12 md:pt-16 pb-8">
        <Container size="wide">
          <Eyebrow color="violet">
            <Bi en="Q1(a) · Source recall" zh="第 1(a) 题 · 资料识别" />
          </Eyebrow>
          <DisplayH1 className="mt-3">
            <Bi en="First Read." zh="初读。" />
          </DisplayH1>
          <Lede className="mt-6">
            <Bi
              en={
                <>
                  Cambridge IGCSE Global Perspectives 0457, Paper 1, Question 1(a): one mark, one line,
                  one precise fact taken from a named source. The easiest mark on the paper — and the one
                  most often lost to a dropped unit, a nearby number, or an over-written answer.
                </>
              }
              zh={
                <>
                  剑桥 IGCSE 全球视野 0457，卷一第 1(a) 题：1 分、一行答题空间、从指定资料中找出一个确切事实。
                  这是全卷最容易的一分——也是最常因为漏写单位、看错数字或写太多而丢失的一分。
                </>
              }
            />
          </Lede>
        </Container>
      </section>

      {/* STICKY TAB STRIP */}
      <div className="sticky top-[calc(var(--site-header-h,64px)+var(--section-bar-h,0px))] z-20 bg-[color:var(--color-paper)]/95 backdrop-blur-md border-b border-[color:var(--color-line)]">
        <Container size="wide">
          <nav
            className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTabAndUrl(t.id)}
                className={`shrink-0 text-[13.5px] font-semibold py-3.5 border-b-2 -mb-px transition-colors ${
                  tab === t.id
                    ? 'text-[color:var(--color-ink)] border-[color:var(--color-ink)]'
                    : 'text-[color:var(--color-ink-3)] border-transparent hover:text-[color:var(--color-ink)]'
                }`}
              >
                <Bi en={t.en} zh={t.zh} />
                <TabNoteBadge tab={t.id} />
              </button>
            ))}
          </nav>
        </Container>
      </div>

      {/* PANELS */}
      <Container size="wide">
        <section className="py-10 md:py-14" role="tabpanel">
          {tab === 'overview' && <OverviewTab />}
          {tab === 'anatomy' && <AnatomyTab />}
          {tab === 'traps' && <TrapsTab />}
          {tab === 'worked' && <WorkedTab />}
          {tab === 'practice' && <PracticeTab />}
          {tab === 'checklist' && <ChecklistTab />}
        </section>
      </Container>

      <ExportFooter toolId={TOOL_ID} />
    </>
  );
}

/* ============================================================
   Notes/export collect(): reads persisted state from localStorage,
   builds the block model the shared module renders into .docx / .pdf.
   ============================================================ */
function collectQ1a() {
  const sections: Array<{ heading: string; blocks: any[] }> = [];

  // Practice items
  let practiceItems: PracticeState[] = [];
  try {
    const raw = localStorage.getItem(`wne_${TOOL_ID}_practice`);
    if (raw) practiceItems = JSON.parse(raw);
  } catch { /* storage disabled */ }
  const practiceBlocks: any[] = [];
  practiceItems.forEach((s, i) => {
    const q = PRACTICE_ITEMS[i];
    if (!q) return;
    const attempted = (s.answer && s.answer.trim()) || s.selfMark !== null;
    if (!attempted) return;
    practiceBlocks.push(nx.h(3, `Item ${q.n} — ${q.topicEn}`));
    practiceBlocks.push(nx.p([nx.text('Question: ', { bold: true }), nx.text(q.stemEn)]));
    practiceBlocks.push(nx.p([nx.text('Your answer: ', { bold: true }), nx.text(s.answer || '(blank)')]));
    if (s.selfMark) {
      practiceBlocks.push(
        nx.p([
          nx.text('Self-mark: ', { bold: true }),
          nx.text(s.selfMark === 'correct' ? '1 mark' : '0 marks'),
        ]),
      );
    }
  });
  if (practiceBlocks.length) {
    sections.push({ heading: 'Practice — Six items', blocks: practiceBlocks });
  }

  // Checklist
  let ticks: boolean[] = [];
  try {
    const raw = localStorage.getItem(`wne_${TOOL_ID}_checklist`);
    if (raw) ticks = JSON.parse(raw);
  } catch { /* storage disabled */ }
  const doneCount = ticks.filter(Boolean).length;
  const clBlocks: any[] = [
    nx.p([nx.text(`${doneCount} of ${CHECKLIST.length} habits ticked`, { bold: true })]),
  ];
  CHECKLIST.forEach((c, i) => {
    const mark = ticks[i] ? '☑ ' : '☐ ';
    clBlocks.push(nx.p(mark + c.en));
  });
  sections.push({ heading: 'Self-check — Six habits', blocks: clBlocks });

  return { sections };
}

/* ─────────── Overview ─────────── */

function OverviewTab() {
  return (
    <div className="grid gap-12">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)] md:gap-14 items-start">
        <div>
          <DisplayH2>
            <Bi en="What Q1(a) really tests." zh="第 1(a) 题真正考察什么。" />
          </DisplayH2>
          <Body className="mt-5">
            <Bi
              en={
                <>
                  Q1(a) is the paper's warm-up. It asks whether you can locate a single, specific piece of
                  information in a named source — a figure, a year, a name, or a direction of change — and
                  transcribe it accurately, with the right units. There is no reasoning to do. No opinion to
                  form. Just precise reading.
                </>
              }
              zh={
                <>
                  第 1(a) 题是整份试卷的热身：考察你能否从指定的一份资料中找出一条具体的信息——一个数字、一个年份、一个名称，或一个变化的方向——
                  并且原样、带对单位地写下来。这里不需要推理，也不需要立场，只考「精确阅读」。
                </>
              }
            />
          </Body>
        </div>

        {/* Fact card: the anatomy of the mark */}
        <aside className="bg-[color:var(--color-violet-tint)] border border-[color:var(--color-violet-soft)] rounded-md p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-violet-deep)]">
            <Bi en="The mark" zh="这一分的构成" />
          </p>
          <dl className="mt-4 grid gap-3 text-[14px]">
            <div className="flex justify-between gap-4 border-b border-[color:var(--color-violet-soft)] pb-2">
              <dt className="text-[color:var(--color-ink-2)]"><Bi en="Marks available" zh="满分" /></dt>
              <dd className="font-mono font-semibold text-[color:var(--color-ink)]">1</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[color:var(--color-violet-soft)] pb-2">
              <dt className="text-[color:var(--color-ink-2)]"><Bi en="Lines on the paper" zh="答题行数" /></dt>
              <dd className="font-mono font-semibold text-[color:var(--color-ink)]">2</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[color:var(--color-violet-soft)] pb-2">
              <dt className="text-[color:var(--color-ink-2)]"><Bi en="Suggested time" zh="建议时间" /></dt>
              <dd className="font-mono font-semibold text-[color:var(--color-ink)]">&lt; 60 s</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[color:var(--color-ink-2)]"><Bi en="Command word" zh="指令词" /></dt>
              <dd className="font-mono font-semibold text-[color:var(--color-ink)]">identify / state</dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <StatCard
          numeral="1"
          eyebrowEn="Named source"
          eyebrowZh="指定资料"
          bodyEn={
            <>
              Every Q1(a) says "From Source 1", "According to Source 1", or "Using Source 1". Read that
              source and only that source, even when Source 2 is longer or looks more interesting.
            </>
          }
          bodyZh={<>每一道第 1(a) 题都以「From Source 1」「According to Source 1」或「Using Source 1」开头。只读题目指定的那一份，即使旁边的资料 2 更长、看起来更有意思。</>}
        />
        <StatCard
          numeral="2"
          eyebrowEn="One exact fact"
          eyebrowZh="一个精确事实"
          bodyEn={
            <>
              Q1(a) is a "point" question, not a level-of-response question — the mark scheme lists specific
              acceptable answers. Anything else, however sensible, earns nothing.
            </>
          }
          bodyZh={<>第 1(a) 采「按点给分」，不是「按等级给分」——评分说明列出了可接受的具体答案。其他回答再合理，也不给分。</>}
        />
        <StatCard
          numeral="3"
          eyebrowEn="Then move on"
          eyebrowZh="然后翻页"
          bodyEn={
            <>
              A one-mark question does not deserve two minutes. The 8- and 16-mark questions later on the
              paper are where the real time investment pays back.
            </>
          }
          bodyZh={<>一道 1 分题不值得花两分钟。真正值得投入时间的，是后面的 8 分和 16 分题。</>}
        />
      </div>

      <Callout tone="violet" eyebrow={<Bi en="Why this tool exists" zh="为什么要做这个练习" />}>
        <Bi
          en={
            <>
              Every year, teachers see bright students lose Q1(a) by writing "9166" instead of "$9166", or by
              writing three sentences of explanation next to a one-mark question. Precise reading is a habit,
              and habits form through short, deliberate practice — which is what the five tabs after this
              one are for.
            </>
          }
          zh={
            <>
              每一年都会有很多优秀学生在第 1(a) 题失分——把 $9166 写成 9166，或者在一道 1 分题旁边写三句解释。
              「精确阅读」是一种习惯，而习惯要靠短小而刻意的练习来养成——接下来的五个标签页就是为此而设。
            </>
          }
        />
      </Callout>
    </div>
  );
}

function StatCard({
  numeral,
  eyebrowEn,
  eyebrowZh,
  bodyEn,
  bodyZh,
}: {
  numeral: string;
  eyebrowEn: string;
  eyebrowZh: string;
  bodyEn: React.ReactNode;
  bodyZh: React.ReactNode;
}) {
  return (
    <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6">
      <div className="flex items-baseline gap-4 mb-3">
        <span className="font-display text-[44px] leading-none text-[color:var(--color-violet)]">
          {numeral}
        </span>
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
          <Bi en={eyebrowEn} zh={eyebrowZh} />
        </p>
      </div>
      <p className="text-[14.5px] leading-[1.55] text-[color:var(--color-ink)]">
        <Bi en={bodyEn} zh={bodyZh} />
      </p>
    </div>
  );
}

/* ─────────── Anatomy ─────────── */

function AnatomyTab() {
  return (
    <div className="grid gap-12">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Four parts of every Q1(a) stem." zh="第 1(a) 题干的四个组成部分。" />
        </DisplayH2>
        <Body className="mt-5">
          <Bi
            en="Q1(a) stems are always short — usually 12 to 20 words. Learn the four parts and you can locate the answer without re-reading the source three times."
            zh="第 1(a) 题干总是很短，一般 12 到 20 个字。把这四个组成部分看熟，你就能定位答案，而不需要把资料读三遍。"
          />
        </Body>
      </div>

      {/* The colour-coded example */}
      <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-8 md:p-10">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-3)] mb-4">
          <Bi en="Example stem" zh="示例题干" />
        </p>
        <p className="font-display text-[22px] md:text-[28px] leading-[1.35] text-[color:var(--color-ink)]">
          <Bi
            en={
              <>
                <span className="bg-[color:var(--color-cobalt-soft)] px-1 rounded">From Source 1</span>,{' '}
                <span className="bg-[color:var(--color-forest-soft)] px-1 rounded">identify</span>{' '}
                <span className="bg-[color:var(--color-amber-soft)] px-1 rounded">the average loss</span>{' '}
                <span className="bg-[color:var(--color-violet-soft)] px-1 rounded">per vehicle theft in 2020</span>.
              </>
            }
            zh={
              <>
                <span className="bg-[color:var(--color-cobalt-soft)] px-1 rounded">根据资料 1</span>，
                <span className="bg-[color:var(--color-forest-soft)] px-1 rounded">找出</span>
                <span className="bg-[color:var(--color-violet-soft)] px-1 rounded">2020 年每辆车被盗</span>的
                <span className="bg-[color:var(--color-amber-soft)] px-1 rounded">平均损失</span>金额。
              </>
            }
          />
        </p>
        <p className="mt-4 font-mono text-[11px] text-[color:var(--color-ink-3)]">
          <Bi en="Real: June 2026 Paper 12, Q1(a)" zh="真题：2026 年 6 月 卷 12，第 1(a) 题" />
        </p>
      </div>

      {/* Four parts unpacked */}
      <div className="grid gap-4 md:grid-cols-2">
        {ANATOMY_PARTS.map((p, i) => {
          const tone = ['cobalt', 'forest', 'amber', 'violet'][i] as
            | 'cobalt'
            | 'forest'
            | 'amber'
            | 'violet';
          const bg =
            tone === 'cobalt'
              ? 'bg-[color:var(--color-cobalt-soft)]'
              : tone === 'forest'
                ? 'bg-[color:var(--color-forest-soft)]'
                : tone === 'amber'
                  ? 'bg-[color:var(--color-amber-soft)]'
                  : 'bg-[color:var(--color-violet-soft)]';
          const text =
            tone === 'cobalt'
              ? 'text-[color:var(--color-cobalt-deep)]'
              : tone === 'forest'
                ? 'text-[color:var(--color-forest-deep)]'
                : tone === 'amber'
                  ? 'text-[color:var(--color-amber-deep)]'
                  : 'text-[color:var(--color-violet-deep)]';
          return (
            <div key={p.label} className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6">
              <div className="flex items-baseline gap-3">
                <span className={`inline-block ${bg} ${text} font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] px-2 py-1 rounded`}>
                  <Bi en={`Part ${i + 1}`} zh={`第 ${i + 1} 部分`} />
                </span>
                <p className="font-display text-[18px] text-[color:var(--color-ink)]">
                  <Bi en={p.label} zh={p.labelZh} />
                </p>
              </div>
              <p className="mt-4 font-mono text-[13px] text-[color:var(--color-ink)] bg-[color:var(--color-paper-2)] px-3 py-2 rounded">
                {p.swatch}
              </p>
              <p className="mt-4 text-[14px] leading-[1.6] text-[color:var(--color-ink-2)]">
                <Bi en={p.explainEn} zh={p.explainZh} />
              </p>
            </div>
          );
        })}
      </div>

      <Callout tone="violet" eyebrow={<Bi en="Do this on the day" zh="考试当天这样做" />}>
        <Bi
          en={
            <>
              Underline all four parts of the stem in pencil before you look at the source. It takes ten
              seconds and stops you from writing a wrong-year, wrong-source, or wrong-noun answer.
            </>
          }
          zh={
            <>
              动笔前先用铅笔在题干上把这四部分都划出来。花十秒钟，可以避免把答案写成错误的年份、错误的资料，或错误的名词。
            </>
          }
        />
      </Callout>
    </div>
  );
}

/* ─────────── Traps ─────────── */

function TrapsTab() {
  return (
    <div className="grid gap-10">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Five ways to lose the mark." zh="五种丢分的方式。" />
        </DisplayH2>
        <Body className="mt-5">
          <Bi
            en="Every one of these has been marked wrong in a real 0457 script this year. Read them once now, and you can spend the exam avoiding them rather than falling into them."
            zh="以下每一种情况，都在今年真实的 0457 试卷上被判过错。现在读一遍，考场上就能规避，而不是踩进去。"
          />
        </Body>
      </div>

      <ol className="grid gap-4">
        {TRAPS.map((t, i) => (
          <li
            key={t.key}
            className="grid gap-6 md:grid-cols-[minmax(0,220px)_1fr] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6 md:p-7"
          >
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[46px] leading-none text-[color:var(--color-ink-3)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mt-2 font-display text-[19px] leading-[1.3] text-[color:var(--color-ink)]">
                <Bi en={t.labelEn} zh={t.labelZh} />
              </p>
            </div>

            <div>
              <p className="text-[14.5px] leading-[1.65] text-[color:var(--color-ink-2)]">
                <Bi en={t.explainEn} zh={t.explainZh} />
              </p>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                <div className="bg-[color:var(--color-ember-soft)] border-l-[3px] border-[color:var(--color-ember)] rounded-r-md px-4 py-3">
                  <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ember)]">
                    <Bi en="No mark" zh="不得分" />
                  </p>
                  <p className="mt-1 text-[13.5px] text-[color:var(--color-ink)]">{t.wrongEn}</p>
                </div>
                <div className="bg-[color:var(--color-forest-soft)] border-l-[3px] border-[color:var(--color-forest)] rounded-r-md px-4 py-3">
                  <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-forest)]">
                    <Bi en="Full mark" zh="得分" />
                  </p>
                  <p className="mt-1 text-[13.5px] text-[color:var(--color-ink)]">{t.rightEn}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─────────── Worked examples ─────────── */

function WorkedTab() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="grid gap-10">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Four real Q1(a)s, worked line by line." zh="四道真实的第 1(a) 题，逐句拆解。" />
        </DisplayH2>
        <Body className="mt-5">
          <Bi
            en="Every stem below is from a released 2026 paper. Read the source, decide on your answer, then open the mark scheme to see what earns and what does not."
            zh="以下每一道题干都来自 2026 年真题。先读资料，写下答案，再展开评分说明，看看什么能得分、什么不能。"
          />
        </Body>
      </div>

      <div className="grid gap-4">
        {WORKED_ITEMS.map((item, i) => {
          const open = openIdx === i;
          return (
            <article
              key={item.meta}
              className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                className="w-full text-left px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-6 hover:bg-[color:var(--color-paper-2)] transition-colors"
                aria-expanded={open}
              >
                <div>
                  <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-violet-deep)]">
                    {item.meta} · <Bi en={item.topicEn} zh={item.topicZh} />
                  </p>
                  <p className="mt-3 font-display text-[19px] md:text-[21px] leading-[1.35] text-[color:var(--color-ink)]">
                    <Bi en={item.stemEn} zh={item.stemZh} />
                  </p>
                </div>
                <span
                  aria-hidden
                  className={`shrink-0 mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full border border-[color:var(--color-line)] text-[color:var(--color-ink-2)] transition-transform ${open ? 'rotate-45' : ''}`}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </button>

              {open && (
                <div className="grid gap-6 border-t border-[color:var(--color-line)] px-6 md:px-8 py-6 md:py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <div>
                    <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
                      <Bi en="The source" zh="资料" />
                    </p>
                    <blockquote className="mt-3 text-[14.5px] leading-[1.65] text-[color:var(--color-ink)] bg-[color:var(--color-paper-2)] border-l-[3px] border-[color:var(--color-ink-3)] pl-4 pr-4 py-3 rounded-r-md">
                      <Bi en={item.sourceEn} zh={item.sourceZh} />
                    </blockquote>
                  </div>

                  <div className="grid gap-5">
                    <div>
                      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-forest)]">
                        <Bi en="Accepted answers" zh="可接受答案" />
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {item.acceptEn.map((a, k) => (
                          <li
                            key={k}
                            className="font-mono text-[13px] bg-[color:var(--color-forest-soft)] text-[color:var(--color-forest-deep)] px-3 py-1.5 rounded"
                          >
                            <Bi en={a} zh={item.acceptZh[k] ?? a} />
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ember)]">
                        <Bi en="Common wrong answers" zh="常见错误答案" />
                      </p>
                      <ul className="mt-3 divide-y divide-[color:var(--color-line-soft)]">
                        {item.rejectEn.map((r, k) => (
                          <li
                            key={k}
                            className="grid gap-1 py-3 first:pt-0 last:pb-0 text-[13.5px] leading-[1.55]"
                          >
                            <span className="font-mono text-[13px] text-[color:var(--color-ember)] line-through decoration-1 decoration-[color:var(--color-ember)]/60">
                              "{r.answer}"
                            </span>
                            <span className="text-[color:var(--color-ink-2)]">
                              <Bi en={r.whyEn} zh={r.whyZh} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-[color:var(--color-line)] pt-4">
                      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-violet-deep)]">
                        <Bi en="Take-away" zh="要点" />
                      </p>
                      <p className="mt-2 text-[14px] leading-[1.6] text-[color:var(--color-ink)]">
                        <Bi en={item.lessonEn} zh={item.lessonZh} />
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── Practice ─────────── */

interface PracticeState {
  answer: string;
  revealed: boolean;
  selfMark: 'correct' | 'wrong' | null;
}

function PracticeTab() {
  const [items, setItems] = usePersistentState<PracticeState[]>(
    TOOL_ID,
    'practice',
    PRACTICE_ITEMS.map(() => ({ answer: '', revealed: false, selfMark: null })),
  );

  const update = (i: number, patch: Partial<PracticeState>) =>
    setItems((cur) => cur.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const scored = items.filter((it) => it.selfMark !== null).length;
  const correct = items.filter((it) => it.selfMark === 'correct').length;

  return (
    <div className="grid gap-10">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] items-end">
        <div>
          <DisplayH2>
            <Bi en="Six original items, exam-style." zh="六道原创习题，仿真题风格。" />
          </DisplayH2>
          <Body className="mt-5 max-w-[62ch]">
            <Bi
              en="Read each source, write your answer, then reveal the acceptable answers and mark yourself. Aim for under a minute per item — Q1(a) does not deserve more."
              zh="逐题读资料、写答案、展开对照。目标每题一分钟以内——第 1(a) 题不值得花更多时间。"
            />
          </Body>
        </div>

        <div className="bg-[color:var(--color-violet-tint)] border border-[color:var(--color-violet-soft)] rounded-md p-5">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-violet-deep)]">
            <Bi en="Your score" zh="你的得分" />
          </p>
          <p className="mt-2 font-display text-[38px] leading-none text-[color:var(--color-ink)]">
            {correct}
            <span className="text-[color:var(--color-ink-3)] text-[24px]"> / {PRACTICE_ITEMS.length}</span>
          </p>
          <p className="mt-1 text-[12.5px] text-[color:var(--color-ink-3)]">
            <Bi en={`Marked ${scored} of ${PRACTICE_ITEMS.length}`} zh={`已批 ${scored} / ${PRACTICE_ITEMS.length}`} />
          </p>
        </div>
      </div>

      <ol className="grid gap-5">
        {PRACTICE_ITEMS.map((item, i) => {
          const s = items[i];
          return (
            <li
              key={item.n}
              className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6 md:p-7"
            >
              <div className="flex items-baseline justify-between gap-6 mb-4">
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
                  <Bi en={`Item ${item.n} · ${item.topicEn}`} zh={`第 ${item.n} 题 · ${item.topicZh}`} />
                </p>
                <span className="font-mono text-[11px] text-[color:var(--color-ink-3)]">[1]</span>
              </div>

              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
                <Bi en={item.sourceLabelEn} zh={item.sourceLabelZh} />
              </p>
              <blockquote className="mt-2 text-[14px] leading-[1.65] text-[color:var(--color-ink)] bg-[color:var(--color-paper-2)] border-l-[3px] border-[color:var(--color-ink-3)] pl-4 pr-4 py-3 rounded-r-md">
                <Bi en={item.sourceEn} zh={item.sourceZh} />
              </blockquote>

              <p className="mt-5 font-display text-[17px] leading-[1.4] text-[color:var(--color-ink)]">
                <Bi en={item.stemEn} zh={item.stemZh} />
              </p>

              <div className="mt-4 grid gap-3">
                <label className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
                  <Bi en="Your answer" zh="你的答案" />
                </label>
                <input
                  type="text"
                  value={s.answer}
                  onChange={(e) => update(i, { answer: e.target.value, revealed: false, selfMark: null })}
                  className="w-full bg-[color:var(--color-paper)] border-b-2 border-[color:var(--color-ink-3)] focus:border-[color:var(--color-violet)] outline-none font-mono text-[15px] text-[color:var(--color-ink)] py-2"
                  placeholder="…"
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => update(i, { revealed: !s.revealed })}
                  className="text-[13px] font-semibold px-4 py-2 rounded-full border border-[color:var(--color-ink)] text-[color:var(--color-ink)] hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-paper)] transition-colors"
                >
                  <Bi
                    en={s.revealed ? 'Hide mark scheme' : 'Reveal mark scheme'}
                    zh={s.revealed ? '隐藏评分说明' : '查看评分说明'}
                  />
                </button>

                {s.revealed && (
                  <div className="inline-flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
                      <Bi en="Mark yourself:" zh="给自己判卷：" />
                    </span>
                    <button
                      type="button"
                      onClick={() => update(i, { selfMark: 'correct' })}
                      className={`text-[13px] font-semibold px-3 py-1.5 rounded-full transition-colors ${
                        s.selfMark === 'correct'
                          ? 'bg-[color:var(--color-forest)] text-[color:var(--color-paper)]'
                          : 'bg-[color:var(--color-forest-soft)] text-[color:var(--color-forest-deep)] hover:bg-[color:var(--color-forest)] hover:text-[color:var(--color-paper)]'
                      }`}
                    >
                      ✓ <Bi en="1 mark" zh="1 分" />
                    </button>
                    <button
                      type="button"
                      onClick={() => update(i, { selfMark: 'wrong' })}
                      className={`text-[13px] font-semibold px-3 py-1.5 rounded-full transition-colors ${
                        s.selfMark === 'wrong'
                          ? 'bg-[color:var(--color-ember)] text-[color:var(--color-paper)]'
                          : 'bg-[color:var(--color-ember-soft)] text-[color:var(--color-ember)] hover:bg-[color:var(--color-ember)] hover:text-[color:var(--color-paper)]'
                      }`}
                    >
                      ✗ <Bi en="0" zh="0 分" />
                    </button>
                  </div>
                )}
              </div>

              {s.revealed && (
                <div className="mt-5 grid gap-4 border-t border-[color:var(--color-line)] pt-5">
                  <div>
                    <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-forest)]">
                      <Bi en="Accepted answers" zh="可接受答案" />
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {item.acceptEn.map((a, k) => (
                        <li
                          key={k}
                          className="font-mono text-[13px] bg-[color:var(--color-forest-soft)] text-[color:var(--color-forest-deep)] px-3 py-1.5 rounded"
                        >
                          <Bi en={a} zh={item.acceptZh[k] ?? a} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-violet-deep)]">
                      <Bi en="Watch out for" zh="注意事项" />
                    </p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[color:var(--color-ink-2)]">
                      <Bi en={item.markingEn} zh={item.markingZh} />
                    </p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ─────────── Checklist ─────────── */

function ChecklistTab() {
  const [checked, setChecked] = usePersistentState<boolean[]>(
    TOOL_ID,
    'checklist',
    new Array(CHECKLIST.length).fill(false),
  );
  const done = checked.filter(Boolean).length;

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)] md:gap-14 items-start">
      <div>
        <DisplayH2>
          <Bi en="Six habits for the exam desk." zh="六个考场习惯。" />
        </DisplayH2>
        <Body className="mt-5">
          <Bi
            en="Tick each habit off after you have practised it at least twice. In the exam, they should happen without thinking about them."
            zh="每一项练习两次以上再打勾。考场上，它们应当无需刻意提醒就能做到。"
          />
        </Body>

        <ul className="mt-8 grid gap-3">
          {CHECKLIST.map((c, i) => (
            <li key={i}>
              <label className="flex items-start gap-4 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-4 md:p-5 cursor-pointer hover:border-[color:var(--color-ink-3)] transition-colors">
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={(e) =>
                    setChecked((cur) => cur.map((v, idx) => (idx === i ? e.target.checked : v)))
                  }
                  className="mt-1 w-4 h-4 accent-[color:var(--color-violet)]"
                />
                <span className="text-[14.5px] leading-[1.55] text-[color:var(--color-ink)]">
                  <Bi en={c.en} zh={c.zh} />
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <aside className="bg-[color:var(--color-violet-tint)] border border-[color:var(--color-violet-soft)] rounded-md p-6 md:sticky md:top-[140px]">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-violet-deep)]">
          <Bi en="Habits ticked" zh="已勾选" />
        </p>
        <p className="mt-3 font-display text-[44px] leading-none text-[color:var(--color-ink)]">
          {done}
          <span className="text-[color:var(--color-ink-3)] text-[24px]"> / {CHECKLIST.length}</span>
        </p>
        <DisplayH3 className="mt-6">
          <Bi en="What next?" zh="接下来做什么？" />
        </DisplayH3>
        <p className="mt-3 text-[14px] leading-[1.6] text-[color:var(--color-ink-2)]">
          <Bi
            en={
              <>
                Once you can do all six on autopilot, move on to <strong>Q1(b) Statement Types</strong> — the
                next question on the paper, and the one that actually rewards the extra reasoning you were
                holding back here.
              </>
            }
            zh={
              <>
                当你可以下意识地做到全部六项，就前进到<strong>第 1(b) 题「陈述类型」</strong>——
                卷面上下一道题，也是真正奖励你多写理由的地方。
              </>
            }
          />
        </p>
      </aside>
    </div>
  );
}
