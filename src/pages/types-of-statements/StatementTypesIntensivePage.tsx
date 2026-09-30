import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, DisplayH1, DisplayH2, DisplayH3, Body, Eyebrow, Lede, Callout } from '../../components/primitives';
import { Bi } from '../../lib/LanguageContext';
import { ExportFooter } from '../../components/ExportFooter';
import { useNotesExport, nx, usePersistentState } from '../../lib/useNotesExport';
import {
  TOOL_ID,
  INTENSIVE_TYPES,
  TYPE_ZH,
  REF_CARDS,
  RAPID_SORT,
  SOURCE_A_TITLE,
  SOURCE_A_PARAGRAPHS,
  SOURCE_B_TITLE,
  SOURCE_B_TURNS,
  DIVE_A_ANSWERS,
  DIVE_B_ANSWERS,
  PAIR_SETS,
  CREATE_PROMPTS,
  EXAM_QUESTIONS,
  TASK_ITEMS,
  CONFIDENCE_ITEMS,
  type IntensiveType,
} from './statementTypesIntensiveData';

const TABS = [
  { id: 'ref', en: 'Reference', zh: '参考卡' },
  { id: 'sort', en: 'Rapid Sort', zh: '快速分类' },
  { id: 'dive', en: 'Source Dive', zh: '资料深读' },
  { id: 'pairs', en: 'Confusable Pairs', zh: '易混对' },
  { id: 'create', en: 'Create Your Own', zh: '原创练习' },
  { id: 'exam', en: 'Exam Practice', zh: '考题练习' },
  { id: 'self', en: 'Self-Assessment', zh: '自评' },
] as const;
type TabId = (typeof TABS)[number]['id'];

/* ══════════════════ Root page ══════════════════ */
export function StatementTypesIntensivePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = (location.hash.replace('#', '') as TabId) || 'ref';
  const [tab, setTab] = useState<TabId>(TABS.some((t) => t.id === initial) ? initial : 'ref');

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
    pageTitleEn: 'Q1(b) — Statement Types Intensive Practice',
    subtitleEn: 'IGCSE Global Perspectives 0457 · Student worksheet',
    filenameStem: 'GP_Statement_Types_Intensive',
    studentNameSelector: '#wne-student-name',
    exportDocxSelector: '#wne-export-docx',
    exportPdfSelector: '#wne-export-pdf',
    openNotesSelector: '#wne-open-notes',
    collect: () => collectIntensive(),
  });

  return (
    <>
      {/* HERO */}
      <section className="pt-12 md:pt-16 pb-8">
        <Container size="wide">
          <Eyebrow color="amber">
            <Bi en="Q1(b) · Intensive practice" zh="第 1(b) 题 · 强化练习" />
          </Eyebrow>
          <DisplayH1 className="mt-3 max-w-[26ch]">
            <Bi
              en="Master the eight statement types."
              zh="精通八种陈述类型。"
            />
          </DisplayH1>
          <Lede className="mt-6">
            <Bi
              en={
                <>
                  A 120-minute deep dive: read the reference cards, rapid-sort 24 statements, take two source deep-dives,
                  clean up the four confusable pairs, write your own examples, and finish with five exam-style questions.
                </>
              }
              zh={
                <>
                  120 分钟深度练习：阅读参考卡、快速分类 24 句、进行两次资料深读、澄清四组易混对、原创 8 句陈述，
                  最后完成 5 道考题。
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
                onClick={() => switchTab(t.id)}
                className={`shrink-0 text-[13.5px] font-semibold py-3.5 border-b-2 -mb-px transition-colors ${
                  tab === t.id
                    ? 'text-[color:var(--color-ink)] border-[color:var(--color-amber)]'
                    : 'text-[color:var(--color-ink-3)] border-transparent hover:text-[color:var(--color-ink)]'
                }`}
              >
                <Bi en={t.en} zh={t.zh} />
              </button>
            ))}
          </nav>
        </Container>
      </div>

      <Container size="wide">
        <section className="py-10 md:py-14" role="tabpanel">
          {tab === 'ref' && <ReferenceTab />}
          {tab === 'sort' && <RapidSortTab />}
          {tab === 'dive' && <SourceDiveTab />}
          {tab === 'pairs' && <PairsTab />}
          {tab === 'create' && <CreateTab />}
          {tab === 'exam' && <ExamTab />}
          {tab === 'self' && <SelfTab />}
        </section>
      </Container>

      <ExportFooter toolId={TOOL_ID} />
    </>
  );
}

