import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, DisplayH1, DisplayH2, DisplayH3, Body, Eyebrow, Lede, Callout } from '../../components/primitives';
import { Bi } from '../../lib/LanguageContext';
import { ExportFooter } from '../../components/ExportFooter';
import { useNotesExport, nx, usePersistentState } from '../../lib/useNotesExport';
import {
  TOOL_ID,
  SORT_CARDS,
  ARTICLE_SENTENCES,
  UPGRADE_PROMPTS,
  PRACTICE_POOL,
  CHECKLIST_ITEMS,
  levelForXp,
  type SortAnswer,
} from './claimEvidenceData';

const TABS = [
  { id: 'overview', en: 'Overview', zh: '概览' },
  { id: 'sort', en: 'Sort & Classify', zh: '分类' },
  { id: 'highlight', en: 'Highlight the Bulletin', zh: '标注新闻稿' },
  { id: 'developed', en: 'Developed vs Basic', zh: '展开 vs 基础' },
  { id: 'practice', en: 'Mixed Practice', zh: '综合练习' },
  { id: 'checklist', en: 'Checklist & Reflection', zh: '自检与反思' },
] as const;
type TabId = (typeof TABS)[number]['id'];

/* ══════════════════ Root ══════════════════ */
export function ClaimVsEvidencePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = (location.hash.replace('#', '') as TabId) || 'overview';
  const [tab, setTab] = useState<TabId>(TABS.some((t) => t.id === initial) ? initial : 'overview');

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
    pageTitleEn: 'The Source — Claim vs Evidence',
    subtitleEn: 'IGCSE Global Perspectives 0457 · Paper 1 · Question 1',
    filenameStem: 'GP_Claim_vs_Evidence',
    studentNameSelector: '#wne-student-name',
    exportDocxSelector: '#wne-export-docx',
    exportPdfSelector: '#wne-export-pdf',
    openNotesSelector: '#wne-open-notes',
    collect: () => collectClaimEvidence(),
  });

  return (
    <>
      <section className="pt-12 md:pt-16 pb-8">
        <Container size="wide">
          <Eyebrow color="amber">
            <Bi en="Paper 1 Q1 · Table E (AO1)" zh="卷 1 第 1 题 · 表 E (AO1)" />
          </Eyebrow>
          <DisplayH1 className="mt-3 max-w-[26ch]">
            <Bi en={<>The <span className="text-[color:var(--color-amber)]">Source</span>.</>} zh="资料溯源。" />
          </DisplayH1>
          <Lede className="mt-6">
            <Bi
              en={
                <>
                  Claim or evidence? Trace the story of Sungai Chantek’s clean-up through four voices — and learn to
                  spot the number that <em>looks</em> like proof but isn't.
                </>
              }
              zh="是主张，还是证据？透过四种声音回顾清溪河的治理故事——识别那些「看起来像证据」的数字。"
            />
          </Lede>
        </Container>
      </section>

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
        <section className="py-10 md:py-14">
          {tab === 'overview' && <OverviewTab />}
          {tab === 'sort' && <SortClassifyTab />}
          {tab === 'highlight' && <HighlightTab />}
          {tab === 'developed' && <DevelopedTab />}
          {tab === 'practice' && <PracticeTab />}
          {tab === 'checklist' && <ChecklistTab />}
        </section>
      </Container>

      <ExportFooter toolId={TOOL_ID} />
    </>
  );
}

