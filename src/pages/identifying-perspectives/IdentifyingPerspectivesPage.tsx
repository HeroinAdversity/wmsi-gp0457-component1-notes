import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, DisplayH1, DisplayH2, DisplayH3, Body, Eyebrow, Chip, Callout, Button, Lede } from '../../components/primitives';
import { Bi, useLanguage } from '../../lib/LanguageContext';
import { ExportFooter } from '../../components/ExportFooter';
import { useNotesExport, nx } from '../../lib/useNotesExport';
import {
  LEVEL_DEFS,
  FIVE_ELEMENTS,
  VOICE_CARDS,
  PRACTICE_STATEMENTS,
  DESCRIBE_QUESTIONS,
  YOUR_TURN,
  CHECKLIST_ITEMS,
  type LevelKey,
} from './data';
import { WeighingRoomSection } from './WeighingRoomPage';
import { CRITERIA, BANDS, SELF_CHECK_ITEMS, TOOL_ID as WEIGH_TOOL_ID } from './weighingRoomData';
import { TabNoteBadge } from '../../components/NotesLayer';
import { usePublishTab } from '../../lib/activeTab';
import { Q1WorksheetPrinter } from '../q1/components/Q1WorksheetPrinter';

const IP_TOOL_ID = 'identifying-perspectives';

const IDENTIFY_TABS = [
  { id: 'overview', en: 'Overview', zh: '概述' },
  { id: 'framework', en: 'Framework', zh: '框架' },
  { id: 'case', en: 'Case study', zh: '案例' },
  { id: 'practice', en: 'Classify & explain', zh: '分类与解释' },
  { id: 'examprep', en: 'Exam practice', zh: '应试练习' },
  { id: 'yourturn', en: 'Your turn', zh: '自己写' },
  { id: 'checklist', en: 'Checklist', zh: '自查' },
] as const;

type IdentifyTabId = (typeof IDENTIFY_TABS)[number]['id'];
type WeighTabKey = 'overview' | 'toolkit' | 'model' | 'levelup' | 'practice' | 'journal';
type Section = 'identify' | 'weigh';

const WEIGH_TAB_KEYS: WeighTabKey[] = ['overview', 'toolkit', 'model', 'levelup', 'practice', 'journal'];
const WEIGH_TAB_LABELS: Record<WeighTabKey, string> = {
  overview: 'Overview', toolkit: 'Toolkit', model: 'Worked model', levelup: 'Level-up', practice: 'Exam practice', journal: 'Progress & journal',
};

/**
 * URL hash convention:
 *   #framework           → identify section, framework tab
 *   #weigh               → weigh section, its overview tab
 *   #weigh-toolkit       → weigh section, toolkit tab
 *
 * Bare identify-tab hashes stay backward-compatible with links written before
 * the Weighing Room was folded in.
 */
