import { useState } from 'react';
import { Container, DisplayH1, DisplayH2, DisplayH3, Body, Eyebrow, Lede, Callout } from '../../components/primitives';
import { Bi } from '../../lib/LanguageContext';
import { ExportFooter } from '../../components/ExportFooter';
import { useNotesExport, nx, usePersistentState } from '../../lib/useNotesExport';
import {
  TOOL_ID,
  TRACKS,
  DIAGNOSTIC_ITEMS,
  TRACK_PRACTICE,
  RETEST_ITEMS,
  trackOptions,
  type TrackKey,
} from './findYourGapData';

type Stage = 'entry' | 'diagnostic' | 'results' | 'track' | 'retest' | 'final';

interface AppState {
  stage: Stage;
  studentName: string;
  diagIndex: number;
  diagAnswers: { category: TrackKey; correct: boolean }[];
  categoryScores: Record<TrackKey, { correct: number; total: number }>;
  assignedTrack: TrackKey | null;
  trackPicks: Record<number, number>; // per-item pick within trackPractice
  trackExplains: Record<number, string>;
  retestPicks: Record<number, number>;
}

const INITIAL_STATE: AppState = {
  stage: 'entry',
  studentName: '',
  diagIndex: 0,
  diagAnswers: [],
  categoryScores: {
    generalisation: { correct: 0, total: 0 },
    pairs: { correct: 0, total: 0 },
    context: { correct: 0, total: 0 },
  },
  assignedTrack: null,
  trackPicks: {},
  trackExplains: {},
  retestPicks: {},
};

/* ══════════════════ Root page ══════════════════ */
export function FindYourGapPage() {
  const [state, setState] = usePersistentState<AppState>(TOOL_ID, 'state', INITIAL_STATE);

  useNotesExport({
    toolId: TOOL_ID,
    pageTitleEn: 'Find Your Gap — Diagnostic & Targeted Practice',
    subtitleEn: 'IGCSE Global Perspectives 0457 · Student worksheet',
    filenameStem: 'GP_Find_Your_Gap',
    studentNameSelector: '#wne-student-name',
    exportDocxSelector: '#wne-export-docx',
    exportPdfSelector: '#wne-export-pdf',
    openNotesSelector: '#wne-open-notes',
    collect: () => collectFindYourGap(),
  });

  const goto = (stage: Stage) => {
    setState((s) => ({ ...s, stage }));
    window.scrollTo({ top: 260, behavior: 'smooth' });
  };

  const startDiagnostic = (name: string) => {
    setState({ ...INITIAL_STATE, studentName: name, stage: 'diagnostic' });
    window.scrollTo({ top: 260, behavior: 'smooth' });
  };

  const answerDiagnostic = (chosenIdx: number) => {
    setState((s) => {
      const item = DIAGNOSTIC_ITEMS[s.diagIndex];
      const correct = chosenIdx === item.answer;
      const cs = { ...s.categoryScores };
      cs[item.category] = {
        correct: cs[item.category].correct + (correct ? 1 : 0),
        total: cs[item.category].total + 1,
      };
      const nextIdx = s.diagIndex + 1;
      const nextAnswers = [...s.diagAnswers, { category: item.category, correct }];
      if (nextIdx >= DIAGNOSTIC_ITEMS.length) {
        // determine weakest
        let weakest: TrackKey = 'generalisation';
        let weakestRatio = 999;
        (Object.keys(cs) as TrackKey[]).forEach((c) => {
          const ratio = cs[c].total > 0 ? cs[c].correct / cs[c].total : 1;
          if (ratio < weakestRatio || (ratio === weakestRatio && c === 'generalisation')) {
            weakestRatio = ratio;
            weakest = c;
          }
        });
        return { ...s, diagAnswers: nextAnswers, diagIndex: nextIdx, categoryScores: cs, assignedTrack: weakest, stage: 'results' };
      }
      return { ...s, diagAnswers: nextAnswers, diagIndex: nextIdx, categoryScores: cs };
    });
  };

  const restart = () => {
    setState(INITIAL_STATE);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <>
      {/* HERO */}
      <section className="pt-12 md:pt-16 pb-8">
        <Container size="wide">
          <Eyebrow color="amber">
            <Bi en="Q1(b) · Diagnostic + targeted practice" zh="第 1(b) 题 · 诊断与针对性练习" />
          </Eyebrow>
          <DisplayH1 className="mt-3 max-w-[26ch]">
            <Bi en="Find your gap. Close it." zh="找出弱点，逐一击破。" />
          </DisplayH1>
          <Lede className="mt-6">
            <Bi
              en="A short 8-question diagnostic finds your weakest area — then gives you focused practice on exactly that, using new material so you can prove the skill transfers."
              zh="通过 8 题诊断找出你最弱的部分，然后针对该弱项进行练习，并用新材料检验是否掌握。"
            />
          </Lede>
        </Container>
      </section>

      <Container size="wide">
        <section className="py-10 md:py-14">
          {state.stage === 'entry' && (
            <EntryStage onStart={startDiagnostic} initialName={state.studentName} />
          )}
          {state.stage === 'diagnostic' && (
            <DiagnosticStage state={state} onAnswer={answerDiagnostic} />
          )}
          {state.stage === 'results' && state.assignedTrack && (
            <ResultsStage state={state} onStart={() => goto('track')} />
          )}
          {state.stage === 'track' && state.assignedTrack && (
            <TrackStage state={state} setState={setState} onContinue={() => goto('retest')} />
          )}
          {state.stage === 'retest' && state.assignedTrack && (
            <RetestStage state={state} setState={setState} onSubmit={() => goto('final')} />
          )}
          {state.stage === 'final' && state.assignedTrack && (
            <FinalStage state={state} onRestart={restart} />
          )}
        </section>
      </Container>

      <ExportFooter toolId={TOOL_ID} />
    </>
  );
}