/* ══════════════════ Tab 1: Reference ══════════════════ */
function ReferenceTab() {
  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="The Eight Terms" zh="八种术语" />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en={
              <>
                Study the definition, signal words, and example for each — then note what it is commonly confused
                with. Pay special attention to the <em>Signal Words</em> — these are your shortcuts in the exam.
              </>
            }
            zh={
              <>
                学习每张卡的定义、信号词与例子，并留意最常见的混淆对象。特别注意<em>信号词</em>——它们是考试中的捷径。
              </>
            }
          />
        </Body>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {REF_CARDS.map((c) => (
          <div
            key={c.type}
            className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5 md:p-6"
          >
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
              {c.type} <span className="ml-1 text-[color:var(--color-ink-3)]">{TYPE_ZH[c.type]}</span>
            </p>
            <p className="mt-3 text-[14px] leading-[1.6] text-[color:var(--color-ink)]">
              <strong>Definition:</strong> {c.definition}
            </p>
            <p className="mt-3 text-[13.5px] leading-[1.55] text-[color:var(--color-ink-2)]">
              <strong>Signal words:</strong> {c.signals}
            </p>
            <p className="mt-3 text-[13.5px] italic leading-[1.55] text-[color:var(--color-ink)] bg-[color:var(--color-paper-2)] border-l-[3px] border-[color:var(--color-line)] pl-3 py-2">
              {c.example}
            </p>
            <p className="mt-3 text-[12.5px] leading-[1.55] text-[color:var(--color-ember)]">
              ⚠ Don’t confuse with <strong>{c.confuse}</strong>
            </p>
          </div>
        ))}
      </div>

      <Callout tone="amber" eyebrow={<Bi en="Exam tip — the 3-question test" zh="考试技巧：三步测试" />}>
        <Bi
          en={
            <>
              When you read a statement in the exam, ask yourself:{' '}
              <strong>1.</strong> Can I verify this? → probably a <em>Fact</em>.{' '}
              <strong>2.</strong> Is this about the future? → probably a <em>Prediction</em>.{' '}
              <strong>3.</strong> Does it use "all/every/always/never"? → probably a <em>Generalisation</em>.
            </>
          }
          zh={
            <>
              三步测试法 — 能否验证？是否关于未来？是否使用「所有/每个/总是/从不」？
            </>
          }
        />
      </Callout>
    </div>
  );
}