function parseHash(hash: string): { section: Section; identifyTab: IdentifyTabId; weighTab: WeighTabKey } {
  const raw = hash.replace(/^#/, '');
  if (raw === 'weigh') {
    return { section: 'weigh', identifyTab: 'overview', weighTab: 'overview' };
  }
  if (raw.startsWith('weigh-')) {
    const key = raw.slice('weigh-'.length) as WeighTabKey;
    return {
      section: 'weigh',
      identifyTab: 'overview',
      weighTab: WEIGH_TAB_KEYS.includes(key) ? key : 'overview',
    };
  }
  if (IDENTIFY_TABS.some((t) => t.id === raw)) {
    return { section: 'identify', identifyTab: raw as IdentifyTabId, weighTab: 'overview' };
  }
  return { section: 'identify', identifyTab: 'overview', weighTab: 'overview' };
}

export function IdentifyingPerspectivesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const parsed = useMemo(() => parseHash(location.hash), [location.hash]);
  const [section, setSection] = useState<Section>(parsed.section);
  const [identifyTab, setIdentifyTab] = useState<IdentifyTabId>(parsed.identifyTab);
  const [weighTab, setWeighTab] = useState<WeighTabKey>(parsed.weighTab);
  // Notes belong to the tab's hash, so a weigh tab is saved as "weigh-<tab>".
  usePublishTab(
    section === 'weigh' ? `weigh-${weighTab}` : identifyTab,
    section === 'weigh' ? `Significance · ${WEIGH_TAB_LABELS[weighTab]}` : IDENTIFY_TABS.find((t) => t.id === identifyTab)?.en ?? '',
  );

  useEffect(() => {
    if (parsed.section !== section) setSection(parsed.section);
    if (parsed.identifyTab !== identifyTab) setIdentifyTab(parsed.identifyTab);
    if (parsed.weighTab !== weighTab) setWeighTab(parsed.weighTab);
  }, [parsed.section, parsed.identifyTab, parsed.weighTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const writeHash = (h: string) =>
    navigate({ pathname: location.pathname, hash: h ? `#${h}` : '' }, { replace: true });

  const switchIdentifyTab = (t: IdentifyTabId) => {
    setIdentifyTab(t);
    writeHash(t);
    window.scrollTo({ top: 260, behavior: 'smooth' });
  };

  const switchWeighTab = (t: WeighTabKey) => {
    setWeighTab(t);
    writeHash(`weigh-${t}`);
  };

  useNotesExport({
    toolId: IP_TOOL_ID,
    pageTitleEn: 'Q1(c) + Q1(d) — Identifying Perspectives & The Weighing Room',
    subtitleEn: 'IGCSE Global Perspectives 0457 · Student worksheet',
    filenameStem: 'GP_Perspectives',
    studentNameSelector: '#wne-student-name',
    exportDocxSelector: '#wne-export-docx',
    exportPdfSelector:  '#wne-export-pdf',
    openNotesSelector:  '#wne-open-notes',
    collect: () => collectPerspectives(),
  });

  return (
    <>
      {/* HERO — shared across both Q1(c) and Q1(d) */}
      <section className="pt-12 md:pt-16 pb-8">
        <Container size="wide">
          <Eyebrow color={section === 'weigh' ? 'forest' : 'amber'}>
            <Bi
              en={section === 'weigh' ? 'Q1(d) · Significance skills' : 'Q1(c) · Analytical skills'}
              zh={section === 'weigh' ? '第 1(d) 题 · 重要性判断' : '第 1(c) 题 · 观点分析'}
            />
          </Eyebrow>
          <DisplayH1 className="mt-3 max-w-[24ch]">
            <Bi
              en="Perspectives — read them, then weigh them."
              zh="观点 —— 先读懂，再权衡。"
            />
          </DisplayH1>
          <Lede className="mt-6">
            <Bi
              en={
                <>
                  Two connected skills on the same Paper 1 source: <strong>identify and describe</strong> the
                  perspective (Q1(c), 6 marks), then <strong>weigh which point matters most</strong> (Q1(d), 8 marks).
                  Together they carry 14 of the paper's 70 marks — a fifth of the exam.
                </>
              }
              zh={
                <>
                  这两项技能建立在卷一同一份资料之上：<strong>识别并描述观点</strong>（第 1(c) 题，6 分），再<strong>判断哪一点最为重要</strong>（第 1(d) 题，8 分）。
                  合计 14 分，约占全卷 70 分的五分之一。
                </>
              }
            />
          </Lede>
          <Q1WorksheetPrinter key={section} part={section === 'weigh' ? 'd' : 'c'} />
        </Container>
      </section>

      {section === 'identify' ? (
        <>
          {/* SUB-TAB STRIP (Q1c) */}
          <div className="sticky top-[calc(var(--site-header-h,64px)+var(--section-bar-h,0px))] z-20 bg-[color:var(--color-paper)]/95 backdrop-blur-md border-b border-[color:var(--color-line)]">
            <Container size="wide">
              <nav
                className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                role="tablist"
                aria-label="Identify perspectives tabs"
              >
                {IDENTIFY_TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={identifyTab === t.id}
                    onClick={() => switchIdentifyTab(t.id)}
                    className={`shrink-0 text-[13.5px] font-semibold py-3.5 border-b-2 -mb-px transition-colors ${
                      identifyTab === t.id
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

          <Container size="wide">
            <section className="py-10 md:py-14" role="tabpanel">
              {identifyTab === 'overview' && <OverviewTab />}
              {identifyTab === 'framework' && <FrameworkTab />}
              {identifyTab === 'case' && <CaseStudyTab />}
              {identifyTab === 'practice' && <PracticeTab />}
              {identifyTab === 'examprep' && <ExamPracticeTab />}
              {identifyTab === 'yourturn' && <YourTurnTab />}
              {identifyTab === 'checklist' && <ChecklistTab />}
            </section>
          </Container>
        </>
      ) : (
        <WeighingRoomSection initialTab={weighTab} onTabChange={switchWeighTab} />
      )}

      <ExportFooter toolId={IP_TOOL_ID} />
    </>
  );
}

/* ============================================================
   Collect for the Perspectives + Weighing Room worksheet.
   Q1(c) student input lives in sub-components — read from DOM by
   data attributes at collect() time. Q1(d) state is persisted via
   usePersistentState on WeighingRoomSection, so read from localStorage.
   ============================================================ */
function collectPerspectives() {
  const sections: Array<{ heading: string; blocks: any[] }> = [];

  // --- Q1(c) responses: read textareas by data-wne-* attributes ---
  const q1cBlocks: any[] = [];
  document.querySelectorAll<HTMLTextAreaElement>('textarea[data-wne-qid]').forEach((ta) => {
    const val = ta.value.trim();
    if (!val) return;
    const qid = ta.getAttribute('data-wne-qid') || '';
    const label = ta.getAttribute('data-wne-label') || `Question ${qid}`;
    q1cBlocks.push(nx.h(3, label));
    q1cBlocks.push(nx.p(val));
  });
  if (q1cBlocks.length) {
    sections.push({ heading: 'Q1(c) — Describe the perspective', blocks: q1cBlocks });
  }

  // --- Your Turn textarea ---
  const yt = document.querySelector<HTMLTextAreaElement>('textarea[data-wne-yourturn]');
  if (yt && yt.value.trim()) {
    sections.push({
      heading: 'Your turn — Five Elements description',
      blocks: [nx.p(yt.value.trim())],
    });
  }

  // --- Q1(d) Weighing Room: persisted state ---
  let wrState: any = null;
  try {
    const raw = localStorage.getItem(`wne_${WEIGH_TOOL_ID}_state`);
    if (raw) wrState = JSON.parse(raw);
  } catch { /* ignore */ }

  if (wrState && Array.isArray(wrState.sets)) {
    const wrBlocks: any[] = [];
    wrState.sets.forEach((setState: any, i: number) => {
      const response = (setState.response || '').trim();
      const criteria = setState.criteria || [];
      const band = setState.band;
      if (!response && !criteria.length && !band) return;
      wrBlocks.push(nx.h(3, `Practice item ${i + 1}`));
      wrBlocks.push(nx.p([nx.text('Your answer:', { bold: true })]));
      wrBlocks.push(nx.p(response || '(blank)'));
      if (criteria.length) {
        const labels = criteria.map((k: string) => {
          const c = CRITERIA.find((x: any) => x.key === k);
          return c ? c.labelEn : k;
        });
        wrBlocks.push(nx.p([nx.text('Weights you used: ', { bold: true }), nx.text(labels.join(', '))]));
      }
      if (band) {
        const b = BANDS.find((x: any) => x.key === band);
        wrBlocks.push(nx.p([nx.text('Self-assessed level: ', { bold: true }), nx.text(b ? `${b.label} — ${b.descEn}` : String(band))]));
      }
    });
    if (wrBlocks.length) sections.push({ heading: 'Q1(d) — Exam-style practice (Weighing Room)', blocks: wrBlocks });

    // Self-check
    const scChecks = wrState.selfCheck || [];
    const doneCount = scChecks.filter(Boolean).length;
    const scBlocks: any[] = [nx.p([nx.text(`${doneCount} of ${SELF_CHECK_ITEMS.length} ticked`, { bold: true })])];
    SELF_CHECK_ITEMS.forEach((item: string, i: number) => {
      const mark = scChecks[i] ? '☑ ' : '☐ ';
      scBlocks.push(nx.p(mark + item));
    });
    sections.push({ heading: 'Q1(d) — Self-check', blocks: scBlocks });

    if ((wrState.levelupStep || 0) >= 4) {
      sections.push({
        heading: 'Q1(d) — Level-up challenge',
        blocks: [nx.p([nx.text('Completed all four building steps — reached Level 4 in the answer-builder.', { bold: true })])],
      });
    }
  }

  // --- Identify checklist (Q1c) — DOM-scanned checkbox items ---
  const identifyChecks = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-wne-checklist]'));
  if (identifyChecks.length) {
    const done = identifyChecks.filter((c) => c.checked).length;
    const clBlocks: any[] = [nx.p([nx.text(`${done} of ${identifyChecks.length} ticked`, { bold: true })])];
    identifyChecks.forEach((cb) => {
      const label = cb.getAttribute('data-wne-checklist') || '';
      const mark = cb.checked ? '☑ ' : '☐ ';
      clBlocks.push(nx.p(mark + label));
    });
    sections.push({ heading: 'Q1(c) — Self-check', blocks: clBlocks });
  }

  return { sections };
}

/* ─────────── Overview ─────────── */
function OverviewTab() {
  const { lang } = useLanguage();
  return (
    <div className="grid gap-10 md:gap-14">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="What is a perspective?" zh="什么是「观点」(perspective)？" />
        </DisplayH2>
        <Body className="mt-5">
          <Bi
            en={
              <>
                Cambridge defines a <em>perspective</em> as a viewpoint on an issue that is supported by reasoning
                and evidence. That's different from an <em>opinion</em>, which is a view not necessarily based on
                fact or knowledge. Every global issue can be seen from more than one perspective, and those perspectives
                usually sit at one of four levels.
              </>
            }
            zh={
              <>
                剑桥将「观点」（perspective）定义为：对某一议题的看法，并有推理和证据作支持：这与
                「意见」（opinion）不同，后者不一定基于事实或知识。每一个全球性议题都可以从不止一个角度去看，
                而这些角度通常可以归入以下四个层次之一。
              </>
            }
          />
        </Body>
      </div>

      {/* Concentric diagram + level cards */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] items-start">
        <div>
          <ConcentricDiagram lang={lang} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {LEVEL_DEFS.map((L) => (
            <div
              key={L.key}
              className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-[6px] p-5"
            >
              <Chip color={L.key === 'GLOBAL' ? 'cobalt' : L.key === 'NATIONAL' ? 'forest' : L.key === 'LOCAL' ? 'amber' : 'violet'}>
                <Bi en={L.en.name} zh={L.zh.name} />
              </Chip>
              <p className="mt-3 text-[14.5px] text-[color:var(--color-ink)]">
                <Bi en={L.en.def} zh={L.zh.def} />
              </p>
              <p className="mt-3 text-[13.5px] text-[color:var(--color-ink-2)] border-l-2 border-[color:var(--color-line)] pl-3 italic">
                <Bi
                  en={<><strong>Example:</strong> {L.en.example}</>}
                  zh={<><strong>例子：</strong> {L.zh.example}</>}
                />
              </p>
            </div>
          ))}
        </div>
      </div>

      <Callout tone="violet" eyebrow={<Bi en="Cultural lens" zh="文化透镜" />}>
        <Bi
          en="Culture isn't a fifth level sitting alongside the other four: it's a lens that colours how national, local, and personal perspectives form. Two neighbouring countries can hold very different national perspectives on the same border because their national identities are built on different histories. Two communities within the same country can see a local issue differently because of different traditions, religion, or language. Learning to notice this cultural lens is part of explaining why perspectives differ: a skill the Oxford textbook (Ch. 1) and Cambridge's mark scheme both specifically reward."
          zh="文化并不是与前面四个层次并列的「第五个层次」，而是一面透镜，会为国家、地方和个人层面的观点染上不同的色彩。两个相邻国家可能因为各自的民族历史叙事不同，而对同一条边界持有截然不同的国家观点；同一个国家内的两个社区，也可能因为传统、宗教或语言的不同，对同一个地方议题看法不同。学会留意这层「文化透镜」，正是解释「为什么观点会不一样」这项技能的一部分：牛津教材第一章与剑桥评分标准都特别看重这项能力。"
        />
      </Callout>

      <Callout tone="cobalt" eyebrow={<Bi en="Oxford textbook · Chapter 1" zh="牛津教材 · 第一章" />}>
        <Bi
          en={
            <>
              The Oxford GP 3rd edition frames perspectives as arising from three underlying drivers: <strong>values</strong>{' '}
              (what a person or group believes matters), <strong>experience</strong> (what they have personally lived through),
              and <strong>knowledge</strong> (what information they have access to). Two people with the same information
              can hold different perspectives because their values or experiences differ. This is why simply "correcting the facts"
              rarely changes someone's perspective on a contested issue.
            </>
          }
          zh={
            <>
              牛津 GP 第三版将观点的形成归结为三个内在驱动因素：<strong>价值观</strong>（一个人或群体认为重要的东西）、<strong>亲身经历</strong>（他们所经历过的事情），以及
              <strong>可获得的知识</strong>（他们能接触到的信息）。两个掌握同样信息的人可能持有不同的观点，因为他们的价值观或经历不同。这正是为什么在有争议的议题上，
              「更正事实」很少能真正改变一个人的观点。
            </>
          }
        />
      </Callout>

      <div className="grid gap-6 md:grid-cols-2">
        <Callout tone="forest" eyebrow={<Bi en="Textbook enrichment · regional level" zh="教材补充 · 地区层面" />}>
          <Bi
            en={
              <>
                The Oxford textbook (Ch. 1, "Identifying global, national, and local issues") also names a fifth,
                intermediate level: <strong>regional</strong>. An issue that spans several neighbouring countries: say,
                haze across Southeast Asia, or drought across the Horn of Africa: is regional, not national and not
                yet global. Cambridge's Q1(a) and Q1(b) only require the four core levels, but the regional layer is
                useful when you write your Individual Report or Team Project.
              </>
            }
            zh={
              <>
                牛津教材第一章（「识别全球、国家与地方议题」）还提到一个介于国家与全球之间的第五层次：<strong>地区层面 (regional)</strong>。
                跨越几个邻国的议题：例如东南亚的雾霾，或非洲之角的干旱：就属于地区层面，还不是全国的，也还没有全球化。
                剑桥卷一第 1(a)、1(b) 题只要求掌握四个核心层次，但在你写「个人报告」或「团队项目」时，「地区层面」这一层特别有用。
              </>
            }
          />
        </Callout>

        <Callout tone="amber" eyebrow={<Bi en="Textbook enrichment · minds change" zh="教材补充 · 观点会改变" />}>
          <Bi
            en={
              <>
                A perspective is not a fixed identity: <em>perspectives can change over time</em>. The Oxford textbook
                gives the example of a well-known astronaut who flew multiple missions but later, in older age,
                turned against further space exploration. When a source describes how someone's view <em>shifted</em>,
                that shift itself is worth naming: it often reveals which value or experience did the shifting.
              </>
            }
            zh={
              <>
                观点并不是一成不变的身份：<em>观点会随时间改变</em>。牛津教材举了一位曾多次执行任务的知名宇航员为例：
                他在晚年反过来反对进一步的太空探索。当资料在描述某个人观点<em>发生转变</em>时，这个转变本身就值得点出：它往往能揭示是哪一项价值观或经历在起作用。
              </>
            }
          />
        </Callout>
      </div>
    </div>
  );
}

/* Concentric diagram: cleaner version of the SVG in the original */
function ConcentricDiagram({ lang }: { lang: 'en' | 'zh' }) {
  const labels =
    lang === 'zh'
      ? { g: '全球', n: '国家', l: '地方', p: '个人' }
      : { g: 'GLOBAL', n: 'NATIONAL', l: 'LOCAL', p: 'PERSONAL' };

  return (
    <figure className="relative mx-auto max-w-[340px] aspect-square">
      <div aria-hidden className="absolute inset-0 rounded-full border border-dashed border-[color:var(--color-line)]" />
      <div className="absolute inset-3 rounded-full bg-[color:var(--color-cobalt-soft)] border border-[color:var(--color-cobalt)]/30" />
      <div className="absolute inset-[16%] rounded-full bg-[color:var(--color-forest-soft)] border border-[color:var(--color-forest)]/30" />
      <div className="absolute inset-[34%] rounded-full bg-[color:var(--color-amber-soft)] border border-[color:var(--color-amber)]/30" />
      <div className="absolute inset-[52%] rounded-full bg-[color:var(--color-violet-soft)] border border-[color:var(--color-violet)]/30" />

      <span className="absolute top-[4%] left-1/2 -translate-x-1/2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-cobalt-deep)]">
        {labels.g}
      </span>
      <span className="absolute top-[19%] left-1/2 -translate-x-1/2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-forest)]">
        {labels.n}
      </span>
      <span className="absolute top-[37%] left-1/2 -translate-x-1/2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-amber)]">
        {labels.l}
      </span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-violet)]">
        {labels.p}
      </span>
    </figure>
  );
}

/* ─────────── Framework tab ─────────── */
function FrameworkTab() {
  return (
    <div className="grid gap-12">
      {/* Header: command words + Five Elements intro side-by-side */}
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <DisplayH2>
            <Bi en="Three command words." zh="三个指令词。" />
          </DisplayH2>
          <Body className="mt-5">
            <Bi
              en={
                <>
                  <strong>"Identify"</strong> means naming which level a perspective sits at, and whose it is: no
                  reasoning required. <strong>"Describe"</strong> means stating the points of a topic and giving its
                  characteristics and main features: clear and full, but without justification.{' '}
                  <strong>"Explain"</strong> goes further still: setting out reasons, making relationships clear, and
                  saying why and/or how, supported with evidence. These are Cambridge's own definitions, and they
                  matter: a "describe" question and an "explain" question are marked on different things.
                </>
              }
              zh={
                <>
                  <strong>「识别」(identify)</strong>是指说出一个观点属于哪个层次、是谁的观点：不需要说明理由。
                  <strong>「描述」(describe)</strong>是指说明某一主题的要点，列出其特征与主要方面：要清楚而全面，但不需要论证。
                  <strong>「解释」(explain)</strong>则要求更进一步：说明理由、理清关系，并说明为什么／如何，并有证据支持。这些是剑桥官方定义，非常关键：「描述」题与「解释」题的评分标准并不相同。
                </>
              }
            />
          </Body>
        </div>

        <div>
          <DisplayH2>
            <Bi en="Five Elements." zh="五个要素。" />
          </DisplayH2>
          <Body className="mt-5">
            <Bi
              en={
                <>
                  When a question asks you to <strong>describe a perspective</strong> from a source, Cambridge's Table A
                  mark scheme rewards covering a wide range of five elements, each backed by specific words from the
                  source. This is the real structure the examiners use.
                </>
              }
              zh={
                <>
                  当题目要求你从资料中<strong>描述一个观点</strong>时，剑桥表 A 评分标准所奖励的，是覆盖广泛的五个要素，
                  并且每一个都有资料中的具体词语作支持。这是考官实际使用的结构。
                </>
              }
            />
          </Body>
        </div>
      </div>

      {/* Five Elements grid (full width) */}
      <div>
        <ol className="grid gap-3 md:grid-cols-5">
          {FIVE_ELEMENTS.map((el, i) => (
            <li
              key={el.id}
              className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-[6px] p-5 flex flex-col gap-3"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[36px] leading-none text-[color:var(--color-cobalt)]">
                  {i + 1}
                </span>
                <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink)]">
                  <Bi en={el.labelEn} zh={el.labelZh} />
                </span>
              </div>
              <p className="text-[13.5px] leading-[1.5] text-[color:var(--color-ink-2)]">
                <Bi en={el.descEn} zh={el.descZh} />
              </p>
              <p className="text-[12px] leading-[1.45] text-[color:var(--color-amber)] italic pt-2 border-t border-[color:var(--color-line-soft)]">
                <Bi en={el.signalsEn} zh={el.signalsZh} />
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Callout tone="amber" eyebrow={<Bi en="Practical note · coverage" zh="实用提示 · 覆盖面" />}>
          <Bi
            en="A source rarely spells out all five elements with equal clarity, and the same sentence can sometimes serve two elements at once: you'll see this in the worked example below. A strong answer covers as many elements as the source genuinely supports, backed by specific words from the text. Don't invent an element that isn't there just to complete the set."
            zh="一份资料很少会把这五个要素都同样清楚地写出来，有时同一句话甚至能同时体现两个要素：你会在下面的范例中看到这一点。一个出色的答案，会尽可能覆盖资料真正能支持的要素，并有资料中的具体词语作为依据。不要为了凑齐五项，而生造一个资料中并不存在的要素。"
          />
        </Callout>

        <Callout tone="forest" eyebrow={<Bi en="Textbook enrichment · owner and product" zh="教材补充 · 「作者」与「作品」" />}>
          <Bi
            en={
              <>
                The Oxford textbook (Ch. 1) frames source analysis as two moves: <strong>provenance</strong> (where the
                source came from: its owner, credentials, format, whether it's primary or secondary) and{' '}
                <strong>content</strong> (what the material actually says: its claims, arguments, and judgements). The
                Five Elements above unpack the <em>content</em>. But before you describe a perspective, always ask:{' '}
                <em>whose perspective is this, and why should I trust their framing?</em> That single question separates
                a Level 2 answer from a Level 3 one on Q1(d).
              </>
            }
            zh={
              <>
                牛津教材第一章将资料分析归纳为两步：<strong>出处 (provenance)</strong>：资料来自哪里？作者是谁、其资历如何、
                是什么格式、是一手还是二手？：以及<strong>内容 (content)</strong>：资料实际说了什么？它的断言、论点与判断是什么？
                上面的五要素分析的是<em>内容</em>。但在你描述某个观点之前，请务必先问：
                <em>这是谁的观点？我为什么应该信任这种表述方式？</em>
                就是这一个问题，把 Q1(d) 的等级 2 答案与等级 3 答案区分开来。
              </>
            }
          />
        </Callout>
      </div>

      <div>
        <DisplayH3 className="mb-4">
          <Bi en="The nine evaluative elements" zh="九个评价要素" />
        </DisplayH3>
        <Body className="mb-6 max-w-[68ch]">
          <Bi
            en={
              <>
                When you move from <strong>describing</strong> a perspective (Q1c) to <strong>evaluating</strong> a source
                (Q1d), Oxford lists nine features to look for. The first five overlap with the Five Elements; the last
                four are what make an evaluation feel real to the examiner.
              </>
            }
            zh={
              <>
                当你从<strong>描述</strong>观点（第 1c 题）进阶到<strong>评价</strong>资料（第 1d 题）时，
                牛津教材列出九个可查找的要素。前五个与五要素有所重叠；后四个则是让评价「言之有物」的关键。
              </>
            }
          />
        </Body>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-w-[68ch]">
          {[
            { en: 'Facts', zh: '事实', tone: 'cobalt' as const },
            { en: 'Opinions', zh: '意见', tone: 'cobalt' as const },
            { en: 'Beliefs (underlying)', zh: '（潜在的）信念', tone: 'cobalt' as const },
            { en: 'Values (projected)', zh: '（表达出的）价值观', tone: 'cobalt' as const },
            { en: 'Evidence', zh: '证据', tone: 'cobalt' as const },
            { en: 'Speculation (guessing)', zh: '推测（猜测）', tone: 'amber' as const },
            { en: 'Interpretation', zh: '诠释', tone: 'amber' as const },
            { en: 'Bias', zh: '偏见', tone: 'ember' as const },
            { en: 'Emotion', zh: '情感', tone: 'ember' as const },
          ].map((it, i) => {
            const dot =
              it.tone === 'cobalt'
                ? 'bg-[color:var(--color-cobalt)]'
                : it.tone === 'amber'
                  ? 'bg-[color:var(--color-amber)]'
                  : 'bg-[color:var(--color-ember)]';
            return (
              <li
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-paper)]"
              >
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden />
                <span className="font-mono text-[10px] font-semibold text-[color:var(--color-ink-3)] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[13.5px] font-semibold text-[color:var(--color-ink)]">
                  <Bi en={it.en} zh={it.zh} />
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[12.5px] text-[color:var(--color-ink-3)] font-mono uppercase tracking-[0.12em]">
          <Bi
            en="Source · Oxford GP 3rd edition, Ch. 1: Analysing and evaluating sources"
            zh="出处 · 牛津 GP 第三版，第一章：分析与评价资料"
          />
        </p>
      </div>

      <div>
        <DisplayH3 className="mb-3">
          <Bi en="Worked example: from the real 2026 paper" zh="范例 ： 来自 2026 年真题" />
        </DisplayH3>
        <p className="text-[13px] text-[color:var(--color-ink-3)] font-mono uppercase tracking-[0.12em] mb-5">
          <Bi
            en="Cambridge IGCSE 0457/13 · June 2026 · Source 2"
            zh="剑桥 IGCSE 0457/13 · 2026 年 6 月 · 资料 2"
          />
        </p>

        <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-[6px] p-5 md:p-6 mb-6">
          <p className="text-[15px] italic text-[color:var(--color-ink)] leading-[1.65] pretty">
            <Bi
              en={GSO_QUOTE_EN}
              zh={GSO_QUOTE_ZH}
            />
          </p>
        </div>

        <div className="border border-[color:var(--color-line)] border-t-[4px] border-t-[color:var(--color-amber)] rounded-[6px] p-5 md:p-6 grid gap-3 bg-[color:var(--color-paper)]">
          {WORKED_EXAMPLE.map((row, i) => (
            <div key={i} className="grid gap-1 md:grid-cols-[100px_1fr]">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)]">
                <Bi en={row.labelEn} zh={row.labelZh} />
              </span>
              <span className="text-[14.5px] text-[color:var(--color-ink)]">
                <Bi en={row.en} zh={row.zh} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const GSO_QUOTE_EN =
  '"The power of sport should not be underestimated! The Global Sports Organisation (GSO) is an international group committed to the development and promotion of sports and activities. We believe that sports contribute to our social and cultural understanding. We founded the activity Play-Connect-Rise in 2022 as a response to the many continuing effects of the Covid-19 pandemic, such as, a lack of fitness, loneliness and insecurity. We depend on donations and work with local governments, NGOs, and local communities to create sustainable sports programmes for all. These programmes emphasise the importance of inclusion and have successfully integrated minority groups into sports. Our programmes have improved the health of local people."';

const GSO_QUOTE_ZH =
  '“体育的力量不容小觑！‘全球体育组织’(GSO) 是一个致力于发展和推广体育运动的国际组织。我们相信体育有助于增进我们的社会与文化理解。我们在2022年发起了‘运动·连结·崛起’(Play-Connect-Rise) 活动，以应对新冠疫情持续带来的种种影响，例如缺乏运动、孤独感和不安全感。我们依靠捐款运作，并与地方政府、非政府组织及地方社区合作，共同打造可持续的全民体育项目。这些项目强调包容的重要性，并已成功帮助少数群体融入体育活动。我们的项目改善了当地居民的健康状况。”';

const WORKED_EXAMPLE = [
  {
    labelEn: 'Issues',
    labelZh: '议题',
    en: '"a lack of fitness, loneliness and insecurity": the continuing effects of the pandemic GSO is responding to.',
    zh: '“缺乏运动、孤独感和不安全感”：疫情持续带来、GSO 正在应对的影响。',
  },
  {
    labelEn: 'Values',
    labelZh: '价值观',
    en: '"sports contribute to our social and cultural understanding" / "emphasise the importance of inclusion": GSO values sport and inclusion.',
    zh: '“体育有助于增进我们的社会与文化理解”／“强调包容的重要性”：GSO 看重体育与包容。',
  },
  {
    labelEn: 'Causes',
    labelZh: '原因',
    en: '"in response to the many continuing effects of the Covid-19 pandemic": GSO frames the pandemic as the cause; "should not be underestimated" implies underestimation of sport as a secondary cause.',
    zh: '“以应对新冠疫情持续带来的种种影响”：GSO 将疫情视为原因；“不容小觑”则暗示对体育的低估是另一个原因。',
  },
  {
    labelEn: 'Consequences',
    labelZh: '后果',
    en: 'The same phrase: "lack of fitness, loneliness and insecurity": doubles as a consequence; "improved the health of local people" is a positive consequence of GSO\'s own work.',
    zh: '同一句“缺乏运动、孤独感和不安全感”，同时也可以作为后果；“改善了当地居民的健康状况”则是 GSO 自身工作带来的正面后果。',
  },
  {
    labelEn: 'Actions',
    labelZh: '行动',
    en: '"work with local governments, NGOs, and local communities to create sustainable sports programmes": GSO\'s actual programme of action.',
    zh: '“与地方政府、非政府组织及地方社区合作，共同打造可持续的全民体育项目”：GSO 实际采取的行动。',
  },
];

/* ─────────── Case-study tab ─────────── */
function CaseStudyTab() {
  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Case study · the Miren Valley" zh="案例研究 · 米伦谷" />
        </DisplayH2>
      </div>

      <div className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)] rounded-[8px] p-6 md:p-8 max-w-[68ch]">
        <p className="text-[15.5px] leading-[1.6] pretty">
          <Bi
            en="For six years, the nations of Kavara and Denrith disputed ownership of the Miren Valley, a fertile farming region on their shared border. A ceasefire has now held for two years. Families displaced during the conflict are slowly returning, though many still live in camps. Below are four voices connected to the valley."
            zh="六年来，卡瓦拉（Kavara）与登里斯（Denrith）两国一直在争夺共同边境上一片肥沃农业地区：米伦谷（Miren Valley）的主权。目前，停火已维持两年。在冲突期间流离失所的家庭正逐渐返回家园，但仍有许多人生活在难民营中。以下是四位与米伦谷相关人士的心声。"
          />
        </p>
      </div>

      <div className="grid gap-5">
        {VOICE_CARDS.map((card, i) => (
          <VoiceCardComponent key={i} card={card} />
        ))}
      </div>
    </div>
  );
}

function VoiceCardComponent({ card }: { card: (typeof VOICE_CARDS)[number] }) {
  const [open, setOpen] = useState(false);
  const color = card.level === 'GLOBAL' ? 'cobalt' : card.level === 'NATIONAL' ? 'forest' : card.level === 'LOCAL' ? 'amber' : 'violet';

  return (
    <article className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-[6px] p-6 md:p-7">
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <Chip color={color}>{card.level}</Chip>
        <span className="text-[12.5px] font-mono uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
          <Bi en={card.whoEn} zh={card.whoZh} />
        </span>
      </div>

      <blockquote className="font-display italic text-[19px] md:text-[20px] leading-[1.4] text-[color:var(--color-ink)] bg-[color:var(--color-paper-2)] rounded-[6px] px-5 py-2.5 border border-[color:var(--color-cobalt)]/30 pretty balance">
        <Bi en={card.quoteEn} zh={card.quoteZh} />
      </blockquote>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-full border border-[color:var(--color-line)] hover:border-[color:var(--color-ink)] transition-colors"
      >
        {open ? <Bi en="Hide the Five Elements" zh="收起五个要素" /> : <Bi en="Reveal the Five Elements" zh="查看五个要素" />}
      </button>

      {open && (
        <div className="mt-5 pt-5 border-t border-[color:var(--color-line)] grid gap-2.5">
          {FIVE_ELEMENTS.map((el, i) => (
            <div key={el.id} className="grid gap-1 md:grid-cols-[110px_1fr]">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink)]">
                <Bi en={el.labelEn} zh={el.labelZh} />
              </span>
              <span className="text-[14px] text-[color:var(--color-ink-2)]">
                <Bi en={card.fiveElements.en[i]} zh={card.fiveElements.zh[i]} />
              </span>
            </div>
          ))}
          {card.cultural && (
            <div className="mt-3 bg-[color:var(--color-paper-2)] border border-[color:var(--color-violet)]/40 rounded-[6px] px-4 py-3">
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-violet)] mb-1">
                <Bi en="Cultural lens" zh="文化透镜" />
              </p>
              <p className="text-[13.5px] text-[color:var(--color-ink)]">
                <Bi en={card.cultural.en} zh={card.cultural.zh} />
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/* ─────────── Practice tab ─────────── */
function PracticeTab() {
  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Classify & explain" zh="分类与解释" />
        </DisplayH2>
        <Body className="mt-5">
          <Bi
            en="Read each statement. Choose which level of perspective it represents, then check your answer. For four of the ten, you'll also write a short WHY explanation: the reasoning is where the marks live."
            zh="阅读下面每一句话，判断它属于哪一个层次，然后核对答案。其中四题还需要你写一段简短的「为什么」说明：理由才是拿分的关键。"
          />
        </Body>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {PRACTICE_STATEMENTS.map((s, i) => (
          <PracticeCard key={i} idx={i} item={s} />
        ))}
      </div>
    </div>
  );
}

function PracticeCard({ idx, item }: { idx: number; item: (typeof PRACTICE_STATEMENTS)[number] }) {
  const [chosen, setChosen] = useState<LevelKey | null>(null);
  const isCorrect = chosen === item.correct;
  const LEVELS: LevelKey[] = ['GLOBAL', 'NATIONAL', 'LOCAL', 'PERSONAL'];

  return (
    <article className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-[6px] p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[10.5px] font-semibold text-[color:var(--color-ink-3)] tabular-nums">
          #{String(idx + 1).padStart(2, '0')} / 10
        </span>
      </div>
      <blockquote className="italic text-[15.5px] text-[color:var(--color-ink)] border-l-2 border-[color:var(--color-line)] pl-4 mb-5 pretty">
        <Bi en={item.quoteEn} zh={item.quoteZh} />
      </blockquote>

      <div className="flex flex-wrap gap-2">
        {LEVELS.map((L) => {
          const isThis = chosen === L;
          const isRight = chosen && L === item.correct;
          const showCorrectHint = chosen && !isCorrect && L === item.correct;
          const showWrong = isThis && !isCorrect;
          let cls =
            'text-[13px] font-semibold px-3.5 py-2 rounded-full border transition-colors border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]';
          if (isRight && isThis) cls = 'text-[13px] font-semibold px-3.5 py-2 rounded-full border bg-[color:var(--color-forest-soft)] border-[color:var(--color-forest)] text-[color:var(--color-forest)]';
          else if (showCorrectHint) cls = 'text-[13px] font-semibold px-3.5 py-2 rounded-full border bg-[color:var(--color-forest-soft)] border-[color:var(--color-forest)] text-[color:var(--color-forest)]';
          else if (showWrong) cls = 'text-[13px] font-semibold px-3.5 py-2 rounded-full border bg-[color:var(--color-ember-soft)] border-[color:var(--color-ember)] text-[color:var(--color-ember)]';
          return (
            <button
              key={L}
              type="button"
              disabled={!!chosen}
              onClick={() => setChosen(L)}
              className={cls + (chosen ? ' cursor-default' : '')}
            >
              {L}
            </button>
          );
        })}
      </div>

      {chosen && (
        <p className="mt-4 text-[13.5px] text-[color:var(--color-ink-2)] pretty">
          <Bi en={item.feedbackEn} zh={item.feedbackZh} />
        </p>
      )}

      {chosen && item.needsWhy && (
        <div className="mt-5 pt-5 border-t border-[color:var(--color-line)]">
          <p className="text-[13.5px] font-semibold text-[color:var(--color-ink)] mb-3">
            <Bi en={item.whyPromptEn!} zh={item.whyPromptZh!} />
          </p>
          <textarea
            className="w-full min-h-[80px] p-3 text-[14px] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-cobalt)] focus:ring-1 focus:ring-[color:var(--color-cobalt)]"
            placeholder="Write your reasoning here…"
          />
        </div>
      )}
    </article>
  );
}

/* ─────────── Exam-practice tab ─────────── */
function ExamPracticeTab() {
  return (
    <div className="grid gap-10">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en={'Exam-style practice: "describe the organisation\'s perspective"'} zh="应试练习：「描述该组织的观点」" />
        </DisplayH2>
      </div>

      <Callout tone="cobalt" eyebrow={<Bi en="Source discipline" zh="资料出处" />}>
        <Bi
          en={
            <>
              Question 1 is <strong>Cambridge IGCSE 0457/13, June 2026, Question 1(c)</strong>: a released past paper,
              reproduced unaltered for WMSI's internal revision. Questions 2–4 are <strong>original practice</strong> written
              in the same style and length (350–400 words) and same format: they are <strong>not</strong> from any real Cambridge paper.
              Each question has its own self-assessment tool, adapted from the official Table A mark scheme.
            </>
          }
          zh={
            <>
              第一题是<strong>剑桥 IGCSE 0457/13，2026 年 6 月第 1(c) 题</strong>：已发布的历年真题，用于 WMSI 校内复习，原文未作任何改动。
              第 2 至 4 题是<strong>原创练习</strong>，按相同的风格与篇幅（350–400 字）撰写，格式一致：
              但它们<strong>并非</strong>取自任何真实的剑桥试卷。每道题都配有根据官方表 A 评分标准改编的自我评估工具。
            </>
          }
        />
      </Callout>

      {DESCRIBE_QUESTIONS.map((q) => (
        <ExamQuestion key={q.qid} q={q} />
      ))}
    </div>
  );
}

function ExamQuestion({ q }: { q: (typeof DESCRIBE_QUESTIONS)[number] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [use, setUse] = useState<'frequent' | 'some' | 'little' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showMarkScheme, setShowMarkScheme] = useState(false);
  const [response, setResponse] = useState('');
  const { lang } = useLanguage();

  const result = useMemo(() => {
    const n = Object.values(checked).filter(Boolean).length;
    if (!use) return null;
    if (n >= 4 && use === 'frequent') return { label: { en: 'Likely Level 3: Clear analysis', zh: '可能达到等级 3 ： 清晰分析' }, range: '5–6' };
    if (n >= 2 && (use === 'frequent' || use === 'some')) return { label: { en: 'Likely Level 2: Some analysis', zh: '可能达到等级 2 ： 一定程度的分析' }, range: '3–4' };
    if (n >= 1) return { label: { en: 'Likely Level 1: Limited analysis', zh: '可能达到等级 1 ： 有限分析' }, range: '1–2' };
    return { label: { en: 'No creditable elements checked yet', zh: '目前尚未勾选任何可得分的要素' }, range: '0' };
  }, [checked, use]);

  return (
    <article className="bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-[8px] p-6 md:p-8">
      <Chip color={q.authentic ? 'ember' : 'cobalt'}>
        <Bi en={q.topicEn} zh={q.topicZh} />
      </Chip>
      <h3 className="font-display text-[22px] md:text-[26px] mt-3 mb-4 text-[color:var(--color-ink)] balance">
        <Bi en={q.titleEn} zh={q.titleZh} />
      </h3>

      <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-[6px] p-5 mb-5">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)] mb-2">
          <Bi en={q.sourceLabelEn} zh={q.sourceLabelZh} />
        </p>
        <p className="text-[14.5px] italic text-[color:var(--color-ink)] leading-[1.7] pretty">
          <Bi en={q.sourceEn} zh={q.sourceZh} />
        </p>
      </div>

      <div className="border-t border-[color:var(--color-line)] pt-4 mb-4">
        <div className="flex justify-between items-baseline gap-3 flex-wrap mb-3">
          <p className="text-[15px] text-[color:var(--color-ink)]">
            <strong>
              <Bi en="Describe" zh="描述" />
            </strong>
            : <Bi en={q.promptEn} zh={q.promptZh} />
          </p>
          <span className="font-mono text-[12px] font-semibold text-[color:var(--color-ink-3)] whitespace-nowrap">[6]</span>
        </div>
        <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-amber)]/40 rounded-[6px] px-4 py-3 mb-3 text-[13px] text-[color:var(--color-ink-2)]">
          <Bi
            en={
              <>
                <strong>Command word: Describe:</strong> state the points of a topic / give characteristics and main features.
                Lighter than "explain": you are not required to justify reasoning, just cover the perspective's features
                clearly and fully.
              </>
            }
            zh={
              <>
                <strong>指令词 ： 描述 (Describe)：</strong>说明某一主题的要点／列出主要特征。比「解释」更轻：不需要论证理由，
                只需清楚而全面地说明这个观点的各项特征。
              </>
            }
          />
        </div>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          data-wne-qid={q.qid}
          data-wne-label={`Question ${q.qid} — ${q.titleEn.replace(/&amp;/g, '&')}`}
          className="w-full min-h-[140px] p-3 text-[14.5px] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-cobalt)] focus:ring-1 focus:ring-[color:var(--color-cobalt)]"
          placeholder={lang === 'zh' ? '在此写下你的答案……' : 'Write your answer here…'}
        />
      </div>

      {/* Self-assess */}
      <div className="mt-6 pt-6 border-t border-[color:var(--color-line)]">
        <DisplayH3 className="mb-3">
          <Bi en="Self-assess your answer" zh="自我评估你的答案" />
        </DisplayH3>
        <Body className="mb-4">
          <Bi
            en={
              <>
                Go back through what you wrote. Tick a box only if your answer covers that element <em>and</em> supports it
                with a specific word, phrase, or detail from the source: not just a general description.
              </>
            }
            zh={
              <>
                回顾你写的内容。只有当你的答案涉及了该要素，<em>并且</em>用资料中的具体词语、短语或细节作支持时，
                才勾选该项：而不是泛泛而谈。
              </>
            }
          />
        </Body>

        <div className="grid gap-2 mb-5">
          {FIVE_ELEMENTS.map((el) => {
            const id = `${q.qid}_${el.id}`;
            return (
              <label
                key={el.id}
                className="flex items-start gap-3 bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-3.5 cursor-pointer hover:border-[color:var(--color-ink)] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checked[id]}
                  onChange={(e) => setChecked({ ...checked, [id]: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-[color:var(--color-cobalt)]"
                />
                <span className="text-[14px]">
                  <strong>
                    <Bi en={el.labelEn} zh={el.labelZh} />
                  </strong>{' '}
                 : <Bi en={el.descEn} zh={el.descZh} />
                </span>
              </label>
            );
          })}
        </div>

        <p className="text-[13.5px] font-semibold text-[color:var(--color-ink)] mb-2.5">
          <Bi
            en="How often did you use specific words or details from the source (not just your own general summary)?"
            zh="你在答案中使用资料具体词语或细节的频率如何（而不仅仅是自己的概括）？"
          />
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {(['frequent', 'some', 'little'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setUse(v)}
              className={`text-[13px] font-semibold px-3.5 py-2 rounded-full border transition-colors ${
                use === v
                  ? 'bg-[color:var(--color-ink)] border-[color:var(--color-ink)] text-[color:var(--color-paper)]'
                  : 'bg-[color:var(--color-paper)] border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]'
              }`}
            >
              {v === 'frequent' ? <Bi en="Frequently" zh="经常" /> : v === 'some' ? <Bi en="Sometimes" zh="有时" /> : <Bi en="Little or none" zh="很少或没有" />}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => setShowResult(true)}>
            <Bi en="Check my likely level" zh="查看我可能达到的等级" />
          </Button>
          <Button variant="secondary" onClick={() => setShowMarkScheme((v) => !v)}>
            {showMarkScheme ? (
              <Bi en="Hide the mark scheme" zh="收起评分标准" />
            ) : (
              <Bi en="Compare to the official mark scheme" zh="对照官方评分标准" />
            )}
          </Button>
        </div>

        {showResult && result && (
          <div className="mt-5 bg-[color:var(--color-paper-2)] border border-[color:var(--color-cobalt)]/40 rounded-[6px] p-4">
            <p className="font-semibold text-[15px] text-[color:var(--color-ink)]">
              <Bi en={result.label.en} zh={result.label.zh} /> ({result.range} / 6)
            </p>
            <p className="mt-2 text-[12.5px] text-[color:var(--color-ink-3)]">
              <Bi
                en="This is a self-assessment estimate to guide your revision: it is not an official mark. Only your teacher's judgement counts for real feedback."
                zh="这只是用于帮助复习的自我评估估计：并非正式分数。只有老师的评判才是真正的反馈。"
              />
            </p>
          </div>
        )}

        {showMarkScheme && (
          <div className="mt-5 bg-[color:var(--color-paper-2)] border border-[color:var(--color-amber)]/40 rounded-[6px] p-4">
            <p className="font-semibold text-[13.5px] mb-2 text-[color:var(--color-ink)]">
              <Bi
                en="Table A: Analysis of issues and perspectives (AO1), 6 marks"
                zh="表 A ： 议题与观点分析 (AO1)，共 6 分"
              />
            </p>
            <p className="text-[13.5px] mb-1.5 text-[color:var(--color-ink)]">
              <Bi
                en={<><strong>Level 3 (5–6 marks): Clear analysis:</strong> describes a wide range of elements of the perspective; frequent use of relevant material and examples taken from the source.</>}
                zh={<><strong>等级 3（5–6 分）： 清晰分析：</strong>描述了该观点广泛的多个要素；频繁使用了资料中的相关材料与例子。</>}
              />
            </p>
            <p className="text-[13.5px] mb-1.5 text-[color:var(--color-ink)]">
              <Bi
                en={<><strong>Level 2 (3–4 marks): Some analysis:</strong> describes a range of elements; some use of relevant material and examples.</>}
                zh={<><strong>等级 2（3–4 分）： 一定分析：</strong>描述了一定范围的要素；使用了部分资料中的相关材料与例子。</>}
              />
            </p>
            <p className="text-[13.5px] mb-2 text-[color:var(--color-ink)]">
              <Bi
                en={<><strong>Level 1 (1–2 marks): Limited analysis:</strong> describes a limited range of elements; little or no use of material and examples.</>}
                zh={<><strong>等级 1（1–2 分）： 有限分析：</strong>描述的观点要素范围有限；很少或没有使用资料中的材料与例子。</>}
              />
            </p>
            <p className="text-[12.5px] text-[color:var(--color-ink-3)]">
              <Bi
                en="The elements examiners look for are exactly the five in the checklist above: issues, values, causes, consequences, actions."
                zh="考官寻找的要素正是上方自查清单中的五项：议题、价值观、原因、后果与行动。"
              />
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

/* ─────────── Your-turn tab ─────────── */
function YourTurnTab() {
  const [text, setText] = useState('');
  const [showModel, setShowModel] = useState(false);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const { lang } = useLanguage();

  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Your turn" zh="自己写" />
        </DisplayH2>
        <Body className="mt-5">
          <Bi
            en="This is a full-length practice passage (like the ones in Exam Practice), but here you get sentence frames and a model answer to lean on: this is supported practice, not a test."
            zh="这是一段完整篇幅的练习段落（与「应试练习」中的段落类似），但这里有句型框架和范文可供你参考：这是有支持的练习，而不是测验。"
          />
        </Body>
      </div>

      <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-[6px] p-5 md:p-6">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-amber)] mb-2">
          <Bi en={YOUR_TURN.sourceLabelEn} zh={YOUR_TURN.sourceLabelZh} />
        </p>
        <p className="text-[14.5px] italic text-[color:var(--color-ink)] leading-[1.7] pretty">
          <Bi en={YOUR_TURN.sourceEn} zh={YOUR_TURN.sourceZh} />
        </p>
      </div>

      <p className="font-semibold text-[15px] text-[color:var(--color-ink)] max-w-[68ch]">
        <Bi
          en="Using the Five Elements (Issues, Values, Causes, Consequences, Actions), describe Bridges for Miren's perspective. Cover as many elements as the passage genuinely supports, using specific words or details from it."
          zh="运用五个要素（议题、价值观、原因、后果、行动），描述「米伦之桥」的观点。尽可能覆盖该段落真正能支持的要素，并使用其中的具体词语或细节。"
        />
      </p>

      <div className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] border-t-[4px] border-t-[color:var(--color-amber)] rounded-[6px] p-5 grid gap-1.5">
        {(lang === 'zh' ? YOUR_TURN.frameLinesZh : YOUR_TURN.frameLinesEn).map((line, i) => (
          <p key={i} className="font-mono text-[13px] text-[color:var(--color-amber)]">
            {line}
          </p>
        ))}
      </div>

      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          data-wne-yourturn="1"
          className="w-full min-h-[180px] p-4 text-[15px] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-md focus:outline-none focus:border-[color:var(--color-cobalt)] focus:ring-1 focus:ring-[color:var(--color-cobalt)]"
          placeholder={lang === 'zh' ? '在此写下你的五要素描述……' : 'Write your Five Elements description here…'}
        />
        <p className="mt-2 text-right font-mono text-[12px] text-[color:var(--color-ink-3)]">
          {words} <Bi en="words" zh="字" />
        </p>
      </div>

      <div>
        <Button variant="primary" onClick={() => setShowModel((v) => !v)}>
          {showModel ? <Bi en="Hide model answer" zh="收起范文" /> : <Bi en="Reveal a model answer" zh="查看范文" />}
        </Button>

        {showModel && (
          <div className="mt-5 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] border-t-[4px] border-t-[color:var(--color-amber)] rounded-[6px] p-5">
            <p
              className="text-[15px] leading-[1.7] text-[color:var(--color-ink)] pretty [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: lang === 'zh' ? YOUR_TURN.modelZh : YOUR_TURN.modelEn }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────── Checklist tab ─────────── */
function ChecklistTab() {
  const [checked, setChecked] = useState<boolean[]>(() => new Array(CHECKLIST_ITEMS.length).fill(false));
  const doneCount = checked.filter(Boolean).length;
  const pct = Math.round((doneCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="grid gap-8">
      <div className="max-w-[68ch]">
        <DisplayH2>
          <Bi en="Self-check" zh="自查清单" />
        </DisplayH2>
        <Body className="mt-5">
          <Bi en="Tick each statement once you're confident you can do it." zh="当你确信自己能做到某一项时，请勾选它。" />
        </Body>
      </div>

      <div className="max-w-[68ch]">
        <div className="h-2.5 bg-[color:var(--color-paper-2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[color:var(--color-cobalt)] to-[color:var(--color-forest)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[12px] text-[color:var(--color-ink)]">
          {doneCount} / {CHECKLIST_ITEMS.length} <Bi en="complete" zh="已完成" /> · {pct}%
        </p>
      </div>

      <div className="grid gap-2.5 max-w-[68ch]">
        {CHECKLIST_ITEMS.map((it, i) => (
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
              data-wne-checklist={it.en}
              className="mt-1 w-4 h-4 accent-[color:var(--color-cobalt)]"
            />
            <span className="text-[14.5px] text-[color:var(--color-ink)]">
              <Bi en={it.en} zh={it.zh} />
            </span>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => window.print()}>
          <Bi en="Print checklist" zh="打印清单" />
        </Button>
      </div>
    </div>
  );
}
