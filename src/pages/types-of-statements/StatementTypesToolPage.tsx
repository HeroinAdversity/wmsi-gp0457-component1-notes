import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, DisplayH1, DisplayH2, DisplayH3, Body, Eyebrow, Lede, Callout } from '../../components/primitives';
import { Bi } from '../../lib/LanguageContext';
import { ExportFooter } from '../../components/ExportFooter';
import { useNotesExport, nx, usePersistentState } from '../../lib/useNotesExport';
import {
  TOOL_ID,
  STATEMENT_TYPES,
  TERM_TILES,
  CONCEPT_CARDS,
  SORT_ITEMS,
  DRILL_ROUNDS,
  ARENA_QUESTIONS,
  ARENA_LEVELS,
  EXIT_CHECK_ITEMS,
  type StatementType,
} from './statementTypesData';
import { TabNoteBadge } from '../../components/NotesLayer';
import { usePublishTab } from '../../lib/activeTab';
import { Q1WorksheetPrinter } from '../q1/components/Q1WorksheetPrinter';

const TABS = [
  { id: 'overview', en: 'Overview', zh: '概览' },
  { id: 'terms', en: 'The Eight Terms', zh: '八种术语' },
  { id: 'sort', en: 'Sort & Classify', zh: '分类练习' },
  { id: 'drill', en: 'Generalisation Drill', zh: '概括训练' },
  { id: 'arena', en: 'Mixed Arena', zh: '混合竞技' },
  { id: 'exit', en: 'Exit Check', zh: '自检' },
] as const;
type TabId = (typeof TABS)[number]['id'];