/* ══════════════════ Tab 1: Overview ══════════════════ */
function OverviewTab() {
  return (
    <div className="grid gap-8 max-w-[860px]">
      <div>
        <DisplayH2>
          <Bi en="What's the difference?" zh="有什么区别？" />
        </DisplayH2>
        <Body className="mt-4">
          <Bi
            en={
              <>
                A <strong>claim</strong> is a statement someone asserts is true. <strong>Evidence</strong> is
                information — data, a measurement, a documented observation — that helps prove a claim is (or isn't)
                accurate. A strong exam answer doesn't just spot the difference; it explains <em>why</em> one piece of
                evidence is stronger or weaker than another.
              </>
            }
            zh={
              <>
                <strong>主张</strong>是一种被断言为真的陈述；<strong>证据</strong>是能够证明主张真伪的信息——数据、测量或有记录的观察。
                优秀的考卷不仅能识别两者，还能说明为何某项证据更强或更弱。
              </>
            }
          />
        </Body>
      </div>

      <div className="mx-auto grid gap-2 items-center">
        <svg width="180" height="100" viewBox="0 0 180 100" role="img" aria-label="Water quality index gauge">
          <path d="M15,95 A75,75 0 0,1 165,95" fill="none" stroke="#ede7d9" strokeWidth="14" strokeLinecap="round" />
          <path d="M15,95 A75,75 0 0,1 130,32" fill="none" stroke="#1A5C5C" strokeWidth="14" strokeLinecap="round" />
          <circle cx="90" cy="95" r="5" fill="#1B2A4A" />
          <line x1="90" y1="95" x2="128" y2="34" stroke="#1B2A4A" strokeWidth="3" strokeLinecap="round" />
          <text x="90" y="72" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="16" fontWeight={700} fill="#1B2A4A">
            WQI 72
          </text>
        </svg>
        <p className="text-center text-[11px] text-[color:var(--color-ink-3)]">
          Water Quality Index — Sungai Chantek, Mar 2026
        </p>
      </div>

      <Callout tone="ember" eyebrow={<Bi en="The misconception to bust today" zh="今日要破除的误解" />}>
        <Bi
          en={
            <>
              "If it has a number in it, it's evidence." <strong>False.</strong> A number only becomes evidence when it
              comes with a <strong>source</strong>, a <strong>method</strong>, and (usually) a <strong>date</strong>.
              Without those three things, a number is just a claim wearing a lab coat.
            </>
          }
          zh="有数字≠有证据。真正的证据需要来源、方法和日期。缺少这三者，数字只是穿着实验服的主张。"
        />
      </Callout>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="bg-[color:var(--color-ember-soft)] border border-[color:var(--color-ember)]/40 rounded-md p-5">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ember)]">
            Claim (looks like evidence)
          </p>
          <p className="mt-2 text-[14px] italic text-[color:var(--color-ink)]">
            "Residents say water clarity has improved by about 60% this year."
          </p>
          <p className="mt-3 text-[13px] text-[color:var(--color-ink-2)]">
            No named source. No method. "About" signals a guess.
          </p>
        </div>
        <div className="bg-[color:var(--color-forest-soft)] border border-[color:var(--color-forest)]/40 rounded-md p-5">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-forest-deep)]">
            Genuine evidence
          </p>
          <p className="mt-2 text-[14px] italic text-[color:var(--color-ink)]">
            "DOE recorded a WQI of 72 at the Sungai Chantek station on 3 March 2026, up from 48 a year earlier."
          </p>
          <p className="mt-3 text-[13px] text-[color:var(--color-ink-2)]">
            Named body (DOE), a standard method (WQI), an exact date, comparable figures.
          </p>
        </div>
      </div>

      <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-5">
        <p className="text-[14px] leading-[1.6] text-[color:var(--color-ink-2)]">
          <strong>Today's story:</strong> Sungai Chantek, a river near the fictional town of Kampung Saujana, has just
          finished a year-long clean-up. Four voices are telling the story — the Department of Environment, the
          Residents' Association, the NGO <em>Sungai Bersih</em>, and the local paper, <em>The Ipoh Echo</em>. Your job
          across the next four tabs is to work out who's giving you a claim, and who's giving you evidence.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════ Tab 2: Sort & Classify ══════════════════ */
