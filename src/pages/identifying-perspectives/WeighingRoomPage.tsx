import { useEffect, useMemo, useState } from 'react';
import { NoteTile, TileGrid } from '../../components/NoteTiles';
import {
  Container,
  DisplayH2,
  DisplayH3,
  Eyebrow,
  Body,
} from '../../components/primitives';
import { Bi, useLanguage } from '../../lib/LanguageContext';
import { usePersistentState } from '../../lib/useNotesExport';
import {
  BANDS,
  BONUS_MOVE,
  CRITERIA,
  JOURNAL_STEMS,
  LEVELUP_BASE,
  LEVELUP_STEPS,
  LEVEL_COMPARE_CARDS,
  MATCH_ITEMS,
  MODEL_ANSWER,
  MODEL_SOURCES,
  NUM_SETS,
  PRACTICE_SETS,
  Q1D_STEMS,
  SELF_CHECK_ITEMS,
  SELF_CHECK_TOTAL,
  SET_MAX_MARK,
  TOOL_ID,
  type CriterionKey,
} from './weighingRoomData';
import { TabNoteBadge } from '../../components/NotesLayer';

type TabKey = 'overview' | 'toolkit' | 'model' | 'levelup' | 'practice' | 'journal';

const TABS: { key: TabKey; en: string; zh: string }[] = [
  { key: 'overview', en: 'Overview', zh: '概览' },
  { key: 'toolkit', en: 'Toolkit', zh: '工具包' },
  { key: 'model', en: 'Worked model', zh: '范例' },
  { key: 'levelup', en: 'Level-up', zh: '升级练习' },
  { key: 'practice', en: 'Exam practice', zh: '应试练习' },
  { key: 'journal', en: 'Progress & journal', zh: '进度与日志' },
];

interface SetState {
  response: string;
  band: string | null;
  criteria: CriterionKey[];
  revealOpen: boolean;
}

interface WeighingRoomState {
  tab: TabKey;
  matchChoice: Record<number, CriterionKey | null>;
  matchLocked: Record<number, boolean>;
  annoOpen: number | null;
  levelupStep: number; // 0 = base, 1..4 filled
  sets: SetState[];
  selfCheck: boolean[];
  studentName: string;
  exportCode: string;
}

function initialState(): WeighingRoomState {
  return {
    tab: 'overview',
    matchChoice: {},
    matchLocked: {},
    annoOpen: null,
    levelupStep: 0,
    sets: Array.from({ length: NUM_SETS }, () => ({
      response: '',
      band: null,
      criteria: [],
      revealOpen: false,
    })),
    selfCheck: Array(SELF_CHECK_TOTAL).fill(false),
    studentName: '',
    exportCode: '',
  };
}

/**
 * The Weighing Room, embedded as a section within /perspectives.
 * Renders its own sub-tab strip + panels, but no page hero — the parent
 * IdentifyingPerspectivesPage owns the shared hero and the chapter switcher.
 *
 * `initialTab` seeds the first render (from URL hash); `onTabChange` lets the
 * parent write the current tab back into the URL.
 */
export function WeighingRoomSection({
  initialTab,
  onTabChange,
}: {
  initialTab?: TabKey;
  onTabChange?: (t: TabKey) => void;
} = {}) {
  const [s, setS] = usePersistentState<WeighingRoomState>(
    TOOL_ID,
    'state',
    { ...initialState(), tab: initialTab && TABS.some((t) => t.key === initialTab) ? initialTab : 'overview' },
  );

  useEffect(() => {
    if (initialTab && TABS.some((t) => t.key === initialTab) && initialTab !== s.tab) {
      setS((cur) => ({ ...cur, tab: initialTab }));
    }
  }, [initialTab]); // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof WeighingRoomState>(k: K, v: WeighingRoomState[K]) {
    setS((cur) => ({ ...cur, [k]: v }));
  }

  function selectTab(t: TabKey) {
    set('tab', t);
    onTabChange?.(t);
    window.scrollTo({ top: 260, behavior: 'smooth' });
  }

  function updateSet(i: number, patch: Partial<SetState>) {
    setS((cur) => ({
      ...cur,
      sets: cur.sets.map((set, idx) => (idx === i ? { ...set, ...patch } : set)),
    }));
  }

  return (
    <>
      {/* STICKY SUB-TAB STRIP */}
      <div className="sticky top-[calc(var(--site-header-h,64px)+var(--section-bar-h,0px))] z-20 bg-[color:var(--color-paper)]/95 backdrop-blur-md border-b border-[color:var(--color-line)]">
        <Container size="wide">
          <nav className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar -mb-px" role="tablist" aria-label="Weighing Room tabs">
            {TABS.map((t) => {
              const active = t.key === s.tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectTab(t.key)}
                  className={`text-[13.5px] font-semibold py-3.5 whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? 'border-[color:var(--color-forest)] text-[color:var(--color-ink)]'
                      : 'border-transparent text-[color:var(--color-ink-3)] hover:text-[color:var(--color-ink)]'
                  }`}
                >
                  <Bi en={t.en} zh={t.zh} />
                  <TabNoteBadge tab={`weigh-${t.key}`} />
                </button>
              );
            })}
          </nav>
        </Container>
      </div>

      <section className="py-10 md:py-14">
        <Container size="wide">
          {s.tab === 'overview' && <OverviewTab />}
          {s.tab === 'toolkit' && (
            <ToolkitTab
              matchChoice={s.matchChoice}
              matchLocked={s.matchLocked}
              onMatchClick={(i, key) => {
                if (s.matchLocked[i]) return;
                setS((cur) => ({
                  ...cur,
                  matchChoice: { ...cur.matchChoice, [i]: key },
                  matchLocked: key === MATCH_ITEMS[i].answer ? { ...cur.matchLocked, [i]: true } : cur.matchLocked,
                }));
              }}
              onGotoModel={() => selectTab('model')}
            />
          )}
          {s.tab === 'model' && (
            <WorkedModelTab
              annoOpen={s.annoOpen}
              onAnno={(i) => set('annoOpen', s.annoOpen === i ? null : i)}
              onGotoLevelUp={() => selectTab('levelup')}
            />
          )}
          {s.tab === 'levelup' && (
            <LevelUpTab
              step={s.levelupStep}
              onStep={(n) => set('levelupStep', Math.max(s.levelupStep, n))}
              onReset={() => set('levelupStep', 0)}
              onGotoPractice={() => selectTab('practice')}
            />
          )}
          {s.tab === 'practice' && (
            <PracticeTab
              sets={s.sets}
              onUpdateSet={updateSet}
            />
          )}
          {s.tab === 'journal' && (
            <JournalTab
              selfCheck={s.selfCheck}
              onSelfCheck={(i, v) =>
                setS((cur) => ({ ...cur, selfCheck: cur.selfCheck.map((x, idx) => (idx === i ? v : x)) }))
              }
              sets={s.sets}
              levelupCompleted={s.levelupStep >= 4}
              studentName={s.studentName}
              onStudentName={(v) => set('studentName', v)}
              exportCode={s.exportCode}
              onExportCode={(v) => set('exportCode', v)}
            />
          )}
        </Container>
      </section>
    </>
  );
}