/* ══════════════════ Stage 0: Entry ══════════════════ */
function EntryStage({ onStart, initialName }: { onStart: (name: string) => void; initialName: string }) {
  const [name, setName] = useState(initialName);
  const submit = () => {
    if (!name.trim()) return;
    onStart(name.trim());
  };
  return (
    <div className="max-w-[560px] mx-auto grid gap-6 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6 md:p-8">
      <DisplayH2>
        <Bi en="Before you start" zh="开始前" />
      </DisplayH2>
      <Body>
        <Bi
          en="Enter your name so your result can be checked at the end of the session. This stays on this device only — it isn't saved anywhere once you close the tab."
          zh="请输入姓名，方便结束时核对结果。资料只保存在此设备中。"
        />
      </Body>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Your name"
        maxLength={40}
        className="bg-[color:var(--color-paper)] border-b-2 border-[color:var(--color-ink-3)] focus:border-[color:var(--color-amber)] outline-none font-mono text-[15px] text-[color:var(--color-ink)] py-2"
      />
      <div>
        <button
          type="button"
          onClick={submit}
          disabled={!name.trim()}
          className="text-[13.5px] font-semibold px-5 py-3 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-ink-2)] disabled:opacity-40"
        >
          <Bi en="Start the diagnostic →" zh="开始诊断 →" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════ Stage 1: Diagnostic ══════════════════ */
function DiagnosticStage({ state, onAnswer }: { state: AppState; onAnswer: (idx: number) => void }) {
  const item = DIAGNOSTIC_ITEMS[state.diagIndex];
  return (
    <div className="grid gap-6 max-w-[820px] mx-auto">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Diagnostic — 8 questions" zh="诊断 — 8 题" />
        </DisplayH2>
        <Body className="mt-3">
          <Bi
            en="One question per statement type. Answer honestly — a wrong answer here just tells the tool what to give you more practice on. There's no penalty."
            zh="每题针对一种类型。请诚实作答，选错不扣分——工具将据此为你安排练习。"
          />
        </Body>
      </div>
      <div>
        <div className="h-2 bg-[color:var(--color-line)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[color:var(--color-amber)] to-[color:var(--color-forest)] transition-all"
            style={{ width: `${(state.diagIndex / DIAGNOSTIC_ITEMS.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[12px] text-[color:var(--color-ink-3)]">
          Question {state.diagIndex + 1} of {DIAGNOSTIC_ITEMS.length}
        </p>
      </div>
      <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-6 md:p-7">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
          {item.source}
        </p>
        <p className="mt-4 text-[15px] leading-[1.6] text-[color:var(--color-ink)]">
          What type of statement is this? <br />
          <span className="italic mt-2 block">{item.q}</span>
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {item.opts.map((o, i) => (
            <button
              key={o}
              type="button"
              onClick={() => onAnswer(i)}
              className="text-left text-[14px] font-semibold p-3 rounded-md border border-[color:var(--color-line)] text-[color:var(--color-ink)] bg-[color:var(--color-paper-2)] hover:border-[color:var(--color-ink)]"
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ Stage 2: Results ══════════════════ */
function ResultsStage({ state, onStart }: { state: AppState; onStart: () => void }) {
  const track = TRACKS.find((t) => t.key === state.assignedTrack)!;
  return (
    <div className="grid gap-6 max-w-[820px] mx-auto">
      <DisplayH2>
        <Bi
          en={`Nice work, ${state.studentName} — here's what the diagnostic found`}
          zh={`做得不错，${state.studentName} —— 诊断结果如下`}
        />
      </DisplayH2>
      <div className="grid gap-3 sm:grid-cols-3">
        {TRACKS.map((t) => {
          const s = state.categoryScores[t.key];
          const weakest = t.key === state.assignedTrack;
          const border = weakest ? 'border-[color:var(--color-amber)] border-t-[4px]' : 'border-[color:var(--color-line)]';
          return (
            <div key={t.key} className={`bg-[color:var(--color-paper)] border rounded-md p-5 ${border}`}>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
                {t.short}
              </p>
              <p className="mt-2 font-display text-[26px] text-[color:var(--color-ink)]">
                {s.correct}
                <span className="text-[color:var(--color-ink-3)] text-[18px]"> / {s.total}</span>
              </p>
              {weakest && (
                <p className="mt-2 text-[12px] font-semibold text-[color:var(--color-amber-deep)]">Your weakest area</p>
              )}
            </div>
          );
        })}
      </div>
      <Callout tone="amber" eyebrow={<Bi en="Your targeted practice" zh="你的针对性练习" />}>
        <p className="font-semibold">{track.name}</p>
        <p className="mt-2">
          <Bi
            en="This is where the diagnostic showed the most room to grow. You'll get extra practice specifically on this, then a quick re-test to check it's clicked."
            zh="诊断显示这是你最需要提升的部分。你将获得针对性练习，随后有一次快速复测。"
          />
        </p>
      </Callout>
      <div>
        <button
          type="button"
          onClick={onStart}
          className="text-[13.5px] font-semibold px-5 py-3 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-ink-2)]"
        >
          <Bi en="Start my targeted practice →" zh="开始针对性练习 →" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════ Stage 3: Track ══════════════════ */
function TrackStage({
  state,
  setState,
  onContinue,
}: {
  state: AppState;
  setState: (fn: (s: AppState) => AppState) => void;
  onContinue: () => void;
}) {
  const track = state.assignedTrack!;
  const items = TRACK_PRACTICE[track];
  const options = trackOptions(track);
  const correctIndex = (item: any): number => {
    if (track === 'generalisation') return item.isGen ? 0 : 1;
    return options.indexOf(item.answer);
  };

  const pick = (idx: number, chosenOptionIdx: number) => {
    if (state.trackPicks[idx] !== undefined) return;
    setState((s) => ({ ...s, trackPicks: { ...s.trackPicks, [idx]: chosenOptionIdx } }));
  };
  const setExplain = (idx: number, text: string) =>
    setState((s) => ({ ...s, trackExplains: { ...s.trackExplains, [idx]: text } }));

  const trackMeta = TRACKS.find((t) => t.key === track)!;
  return (
    <div className="grid gap-6 max-w-[860px] mx-auto">
      <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-amber)] border-t-[4px] rounded-md p-5">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber-deep)]">
          {state.studentName}’s track
        </p>
        <p className="mt-2 font-display text-[20px] text-[color:var(--color-ink)]">Targeted Practice: {trackMeta.name}</p>
      </div>

      <div className="grid gap-3">
        {(items as any[]).map((it, idx) => {
          const answered = state.trackPicks[idx];
          const correct = answered !== undefined && answered === correctIndex(it);
          return (
            <div key={idx} className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5">
              <p className="text-[14.5px] leading-[1.6] text-[color:var(--color-ink)]">
                <span className="font-mono text-[11.5px] text-[color:var(--color-ink-3)] mr-2">{idx + 1}.</span>
                {it.stmt}
              </p>
              <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">{it.src}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {options.map((o, oi) => {
                  const isChosen = answered === oi;
                  const showCorrect = answered !== undefined && oi === correctIndex(it);
                  const showWrong = isChosen && oi !== correctIndex(it);
                  let cls =
                    'text-[12.5px] font-semibold px-3 py-1.5 rounded-full border transition-colors border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]';
                  if (showCorrect) cls =
                    'text-[12.5px] font-semibold px-3 py-1.5 rounded-full border bg-[color:var(--color-forest-soft)] border-[color:var(--color-forest)] text-[color:var(--color-forest-deep)]';
                  if (showWrong) cls =
                    'text-[12.5px] font-semibold px-3 py-1.5 rounded-full border bg-[color:var(--color-ember-soft)] border-[color:var(--color-ember)] text-[color:var(--color-ember)]';
                  return (
                    <button
                      key={o}
                      type="button"
                      disabled={answered !== undefined}
                      onClick={() => pick(idx, oi)}
                      className={cls}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
              {answered !== undefined && (
                <p
                  className={`mt-3 text-[13.5px] leading-[1.55] ${
                    correct ? 'text-[color:var(--color-forest-deep)]' : 'text-[color:var(--color-ember)]'
                  }`}
                >
                  <strong>{correct ? '✓ Correct' : '✗ Not quite.'} — the signal to look for:</strong>{' '}
                  <span className="text-[color:var(--color-ink-2)]">{it.signal}</span>
                </p>
              )}
              {it.explainFocus && answered !== undefined && (
                <div className="mt-3">
                  <p className="text-[13px] font-semibold text-[color:var(--color-ink)]">
                    Now explain why: what specific word or clue gave it away?
                  </p>
                  <textarea
                    value={state.trackExplains[idx] || ''}
                    onChange={(e) => setExplain(idx, e.target.value)}
                    placeholder="Type your reasoning…"
                    className="mt-2 w-full min-h-[80px] p-3 text-[14px] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-amber)] focus:ring-1 focus:ring-[color:var(--color-amber)]"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <button
          type="button"
          onClick={onContinue}
          className="text-[13.5px] font-semibold px-5 py-3 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-ink-2)]"
        >
          <Bi en="Continue to re-test →" zh="进入复测 →" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════ Stage 4: Retest ══════════════════ */
function RetestStage({
  state,
  setState,
  onSubmit,
}: {
  state: AppState;
  setState: (fn: (s: AppState) => AppState) => void;
  onSubmit: () => void;
}) {
  const track = state.assignedTrack!;
  const items = RETEST_ITEMS[track];
  const pick = (idx: number, chosen: number) => {
    if (state.retestPicks[idx] !== undefined) return;
    setState((s) => ({ ...s, retestPicks: { ...s.retestPicks, [idx]: chosen } }));
  };
  const allAnswered = items.every((_, i) => state.retestPicks[i] !== undefined);
  return (
    <div className="grid gap-6 max-w-[820px] mx-auto">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Quick re-test" zh="快速复测" />
        </DisplayH2>
        <Body className="mt-3">
          <Bi
            en="Same category, new statements. This checks whether the practice actually closed the gap."
            zh="同类别、新材料。检验刚才的练习是否真正弥补了差距。"
          />
        </Body>
      </div>

      <div className="grid gap-3">
        {items.map((it, idx) => {
          const answered = state.retestPicks[idx];
          const correct = answered !== undefined && answered === it.answer;
          return (
            <div key={idx} className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5">
              <p className="text-[14.5px] leading-[1.6] text-[color:var(--color-ink)]">
                <span className="font-mono text-[11.5px] text-[color:var(--color-ink-3)] mr-2">{idx + 1}.</span>
                {it.stmt}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {it.opts.map((o, oi) => {
                  const isChosen = answered === oi;
                  const showCorrect = answered !== undefined && oi === it.answer;
                  const showWrong = isChosen && oi !== it.answer;
                  let cls =
                    'text-[12.5px] font-semibold px-3 py-1.5 rounded-full border transition-colors border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]';
                  if (showCorrect) cls =
                    'text-[12.5px] font-semibold px-3 py-1.5 rounded-full border bg-[color:var(--color-forest-soft)] border-[color:var(--color-forest)] text-[color:var(--color-forest-deep)]';
                  if (showWrong) cls =
                    'text-[12.5px] font-semibold px-3 py-1.5 rounded-full border bg-[color:var(--color-ember-soft)] border-[color:var(--color-ember)] text-[color:var(--color-ember)]';
                  return (
                    <button key={o} type="button" disabled={answered !== undefined} onClick={() => pick(idx, oi)} className={cls}>
                      {o}
                    </button>
                  );
                })}
              </div>
              {answered !== undefined && (
                <p className={`mt-3 text-[13.5px] ${correct ? 'text-[color:var(--color-forest-deep)]' : 'text-[color:var(--color-ember)]'}`}>
                  <strong>{correct ? '✓ Correct' : '✗ Not quite — review the signal words from your practice track.'}</strong>
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!allAnswered}
          className="text-[13.5px] font-semibold px-5 py-3 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-ink-2)] disabled:opacity-40"
        >
          <Bi en="Check my answers →" zh="查看结果 →" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════ Stage 5: Final ══════════════════ */
function FinalStage({ state, onRestart }: { state: AppState; onRestart: () => void }) {
  const track = state.assignedTrack!;
  const trackMeta = TRACKS.find((t) => t.key === track)!;
  const diagCat = state.categoryScores[track];
  const diagRatio = diagCat.total ? Math.round((diagCat.correct / diagCat.total) * 100) : 0;
  const retestItems = RETEST_ITEMS[track];
  const retestCorrect = retestItems.filter((it, i) => state.retestPicks[i] === it.answer).length;
  const retestRatio = retestItems.length ? Math.round((retestCorrect / retestItems.length) * 100) : 0;
  const improved = retestRatio > diagRatio;

  return (
    <div className="grid gap-6 max-w-[720px] mx-auto">
      <div className="text-center">
        <p className="text-[52px]" aria-hidden="true">✅</p>
        <DisplayH2>
          <Bi en={`Well done, ${state.studentName}!`} zh={`做得漂亮，${state.studentName}！`} />
        </DisplayH2>
      </div>

      <div className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md p-5 grid gap-3">
        <FinalRow label="Weakest area found" value={trackMeta.name} />
        <FinalRow label="Diagnostic score (this area)" value={`${diagCat.correct} / ${diagCat.total}`} />
        <FinalRow label="Re-test score" value={`${retestCorrect} / ${retestItems.length}`} />
        <FinalRow
          label="Improved?"
          value={improved ? 'Yes ✓' : 'Not yet — worth another look'}
          tone={improved ? 'forest' : 'ember'}
        />
      </div>

      <Callout tone="cobalt" eyebrow={<Bi en="Next step" zh="下一步" />}>
        <Bi
          en="Use the Word or PDF export at the bottom of the page to hand your teacher a printable record — it includes the diagnostic breakdown, targeted practice attempts, and the re-test result."
          zh="使用页面底部的 Word 或 PDF 导出，向老师提交可打印的记录——包括诊断、针对性练习与复测结果。"
        />
      </Callout>

      <div>
        <button
          type="button"
          onClick={onRestart}
          className="text-[13px] font-semibold px-4 py-2 rounded-full border border-[color:var(--color-ink-3)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
        >
          <Bi en="Start again" zh="重新开始" />
        </button>
      </div>
    </div>
  );
}

function FinalRow({ label, value, tone }: { label: string; value: string; tone?: 'forest' | 'ember' }) {
  const color =
    tone === 'forest'
      ? 'text-[color:var(--color-forest-deep)]'
      : tone === 'ember'
      ? 'text-[color:var(--color-ember)]'
      : 'text-[color:var(--color-ink)]';
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[color:var(--color-line)] pb-3 last:border-0 last:pb-0">
      <span className="text-[13.5px] text-[color:var(--color-ink-2)]">{label}</span>
      <strong className={`text-[15px] ${color}`}>{value}</strong>
    </div>
  );
}

/* ══════════════════ collect() ══════════════════ */
function collectFindYourGap() {
  const sections: Array<{ heading: string; blocks: any[] }> = [];
  let stored: AppState | null = null;
  try {
    const raw = localStorage.getItem(`wne_${TOOL_ID}_state`);
    if (raw) stored = JSON.parse(raw);
  } catch {}
  if (!stored) return { sections };

  // Diagnostic scores
  const diag: any[] = [];
  TRACKS.forEach((t) => {
    const s = stored!.categoryScores[t.key];
    diag.push(nx.p([nx.text(`${t.short}: `, { bold: true }), nx.text(`${s.correct} / ${s.total}`)]));
  });
  if (stored.assignedTrack) {
    const meta = TRACKS.find((t) => t.key === stored!.assignedTrack)!;
    diag.push(nx.p([nx.text('Weakest area: ', { bold: true }), nx.text(meta.name)]));
  }
  sections.push({ heading: 'Diagnostic', blocks: diag });

  // Track practice
  if (stored.assignedTrack) {
    const items = (TRACK_PRACTICE as any)[stored.assignedTrack] as any[];
    const options = trackOptions(stored.assignedTrack);
    const trackBlocks: any[] = [];
    let correctCount = 0;
    let answered = 0;
    items.forEach((it, i) => {
      const pick = stored!.trackPicks[i];
      if (pick === undefined) return;
      answered++;
      const correctIdx =
        stored!.assignedTrack === 'generalisation' ? (it.isGen ? 0 : 1) : options.indexOf(it.answer);
      const correct = pick === correctIdx;
      if (correct) correctCount++;
      trackBlocks.push(nx.h(3, `Item ${i + 1}`));
      trackBlocks.push(nx.p([nx.text('Statement: ', { bold: true }), nx.text(it.stmt)]));
      trackBlocks.push(
        nx.p([
          nx.text(correct ? '✓ Chose: ' : '✗ Chose: ', { bold: true }),
          nx.text(options[pick] || 'unanswered'),
        ]),
      );
      if (it.explainFocus && stored!.trackExplains[i]) {
        trackBlocks.push(nx.p([nx.text('Your explanation: ', { bold: true }), nx.text(stored!.trackExplains[i])]));
      }
    });
    trackBlocks.unshift(
      nx.p([nx.text(`Score: `, { bold: true }), nx.text(`${correctCount} / ${answered} answered (of ${items.length})`)]),
    );
    sections.push({ heading: 'Targeted practice', blocks: trackBlocks });

    // Retest
    const retest = RETEST_ITEMS[stored.assignedTrack];
    const retestBlocks: any[] = [];
    let retestCorrect = 0;
    let retestAnswered = 0;
    retest.forEach((it, i) => {
      const pick = stored!.retestPicks[i];
      if (pick === undefined) return;
      retestAnswered++;
      const correct = pick === it.answer;
      if (correct) retestCorrect++;
      retestBlocks.push(nx.p([nx.text(`Q${i + 1}: `, { bold: true }), nx.text(it.stmt)]));
      retestBlocks.push(
        nx.p([
          nx.text(correct ? '✓ ' : '✗ ', { bold: true }),
          nx.text(`Chose "${it.opts[pick]}" (correct: "${it.opts[it.answer]}")`),
        ]),
      );
    });
    retestBlocks.unshift(nx.p([nx.text('Score: ', { bold: true }), nx.text(`${retestCorrect} / ${retestAnswered}`)]));
    sections.push({ heading: 'Re-test', blocks: retestBlocks });
  }

  return { sections };
}