interface SortState {
  order: number[];
  index: number;
  results: { text: string; correct: boolean; given: SortAnswer; answer: SortAnswer }[];
}
function shuffleN(n: number, seed = 0): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  // Deterministic-enough Fisher-Yates driven by Math.random on init only
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function SortClassifyTab() {
  const [state, setState] = usePersistentState<SortState>(TOOL_ID, 'sort', {
    order: shuffleN(SORT_CARDS.length),
    index: 0,
    results: [],
  });
  const [pending, setPending] = useState<SortAnswer | null>(null);
  const card = SORT_CARDS[state.order[state.index]];
  const done = state.index >= SORT_CARDS.length;
  const score = state.results.filter((r) => r.correct).length;

  const answer = (choice: SortAnswer) => {
    if (pending) return;
    setPending(choice);
  };
  const next = () => {
    if (!pending) return;
    const correct = pending === card.answer;
    setState((s) => ({
      ...s,
      index: s.index + 1,
      results: [...s.results, { text: card.text, correct, given: pending, answer: card.answer }],
    }));
    setPending(null);
  };
  const restart = () => {
    setState({ order: shuffleN(SORT_CARDS.length), index: 0, results: [] });
    setPending(null);
  };

  return (
    <div className="grid gap-6 max-w-[820px] mx-auto">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Sort & Classify" zh="分类" />
        </DisplayH2>
        <Body className="mt-3">
          <Bi
            en={
              <>
                15 statements from the Sungai Chantek story. For each one, decide: is it a bare <strong>claim</strong>,
                genuine <strong>evidence</strong>, or a <strong>claim + evidence</strong> combined in one statement?
              </>
            }
            zh="来自清溪河故事的 15 句陈述。请判断：是「主张」、「证据」，还是「主张 + 证据」的组合？"
          />
        </Body>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[12.5px] text-[color:var(--color-ink)]">
          Card <strong>{Math.min(state.index + 1, SORT_CARDS.length)}</strong> of {SORT_CARDS.length}
        </p>
        <p className="font-mono text-[12.5px] text-[color:var(--color-ink)]">
          Score: <strong>{score}</strong> / {SORT_CARDS.length}
        </p>
      </div>
      <div className="h-2 bg-[color:var(--color-line)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[color:var(--color-amber)] to-[color:var(--color-forest)]"
          style={{ width: `${(state.index / SORT_CARDS.length) * 100}%` }}
        />
      </div>

      {!done ? (
        <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6 md:p-7">
          <p className="text-[15px] leading-[1.6] italic text-[color:var(--color-ink)]">"{card.text}"</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {(['claim', 'evidence', 'combined'] as SortAnswer[]).map((c) => {
              const isPending = pending === c;
              const showCorrect = pending && c === card.answer;
              const showWrong = isPending && c !== card.answer;
              let cls = 'text-left text-[13px] font-semibold p-3 rounded-md border border-[color:var(--color-line)] text-[color:var(--color-ink)] bg-[color:var(--color-paper-2)] hover:border-[color:var(--color-ink)]';
              if (showCorrect) cls = 'text-left text-[13px] font-semibold p-3 rounded-md border bg-[color:var(--color-forest-soft)] border-[color:var(--color-forest)] text-[color:var(--color-forest-deep)]';
              else if (showWrong) cls = 'text-left text-[13px] font-semibold p-3 rounded-md border bg-[color:var(--color-ember-soft)] border-[color:var(--color-ember)] text-[color:var(--color-ember)]';
              return (
                <button key={c} type="button" disabled={!!pending} onClick={() => answer(c)} className={cls}>
                  {c === 'claim' ? 'CLAIM' : c === 'evidence' ? 'EVIDENCE' : 'CLAIM + EVIDENCE'}
                  <br />
                  <span className="text-[11px] font-normal text-[color:var(--color-ink-3)]">
                    {c === 'claim' ? 'no source behind it' : c === 'evidence' ? 'sourced & measured' : 'a claim, backed up'}
                  </span>
                </button>
              );
            })}
          </div>

          {pending && (
            <div
              className={`mt-4 rounded-md p-4 text-[13.5px] leading-[1.55] ${
                pending === card.answer
                  ? 'bg-[color:var(--color-forest-soft)] text-[color:var(--color-forest-deep)]'
                  : 'bg-[color:var(--color-ember-soft)] text-[color:var(--color-ember)]'
              }`}
            >
              <strong>{pending === card.answer ? '✓ Correct — ' : '✗ Not quite — correct answer: '}</strong>
              {card.answer.toUpperCase()}
              <p className="mt-2 text-[color:var(--color-ink-2)]">{card.why}</p>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={next}
              disabled={!pending}
              className="text-[13px] font-semibold px-4 py-2 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] disabled:opacity-40"
            >
              Next card →
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6 md:p-7">
          <DisplayH3>
            Sort complete — {score} / {SORT_CARDS.length}
          </DisplayH3>
          <div className="mt-4 grid gap-2">
            {state.results.map((r, i) => (
              <p key={i} className="text-[13.5px] leading-[1.55] text-[color:var(--color-ink)]">
                <span className="mr-2">{r.correct ? '✅' : '❌'}</span>
                {r.text}
                {!r.correct && (
                  <em className="text-[color:var(--color-ember)]"> (you said {r.given}, it was {r.answer})</em>
                )}
              </p>
            ))}
          </div>
          <button
            type="button"
            onClick={restart}
            className="mt-5 text-[13px] font-semibold px-4 py-2 rounded-full border border-[color:var(--color-ink-3)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
          >
            Restart Sort & Classify
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════ Tab 3: Highlight the Bulletin ══════════════════ */
function HighlightTab() {
  const [picks, setPicks] = usePersistentState<Record<number, 'claim' | 'evidence'>>(TOOL_ID, 'highlight', {});
  const totalMarkable = ARTICLE_SENTENCES.filter((s) => s.type !== 'neutral').length;
  const marked = Object.keys(picks).length;
  const correct = Object.entries(picks).filter(([i, v]) => v === ARTICLE_SENTENCES[+i].type).length;

  const mark = (i: number, choice: 'claim' | 'evidence') => {
    if (picks[i]) return;
    setPicks((p) => ({ ...p, [i]: choice }));
  };
  const restart = () => setPicks({});

  return (
    <div className="grid gap-6 max-w-[820px] mx-auto">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Highlight the Bulletin" zh="标注新闻稿" />
        </DisplayH2>
        <Body className="mt-3">
          <Bi
            en={
              <>
                Read <em>The Ipoh Echo</em>'s report below. For each sentence, click{' '}
                <strong>Claim</strong> or <strong>Evidence</strong>. One opening sentence is scene-setting only — it
                doesn't need marking.
              </>
            }
            zh="阅读《怡保回声》的报道，为每句话点选「主张」或「证据」。首句为背景交代，不需标注。"
          />
        </Body>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[12.5px] text-[color:var(--color-ink)]">
          Marked: <strong>{marked}</strong> / {totalMarkable}
        </p>
        <p className="font-mono text-[12.5px] text-[color:var(--color-ink)]">
          Correct: <strong>{correct}</strong>
        </p>
      </div>
      <div className="h-2 bg-[color:var(--color-line)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[color:var(--color-amber)] to-[color:var(--color-forest)]"
          style={{ width: `${(marked / totalMarkable) * 100}%` }}
        />
      </div>

      <article className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5 md:p-6 grid gap-3">
        {ARTICLE_SENTENCES.map((s, i) => {
          const picked = picks[i];
          const correct = picked && picked === s.type;
          const wrong = picked && picked !== s.type;
          if (s.type === 'neutral') {
            return (
              <p key={i} className="text-[14.5px] leading-[1.7] text-[color:var(--color-ink-3)] italic">
                {s.text}
              </p>
            );
          }
          return (
            <p
              key={i}
              className={`text-[14.5px] leading-[1.7] rounded-md px-2 py-1 ${
                correct
                  ? 'bg-[color:var(--color-forest-soft)] text-[color:var(--color-ink)]'
                  : wrong
                  ? 'bg-[color:var(--color-ember-soft)] text-[color:var(--color-ink)]'
                  : 'text-[color:var(--color-ink)]'
              }`}
            >
              {s.text}
              <span className="ml-2 inline-flex gap-1 align-middle">
                {picked ? (
                  correct ? (
                    <span className="text-[color:var(--color-forest-deep)] font-semibold">✅</span>
                  ) : (
                    <span className="text-[color:var(--color-ember)] font-semibold">❌ (→ {s.type})</span>
                  )
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => mark(i, 'claim')}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[color:var(--color-ember)] text-[color:var(--color-ember)] hover:bg-[color:var(--color-ember-soft)]"
                    >
                      Claim
                    </button>
                    <button
                      type="button"
                      onClick={() => mark(i, 'evidence')}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[color:var(--color-forest)] text-[color:var(--color-forest-deep)] hover:bg-[color:var(--color-forest-soft)]"
                    >
                      Evidence
                    </button>
                  </>
                )}
              </span>
            </p>
          );
        })}
      </article>

      <div>
        <button
          type="button"
          onClick={restart}
          className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full border border-[color:var(--color-ink-3)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
        >
          Restart
        </button>
      </div>
    </div>
  );
}

/* ══════════════════ Tab 4: Developed vs Basic ══════════════════ */
function DevelopedTab() {
  const [answers, setAnswers] = usePersistentState<string[]>(
    TOOL_ID,
    'upgrades',
    UPGRADE_PROMPTS.map(() => ''),
  );
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <div className="grid gap-8 max-w-[820px] mx-auto">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Developed vs Basic" zh="展开 vs 基础" />
        </DisplayH2>
      </div>

      <Callout tone="cobalt" eyebrow={<Bi en="Table E — Evaluation of evidence & sources (AO1)" zh="表 E — 证据与来源评估" />}>
        <p>
          <strong>Level 3 (5–6 marks):</strong> Makes two appropriate and <strong>developed</strong> points of
          evaluation of evidence presented and/or sources used.
        </p>
        <p className="mt-2">
          <strong>Level 2 (3–4 marks):</strong> Makes two or more <strong>basic</strong> evaluative comments about
          evidence and/or sources.
        </p>
      </Callout>

      <Body>
        The whole gap between Level 2 and Level 3 often comes down to one thing:{' '}
        <strong>does the sentence keep going after the noun?</strong>
      </Body>

      <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ember)]">
          BASIC (Level 2)
        </p>
        <p className="mt-2 italic text-[14.5px] text-[color:var(--color-ink)]">
          "This is good evidence because it comes from the government."
        </p>
        <p className="mt-3 text-[14px] leading-[1.6] text-[color:var(--color-ink)]">
          <strong>Developed (Level 3):</strong> "This is strong evidence because it comes from the Department of
          Environment, a government body that uses a standardised measurement — the Water Quality Index — rather than
          personal opinion, and it gives an exact date and a comparison figure. That combination makes it far more
          reliable than someone simply saying the river 'looks cleaner.'"
        </p>
      </div>

      <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-4">
        <p className="text-[13.5px] leading-[1.6] text-[color:var(--color-ink)]">
          <strong>Sentence frame:</strong> "This is [strong / weak] evidence because it comes from ___, it uses /
          doesn't use a clear method (___), and it does / doesn't give a specific date or figure — which means ___."
        </p>
      </div>

      <DisplayH3>
        <Bi en="Your turn — upgrade these three" zh="轮到你——改写这三段" />
      </DisplayH3>

      <div className="grid gap-4">
        {UPGRADE_PROMPTS.map((u, i) => (
          <div key={i} className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5">
            <p className="text-[14px] leading-[1.6] text-[color:var(--color-ink)]">
              <strong>Evidence:</strong> {u.evidence}
            </p>
            <p className="mt-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ember)]">
              BASIC (Level 2)
            </p>
            <p className="mt-1 italic text-[14px] text-[color:var(--color-ink)]">{u.basic}</p>
            <p className="mt-3 text-[13px] font-semibold text-[color:var(--color-ink)]">
              Write your own developed (Level 3) version:
            </p>
            <textarea
              value={answers[i]}
              onChange={(e) => setAnswers((cur) => cur.map((v, idx) => (idx === i ? e.target.value : v)))}
              placeholder="This is strong/weak evidence because…"
              className="mt-2 w-full min-h-[100px] p-3 text-[14px] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-amber)] focus:ring-1 focus:ring-[color:var(--color-amber)]"
            />
            <button
              type="button"
              onClick={() => setRevealed((s) => ({ ...s, [i]: !s[i] }))}
              className="mt-3 text-[12.5px] font-semibold px-3 py-1.5 rounded-full border border-[color:var(--color-ink-3)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
            >
              {revealed[i] ? 'Hide model' : 'Reveal a model answer'}
            </button>
            {revealed[i] && (
              <div className="mt-3 bg-[color:var(--color-forest-soft)] border-l-[3px] border-[color:var(--color-forest)] p-4 rounded-r-md text-[14px] leading-[1.6] text-[color:var(--color-ink)]">
                <strong>Model developed comment:</strong> {u.model}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════ Tab 5: Mixed Practice ══════════════════ */
interface PracticeState {
  order: number[];
  index: number;
  xp: number;
  streak: number;
  bestStreak: number;
  chosen: 'claim' | 'evidence' | null;
  finished: boolean;
}
function PracticeTab() {
  const [state, setState] = useState<PracticeState>(() => ({
    order: shuffleN(PRACTICE_POOL.length),
    index: 0,
    xp: 0,
    streak: 0,
    bestStreak: 0,
    chosen: null,
    finished: false,
  }));
  const item = PRACTICE_POOL[state.order[state.index]];

  const answer = (choice: 'claim' | 'evidence') => {
    if (state.chosen || !item) return;
    const correct = choice === item.answer;
    const nextStreak = correct ? state.streak + 1 : 0;
    const gain = correct ? (nextStreak >= 3 ? 20 : nextStreak === 2 ? 15 : 10) : 0;
    setState((s) => ({
      ...s,
      chosen: choice,
      xp: s.xp + gain,
      streak: nextStreak,
      bestStreak: Math.max(s.bestStreak, nextStreak),
    }));
    window.setTimeout(() => {
      setState((s) => {
        const nextIdx = s.index + 1;
        if (nextIdx >= PRACTICE_POOL.length) {
          return { ...s, finished: true };
        }
        return { ...s, index: nextIdx, chosen: null };
      });
    }, 1100);
  };
  const restart = () =>
    setState({
      order: shuffleN(PRACTICE_POOL.length),
      index: 0,
      xp: 0,
      streak: 0,
      bestStreak: 0,
      chosen: null,
      finished: false,
    });

  const level = useMemo(() => levelForXp(state.xp), [state.xp]);

  return (
    <div className="grid gap-6 max-w-[820px] mx-auto">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Mixed Practice" zh="综合练习" />
        </DisplayH2>
        <Body className="mt-3">
          <Bi en="Quick-fire round. Claim or evidence — build your streak." zh="快速判断：主张还是证据？连对拿分。" />
        </Body>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="XP" value={String(state.xp)} />
        <Stat label="Level" value={level} />
        <Stat label="Streak" value={String(state.streak)} />
        <Stat label="Best streak" value={String(state.bestStreak)} />
      </div>

      {!state.finished && item ? (
        <>
          <div className="flex justify-between text-[12.5px] font-mono text-[color:var(--color-ink-3)]">
            <span>Item {state.index + 1} of {PRACTICE_POOL.length}</span>
          </div>
          <div className="h-2 bg-[color:var(--color-line)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[color:var(--color-amber)] to-[color:var(--color-forest)]"
              style={{ width: `${(state.index / PRACTICE_POOL.length) * 100}%` }}
            />
          </div>
          <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6 md:p-7">
            <p className="text-[16px] leading-[1.6] italic text-[color:var(--color-ink)]">"{item.text}"</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {(['claim', 'evidence'] as const).map((c) => {
                const isChosen = state.chosen === c;
                const showCorrect = state.chosen && c === item.answer;
                const showWrong = isChosen && c !== item.answer;
                let cls = 'text-[14px] font-semibold p-3 rounded-md border border-[color:var(--color-line)] text-[color:var(--color-ink)] bg-[color:var(--color-paper-2)] hover:border-[color:var(--color-ink)]';
                if (showCorrect) cls = 'text-[14px] font-semibold p-3 rounded-md border bg-[color:var(--color-forest-soft)] border-[color:var(--color-forest)] text-[color:var(--color-forest-deep)]';
                else if (showWrong) cls = 'text-[14px] font-semibold p-3 rounded-md border bg-[color:var(--color-ember-soft)] border-[color:var(--color-ember)] text-[color:var(--color-ember)]';
                return (
                  <button key={c} type="button" disabled={!!state.chosen} onClick={() => answer(c)} className={cls}>
                    {c === 'claim' ? 'Claim' : 'Evidence'}
                  </button>
                );
              })}
            </div>
            {state.chosen && (
              <p
                className={`mt-4 text-[13.5px] ${
                  state.chosen === item.answer
                    ? 'text-[color:var(--color-forest-deep)]'
                    : 'text-[color:var(--color-ember)]'
                }`}
              >
                <strong>
                  {state.chosen === item.answer
                    ? `✓ Correct — +${state.streak >= 3 ? 20 : state.streak === 2 ? 15 : 10} XP${
                        state.streak >= 3 ? ' (streak bonus!)' : ''
                      }`
                    : `✗ It was ${item.answer.toUpperCase()}. Streak reset — next one!`}
                </strong>
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6 text-center">
          <DisplayH3>Round complete!</DisplayH3>
          <p className="mt-3 text-[15px] text-[color:var(--color-ink-2)]">
            Final XP: <strong>{state.xp}</strong> · Best streak: <strong>{state.bestStreak}</strong>
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-5 text-[13px] font-semibold px-4 py-2 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)]"
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-4">
      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
        {label}
      </p>
      <p className="mt-1 font-display text-[20px] text-[color:var(--color-ink)]">{value}</p>
    </div>
  );
}

/* ══════════════════ Tab 6: Checklist & Reflection ══════════════════ */
function ChecklistTab() {
  const [checked, setChecked] = usePersistentState<boolean[]>(
    TOOL_ID,
    'checklist',
    new Array(CHECKLIST_ITEMS.length).fill(false),
  );
  const [reflection, setReflection] = usePersistentState<string>(TOOL_ID, 'reflection', '', (r) => r, (v) => v);
  const done = checked.filter(Boolean).length;

  return (
    <div className="grid gap-8 max-w-[820px] mx-auto">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Self-Assessment Checklist" zh="自评清单" />
        </DisplayH2>
      </div>
      <div>
        <div className="h-2 bg-[color:var(--color-line)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[color:var(--color-amber)] to-[color:var(--color-forest)]"
            style={{ width: `${(done / CHECKLIST_ITEMS.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[12px] text-[color:var(--color-ink-3)]">
          {done} / {CHECKLIST_ITEMS.length} complete
        </p>
      </div>
      <div className="grid gap-2">
        {CHECKLIST_ITEMS.map((c, i) => (
          <label
            key={i}
            className="flex items-start gap-3 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-4 cursor-pointer hover:border-[color:var(--color-ink)]"
          >
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={(e) => setChecked((cur) => cur.map((v, idx) => (idx === i ? e.target.checked : v)))}
              className="mt-1 w-4 h-4 accent-[color:var(--color-amber)]"
            />
            <span className="text-[14px] leading-[1.55] text-[color:var(--color-ink)]">
              {c.en}
              <span className="block text-[12px] text-[color:var(--color-ink-3)] mt-1">{c.zh}</span>
            </span>
          </label>
        ))}
      </div>

      <div>
        <DisplayH3>
          <Bi en="Reflection" zh="反思" />
        </DisplayH3>
        <p className="mt-2 text-[13.5px] text-[color:var(--color-ink-2)]">
          Which of the fifteen cards tricked you at first — and what was it about the wording that made it feel like
          evidence?
        </p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Type your reflection here…"
          className="mt-3 w-full min-h-[110px] p-3 text-[14px] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-amber)] focus:ring-1 focus:ring-[color:var(--color-amber)]"
        />
      </div>
    </div>
  );
}

/* ══════════════════ collect() ══════════════════ */
function collectClaimEvidence() {
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

  const sortState = read<{ order: number[]; index: number; results: { correct: boolean }[] }>(
    'sort',
    { order: [], index: 0, results: [] },
  );
  sections.push({
    heading: 'Sort & Classify',
    blocks: [
      nx.p([
        nx.text('Score: ', { bold: true }),
        nx.text(`${sortState.results.filter((r) => r.correct).length} / ${SORT_CARDS.length}`),
      ]),
    ],
  });

  const highlight = read<Record<number, 'claim' | 'evidence'>>('highlight', {});
  const markable = ARTICLE_SENTENCES.filter((s) => s.type !== 'neutral').length;
  const marked = Object.keys(highlight).length;
  const highlightCorrect = Object.entries(highlight).filter(
    ([i, v]) => v === ARTICLE_SENTENCES[+i].type,
  ).length;
  sections.push({
    heading: 'Highlight the Bulletin',
    blocks: [
      nx.p([nx.text(`Marked: ${marked} / ${markable}`, { bold: true })]),
      nx.p([nx.text(`Correct: ${highlightCorrect} / ${markable}`, { bold: true })]),
    ],
  });

  const upgrades = read<string[]>('upgrades', UPGRADE_PROMPTS.map(() => ''));
  const upBlocks: any[] = [];
  UPGRADE_PROMPTS.forEach((p, i) => {
    if (!upgrades[i]?.trim()) return;
    upBlocks.push(nx.h(3, `Upgrade ${i + 1}`));
    upBlocks.push(nx.p([nx.text('Evidence: ', { bold: true }), nx.text(p.evidence)]));
    upBlocks.push(nx.p([nx.text('Your developed answer:', { bold: true })]));
    upBlocks.push(nx.p(upgrades[i].trim()));
  });
  if (upBlocks.length) sections.push({ heading: 'Developed vs Basic — your answers', blocks: upBlocks });

  const checked = read<boolean[]>('checklist', new Array(CHECKLIST_ITEMS.length).fill(false));
  const clBlocks: any[] = [
    nx.p([nx.text(`${checked.filter(Boolean).length} of ${CHECKLIST_ITEMS.length} ticked`, { bold: true })]),
  ];
  CHECKLIST_ITEMS.forEach((c, i) => {
    clBlocks.push(nx.p((checked[i] ? '☑ ' : '☐ ') + c.en));
  });

  const reflection = readString('reflection');
  if (reflection) {
    clBlocks.push(nx.h(3, 'Reflection'));
    clBlocks.push(nx.p(reflection));
  }
  sections.push({ heading: 'Checklist & Reflection', blocks: clBlocks });

  return { sections };
}