/* ─────────── Overview tab ─────────── */

function OverviewTab() {
  return (
    <div className="grid gap-12">
      <div className="grid gap-8 md:grid-cols-2 md:gap-14">
        <div>
          <Eyebrow color="cobalt">
            <Bi en="Where this sits in your exam" zh="这一题在整份卷中的位置" />
          </Eyebrow>
          <DisplayH2 className="mt-3">
            <Bi en="Paper 1 in one picture." zh="一图看懂卷一。" />
          </DisplayH2>
          <Body className="mt-5">
            <Bi
              en={
                <>
                  Paper 1 is 1 hour 25 minutes and worth 70 marks. It has four compulsory questions, all based on
                  sources you read on the day — you are never tested on prior knowledge of the topic itself, only on
                  what you can do with the sources in front of you.
                </>
              }
              zh={
                <>
                  卷一时长 1 小时 25 分钟，满分 70 分，共有四道必答题，全部基于当日阅读的资料——
                  从不考察你对话题本身的先验知识，只考察你如何处理眼前的资料。
                </>
              }
            />
          </Body>
        </div>

        <div className="grid grid-cols-2 gap-3 self-end">
          {[
            { n: 'Q1 · 18', bEn: 'several short parts, incl. 1(d)', bZh: '多个小题，含 1(d)' },
            { n: 'Q2 · 16', bEn: 'evaluating research/evidence', bZh: '评估研究/证据' },
            { n: 'Q3 · 16', bEn: 'judging two arguments', bZh: '判断两种论证' },
            { n: 'Q4 · 20', bEn: 'assessing a course of action', bZh: '评估行动方案' },
          ].map((s) => (
            <div key={s.n} className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-4">
              <p className="font-mono text-[13px] font-semibold text-[color:var(--color-ink)]">{s.n}</p>
              <p className="text-[12px] text-[color:var(--color-ink-3)] mt-1">
                <Bi en={s.bEn} zh={s.bZh} />
              </p>
            </div>
          ))}
        </div>
      </div>

      <Body className="max-w-[68ch]">
        <Bi
          en={
            <>
              Question 1(d) is the last part of Question 1. It is marked out of <strong>8</strong>, against a
              level-based scheme examiners call <strong>Table B: Analysis of issues and perspectives</strong>. That's
              about 11% of the whole paper riding on one skill — which makes it worth getting very good at.
            </>
          }
          zh={
            <>
              第 1(d) 题是第一题的最后一部分，满分 <strong>8 分</strong>，采用等级评分制，评分表 B
              标题为「问题与观点分析」。这一题约占整份卷的 11%——只考一项技能，值得下功夫掌握。
            </>
          }
        />
      </Body>

      <div>
        <Eyebrow color="cobalt">
          <Bi en="The disguise" zh="题目的伪装" />
        </Eyebrow>
        <DisplayH2 className="mt-3">
          <Bi en="One question, four different costumes." zh="一道题，四种伪装。" />
        </DisplayH2>
        <Body className="mt-5 max-w-[68ch]">
          <Bi
            en={
              <>
                Q1(d) never uses the same wording twice. Here are four real exam stems. Read them and notice what stays
                exactly the same underneath the surface wording.
              </>
            }
            zh={<>第 1(d) 题从不使用同样的措辞。以下是四道真实的题干，请注意它们表层措辞下始终不变的部分。</>}
          />
        </Body>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {Q1D_STEMS.map((q, i) => (
            <div key={i} className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5">
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
                  {q.meta}
                </span>
                <span className="font-mono text-[11px] font-semibold text-[color:var(--color-ink-3)]">[8]</span>
              </div>
              <p className="text-[14.5px] text-[color:var(--color-ink)] leading-[1.55]">{q.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[color:var(--color-paper-2)] border border-[color:var(--color-cobalt)]/40 rounded-[6px] px-5 py-4">
          <p className="text-[14px] text-[color:var(--color-ink)] leading-[1.6]">
            <strong>
              <Bi en="Notice:" zh="留意：" />
            </strong>{' '}
            <Bi
              en={
                <>
                  "benefit", "cause", "consequence" and "challenge" are just different nouns for the same thing — a
                  point raised in the sources. The instruction never changes: <em>pick one, then argue why it outweighs
                    the others.</em> Learn the skill once and it works whatever noun turns up on the day.
                </>
              }
              zh={
                <>
                  「benefit（好处）」「cause（原因）」「consequence（后果）」和「challenge（挑战）」只是同一件事的不同名词——
                  资料中提出的一个论点。指令始终不变：<em>选出一点，论证它为何胜过其他。</em>
                  技能学一次，无论当天出现哪个名词都适用。
                </>
              }
            />
          </p>
        </div>
      </div>

      <div>
        <Eyebrow color="cobalt">
          <Bi en="What's actually being marked" zh="真正评分的是什么" />
        </Eyebrow>
        <DisplayH2 className="mt-3">
          <Bi en="Choosing is free. Justifying is the marks." zh="选择是自由的，论证才是分数。" />
        </DisplayH2>
        <Body className="mt-5 max-w-[68ch]">
          <Bi
            en={
              <>
                This is the single most common misunderstanding at this stage: students think the mark is for spotting
                a good benefit or a shocking consequence. It isn't. There is no list of "correct" answers — almost any
                point from the sources can reach full marks if the explanation is strong enough. In plain English,
                here's what separates the levels:
              </>
            }
            zh={
              <>
                这是这一阶段最常见的误解：学生以为分数在于选出「好」的好处或「惊人」的后果。
                其实并非如此——没有所谓「正确」答案清单，资料中几乎任何一点，只要论证足够有力，都可以拿满分。
                下面用大白话说明各等级的差别：
              </>
            }
          />
        </Body>

        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {BANDS.filter((b) => b.key !== '0').map((b) => (
            <div key={b.key} className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5">
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-cobalt)]">
                {b.label} <Bi en="marks" zh="分" />
              </span>
              <p className="mt-2 text-[14px] text-[color:var(--color-ink)] leading-[1.5]">{b.descEn}</p>
            </div>
          ))}
        </div>

        <Body className="mt-6 max-w-[68ch]">
          <Bi
            en={
              <>
                So the real question isn't "which one is most significant?" — it's{' '}
                <strong>"what makes something significant, and can I prove it applies here?"</strong> That's exactly
                what the Toolkit tab gives you.
              </>
            }
            zh={
              <>
                所以真正的问题不是「哪一个最重要？」，而是
                <strong>「什么让一件事变得重要？我能证明这适用于眼前的情况吗？」</strong>
                这正是「工具包」标签页要教你的。
              </>
            }
          />
        </Body>
      </div>
    </div>
  );
}

/* ─────────── Toolkit tab ─────────── */

function ToolkitTab({
  matchChoice,
  matchLocked,
  onMatchClick,
  onGotoModel,
}: {
  matchChoice: Record<number, CriterionKey | null>;
  matchLocked: Record<number, boolean>;
  onMatchClick: (i: number, key: CriterionKey) => void;
  onGotoModel: () => void;
}) {
  return (
    <div className="grid gap-14">
      <div>
        <Eyebrow color="cobalt">
          <Bi en="Five tests" zh="五种测试" />
        </Eyebrow>
        <DisplayH2 className="mt-3">
          <Bi en="The Significance Toolkit." zh="重要性判断工具包。" />
        </DisplayH2>
        <Body className="mt-5 max-w-[68ch]">
          <Bi
            en={
              <>
                Every strong Q1(d) answer runs the point it picks through one or more of these five tests. Think of
                each one as a weight you can place on the scale to show why your chosen point outweighs the others.
                You don't need all five in one answer — <em>two used well beats five used badly.</em>
              </>
            }
            zh={
              <>
                每一份出色的第 1(d) 题作答，都会把所选的论点放到下面五种测试中的一项或多项上「称量」。
                把每项测试想成一个可以放在天平上的砝码，用来证明你选的这点为什么比别的重。
                一份作答不必用满五项——<em>两项用得好，胜过五项用得糟。</em>
              </>
            }
          />
        </Body>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CRITERIA.map((c, i) => (
            <div key={c.key} className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-[6px] p-5 flex flex-col gap-3">
              <span className="font-display text-[32px] leading-none text-[color:var(--color-cobalt)]">{i + 1}</span>
              <p className="font-display text-[18px] leading-tight text-[color:var(--color-ink)]">
                <Bi en={c.labelEn} zh={c.labelZh} />
              </p>
              <p className="text-[13.5px] leading-[1.5] text-[color:var(--color-ink-2)]">{c.defEn}</p>
              <p className="text-[12px] italic text-[color:var(--color-amber)] pt-3 border-t border-[color:var(--color-line-soft)]">
                {c.starterEn}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[color:var(--color-paper-2)] border border-[color:var(--color-amber)]/40 rounded-[6px] px-5 py-4">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)] mb-2">
            <Bi en="Bonus move" zh="加分技巧" /> · Back It Up
          </p>
          <p className="text-[14px] text-[color:var(--color-ink)] leading-[1.6]">{BONUS_MOVE.bodyEn}</p>
        </div>
      </div>

      <div>
        <Eyebrow color="cobalt">
          <Bi en="Check your ear for it" zh="练一练耳朵" />
        </Eyebrow>
        <DisplayH2 className="mt-3">
          <Bi en="Spot the test being used." zh="辨认所用的测试。" />
        </DisplayH2>
        <Body className="mt-5 max-w-[68ch]">
          <Bi
            en={
              <>
                Each line below is a short justification. Click the test you think it's using. These are written in
                the style examiners reward — not copied from any real script.
              </>
            }
            zh={<>下面每一段都是简短的论证，点击你认为它用了哪一种测试。这些是仿照考官奖励的风格写的，并非任何真实答卷。</>}
          />
        </Body>

        <div className="mt-6 grid gap-4">
          {MATCH_ITEMS.map((item, i) => {
            const chosen = matchChoice[i] ?? null;
            const locked = matchLocked[i];
            const correct = locked && chosen === item.answer;
            return (
              <div key={i} className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-[6px] p-5 md:p-6">
                <p className="text-[15px] italic text-[color:var(--color-ink)] leading-[1.55]">{item.quote}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.optionsOrder.map((k) => {
                    const c = CRITERIA.find((x) => x.key === k)!;
                    const isChosen = chosen === k;
                    const isRight = locked && k === item.answer;
                    const isWrong = isChosen && !locked;
                    let cls = 'text-[12.5px] font-semibold px-3.5 py-2 rounded-full border border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)] transition-colors';
                    if (isRight) cls = 'text-[12.5px] font-semibold px-3.5 py-2 rounded-full border bg-[color:var(--color-forest-soft)] border-[color:var(--color-forest)] text-[color:var(--color-forest)]';
                    else if (isWrong) cls = 'text-[12.5px] font-semibold px-3.5 py-2 rounded-full border bg-[color:var(--color-ember-soft)] border-[color:var(--color-ember)] text-[color:var(--color-ember)]';
                    else if (locked && !isRight) cls = 'text-[12.5px] font-semibold px-3.5 py-2 rounded-full border border-[color:var(--color-line)] text-[color:var(--color-ink-3)] opacity-60';
                    return (
                      <button
                        key={k}
                        type="button"
                        disabled={locked}
                        onClick={() => onMatchClick(i, k)}
                        className={cls + (locked ? ' cursor-default' : '')}
                      >
                        {c.labelEn}
                      </button>
                    );
                  })}
                </div>
                {chosen && (
                  <p className={`mt-3 text-[13px] font-semibold ${correct ? 'text-[color:var(--color-forest)]' : 'text-[color:var(--color-ember)]'}`}>
                    {correct ? (
                      <Bi en="Correct — that's the weight being used." zh="正确——这就是所用的砝码。" />
                    ) : (
                      <Bi en="Not quite — try another option." zh="不完全对，再试一个。" />
                    )}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={onGotoModel}
            className="text-[13.5px] font-semibold px-5 py-2.5 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-cobalt)] transition-colors"
          >
            <Bi en="See the Toolkit used in a full answer →" zh="看工具包如何用在完整答案中 →" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Worked model tab ─────────── */

function WorkedModelTab({
  annoOpen,
  onAnno,
  onGotoLevelUp,
}: {
  annoOpen: number | null;
  onAnno: (i: number) => void;
  onGotoLevelUp: () => void;
}) {
  return (
    <div className="grid gap-14">
      <div>
        <Eyebrow color="cobalt">
          <Bi en="Vehicle topic · Social identity and inclusion" zh="主题载体 · 社会身份与包容" />
        </Eyebrow>
        <DisplayH2 className="mt-3">
          <Bi en="Read the sources." zh="阅读资料。" />
        </DisplayH2>
        <Body className="mt-5 max-w-[68ch]">
          <Bi
            en="These two sources (written for practice, in the style of a real insert) both discuss the same issue from different angles — a report extract, and an interview transcript. This mix is typical of Question 1's source material."
            zh="下面两份资料（按真实卷附的风格所撰写，用于练习）从不同角度讨论同一议题——一份是报告摘录，一份是访谈记录。这样的组合在第 1 题的资料中非常常见。"
          />
        </Body>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <SourceBox label={MODEL_SOURCES.s1Label}>
            <p className="text-[14px] leading-[1.65] text-[color:var(--color-ink)]">{MODEL_SOURCES.s1Body}</p>
          </SourceBox>
          <SourceBox label={MODEL_SOURCES.s2Label}>
            <div className="grid gap-3 text-[14px] leading-[1.65] text-[color:var(--color-ink)]">
              {MODEL_SOURCES.s2Body.map((line, i) => (
                <p key={i}>
                  <em>{line.role}:</em> {line.text}
                </p>
              ))}
            </div>
          </SourceBox>
        </div>

        <div className="mt-6 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5">
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
              <Bi en="Worked example" zh="范例" />
            </span>
            <span className="font-mono text-[11px] font-semibold text-[color:var(--color-ink-3)]">[8]</span>
          </div>
          <p className="text-[14.5px] text-[color:var(--color-ink)] leading-[1.55]">{MODEL_SOURCES.qStem}</p>
        </div>
      </div>

      <div>
        <Eyebrow color="cobalt">
          <Bi en="Click each dotted part" zh="点击每一处虚线部分" />
        </Eyebrow>
        <DisplayH2 className="mt-3">
          <Bi en="A full Level 4 answer, annotated." zh="一份完整的 4 级答案（含注释）。" />
        </DisplayH2>
        <Body className="mt-5 max-w-[68ch]">
          <Bi
            en={
              <>
                Click on any dotted phrase to see what job it's doing. Notice this answer only properly explains{' '}
                <strong>one</strong> benefit in depth — it doesn't try to cover all five just to prove it read both
                sources.
              </>
            }
            zh={
              <>
                点击任意虚线短语，查看它承担的作用。请注意，这份答案只对<strong>一个</strong>好处做了深入解释——
                并没有试图把五点全部提到只为证明自己读了两份资料。
              </>
            }
          />
        </Body>

        <div className="mt-6 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6 md:p-7 text-[15.5px] leading-[1.7] text-[color:var(--color-ink)] pretty">
          {MODEL_ANSWER.map((seg, i) => (
            <span
              key={i}
              onClick={() => onAnno(i)}
              className={`cursor-pointer transition-colors ${
                annoOpen === i
                  ? 'bg-[color:var(--color-amber-soft)] text-[color:var(--color-ink)]'
                  : 'border-b border-dotted border-[color:var(--color-ink-3)] hover:bg-[color:var(--color-paper-2)]'
              }`}
            >
              {seg.text}
            </span>
          )).reduce<React.ReactNode[]>((acc, el, i) => (i === 0 ? [el] : [...acc, ' ', el]), [])}
        </div>

        {annoOpen !== null && (
          <div className="mt-3 bg-[color:var(--color-paper-2)] border border-[color:var(--color-amber)]/40 rounded-[6px] px-5 py-3">
            <p className="text-[13.5px] text-[color:var(--color-ink)] leading-[1.55]">{MODEL_ANSWER[annoOpen].note}</p>
          </div>
        )}
      </div>

      <div>
        <Eyebrow color="cobalt">
          <Bi en="The same starting idea, three ways" zh="同一起点，三种写法" />
        </Eyebrow>
        <DisplayH2 className="mt-3">
          <Bi en="What separates the levels?" zh="等级之间的分野在哪里？" />
        </DisplayH2>
        <Body className="mt-5 max-w-[68ch]">
          <Bi
            en={
              <>
                Here's a different benefit from the sources — <em>staff loyalty and lower turnover</em> — written at
                three different quality levels. Same idea, same sources, very different marks.
              </>
            }
            zh={
              <>
                下面选用资料中另一个好处——<em>员工忠诚度与更低的离职率</em>——以三种不同质量水平写出。
                同一个想法，同样的资料，得分却大不相同。
              </>
            }
          />
        </Body>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {LEVEL_COMPARE_CARDS.map((c) => (
            <div key={c.levelTag} className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5">
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-cobalt)]">
                {c.levelTag}
              </span>
              <p className="mt-2 text-[14px] text-[color:var(--color-ink)] leading-[1.5]">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[color:var(--color-paper-2)] border border-[color:var(--color-cobalt)]/40 rounded-[6px] px-5 py-4">
          <p className="text-[14px] text-[color:var(--color-ink)] leading-[1.6]">
            <strong>
              <Bi en="Spot the pattern:" zh="看出规律：" />
            </strong>{' '}
            <Bi
              en={
                <>
                  Level 1 has no source evidence and no real reasoning. Level 2 adds a source but the reasoning ("this
                  is good for the company") is generic. Level 3 adds a specific figure and a clear consequence. To
                  reach Level 4, this answer would still need one more thing: <strong>a direct comparison</strong>{' '}
                  showing why loyalty beats the other benefits on offer — exactly the move used in the annotated model
                  above.
                </>
              }
              zh={
                <>
                  1 级没有资料证据，也没有真正的论证。2 级加入了资料，但论证（「这对公司有好处」）泛泛而谈。
                  3 级加入了具体数字和明确后果。要冲到 4 级，这份答案还需要一件事：
                  <strong>直接比较</strong>，说明忠诚度为何胜过资料中的其他好处——这正是上面注释范例所展示的动作。
                </>
              }
            />
          </p>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={onGotoLevelUp}
            className="text-[13.5px] font-semibold px-5 py-2.5 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-cobalt)] transition-colors"
          >
            <Bi en="Try building an answer yourself →" zh="自己动手搭一份答案 →" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SourceBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5">
      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)] mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}

/* ─────────── Level-Up tab ─────────── */

function LevelUpTab({
  step,
  onStep,
  onReset,
  onGotoPractice,
}: {
  step: number;
  onStep: (n: number) => void;
  onReset: () => void;
  onGotoPractice: () => void;
}) {
  const currentLevel = Math.min(step + 1, 4);
  const widthPct = 25 * currentLevel;
  const levelLabel =
    currentLevel === 1
      ? 'LEVEL 1 · 1–2 marks'
      : currentLevel === 2
        ? 'LEVEL 2 · 3–4 marks'
        : currentLevel === 3
          ? 'LEVEL 3 · 5–6 marks'
          : 'LEVEL 4 · 7–8 marks';

  return (
    <div className="grid gap-8">
      <div>
        <Eyebrow color="cobalt">
          <Bi en="Same sources as Worked Model" zh="沿用范例中的资料" />
        </Eyebrow>
        <DisplayH2 className="mt-3">
          <Bi en="Level-Up Challenge." zh="升级挑战。" />
        </DisplayH2>
        <Body className="mt-5 max-w-[68ch]">
          <Bi
            en={
              <>
                Below is a Level 1 answer about a third benefit from the sources — <em>improved reputation</em>. Click
                each button below, in order, to build it up toward Level 4. Watch the level meter move as you go.
              </>
            }
            zh={
              <>
                下面是一份 1 级答案，主题是资料中的第三个好处——<em>公司声誉提升</em>。
                依次点击下面的按钮，把它一步步升到 4 级。等级进度条会随之推进。
              </>
            }
          />
        </Body>
      </div>

      <div className="grid gap-3">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-cobalt)]">
            {levelLabel}
          </span>
          <span className="font-mono text-[10.5px] text-[color:var(--color-ink-3)] tabular-nums">
            {widthPct}%
          </span>
        </div>
        <div className="h-2 bg-[color:var(--color-paper-2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[color:var(--color-cobalt)] transition-all duration-500"
            style={{ width: `${widthPct}%` }}
          />
        </div>
      </div>

      <div>
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)] mb-2">
          <Bi en="Your growing answer" zh="你逐步生长的答案" />
        </p>
        <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5 md:p-6 text-[15px] leading-[1.7] text-[color:var(--color-ink)] pretty min-h-[120px]">
          {LEVELUP_BASE}
          {LEVELUP_STEPS.slice(0, step).map((st, i) => (
            <span key={i} className="text-[color:var(--color-cobalt-deep)]">
              {st.text}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)] mb-3">
          <Bi en="Build it up" zh="一步步构建" />
        </p>
        <div className="grid gap-3">
          {LEVELUP_STEPS.map((st, i) => {
            const n = i + 1;
            const done = step >= n;
            const enabled = step >= n - 1 && !done;
            return (
              <button
                key={n}
                type="button"
                disabled={!enabled}
                onClick={() => onStep(n)}
                className={`text-left px-5 py-4 rounded-md border transition-colors ${
                  done
                    ? 'bg-[color:var(--color-paper-2)] border-[color:var(--color-line)] opacity-70'
                    : enabled
                      ? 'bg-[color:var(--color-paper)] border-[color:var(--color-line)] hover:border-[color:var(--color-ink)]'
                      : 'bg-[color:var(--color-paper)] border-[color:var(--color-line)] opacity-40 cursor-not-allowed'
                }`}
              >
                <span className="block font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-cobalt)] mb-1">
                  {st.tag}
                </span>
                <span className="block text-[14.5px] text-[color:var(--color-ink)]">{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {step >= 4 && (
        <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-forest)]/40 rounded-[6px] px-5 py-4">
          <p className="text-[14px] text-[color:var(--color-ink)] leading-[1.6]">
            <strong>
              <Bi en="That's a Level 4 answer." zh="这就是一份 4 级答案。" />
            </strong>{' '}
            <Bi
              en="Notice it took four separate moves to get there — a source detail, a reason, a comparison, and a conclusion. That's the shape to aim for every time, whatever the topic on the day."
              zh="注意，达到 4 级用了四个独立步骤——一处资料细节、一个理由、一次比较、一句结论。无论当天题目是什么，都要向这个形状看齐。"
            />
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="text-[13px] font-semibold px-4 py-2 rounded-full border border-[color:var(--color-line)] hover:border-[color:var(--color-ink)]"
        >
          <Bi en="Reset and try again" zh="重置再试" />
        </button>
        <button
          type="button"
          onClick={onGotoPractice}
          className="text-[13.5px] font-semibold px-5 py-2.5 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-cobalt)] transition-colors"
        >
          <Bi en="Ready for exam practice →" zh="进入应试练习 →" />
        </button>
      </div>
    </div>
  );
}

/* ─────────── Practice tab ─────────── */

function PracticeTab({
  sets,
  onUpdateSet,
}: {
  sets: SetState[];
  onUpdateSet: (i: number, patch: Partial<SetState>) => void;
}) {
  const [active, setActive] = useState(0);
  const s = sets[active];
  const p = PRACTICE_SETS[active];

  return (
    <div className="grid gap-8">
      <div>
        <Eyebrow color="cobalt">
          <Bi en="Five full practice sets" zh="五套完整练习" />
        </Eyebrow>
        <DisplayH2 className="mt-3">
          <Bi en="Exam practice." zh="应试练习。" />
        </DisplayH2>
        <Body className="mt-5 max-w-[68ch]">
          <Bi
            en="Five practice items, each with two sources (about 350–400 words combined) and a genuine Q1(d)-style question. The topics deliberately jump around — Digital World, Environment, Health, Social Identity, and Conflict and Peace — because the real exam never tells you the topic in advance. The skill is what transfers, not the content."
            zh="五道练习，每道配两份资料（合计约 350–400 词）和一道真正 Q1(d) 风格的题目。主题刻意跳跃——数码世界、环境、健康、社会身份、战争与和平——因为真实考试不会提前告诉你话题。可迁移的是技能，而非内容。"
          />
        </Body>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRACTICE_SETS.map((_, i) => {
          const attempted = wordCountOf(sets[i].response) >= 15 || sets[i].band;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`w-11 h-11 rounded-full font-mono text-[14px] font-semibold border transition-colors relative ${
                active === i
                  ? 'bg-[color:var(--color-ink)] text-[color:var(--color-paper)] border-[color:var(--color-ink)]'
                  : 'bg-[color:var(--color-paper)] text-[color:var(--color-ink)] border-[color:var(--color-line)] hover:border-[color:var(--color-ink)]'
              }`}
            >
              {i + 1}
              {attempted && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[color:var(--color-forest)] border-2 border-[color:var(--color-paper)]" />
              )}
            </button>
          );
        })}
      </div>

      <div>
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-cobalt)] mb-3">
          {p.topic}
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <SourceBox label={p.s1Label}>
            <p className="text-[14px] leading-[1.65] text-[color:var(--color-ink)]">{p.s1}</p>
          </SourceBox>
          <SourceBox label={p.s2Label}>
            <p className="text-[14px] leading-[1.65] text-[color:var(--color-ink)]">{p.s2}</p>
          </SourceBox>
        </div>

        <div className="mt-5 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5">
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
              {p.qMeta}
            </span>
            <span className="font-mono text-[11px] font-semibold text-[color:var(--color-ink-3)]">[8]</span>
          </div>
          <p className="text-[14.5px] text-[color:var(--color-ink)] leading-[1.55]">{p.qStem}</p>
        </div>

        <div className="mt-5">
          <textarea
            value={s.response}
            onChange={(e) => onUpdateSet(active, { response: e.target.value })}
            placeholder="Write your answer here…"
            className="w-full min-h-[180px] p-4 text-[14.5px] leading-[1.6] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-cobalt)] focus:ring-1 focus:ring-[color:var(--color-cobalt)]"
          />
          <p className="mt-1 font-mono text-[11px] text-[color:var(--color-ink-3)] tabular-nums">
            {wordCountOf(s.response)} <Bi en="words" zh="字" />
          </p>
        </div>

        <div className="mt-6">
          <DisplayH3>
            <Bi en="Which weights did you use?" zh="你用了哪些砝码？" />
          </DisplayH3>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...CRITERIA, { key: 'backitup' as CriterionKey, labelEn: 'Back It Up (bonus)', labelZh: '回溯支撑（加分）', defEn: '', starterEn: '' }].map((c) => {
              const on = s.criteria.includes(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() =>
                    onUpdateSet(active, {
                      criteria: on ? s.criteria.filter((x) => x !== c.key) : [...s.criteria, c.key],
                    })
                  }
                  className={`text-[12.5px] font-semibold px-3.5 py-2 rounded-full border transition-colors ${
                    on
                      ? 'bg-[color:var(--color-forest-soft)] border-[color:var(--color-forest)] text-[color:var(--color-forest)]'
                      : 'bg-[color:var(--color-paper)] border-[color:var(--color-line)] text-[color:var(--color-ink-2)] hover:border-[color:var(--color-ink)]'
                  }`}
                >
                  {c.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <DisplayH3>
            <Bi en="Self-assess your level" zh="自评等级" />
          </DisplayH3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {BANDS.map((b) => {
              const on = s.band === b.key;
              return (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => onUpdateSet(active, { band: b.key })}
                  className={`text-left px-4 py-3 rounded-md border transition-colors ${
                    on
                      ? 'bg-[color:var(--color-ink)] text-[color:var(--color-paper)] border-[color:var(--color-ink)]'
                      : 'bg-[color:var(--color-paper)] border-[color:var(--color-line)] hover:border-[color:var(--color-ink)]'
                  }`}
                >
                  <span className={`font-display text-[18px] leading-none ${on ? '' : 'text-[color:var(--color-cobalt)]'}`}>
                    {b.label}
                  </span>
                  <span className={`block mt-1 text-[11.5px] leading-[1.35] ${on ? 'text-[color:var(--color-paper)]/85' : 'text-[color:var(--color-ink-2)]'}`}>
                    {b.descEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => onUpdateSet(active, { revealOpen: !s.revealOpen })}
            className="text-[13px] font-semibold px-4 py-2 rounded-full border border-[color:var(--color-line)] hover:border-[color:var(--color-ink)]"
          >
            {s.revealOpen ? (
              <Bi en="Hide indicative content & tips" zh="收起参考内容与提示" />
            ) : (
              <Bi en="Show indicative content & tips" zh="查看参考内容与提示" />
            )}
          </button>
          {s.revealOpen && (
            <div className="mt-4 bg-[color:var(--color-paper-2)] border border-[color:var(--color-amber)]/40 rounded-[6px] px-5 py-4 grid gap-5">
              <div>
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)] mb-2">
                  <Bi en="Possible points candidates might identify" zh="考生可能提出的要点" />
                </p>
                <TileGrid cols={2}>
                  {p.revealPoints.map((pt, i) => (
                    <NoteTile key={i} accent="var(--color-amber)">{pt}</NoteTile>
                  ))}
                </TileGrid>
              </div>
              <div>
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)] mb-2">
                  <Bi en="What would push this toward Level 4" zh="如何进一步冲上 4 级" />
                </p>
                <TileGrid cols={2}>
                  {p.revealTips.map((pt, i) => (
                    <NoteTile key={i} accent="var(--color-forest)">{pt}</NoteTile>
                  ))}
                </TileGrid>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Journal / export tab ─────────── */

function JournalTab({
  selfCheck,
  onSelfCheck,
  sets,
  levelupCompleted,
  studentName,
  onStudentName,
  exportCode,
  onExportCode,
}: {
  selfCheck: boolean[];
  onSelfCheck: (i: number, v: boolean) => void;
  sets: SetState[];
  levelupCompleted: boolean;
  studentName: string;
  onStudentName: (v: string) => void;
  exportCode: string;
  onExportCode: (v: string) => void;
}) {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalWords = sets.reduce((sum, s) => sum + wordCountOf(s.response), 0);
  const practiceCompleted = sets.filter((s) => wordCountOf(s.response) >= 15 || s.band).length;

  useEffect(() => {
    setCopied(false);
  }, [exportCode]);

  function generate() {
    const trimmed = studentName.trim();
    if (!trimmed) {
      setError(lang === 'zh' ? '请先填写你的姓名。' : 'Please enter your name first.');
      return;
    }
    setError(null);
    const setsData: Record<string, { words: number; band: string | null; criteria: string[] }> = {};
    for (let i = 0; i < NUM_SETS; i++) {
      const s = sets[i];
      setsData[String(i + 1)] = {
        words: wordCountOf(s.response),
        band: s.band,
        criteria: s.criteria,
      };
    }
    const payload = {
      toolId: TOOL_ID,
      studentName: trimmed,
      timestamp: new Date().toISOString(),
      data: {
        levelUpCompleted: levelupCompleted,
        practiceCompleted,
        totalWords,
        selfCheckTicked: selfCheck.filter(Boolean).length,
        sets: setsData,
      },
    };
    try {
      const json = JSON.stringify(payload);
      // Match legacy encoder: btoa(unescape(encodeURIComponent(json)))
      const encoded = btoa(unescape(encodeURIComponent(json)));
      onExportCode(encoded);
    } catch (e) {
      setError(lang === 'zh' ? '无法生成代码，请重试。' : 'Could not generate the code. Try again.');
    }
  }

  async function copy() {
    if (!exportCode) return;
    try {
      await navigator.clipboard.writeText(exportCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="grid gap-12">
      <div>
        <Eyebrow color="cobalt">
          <Bi en="Self-check" zh="自我检查" />
        </Eyebrow>
        <DisplayH2 className="mt-3">
          <Bi en="Before you move on." zh="继续之前。" />
        </DisplayH2>
        <Body className="mt-5 max-w-[68ch]">
          <Bi
            en="Tick these off honestly — they matter more than finishing quickly."
            zh="请如实打勾——诚实比赶快完成更重要。"
          />
        </Body>

        <div className="mt-6 grid gap-2">
          {SELF_CHECK_ITEMS.map((item, i) => (
            <label
              key={i}
              className="flex items-start gap-3 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-4 hover:border-[color:var(--color-ink)] transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selfCheck[i]}
                onChange={(e) => onSelfCheck(i, e.target.checked)}
                className="mt-1"
              />
              <span className="text-[14px] text-[color:var(--color-ink)] leading-[1.5]">{item}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatTile label={<Bi en="Practice items attempted" zh="已尝试练习" />} value={`${practiceCompleted} / ${NUM_SETS}`} />
          <StatTile label={<Bi en="Total words written" zh="总字数" />} value={totalWords} />
          <StatTile
            label={<Bi en="Self-check ticks" zh="自查打勾" />}
            value={`${selfCheck.filter(Boolean).length} / ${SELF_CHECK_TOTAL}`}
          />
        </div>
      </div>

      <div>
        <Eyebrow color="amber">
          <Bi en="GP journal · compulsory" zh="GP 日志 · 必做" />
        </Eyebrow>
        <DisplayH3 className="mt-3">
          <Bi en="Journal prompt for today." zh="今日日志提示。" />
        </DisplayH3>
        <Body className="mt-4 max-w-[68ch]">
          <Bi
            en="Open your GP journal now and write 3–4 sentences using these stems:"
            zh="现在打开你的 GP 日志本，按以下句式写 3–4 句："
          />
        </Body>
        <TileGrid cols={3} className="mt-3">
          {JOURNAL_STEMS.map((j, i) => (
            <NoteTile key={i} accent="var(--color-forest)" eyebrow={`Stem ${i + 1}`}><span className="italic text-[color:var(--color-ink)]">{j}</span></NoteTile>
          ))}
        </TileGrid>
        <p className="mt-3 text-[12.5px] text-[color:var(--color-ink-3)] max-w-[68ch]">
          <Bi
            en="This is a normal WMSI GP journal entry, not something typed into this tool — keep it in the same journal you use for every lesson."
            zh="这是一份普通的 WMSI GP 日志条目，不是要打字输入本工具——写在你每节课都用的同一本日志里。"
          />
        </p>
      </div>

      <div>
        <Eyebrow color="cobalt">
          <Bi en="Send your work to your teacher" zh="把你的作答交给老师" />
        </Eyebrow>
        <DisplayH2 className="mt-3">
          <Bi en="Generate your code." zh="生成你的代码。" />
        </DisplayH2>
        <Body className="mt-5 max-w-[68ch]">
          <Bi
            en="Type your name, then generate a code. Copy it and submit it the way your teacher has asked (e.g. paste into the class submission form)."
            zh="填写你的姓名，然后生成代码，按老师的要求交上去（例如粘贴到班级提交表格）。"
          />
        </Body>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
              <Bi en="Your full name" zh="你的姓名（完整）" />
            </span>
            <input
              type="text"
              value={studentName}
              onChange={(e) => onStudentName(e.target.value)}
              className="w-full max-w-[420px] px-4 py-2.5 text-[15px] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-cobalt)] focus:ring-1 focus:ring-[color:var(--color-cobalt)]"
              placeholder={lang === 'zh' ? '你的姓名' : 'Your full name'}
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={generate}
              className="text-[13.5px] font-semibold px-5 py-2.5 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-cobalt)] transition-colors"
            >
              <Bi en="Generate my code" zh="生成我的代码" />
            </button>
            {exportCode && (
              <button
                type="button"
                onClick={copy}
                className="text-[13px] font-semibold px-4 py-2 rounded-full border border-[color:var(--color-line)] hover:border-[color:var(--color-ink)]"
              >
                {copied ? (
                  <Bi en="Copied ✓" zh="已复制 ✓" />
                ) : (
                  <Bi en="Copy code" zh="复制代码" />
                )}
              </button>
            )}
          </div>

          {error && (
            <p className="text-[13px] text-[color:var(--color-ember)]">{error}</p>
          )}

          <textarea
            value={exportCode}
            readOnly
            placeholder={lang === 'zh' ? '你的代码会显示在这里……' : 'Your code will appear here…'}
            className="w-full min-h-[100px] font-mono text-[12.5px] p-3 bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5">
      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-3)]">
        {label}
      </p>
      <p className="mt-2 font-display text-[26px] leading-none text-[color:var(--color-ink)]">{value}</p>
    </div>
  );
}

/* ─────────── Utils ─────────── */

function wordCountOf(s: string): number {
  const trimmed = s.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