/* ══════════════════ Root page ══════════════════ */
export function StatementTypesToolPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = (location.hash.replace('#', '') as TabId) || 'overview';
  const [tab, setTab] = useState<TabId>(TABS.some((t) => t.id === initial) ? initial : 'overview');
  usePublishTab(tab, TABS.find((t) => t.id === tab)?.en ?? '');

  const switchTab = (t: TabId) => {
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
    pageTitleEn: 'Q1(b) — Reading Between the Lines · Statement Types & Generalisations',
    subtitleEn: 'IGCSE Global Perspectives 0457 · Student worksheet',
    filenameStem: 'GP_Statement_Types',
    studentNameSelector: '#wne-student-name',
    exportDocxSelector: '#wne-export-docx',
    exportPdfSelector: '#wne-export-pdf',
    openNotesSelector: '#wne-open-notes',
    collect: () => collectStatements(),
  });

  return (
    <>
      {/* HERO */}
      <section className="pt-12 md:pt-16 pb-8">
        <Container size="wide">
          <Eyebrow color="amber">
            <Bi en="Q1(b) · Reading between the lines" zh="第 1(b) 题 · 识别陈述类型" />
          </Eyebrow>
          <DisplayH1 className="mt-3 max-w-[26ch]">
            <Bi
              en="Eight statement types. One is worth three marks."
              zh="八种陈述类型。其中一种直接考三分。"
            />
          </DisplayH1>
          <Lede className="mt-6">
            <Bi
              en={
                <>
                  Cambridge names eight statement types. <strong>Generalisation</strong> is tested directly in Q1(b) —
                  identify one from a source (1 mark) and explain why it is one (2 marks). Total: three marks in the first
                  five minutes of Paper 1. The other seven sharpen your reading for Q2–Q4.
                </>
              }
              zh={
                <>
                  剑桥列出八种陈述类型。<strong>概括性陈述 (Generalisation)</strong> 是第 1(b) 题直接考查的：
                  从资料中找出一个（1 分），并解释它为何属于此类（2 分）。共 3 分，在卷一开头五分钟内。
                  其余七种能帮你更清楚地读懂第 2 至 4 题。
                </>
              }
            />
          </Lede>
          <Q1WorksheetPrinter part={'b'} />
        </Container>
      </section>

      {/* STICKY TAB STRIP */}
      <div className="sticky top-[calc(var(--site-header-h,64px)+var(--section-bar-h,0px))] z-20 bg-[color:var(--color-paper)]/95 backdrop-blur-md border-b border-[color:var(--color-line)]">
        <Container size="wide">
          <nav
            className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Statement Types tabs"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => switchTab(t.id)}
                className={`shrink-0 text-[13.5px] font-semibold py-3.5 border-b-2 -mb-px transition-colors ${
                  tab === t.id
                    ? 'text-[color:var(--color-ink)] border-[color:var(--color-amber)]'
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
          {tab === 'overview' && <OverviewTab onGoto={switchTab} />}
          {tab === 'terms' && <TermsTab />}
          {tab === 'sort' && <SortClassifyTab />}
          {tab === 'drill' && <DrillTab />}
          {tab === 'arena' && <ArenaTab />}
          {tab === 'exit' && <ExitCheckTab />}
        </section>
      </Container>

      <ExportFooter toolId={TOOL_ID} />
    </>
  );
}

/* ─────────── Tab 1: explainer video block ─────────── */
const VIDEO_SRC = '/legacy/assets/statement-types-overview.mp4';
function ExplainerVideo() {
  const [failed, setFailed] = useState(false);
  return (
    <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <DisplayH3>
          <Bi en="Watch first: the eight terms in one go" zh="先看视频：一次讲完八种术语" />
        </DisplayH3>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
          <Bi en="▶ Explainer · 1(b)" zh="▶ 讲解 · 1(b)" />
        </span>
      </div>
      <Body className="mt-3 max-w-[68ch]">
        <Bi
          en={
            <>
              Start here if you're new to this topic — the video walks through all eight terms, spends the longest on{' '}
              <strong>generalisation</strong>, and uses the same social-media examples you'll meet in the Eight Terms tab.
            </>
          }
          zh={
            <>
              如果你是第一次接触这个话题，从这里开始。视频依次讲解八种术语，重点讲<strong>「概括」</strong>，
              例子与「八种术语」标签中一致。
            </>
          }
        />
      </Body>

      {!failed ? (
        <div className="mt-5 overflow-hidden rounded-md border border-[color:var(--color-line)] bg-black">
          <video
            className="w-full h-auto block"
            controls
            preload="metadata"
            playsInline
            onError={() => setFailed(true)}
          >
            <source src={VIDEO_SRC} type="video/mp4" onError={() => setFailed(true)} />
            Your browser doesn't support embedded video.
          </video>
        </div>
      ) : (
        <div className="mt-5 bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-5 text-[14px] leading-[1.6] text-[color:var(--color-ink-2)]">
          <Bi
            en={
              <>
                <strong>The video isn't loading right now.</strong> It may still be uploading, or you may be offline.
                Nothing is lost — every point the video makes is written out in full in the <strong>Eight Terms</strong>{' '}
                tab. Carry on there and try the video again later.
              </>
            }
            zh={
              <>
                <strong>视频暂时无法加载。</strong>可能仍在上传，或你目前处于离线状态。
                不影响学习——视频讲解的所有要点都在<strong>「八种术语」</strong>标签中完整呈现。
              </>
            }
          />
        </div>
      )}

      {!failed && (
        <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
          <span className="font-mono uppercase tracking-[0.12em] text-[color:var(--color-ink-3)] px-2.5 py-1 bg-[color:var(--color-paper-2)] rounded">
            <Bi en="Use CC if the audio is unclear" zh="音频不清可开字幕" />
          </span>
          <span className="font-mono uppercase tracking-[0.12em] text-[color:var(--color-ink-3)] px-2.5 py-1 bg-[color:var(--color-paper-2)] rounded">
            <Bi en="Pause on each example" zh="每个例子处暂停" />
          </span>
          <span className="font-mono uppercase tracking-[0.12em] text-[color:var(--color-ink-3)] px-2.5 py-1 bg-[color:var(--color-paper-2)] rounded">
            <Bi en="Then continue to Eight Terms" zh="然后进入「八种术语」" />
          </span>
        </div>
      )}
    </div>
  );
}

/* ══════════════════ Tab 1: Overview ══════════════════ */
function OverviewTab({ onGoto }: { onGoto: (t: TabId) => void }) {
  return (
    <div className="grid gap-12">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Why this matters" zh="为何重要" />
        </DisplayH2>
        <Body className="mt-5">
          <Bi
            en={
              <>
                The syllabus names eight terms candidates should understand when reading exam sources:{' '}
                <strong>bias, claim, fact, generalisation, opinion, prediction, value,</strong> and{' '}
                <strong>vested interest</strong>. One of these — generalisation — is tested directly. The rest sharpen
                your reading for Questions 2, 3 and 4.
              </>
            }
            zh={
              <>
                考试大纲列出八种候选人须理解的术语：<strong>偏见、主张、事实、概括、观点、预测、价值观、既得利益</strong>。
                其中「概括」直接考查；其余则帮助你更好地读懂第 2、3、4 题。
              </>
            }
          />
        </Body>
      </div>

      <Callout tone="amber" eyebrow={<Bi en="Priority for this lesson" zh="本课重点" />}>
        <Bi
          en={
            <>
              Q1(b)(i) asks you to identify which statement from a source <em>is</em> a generalisation. Q1(b)(ii) asks
              you to explain <strong>why</strong> — 3 marks total, in the first five minutes of the paper.
            </>
          }
          zh={
            <>
              第 1(b)(i) 题要求你指认哪句话是「概括」；第 1(b)(ii) 题要求你解释「为何」——共 3 分，
              在卷一开头五分钟内完成。
            </>
          }
        />
      </Callout>

      <ExplainerVideo />

      <div>
        <DisplayH3>
          <Bi en="The eight terms at a glance" zh="八种术语一览" />
        </DisplayH3>
        <Body className="mt-4 max-w-[68ch]">
          <Bi
            en="Tap through the Eight Terms tab for full definitions and examples. This map shows where each term resurfaces across the paper."
            zh="点击「八种术语」标签查看完整定义与例子。下方地图显示每个术语在试卷中的出现位置。"
          />
        </Body>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {TERM_TILES.map((t) => (
            <div
              key={t.name}
              className={`bg-[color:var(--color-paper)] border rounded-md p-5 ${
                t.priority
                  ? 'border-[color:var(--color-amber)] border-l-[4px]'
                  : 'border-[color:var(--color-line)]'
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-[19px] text-[color:var(--color-ink)]">{t.name}</p>
                <p
                  className={`font-mono text-[11px] font-semibold uppercase tracking-[0.12em] ${
                    t.priority ? 'text-[color:var(--color-amber)]' : 'text-[color:var(--color-ink-3)]'
                  }`}
                >
                  {t.where}
                </p>
              </div>
              <p className="mt-2 text-[14px] leading-[1.55] text-[color:var(--color-ink-2)]">{t.def}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-5">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
            1 MARK
          </p>
          <p className="mt-2 font-display text-[18px] text-[color:var(--color-ink)]">Question 1(b)(i)</p>
          <p className="mt-2 text-[14px] text-[color:var(--color-ink-2)]">
            Identify which of three statements from the source is a generalisation. One correct answer only.
          </p>
        </div>
        <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-5">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
            2 MARKS
          </p>
          <p className="mt-2 font-display text-[18px] text-[color:var(--color-ink)]">Question 1(b)(ii)</p>
          <p className="mt-2 text-[14px] text-[color:var(--color-ink-2)]">
            Explain why your chosen statement is a generalisation — link clearly to a small sample being applied to
            everyone, or an "always/never" claim that isn't always true.
          </p>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => onGoto('drill')}
          className="text-[13.5px] font-semibold px-5 py-2.5 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-ink-2)] transition-colors"
        >
          <Bi en="Jump to the Generalisation Drill →" zh="直接开始「概括训练」→" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════ Tab 2: The Eight Terms ══════════════════ */
function TermsTab() {
  const [activeId, setActiveId] = useState<string>(CONCEPT_CARDS[0].id);
  const active = CONCEPT_CARDS.find((c) => c.id === activeId)!;

  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="The Eight Terms, in detail" zh="八种术语详解" />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en={
              <>
                All examples are built around one strand: <strong>youth mental health and social media use</strong>. Read
                each statement carefully — the wording is what signals the type, not the topic.
              </>
            }
            zh={
              <>
                所有例子都围绕同一主线：<strong>青少年心理健康与社交媒体使用</strong>。仔细阅读每一句话——
                真正决定类型的是语言方式，而不是话题。
              </>
            }
          />
        </Body>
      </div>

      <div className="flex flex-wrap gap-2">
        {CONCEPT_CARDS.map((c) => {
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveId(c.id)}
              className={`text-[13px] font-semibold px-3.5 py-2 rounded-full border transition-colors ${
                isActive
                  ? c.priority
                    ? 'bg-[color:var(--color-amber)] border-[color:var(--color-amber)] text-[color:var(--color-paper)]'
                    : 'bg-[color:var(--color-ink)] border-[color:var(--color-ink)] text-[color:var(--color-paper)]'
                  : 'bg-[color:var(--color-paper)] border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]'
              }`}
            >
              {c.priority && !isActive ? '★ ' : ''}
              {c.name}
            </button>
          );
        })}
      </div>

      <div
        className={`bg-[color:var(--color-paper)] border rounded-md p-6 md:p-7 ${
          active.priority ? 'border-[color:var(--color-amber)] border-l-[4px]' : 'border-[color:var(--color-line)]'
        }`}
      >
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <p className="font-display text-[22px] text-[color:var(--color-ink)]">
            {active.name} <span className="ml-2 text-[15px] text-[color:var(--color-ink-3)]">{active.zh}</span>
          </p>
          <p
            className={`font-mono text-[11px] font-semibold uppercase tracking-[0.12em] ${
              active.priority ? 'text-[color:var(--color-amber)]' : 'text-[color:var(--color-ink-3)]'
            }`}
          >
            {active.badge}
          </p>
        </div>
        <p
          className={`text-[15px] leading-[1.6] mb-5 ${
            active.priority
              ? 'text-[color:var(--color-ink)] bg-[color:var(--color-amber-soft)] border-l-[3px] border-[color:var(--color-amber)] p-4 rounded-r-md'
              : 'text-[color:var(--color-ink-2)]'
          }`}
        >
          {active.def}
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-[color:var(--color-forest-soft)] border border-[color:var(--color-forest)]/40 rounded-md p-4">
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-forest-deep)]">
              {active.isExampleLabel}
            </p>
            <p className="mt-2 text-[14px] italic leading-[1.6] text-[color:var(--color-ink)]">{active.isExample}</p>
          </div>
          <div className="bg-[color:var(--color-ember-soft)] border border-[color:var(--color-ember)]/40 rounded-md p-4">
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ember)]">
              {active.notLabel}
            </p>
            <p className="mt-2 text-[14px] italic leading-[1.6] text-[color:var(--color-ink)]">{active.notExample}</p>
          </div>
        </div>

        {active.note && (
          <p className="mt-5 text-[13.5px] leading-[1.55] text-[color:var(--color-ink-2)]">
            <strong>Note:</strong> {active.note}
          </p>
        )}
        {active.signalWords && (
          <div className="mt-5 flex flex-wrap gap-2">
            {active.signalWords.map((w) => (
              <span
                key={w}
                className="font-mono text-[12px] px-2.5 py-1 rounded-md bg-[color:var(--color-amber-soft)] text-[color:var(--color-amber-deep)]"
              >
                {w}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════ Tab 3: Sort & Classify ══════════════════ */
interface SortEntry {
  selected: StatementType | null;
  correct: boolean;
}

function SortClassifyTab() {
  const [state, setState] = usePersistentState<SortEntry[]>(
    TOOL_ID,
    'sort',
    SORT_ITEMS.map(() => ({ selected: null, correct: false })),
  );
  const correctCount = state.filter((s) => s.correct).length;

  const choose = (idx: number, type: StatementType) => {
    setState((cur) =>
      cur.map((s, i) => {
        if (i !== idx || s.correct) return s;
        return { selected: type, correct: type === SORT_ITEMS[idx].answer };
      }),
    );
  };
  const reset = () => setState(SORT_ITEMS.map(() => ({ selected: null, correct: false })));

  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Sort & Classify" zh="分类练习" />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en="Ten statements, all from the same strand (youth mental health and social media). Choose the correct statement type for each. Difficulty increases as you go — the last three are exam-realistic and deliberately ambiguous."
            zh="共十句话，均围绕青少年心理健康与社交媒体。为每一句选出正确的陈述类型。难度递增——最后三题风格接近考题，有意具有歧义性。"
          />
        </Body>
      </div>

      <div className="flex flex-wrap items-center gap-3 justify-between bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md px-5 py-3">
        <p className="font-mono text-[12.5px] text-[color:var(--color-ink)]">
          <strong>{correctCount}</strong> / {SORT_ITEMS.length} correct
        </p>
        <button
          type="button"
          onClick={reset}
          className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full border border-[color:var(--color-ink-3)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)] transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4">
        {SORT_ITEMS.map((item, idx) => {
          const entry = state[idx];
          const done = entry.correct;
          return (
            <div
              key={idx}
              className={`bg-[color:var(--color-paper)] border rounded-md p-5 md:p-6 ${
                done
                  ? 'border-[color:var(--color-forest)]/50'
                  : entry.selected && !entry.correct
                  ? 'border-[color:var(--color-ember)]/40'
                  : 'border-[color:var(--color-line)]'
              }`}
            >
              <p className="text-[14.5px] leading-[1.6] text-[color:var(--color-ink)]">
                <span className="font-mono text-[11.5px] text-[color:var(--color-ink-3)] mr-2">{idx + 1}.</span>
                {item.stmt}
                <span className="block mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-ink-3)]">
                  {item.src}
                </span>
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {STATEMENT_TYPES.map((t) => {
                  const isChosen = entry.selected === t;
                  const showAsCorrect = isChosen && entry.correct;
                  const showAsWrong = isChosen && !entry.correct;
                  let cls =
                    'text-[12.5px] font-semibold px-3 py-1.5 rounded-full border transition-colors border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]';
                  if (showAsCorrect) {
                    cls =
                      'text-[12.5px] font-semibold px-3 py-1.5 rounded-full border bg-[color:var(--color-forest-soft)] border-[color:var(--color-forest)] text-[color:var(--color-forest-deep)]';
                  } else if (showAsWrong) {
                    cls =
                      'text-[12.5px] font-semibold px-3 py-1.5 rounded-full border bg-[color:var(--color-ember-soft)] border-[color:var(--color-ember)] text-[color:var(--color-ember)]';
                  } else if (done) {
                    cls =
                      'text-[12.5px] font-semibold px-3 py-1.5 rounded-full border border-[color:var(--color-line)] text-[color:var(--color-ink-3)] cursor-default';
                  }
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={done}
                      onClick={() => choose(idx, t)}
                      className={cls}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              {entry.selected && (
                <p
                  className={`mt-4 text-[13.5px] leading-[1.55] ${
                    entry.correct ? 'text-[color:var(--color-forest-deep)]' : 'text-[color:var(--color-ember)]'
                  }`}
                >
                  {entry.correct ? (
                    <>
                      <strong>✓ Correct.</strong> {item.explain}
                    </>
                  ) : (
                    <>
                      <strong>✗ Not quite.</strong> Think again — what does the wording actually do?
                    </>
                  )}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════ Tab 4: Generalisation Drill ══════════════════ */
interface DrillState {
  round: number;
  xp: number;
  rounds: { step: 1 | 2 | 3; chosenIndex: number | null; explain: string }[];
}

function DrillTab() {
  const [state, setState] = usePersistentState<DrillState>(TOOL_ID, 'drill', {
    round: 0,
    xp: 0,
    rounds: DRILL_ROUNDS.map(() => ({ step: 1 as const, chosenIndex: null, explain: '' })),
  });
  const [toast, setToast] = useState<string | null>(null);
  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const chooseStatement = (i: number) => {
    const r = DRILL_ROUNDS[state.round];
    if (!r) return;
    if (i === r.correctIndex) {
      setState((cur) => ({
        ...cur,
        xp: cur.xp + 1,
        rounds: cur.rounds.map((rr, idx) =>
          idx === cur.round ? { ...rr, chosenIndex: i, step: 2 } : rr,
        ),
      }));
      flash('+1 XP — correct statement spotted!');
    } else {
      setState((cur) => ({
        ...cur,
        rounds: cur.rounds.map((rr, idx) => (idx === cur.round ? { ...rr, chosenIndex: i } : rr)),
      }));
      flash('Not quite — look again.');
    }
  };
  const submitExplain = () => {
    const cur = state.rounds[state.round];
    if (!cur || cur.explain.trim().length < 8) {
      flash('Write a little more before checking — aim for a full sentence.');
      return;
    }
    setState((s) => ({
      ...s,
      xp: s.xp + 2,
      rounds: s.rounds.map((rr, idx) => (idx === s.round ? { ...rr, step: 3 } : rr)),
    }));
    flash('+2 XP — nice reasoning, compare it to the model!');
  };
  const nextRound = () => setState((s) => ({ ...s, round: s.round + 1 }));
  const restart = () =>
    setState({
      round: 0,
      xp: 0,
      rounds: DRILL_ROUNDS.map(() => ({ step: 1 as const, chosenIndex: null, explain: '' })),
    });

  const finished = state.round >= DRILL_ROUNDS.length;
  const round = DRILL_ROUNDS[state.round];
  const roundState = state.rounds[state.round];
  const xpPct = Math.min(100, Math.round((state.xp / (DRILL_ROUNDS.length * 3)) * 100));

  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi
            en="Generalisation Drill — the 1(b)(i) + 1(b)(ii) two-step"
            zh="概括训练——第 1(b)(i) 与 1(b)(ii) 两步走"
          />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en="This is the exact shape of the exam question. Step 1: spot the generalisation among three statements. Step 2: explain why, in your own words. Five rounds, each worth up to 3 XP — matching the 3 real marks on the paper."
            zh="这就是考题的实际形式：第 1 步在三句话中找出「概括」，第 2 步用自己的话解释「为何」。五轮，每轮最多 3 XP，对应真实的 3 分。"
          />
        </Body>
      </div>

      <div className="flex flex-wrap items-center gap-4 justify-between bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-5">
        <div className="flex items-center gap-3">
          <p className="font-display text-[18px] text-[color:var(--color-ink)]">
            <span aria-hidden="true">⚡</span> Generalisation Hunter
          </p>
          <span className="text-[13px] font-semibold px-3 py-1 rounded-full bg-[color:var(--color-amber)] text-[color:var(--color-paper)]">
            {state.xp} XP
          </span>
        </div>
        <div className="w-full md:w-[220px]">
          <div className="h-2 bg-[color:var(--color-line)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[color:var(--color-amber)] to-[color:var(--color-forest)] transition-all"
              style={{ width: `${xpPct}%` }}
            />
          </div>
          <p className="mt-1 font-mono text-[11px] text-[color:var(--color-ink-3)]">
            {state.xp} / {DRILL_ROUNDS.length * 3} XP
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {DRILL_ROUNDS.map((_, i) => {
          const done = i < state.round;
          const active = i === state.round;
          return (
            <span
              key={i}
              className={`h-2.5 flex-1 rounded-full ${
                done
                  ? 'bg-[color:var(--color-forest)]'
                  : active
                  ? 'bg-[color:var(--color-amber)]'
                  : 'bg-[color:var(--color-line)]'
              }`}
            />
          );
        })}
      </div>

      <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6 md:p-7">
        {finished ? (
          <div className="text-center">
            <p className="font-display text-[22px] text-[color:var(--color-ink)]">Drill complete!</p>
            <p className="mt-3 text-[15px] text-[color:var(--color-ink-2)]">
              You earned <strong>{state.xp} XP</strong> across {DRILL_ROUNDS.length} rounds (max{' '}
              {DRILL_ROUNDS.length * 3} XP).
            </p>
            <p className="mt-2 text-[13.5px] text-[color:var(--color-ink-3)]">
              This is exactly the two-step Q1(b) asks for every time: spot it, then explain why. Head to Exit Check to
              lock it in.
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-5 text-[13px] font-semibold px-5 py-2.5 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-ink-2)]"
            >
              Play again
            </button>
          </div>
        ) : (
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
              {round!.source} · Round {state.round + 1} of {DRILL_ROUNDS.length} ·{' '}
              {roundState!.step === 1 ? 'STEP 1 — 1(b)(i)' : roundState!.step === 2 ? 'STEP 2 — 1(b)(ii)' : 'MODEL ANSWER'}
            </p>

            {roundState!.step === 1 && (
              <>
                <p className="mt-3 font-semibold text-[15px] text-[color:var(--color-ink)]">
                  Which of these statements is a generalisation?
                </p>
                <div className="mt-4 grid gap-2.5">
                  {round!.statements.map((s, i) => {
                    const isChosen = roundState!.chosenIndex === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => chooseStatement(i)}
                        className={`text-left text-[14px] leading-[1.55] p-4 rounded-md border transition-colors ${
                          isChosen && i !== round!.correctIndex
                            ? 'bg-[color:var(--color-ember-soft)] border-[color:var(--color-ember)]/60 text-[color:var(--color-ink)]'
                            : 'bg-[color:var(--color-paper-2)] border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]'
                        }`}
                      >
                        {i + 1}. {s}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {roundState!.step === 2 && (
              <>
                <p className="mt-3 font-semibold text-[14.5px] text-[color:var(--color-ink)]">
                  You chose: <em>"{round!.statements[roundState!.chosenIndex!]}"</em>
                </p>
                <p className="mt-3 text-[13.5px] leading-[1.55] text-[color:var(--color-ink-2)]">
                  Now explain WHY this is a generalisation. Think: what small group is being stretched to cover
                  everyone? Or what absolute word is being used?
                </p>
                <textarea
                  value={roundState!.explain}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      rounds: s.rounds.map((rr, idx) =>
                        idx === s.round ? { ...rr, explain: e.target.value } : rr,
                      ),
                    }))
                  }
                  className="mt-4 w-full min-h-[110px] p-3 text-[14px] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-amber)] focus:ring-1 focus:ring-[color:var(--color-amber)]"
                  placeholder="Type your explanation here..."
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-[11.5px] text-[color:var(--color-ink-3)]">
                    {roundState!.explain.trim() ? roundState!.explain.trim().split(/\s+/).length : 0} words
                  </span>
                  <button
                    type="button"
                    onClick={submitExplain}
                    className="text-[13px] font-semibold px-4 py-2 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-ink-2)]"
                  >
                    Check my thinking
                  </button>
                </div>
              </>
            )}

            {roundState!.step === 3 && (
              <>
                <p className="mt-3 font-semibold text-[14.5px] text-[color:var(--color-ink)]">
                  Correct statement: <em>"{round!.statements[round!.correctIndex]}"</em>
                </p>
                <div className="mt-4 bg-[color:var(--color-forest-soft)] border-l-[3px] border-[color:var(--color-forest)] p-4 rounded-r-md">
                  <p className="text-[14px] leading-[1.6] text-[color:var(--color-ink)]">
                    <strong>Model explanation:</strong> {round!.modelExplain}
                  </p>
                </div>
                <p className="mt-3 text-[13px] leading-[1.55] text-[color:var(--color-ink-3)]">
                  Compare this to what you wrote. Did you name the specific small sample, or the specific absolute
                  word? That's what earns both marks in the real exam.
                </p>
                <button
                  type="button"
                  onClick={nextRound}
                  className="mt-5 text-[13px] font-semibold px-5 py-2.5 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-ink-2)]"
                >
                  Next round →
                </button>
              </>
            )}
          </>
        )}
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-1/2 top-16 -translate-x-1/2 z-40 bg-[color:var(--color-ink)] text-[color:var(--color-paper)] px-4 py-2 rounded-full text-[13px] font-semibold shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

/* ══════════════════ Tab 5: Mixed Arena ══════════════════ */
interface ArenaState {
  running: boolean;
  qIndex: number;
  score: number;
  streak: number;
  bestStreak: number;
  timer: number;
  order: number[];
  chosen: number | null;
  finished: boolean;
}

function ArenaTab() {
  const [state, setState] = useState<ArenaState>({
    running: false,
    qIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    timer: 15,
    order: [],
    chosen: null,
    finished: false,
  });
  const timerRef = useRef<number | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  useEffect(() => () => stopTimer(), []);

  const shuffle = (n: number) => {
    const a = Array.from({ length: n }, (_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const startArena = () => {
    stopTimer();
    setState((s) => ({
      running: true,
      qIndex: 0,
      score: 0,
      streak: 0,
      bestStreak: s.bestStreak,
      timer: 15,
      order: shuffle(ARENA_QUESTIONS.length),
      chosen: null,
      finished: false,
    }));
  };

  useEffect(() => {
    if (!state.running || state.finished) return;
    if (state.chosen !== null) return;
    stopTimer();
    timerRef.current = window.setInterval(() => {
      const cur = stateRef.current;
      if (cur.timer <= 1) {
        stopTimer();
        answer(-1);
      } else {
        setState((s) => ({ ...s, timer: s.timer - 1 }));
      }
    }, 1000);
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.qIndex, state.running, state.chosen]);

  const answer = (idx: number) => {
    stopTimer();
    const cur = stateRef.current;
    const q = ARENA_QUESTIONS[cur.order[cur.qIndex]];
    const correct = idx === q.answer;
    setState((s) => {
      const newScore = correct ? s.score + 1 : s.score;
      const newStreak = correct ? s.streak + 1 : 0;
      return {
        ...s,
        chosen: idx,
        score: newScore,
        streak: newStreak,
        bestStreak: Math.max(s.bestStreak, newStreak),
      };
    });
    window.setTimeout(() => {
      setState((s) => {
        const next = s.qIndex + 1;
        if (next >= ARENA_QUESTIONS.length) {
          return { ...s, finished: true, running: false };
        }
        return { ...s, qIndex: next, timer: 15, chosen: null };
      });
    }, 1000);
  };

  const level = ARENA_LEVELS.slice().reverse().find((l) => state.score >= l.min)!;
  const currentQ = state.order.length ? ARENA_QUESTIONS[state.order[state.qIndex]] : null;

  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Mixed Retrieval Arena" zh="混合竞技" />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en="All eight terms, mixed and timed. Fifteen seconds per question — this mirrors the pace you need on exam day. Beat your streak."
            zh="八种术语混合出题，每题限时 15 秒——与考场节奏一致。挑战你的连胜纪录。"
          />
        </Body>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-5">
        <p className="font-display text-[16px] text-[color:var(--color-ink)]">{level.title}</p>
        <p
          className={`font-mono text-[22px] tabular-nums ${
            state.timer <= 5 && state.running ? 'text-[color:var(--color-ember)]' : 'text-[color:var(--color-ink)]'
          }`}
        >
          {state.timer}
        </p>
      </div>

      <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6 md:p-7">
        {state.finished ? (
          <>
            <p className="font-display text-[20px] text-[color:var(--color-ink)]">Session complete</p>
            <p className="mt-3 text-[14.5px] text-[color:var(--color-ink-2)]">
              Final score: <strong>{state.score}</strong> / {ARENA_QUESTIONS.length}. Best streak:{' '}
              <strong>{state.bestStreak}</strong>.
            </p>
            <button
              type="button"
              onClick={startArena}
              className="mt-5 text-[13px] font-semibold px-5 py-2.5 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-ink-2)]"
            >
              Play again
            </button>
          </>
        ) : !state.running || !currentQ ? (
          <>
            <p className="text-[14.5px] leading-[1.6] text-[color:var(--color-ink-2)]">
              Press Start to begin. Each question shows one statement — choose the type before the timer runs out.
            </p>
            <button
              type="button"
              onClick={startArena}
              className="mt-5 text-[13.5px] font-semibold px-5 py-2.5 rounded-full bg-[color:var(--color-amber)] text-[color:var(--color-paper)] hover:opacity-90"
            >
              Start Arena
            </button>
          </>
        ) : (
          <>
            <p className="text-[15px] leading-[1.6] text-[color:var(--color-ink)]">{currentQ.q}</p>
            <div className="mt-5 grid gap-2.5">
              {currentQ.opts.map((o, i) => {
                const isChosen = state.chosen === i;
                const showCorrect = state.chosen !== null && i === currentQ.answer;
                const showWrong = isChosen && i !== currentQ.answer;
                let cls =
                  'text-left text-[14px] font-semibold p-3.5 rounded-md border transition-colors border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)] bg-[color:var(--color-paper-2)]';
                if (showCorrect) {
                  cls =
                    'text-left text-[14px] font-semibold p-3.5 rounded-md border bg-[color:var(--color-forest-soft)] border-[color:var(--color-forest)] text-[color:var(--color-forest-deep)]';
                } else if (showWrong) {
                  cls =
                    'text-left text-[14px] font-semibold p-3.5 rounded-md border bg-[color:var(--color-ember-soft)] border-[color:var(--color-ember)] text-[color:var(--color-ember)]';
                }
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={state.chosen !== null}
                    onClick={() => answer(i)}
                    className={cls}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ArenaStat label="Score" value={String(state.score)} />
        <ArenaStat label="Streak" value={String(state.streak)} />
        <ArenaStat label="Best streak" value={String(state.bestStreak)} />
        <ArenaStat
          label="Question"
          value={`${state.running || state.finished ? Math.min(state.qIndex + (state.finished ? 0 : 1), ARENA_QUESTIONS.length) : 0}/${ARENA_QUESTIONS.length}`}
        />
      </div>
    </div>
  );
}
function ArenaStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-4">
      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
        {label}
      </p>
      <p className="mt-1 font-display text-[22px] text-[color:var(--color-ink)]">{value}</p>
    </div>
  );
}

/* ══════════════════ Tab 6: Exit Check ══════════════════ */
function ExitCheckTab() {
  const [checked, setChecked] = usePersistentState<boolean[]>(
    TOOL_ID,
    'exit',
    new Array(EXIT_CHECK_ITEMS.length).fill(false),
  );
  const [reflection, setReflection] = usePersistentState<string>(
    TOOL_ID,
    'reflection',
    '',
    (raw) => raw,
    (v) => v,
  );
  const done = checked.filter(Boolean).length;
  const pct = Math.round((done / EXIT_CHECK_ITEMS.length) * 100);

  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Exit Check" zh="自我检查" />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en="Before you finish, check off what you can now do confidently. Be honest — this is for you, not for marks."
            zh="结束前，如实勾选你已能做到的项目。这是为了你自己，不为得分。"
          />
        </Body>
      </div>

      <div className="max-w-[68ch]">
        <div className="h-2.5 bg-[color:var(--color-paper-2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[color:var(--color-amber)] to-[color:var(--color-forest)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[12px] text-[color:var(--color-ink)]">
          {done} / {EXIT_CHECK_ITEMS.length} <Bi en="complete" zh="已完成" /> · {pct}%
        </p>
      </div>

      <div className="grid gap-2.5 max-w-[72ch]">
        {EXIT_CHECK_ITEMS.map((item, i) => (
          <label
            key={i}
            className="flex items-start gap-3 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-4 cursor-pointer hover:border-[color:var(--color-ink)] transition-colors"
          >
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={(e) => {
                const next = [...checked];
                next[i] = e.target.checked;
                setChecked(next);
              }}
              className="mt-1 w-4 h-4 accent-[color:var(--color-amber)]"
            />
            <span className="text-[14.5px] leading-[1.55] text-[color:var(--color-ink)]">{item}</span>
          </label>
        ))}
      </div>

      <div className="max-w-[72ch]">
        <p className="font-semibold text-[14.5px] text-[color:var(--color-ink)] mb-2">
          One sentence: what's the difference between a fact and a generalisation?
        </p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="w-full min-h-[100px] p-3 text-[14.5px] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-amber)] focus:ring-1 focus:ring-[color:var(--color-amber)]"
          placeholder="Write your answer here — this is a good sentence to keep in your journal…"
        />
      </div>
    </div>
  );
}

/* ══════════════════ Notes/export: collect() ══════════════════ */
function collectStatements() {
  const sections: Array<{ heading: string; blocks: any[] }> = [];
  const read = <T,>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(`wne_${TOOL_ID}_${key}`);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };

  // Sort & Classify
  const sortState = read<{ selected: string | null; correct: boolean }[]>(
    'sort',
    SORT_ITEMS.map(() => ({ selected: null, correct: false })),
  );
  const correct = sortState.filter((s) => s.correct).length;
  sections.push({
    heading: 'Sort & Classify',
    blocks: [
      nx.p([nx.text(`${correct} of ${SORT_ITEMS.length} correct`, { bold: true })]),
      ...sortState.flatMap((s, i) => {
        if (!s.selected) return [];
        return [
          nx.p([
            nx.text(`${i + 1}. `, { bold: true }),
            nx.text(SORT_ITEMS[i].stmt),
          ]),
          nx.p([
            nx.text(s.correct ? '✓ Chose: ' : '✗ Chose: ', { bold: true }),
            nx.text(String(s.selected)),
            nx.text(s.correct ? '' : ` (correct answer: ${SORT_ITEMS[i].answer})`),
          ]),
        ];
      }),
    ],
  });

  // Drill
  const drillState = read<{ round: number; xp: number; rounds: { step: number; chosenIndex: number | null; explain: string }[] }>('drill', {
    round: 0,
    xp: 0,
    rounds: DRILL_ROUNDS.map(() => ({ step: 1, chosenIndex: null, explain: '' })),
  });
  const drillBlocks: any[] = [
    nx.p([nx.text(`XP: `, { bold: true }), nx.text(`${drillState.xp} / ${DRILL_ROUNDS.length * 3}`)]),
    nx.p([nx.text(`Rounds completed: `, { bold: true }), nx.text(`${drillState.round}`)]),
  ];
  drillState.rounds.forEach((rr, i) => {
    if (rr.chosenIndex === null && !rr.explain) return;
    drillBlocks.push(nx.h(3, `Round ${i + 1} — ${DRILL_ROUNDS[i].source}`));
    if (rr.chosenIndex !== null) {
      drillBlocks.push(
        nx.p([
          nx.text('Chosen statement: ', { bold: true }),
          nx.text(DRILL_ROUNDS[i].statements[rr.chosenIndex]),
        ]),
      );
    }
    if (rr.explain.trim()) {
      drillBlocks.push(nx.p([nx.text('Your explanation: ', { bold: true }), nx.text(rr.explain.trim())]));
    }
  });
  sections.push({ heading: 'Generalisation Drill', blocks: drillBlocks });

  // Exit Check
  const exitState = read<boolean[]>('exit', new Array(EXIT_CHECK_ITEMS.length).fill(false));
  const doneCount = exitState.filter(Boolean).length;
  const exitBlocks: any[] = [
    nx.p([nx.text(`${doneCount} of ${EXIT_CHECK_ITEMS.length} ticked`, { bold: true })]),
  ];
  EXIT_CHECK_ITEMS.forEach((item, i) => {
    exitBlocks.push(nx.p((exitState[i] ? '☑ ' : '☐ ') + item));
  });

  // Reflection
  let reflection = '';
  try {
    reflection = localStorage.getItem(`wne_${TOOL_ID}_reflection`) || '';
  } catch {}
  if (reflection) {
    exitBlocks.push(nx.h(3, 'Reflection — fact vs generalisation'));
    exitBlocks.push(nx.p(reflection));
  }
  sections.push({ heading: 'Exit Check', blocks: exitBlocks });

  return { sections };
}