/* ══════════════════ Tab 2: Rapid Sort ══════════════════ */
interface SortAnswer { picked: IntensiveType | null }
function RapidSortTab() {
  const [state, setState] = usePersistentState<{ index: number; answers: SortAnswer[] }>(
    TOOL_ID,
    'rapidSort',
    { index: 0, answers: RAPID_SORT.map(() => ({ picked: null })) },
  );
  const answered = state.answers[state.index]?.picked ?? null;
  const item = RAPID_SORT[state.index];
  const answeredCount = state.answers.filter((a) => a.picked !== null).length;
  const correctCount = state.answers.filter((a, i) => a.picked === RAPID_SORT[i].type).length;
  const allDone = answeredCount === RAPID_SORT.length;

  const pick = (t: IntensiveType) => {
    if (state.answers[state.index].picked !== null) return;
    setState((s) => ({
      ...s,
      answers: s.answers.map((a, i) => (i === s.index ? { picked: t } : a)),
    }));
  };
  const next = () => setState((s) => ({ ...s, index: Math.min(s.index + 1, RAPID_SORT.length - 1) }));
  const prev = () => setState((s) => ({ ...s, index: Math.max(s.index - 1, 0) }));
  const reset = () => setState({ index: 0, answers: RAPID_SORT.map(() => ({ picked: null })) });

  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Rapid Sort — 24 statements" zh="快速分类 —— 24 句" />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en="Read each statement carefully, then select the type that best describes it. Immediate feedback appears after each answer. Aim for 20/24 or above."
            zh="仔细阅读每句话，选择最合适的类型。每题作答后立即反馈。目标 20/24 以上。"
          />
        </Body>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-4">
        <p className="font-mono text-[12.5px] text-[color:var(--color-ink)]">
          <strong>{correctCount}</strong> / {answeredCount} correct · Question {state.index + 1} / {RAPID_SORT.length}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reset}
            className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full border border-[color:var(--color-ink-3)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="h-2 bg-[color:var(--color-line)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[color:var(--color-amber)] to-[color:var(--color-forest)]"
          style={{ width: `${(answeredCount / RAPID_SORT.length) * 100}%` }}
        />
      </div>

      <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6 md:p-7">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
          {item.topic}
        </p>
        <p className="mt-3 font-display text-[18px] leading-[1.4] text-[color:var(--color-ink)]">"{item.s}"</p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {INTENSIVE_TYPES.map((t) => {
            const showCorrect = answered !== null && t === item.type;
            const showWrong = answered === t && t !== item.type;
            let cls =
              'text-left text-[13px] font-semibold p-3 rounded-md border transition-colors border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)] bg-[color:var(--color-paper-2)]';
            if (showCorrect) {
              cls =
                'text-left text-[13px] font-semibold p-3 rounded-md border bg-[color:var(--color-forest-soft)] border-[color:var(--color-forest)] text-[color:var(--color-forest-deep)]';
            } else if (showWrong) {
              cls =
                'text-left text-[13px] font-semibold p-3 rounded-md border bg-[color:var(--color-ember-soft)] border-[color:var(--color-ember)] text-[color:var(--color-ember)]';
            }
            return (
              <button
                key={t}
                type="button"
                disabled={answered !== null}
                onClick={() => pick(t)}
                className={cls}
              >
                {t}
              </button>
            );
          })}
        </div>

        {answered !== null && (
          <div
            className={`mt-4 rounded-md p-4 text-[13.5px] leading-[1.55] ${
              answered === item.type
                ? 'bg-[color:var(--color-forest-soft)] text-[color:var(--color-forest-deep)]'
                : 'bg-[color:var(--color-ember-soft)] text-[color:var(--color-ember)]'
            }`}
          >
            <strong>{answered === item.type ? '✓ Correct!' : '✗ Not quite.'}</strong> This is a{' '}
            <strong>{item.type}</strong>.<br />
            <span className="text-[color:var(--color-ink-2)]">{item.explain}</span>
          </div>
        )}

        <div className="mt-5 flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={state.index === 0}
            className="text-[13px] font-semibold px-4 py-2 rounded-full border border-[color:var(--color-ink-3)] text-[color:var(--color-ink)] disabled:opacity-40"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={next}
            disabled={state.index >= RAPID_SORT.length - 1}
            className="text-[13px] font-semibold px-4 py-2 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>

      {allDone && (
        <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-6 text-center">
          <p className="font-display text-[24px] text-[color:var(--color-ink)]">
            {correctCount === RAPID_SORT.length
              ? '🌟 Perfect!'
              : correctCount >= 20
              ? '🌟 Excellent!'
              : correctCount >= 18
              ? '👍 Good work!'
              : correctCount >= 14
              ? '📚 Getting there'
              : '🔄 More practice needed'}
          </p>
          <p className="mt-2 font-display text-[28px] text-[color:var(--color-amber)]">
            {correctCount} / {RAPID_SORT.length}
          </p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════ Tab 3: Source Deep Dive ══════════════════ */
function SourceDiveTab() {
  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Source Deep Dive" zh="资料深读" />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en="Read the source below, then identify examples of each statement type within it. This is how statements appear in the real exam — embedded in a longer text, not isolated."
            zh="阅读下方资料，找出每种类型的例子。真实考题就是这样——陈述嵌入在长文本中，而非孤立出现。"
          />
        </Body>
      </div>

      {/* Source A */}
      <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-5 md:p-6">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
          SOURCE A
        </p>
        <p className="mt-2 font-display text-[18px] text-[color:var(--color-ink)]">{SOURCE_A_TITLE}</p>
        <div className="mt-4 grid gap-3">
          {SOURCE_A_PARAGRAPHS.map((p, i) => (
            <p key={i} className="text-[14px] leading-[1.7] text-[color:var(--color-ink)]">
              {p}
            </p>
          ))}
        </div>
      </div>

      <DiveExercise label="Source A" answers={DIVE_A_ANSWERS} storeKey="diveA" />

      {/* Source B */}
      <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-5 md:p-6">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
          SOURCE B
        </p>
        <p className="mt-2 font-display text-[18px] text-[color:var(--color-ink)]">{SOURCE_B_TITLE}</p>
        <div className="mt-4 grid gap-3">
          {SOURCE_B_TURNS.map((t, i) => (
            <p key={i} className="text-[14px] leading-[1.7] text-[color:var(--color-ink)]">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-ink-3)] mr-2">
                {t.speaker}:
              </span>
              {t.text}
            </p>
          ))}
        </div>
      </div>

      <Callout tone="cobalt" eyebrow={<Bi en="Dialogue tip" zh="对话提示" />}>
        <Bi
          en={
            <>
              In a conversation source, pay attention to <em>who</em> is speaking and <em>why</em> they hold their view.
              Opinions and value judgements are easier to spot in dialogues because speakers use "I think" and "I
              believe" more naturally.
            </>
          }
          zh="对话中留意谁在说话以及他们为什么持有该观点。「意见」和「价值判断」在对话中更易识别。"
        />
      </Callout>

      <DiveExercise label="Source B" answers={DIVE_B_ANSWERS} storeKey="diveB" />
    </div>
  );
}

function DiveExercise({
  label,
  answers,
  storeKey,
}: {
  label: string;
  answers: typeof DIVE_A_ANSWERS;
  storeKey: string;
}) {
  const [open, setOpen] = usePersistentState<Record<string, boolean>>(TOOL_ID, storeKey, {});
  const toggle = (t: IntensiveType) => setOpen((s) => ({ ...s, [t]: !s[t] }));

  return (
    <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5 md:p-7">
      <DisplayH3>
        <Bi en={`Your task — find all eight types in ${label}`} zh={`任务：在${label}中找出所有八种类型`} />
      </DisplayH3>
      <Body className="mt-3 max-w-[68ch]">
        <Bi
          en="For each statement type below, identify at least one example from the source. Click Reveal to check your answers."
          zh="为每种类型至少找出一个例子。点击「查看答案」核对。"
        />
      </Body>
      <div className="mt-4 grid gap-3">
        {answers.map((a) => (
          <div key={a.type} className="border-b border-[color:var(--color-line)] pb-3">
            <div className="flex items-center gap-3 justify-between">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
                {a.type} <span className="ml-1 text-[color:var(--color-ink-3)]">{TYPE_ZH[a.type]}</span>
              </p>
              <button
                type="button"
                onClick={() => toggle(a.type)}
                className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full border border-[color:var(--color-ink-3)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
              >
                {open[a.type] ? 'Hide' : 'Reveal answer'}
              </button>
            </div>
            {open[a.type] && (
              <div className="mt-2 grid gap-2">
                {a.examples.map((e, i) => (
                  <p
                    key={i}
                    className="text-[13.5px] leading-[1.55] text-[color:var(--color-ink-2)] bg-[color:var(--color-paper-2)] p-3 rounded-md"
                  >
                    {e}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════ Tab 4: Confusable Pairs ══════════════════ */
function PairsTab() {
  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Confusable Pairs Clinic" zh="易混对练习" />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en="These four pairs cause the most mistakes in exams. Study the key difference, then sort the practice statements."
            zh="以下四组在考试中最易混淆。先看清关键区别，再作答。"
          />
        </Body>
      </div>

      {PAIR_SETS.map((set) => (
        <PairCard key={set.id} set={set} />
      ))}
    </div>
  );
}

function PairCard({ set }: { set: (typeof PAIR_SETS)[number] }) {
  const [answers, setAnswers] = usePersistentState<Record<number, 'A' | 'B' | null>>(
    TOOL_ID,
    `pair_${set.id}`,
    {},
  );

  const pick = (i: number, side: 'A' | 'B') => {
    if (answers[i]) return;
    setAnswers((s) => ({ ...s, [i]: side }));
  };

  return (
    <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5 md:p-6">
      <DisplayH3>{set.title}</DisplayH3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="bg-[color:var(--color-paper-2)] border-l-[3px] border-[color:var(--color-cobalt)] p-4 rounded-r-md">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-cobalt)]">
            {set.labelA}
          </p>
          <p
            className="mt-2 text-[13.5px] leading-[1.6] text-[color:var(--color-ink)]"
            dangerouslySetInnerHTML={{ __html: set.descriptionA.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
          />
        </div>
        <div className="bg-[color:var(--color-paper-2)] border-l-[3px] border-[color:var(--color-ember)] p-4 rounded-r-md">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ember)]">
            {set.labelB}
          </p>
          <p
            className="mt-2 text-[13.5px] leading-[1.6] text-[color:var(--color-ink)]"
            dangerouslySetInnerHTML={{ __html: set.descriptionB.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
          />
        </div>
      </div>

      <Callout tone="amber" eyebrow={<Bi en="The test" zh="判断方法" />}>
        {set.test}
      </Callout>

      <div className="mt-5 grid gap-3">
        {set.items.map((item, i) => {
          const answered = answers[i];
          const correct = answered === item.ans;
          return (
            <div
              key={i}
              className={`p-4 rounded-md border ${
                answered
                  ? correct
                    ? 'bg-[color:var(--color-forest-soft)] border-[color:var(--color-forest)]/50'
                    : 'bg-[color:var(--color-ember-soft)] border-[color:var(--color-ember)]/50'
                  : 'bg-[color:var(--color-paper-2)] border-[color:var(--color-line)]'
              }`}
            >
              <p className="text-[14px] leading-[1.6] text-[color:var(--color-ink)]">"{item.s}"</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!!answered}
                  onClick={() => pick(i, 'A')}
                  className={`text-[12.5px] font-semibold px-3 py-1.5 rounded-full border ${
                    answered === 'A'
                      ? item.ans === 'A'
                        ? 'bg-[color:var(--color-forest)] border-[color:var(--color-forest)] text-[color:var(--color-paper)]'
                        : 'bg-[color:var(--color-ember)] border-[color:var(--color-ember)] text-[color:var(--color-paper)]'
                      : 'border-[color:var(--color-cobalt)] text-[color:var(--color-cobalt)]'
                  }`}
                >
                  {set.labelA}
                </button>
                <button
                  type="button"
                  disabled={!!answered}
                  onClick={() => pick(i, 'B')}
                  className={`text-[12.5px] font-semibold px-3 py-1.5 rounded-full border ${
                    answered === 'B'
                      ? item.ans === 'B'
                        ? 'bg-[color:var(--color-forest)] border-[color:var(--color-forest)] text-[color:var(--color-paper)]'
                        : 'bg-[color:var(--color-ember)] border-[color:var(--color-ember)] text-[color:var(--color-paper)]'
                      : 'border-[color:var(--color-ember)] text-[color:var(--color-ember)]'
                  }`}
                >
                  {set.labelB}
                </button>
              </div>
              {answered && (
                <p
                  className={`mt-3 text-[13px] leading-[1.55] ${
                    correct ? 'text-[color:var(--color-forest-deep)]' : 'text-[color:var(--color-ember)]'
                  }`}
                >
                  <strong>
                    {correct ? '✓ Correct!' : `✗ Incorrect — this is ${item.ans === 'A' ? set.labelA : set.labelB}.`}
                  </strong>{' '}
                  {item.explain}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════ Tab 5: Create Your Own ══════════════════ */
function CreateTab() {
  const [topic, setTopic] = usePersistentState<string>(TOOL_ID, 'topic', '', (r) => r, (v) => v);
  const [statements, setStatements] = usePersistentState<string[]>(
    TOOL_ID,
    'created',
    new Array(CREATE_PROMPTS.length).fill(''),
  );

  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Create Your Own — Production Exercise" zh="原创练习" />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en="Identifying statement types is one skill. Writing your own is harder — and proves you truly understand them. For each type below, write an original statement on any Global Perspectives topic."
            zh="识别类型是一种能力，自己写更难——并证明你真正理解。为每种类型写一句原创陈述。"
          />
        </Body>
      </div>

      <Callout tone="amber" eyebrow={<Bi en="Why this matters" zh="为何重要" />}>
        <Bi
          en="In the exam you won't just identify types — in Questions 3 and 4 you'll need to write claims, support them with evidence, and evaluate others' arguments. Being able to construct each type on demand means you understand the difference deeply, not just by signal words."
          zh="考试中你不仅需要识别类型，还需要构建主张、用证据支持并评价论证。"
        />
      </Callout>

      <div className="max-w-[600px]">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
          <Bi en="Topic you're using" zh="选择话题" />
        </p>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Climate Change, Mental Health, AI in Education…"
          className="mt-2 w-full bg-[color:var(--color-paper)] border-b-2 border-[color:var(--color-ink-3)] focus:border-[color:var(--color-amber)] outline-none font-mono text-[14px] text-[color:var(--color-ink)] py-2"
        />
      </div>

      <div className="grid gap-4">
        {CREATE_PROMPTS.map((p, i) => (
          <div key={p.type} className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
              {p.type} <span className="ml-1 text-[color:var(--color-ink-3)]">{TYPE_ZH[p.type]}</span>
            </p>
            <p className="mt-2 text-[13px] leading-[1.55] text-[color:var(--color-ink-2)]">{p.hint}</p>
            <textarea
              value={statements[i]}
              onChange={(e) =>
                setStatements((cur) => cur.map((v, idx) => (idx === i ? e.target.value : v)))
              }
              placeholder={`Write your ${p.type.toLowerCase()} statement here…`}
              className="mt-3 w-full min-h-[70px] p-3 text-[14px] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-amber)] focus:ring-1 focus:ring-[color:var(--color-amber)]"
            />
          </div>
        ))}
      </div>

      <Callout tone="cobalt" eyebrow={<Bi en="Peer check" zh="同伴互查" />}>
        <Bi
          en="When you've finished, swap with a partner. Can they correctly identify each of your eight statements? If they can't, the statement might not contain clear enough signal words — revise it."
          zh="完成后与同伴互换。若无法准确识别，说明信号词不够清晰，需要修改。"
        />
      </Callout>
    </div>
  );
}

/* ══════════════════ Tab 6: Exam Practice ══════════════════ */
function ExamTab() {
  const [answers, setAnswers] = usePersistentState<string[]>(
    TOOL_ID,
    'exam',
    EXAM_QUESTIONS.map(() => ''),
  );
  const [openScaf, setOpenScaf] = useState<Record<string, boolean>>({});
  const [openModel, setOpenModel] = useState<Record<string, boolean>>({});

  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Exam Practice — 5 Questions" zh="考题练习 — 5 题" />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en="Use the sources on this page to answer 5 exam-style questions. Write your answer in the box, then use the scaffolding and model answer to check your work."
            zh="使用页面上的资料回答 5 道考题。先写答案，再查看提示与范文。"
          />
        </Body>
      </div>

      <Callout tone="amber" eyebrow={<Bi en="Exam conditions" zh="考试条件" />}>
        <Bi
          en="Try writing your answers BEFORE opening the scaffolding or model answer. The scaffolding is there to help if you're stuck — but the exam won't have scaffolding, so practise without it first."
          zh="先自己写，再看提示与范文——考场上没有提示。"
        />
      </Callout>

      {/* Source A */}
      <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-5 md:p-6">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
          SOURCE A
        </p>
        <p className="mt-2 font-display text-[17px] text-[color:var(--color-ink)]">{SOURCE_A_TITLE}</p>
        <div className="mt-3 grid gap-2">
          {SOURCE_A_PARAGRAPHS.map((p, i) => (
            <p key={i} className="text-[13.5px] leading-[1.65] text-[color:var(--color-ink)]">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Source B */}
      <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-5 md:p-6">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
          SOURCE B
        </p>
        <p className="mt-2 font-display text-[17px] text-[color:var(--color-ink)]">{SOURCE_B_TITLE}</p>
        <div className="mt-3 grid gap-2">
          {SOURCE_B_TURNS.map((t, i) => (
            <p key={i} className="text-[13.5px] leading-[1.65] text-[color:var(--color-ink)]">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-ink-3)] mr-2">
                {t.speaker}:
              </span>
              {t.text}
            </p>
          ))}
        </div>
      </div>

      {EXAM_QUESTIONS.map((q, i) => (
        <div key={q.id} className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5 md:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
              {q.num}
            </p>
            <p className="font-mono text-[11px] text-[color:var(--color-ink-3)]">{q.marks}</p>
          </div>
          <p className="mt-2 text-[15px] leading-[1.55] text-[color:var(--color-ink)]">{q.question}</p>
          <textarea
            value={answers[i]}
            onChange={(e) => setAnswers((s) => s.map((a, idx) => (idx === i ? e.target.value : a)))}
            placeholder="Write your answer here…"
            className="mt-4 w-full min-h-[110px] p-3 text-[14px] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-amber)] focus:ring-1 focus:ring-[color:var(--color-amber)]"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOpenScaf((s) => ({ ...s, [q.id]: !s[q.id] }))}
              className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full border border-[color:var(--color-ink-3)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
            >
              {openScaf[q.id] ? 'Hide scaffolding' : '📎 Show scaffolding'}
            </button>
            <button
              type="button"
              onClick={() => setOpenModel((s) => ({ ...s, [q.id]: !s[q.id] }))}
              className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full border border-[color:var(--color-amber)] text-[color:var(--color-amber-deep)] hover:bg-[color:var(--color-amber-soft)]"
            >
              {openModel[q.id] ? 'Hide model answer' : 'Show model answer'}
            </button>
          </div>
          {openScaf[q.id] && (
            <div className="mt-3 bg-[color:var(--color-paper-2)] border-l-[3px] border-[color:var(--color-cobalt)] p-4 rounded-r-md whitespace-pre-line text-[13.5px] leading-[1.55] text-[color:var(--color-ink-2)]">
              {q.scaffolding}
            </div>
          )}
          {openModel[q.id] && (
            <div className="mt-3 bg-[color:var(--color-forest-soft)] border-l-[3px] border-[color:var(--color-forest)] p-4 rounded-r-md">
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-forest-deep)]">
                MODEL ANSWER
              </p>
              <p className="mt-2 whitespace-pre-line text-[14px] leading-[1.6] text-[color:var(--color-ink)]">{q.model}</p>
              <p className="mt-2 text-[12.5px] leading-[1.55] text-[color:var(--color-ink-3)]">✓ {q.modelNote}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════ Tab 7: Self-Assessment ══════════════════ */
type ConfLevel = 'low' | 'mid' | 'high';
function SelfTab() {
  const [tasks, setTasks] = usePersistentState<boolean[]>(
    TOOL_ID,
    'tasks',
    new Array(TASK_ITEMS.length).fill(false),
  );
  const [confidence, setConfidence] = usePersistentState<Record<IntensiveType, ConfLevel | null>>(
    TOOL_ID,
    'confidence',
    INTENSIVE_TYPES.reduce((acc, t) => ({ ...acc, [t]: null }), {} as Record<IntensiveType, ConfLevel | null>),
  );
  const [reflection, setReflection] = usePersistentState<string>(TOOL_ID, 'reflection', '', (r) => r, (v) => v);
  const done = tasks.filter(Boolean).length;

  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Self-Assessment & Checklist" zh="自评与清单" />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en="Track your progress through the session, rate your confidence, and reflect on your learning."
            zh="记录进度、评估信心并进行反思。"
          />
        </Body>
      </div>

      {/* Task checklist */}
      <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5 md:p-6">
        <DisplayH3>
          <Bi en="Task checklist" zh="任务清单" />
        </DisplayH3>
        <Body className="mt-3">
          <Bi
            en="Tick each task as you complete it. Aim to finish everything within 120 minutes."
            zh="完成一项打一勾。目标在 120 分钟内完成。"
          />
        </Body>
        <div className="mt-4 grid gap-2">
          {TASK_ITEMS.map((t, i) => (
            <label
              key={i}
              className="flex items-center gap-3 justify-between bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-3 cursor-pointer hover:border-[color:var(--color-ink)]"
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={tasks[i]}
                  onChange={(e) => setTasks((cur) => cur.map((v, idx) => (idx === i ? e.target.checked : v)))}
                  className="w-4 h-4 accent-[color:var(--color-amber)]"
                />
                <span className="text-[14px] text-[color:var(--color-ink)]">{t.label}</span>
              </span>
              <span className="font-mono text-[11px] text-[color:var(--color-ink-3)]">{t.time}</span>
            </label>
          ))}
        </div>
        <p className="mt-4 font-mono text-[12.5px] text-[color:var(--color-ink)]">
          <strong>{done}</strong> / {TASK_ITEMS.length} tasks completed
        </p>
        <div className="mt-2 h-2 bg-[color:var(--color-line)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[color:var(--color-amber)] to-[color:var(--color-forest)]"
            style={{ width: `${(done / TASK_ITEMS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Confidence check */}
      <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5 md:p-6">
        <DisplayH3>
          <Bi en="Confidence check" zh="信心检查" />
        </DisplayH3>
        <div className="mt-4 grid gap-3">
          {CONFIDENCE_ITEMS.map((item) => (
            <div key={item.type} className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] items-center bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-3">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
                  {item.type} <span className="ml-1 text-[color:var(--color-ink-3)]">{TYPE_ZH[item.type]}</span>
                </p>
                <p className="mt-1 text-[13.5px] leading-[1.5] text-[color:var(--color-ink)]">{item.desc}</p>
              </div>
              <div className="flex gap-1.5">
                {(['low', 'mid', 'high'] as const).map((lvl) => {
                  const active = confidence[item.type] === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setConfidence((c) => ({ ...c, [item.type]: lvl }))}
                      className={`text-[12px] font-semibold px-2.5 py-1 rounded-full border ${
                        active
                          ? lvl === 'low'
                            ? 'bg-[color:var(--color-ember)] border-[color:var(--color-ember)] text-[color:var(--color-paper)]'
                            : lvl === 'mid'
                            ? 'bg-[color:var(--color-amber)] border-[color:var(--color-amber)] text-[color:var(--color-paper)]'
                            : 'bg-[color:var(--color-forest)] border-[color:var(--color-forest)] text-[color:var(--color-paper)]'
                          : 'border-[color:var(--color-line)] text-[color:var(--color-ink-2)] hover:border-[color:var(--color-ink)]'
                      }`}
                    >
                      {lvl === 'low' ? 'Not yet' : lvl === 'mid' ? 'Getting there' : 'Confident'}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reflection */}
      <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5 md:p-6">
        <DisplayH3>
          <Bi en="Reflection" zh="反思" />
        </DisplayH3>
        <p className="mt-2 text-[14px] leading-[1.55] text-[color:var(--color-ink-2)]">
          Which statement type do you find hardest to identify, and why? What will you do to improve?
        </p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write your reflection here…"
          className="mt-3 w-full min-h-[120px] p-3 text-[14px] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-amber)] focus:ring-1 focus:ring-[color:var(--color-amber)]"
        />
      </div>
    </div>
  );
}

/* ══════════════════ collect() ══════════════════ */
function collectIntensive() {
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
  const readString = (key: string): string => {
    try {
      return localStorage.getItem(`wne_${TOOL_ID}_${key}`) || '';
    } catch {
      return '';
    }
  };

  // Rapid sort
  const sort = read<{ index: number; answers: { picked: IntensiveType | null }[] }>('rapidSort', {
    index: 0,
    answers: RAPID_SORT.map(() => ({ picked: null })),
  });
  const sortCorrect = sort.answers.filter((a, i) => a.picked === RAPID_SORT[i].type).length;
  const sortDone = sort.answers.filter((a) => a.picked !== null).length;
  sections.push({
    heading: 'Rapid Sort',
    blocks: [
      nx.p([nx.text(`${sortCorrect} of ${sortDone} correct (attempted ${sortDone} of ${RAPID_SORT.length})`, { bold: true })]),
    ],
  });

  // Pairs
  const pairBlocks: any[] = [];
  PAIR_SETS.forEach((set) => {
    const ans = read<Record<number, 'A' | 'B' | null>>(`pair_${set.id}`, {});
    let done = 0, correct = 0;
    set.items.forEach((it, i) => {
      if (ans[i]) { done++; if (ans[i] === it.ans) correct++; }
    });
    pairBlocks.push(nx.p([nx.text(`${set.title}: `, { bold: true }), nx.text(`${correct} / ${done} correct`)]));
  });
  sections.push({ heading: 'Confusable Pairs', blocks: pairBlocks });

  // Create your own
  const topic = readString('topic');
  const created = read<string[]>('created', new Array(CREATE_PROMPTS.length).fill(''));
  const createBlocks: any[] = [];
  if (topic) createBlocks.push(nx.p([nx.text('Topic: ', { bold: true }), nx.text(topic)]));
  CREATE_PROMPTS.forEach((p, i) => {
    if (!created[i]?.trim()) return;
    createBlocks.push(nx.p([nx.text(`${p.type}: `, { bold: true }), nx.text(created[i].trim())]));
  });
  if (createBlocks.length) sections.push({ heading: 'Create Your Own', blocks: createBlocks });

  // Exam
  const exam = read<string[]>('exam', EXAM_QUESTIONS.map(() => ''));
  const examBlocks: any[] = [];
  EXAM_QUESTIONS.forEach((q, i) => {
    const a = exam[i]?.trim();
    if (!a) return;
    examBlocks.push(nx.h(3, `${q.num} ${q.marks}`));
    examBlocks.push(nx.p([nx.text('Question: ', { bold: true }), nx.text(q.question)]));
    examBlocks.push(nx.p([nx.text('Your answer:', { bold: true })]));
    examBlocks.push(nx.p(a));
  });
  if (examBlocks.length) sections.push({ heading: 'Exam Practice', blocks: examBlocks });

  // Self-assessment
  const tasks = read<boolean[]>('tasks', new Array(TASK_ITEMS.length).fill(false));
  const conf = read<Record<IntensiveType, ConfLevel | null>>('confidence', {} as any);
  const reflection = readString('reflection');
  const selfBlocks: any[] = [];
  const tasksDone = tasks.filter(Boolean).length;
  selfBlocks.push(nx.p([nx.text(`Tasks: ${tasksDone} of ${TASK_ITEMS.length} completed`, { bold: true })]));
  TASK_ITEMS.forEach((t, i) => {
    selfBlocks.push(nx.p((tasks[i] ? '☑ ' : '☐ ') + t.label));
  });
  selfBlocks.push(nx.h(3, 'Confidence'));
  CONFIDENCE_ITEMS.forEach((item) => {
    const lvl = conf[item.type];
    const label = lvl === 'high' ? 'Confident' : lvl === 'mid' ? 'Getting there' : lvl === 'low' ? 'Not yet' : '—';
    selfBlocks.push(nx.p([nx.text(`${item.type}: `, { bold: true }), nx.text(label)]));
  });
  if (reflection) {
    selfBlocks.push(nx.h(3, 'Reflection'));
    selfBlocks.push(nx.p(reflection));
  }
  sections.push({ heading: 'Self-Assessment', blocks: selfBlocks });

  return { sections };
}
