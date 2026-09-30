import { Link } from 'react-router-dom';
import { Container, DisplayH1, Lede } from '../../components/primitives';
import { Bi } from '../../lib/LanguageContext';

const EIGHT_TERMS = [
  { en: 'Bias', zh: '偏见' },
  { en: 'Claim', zh: '断言' },
  { en: 'Fact', zh: '事实' },
  { en: 'Generalisation', zh: '一般化', accent: true },
  { en: 'Opinion', zh: '意见' },
  { en: 'Prediction', zh: '预测' },
  { en: 'Value', zh: '价值观' },
  { en: 'Vested interest', zh: '既得利益' },
];

export function StatementTypesHubPage() {
  return (
    <>
      {/* HERO */}
      <section className="pt-12 md:pt-16 pb-10 md:pb-12 border-b border-[color:var(--color-line)]">
        <Container size="wide">
          <div className="max-w-[52ch]">
            <DisplayH1>
              <Bi
                en={<>Eight words that unlock the paper.</>}
                zh={<>八个术语，解锁整份试卷。</>}
              />
            </DisplayH1>
            <Lede className="mt-6">
              <Bi
                en={
                  <>
                    The Cambridge IGCSE Global Perspectives 0457 syllabus names eight kinds of statement. Learn to
                    tell them apart and you unlock <strong>Question 1(b)</strong>, most of Paper 1, and the
                    analytical spine of your team project.
                  </>
                }
                zh={
                  <>
                    剑桥 IGCSE 全球视野 0457 大纲共列出八种陈述类型。学会分辨它们，就等于解锁了
                    <strong>第 1(b) 题</strong>、卷一的大部分内容，以及团队项目的分析主线。
                  </>
                }
              />
            </Lede>
          </div>

          {/* Eight-terms row */}
          <ul className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-4 border-t border-[color:var(--color-line)] pt-6">
            {EIGHT_TERMS.map((t) => (
              <li key={t.en} className="flex flex-col gap-1.5">
                <span
                  className={`font-display text-[17px] leading-tight ${
                    t.accent ? 'text-[color:var(--color-cobalt)]' : 'text-[color:var(--color-ink)]'
                  }`}
                >
                  <Bi en={t.en} zh={t.zh} />
                </span>
                {t.accent && (
                  <span className="self-start inline-flex items-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-[color:var(--color-cobalt-soft)] text-[color:var(--color-cobalt-deep)]">
                    <Bi en="most-tested" zh="最常考" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* TOOLS GRID */}
      <section className="py-14 md:py-20">
        <Container size="wide">
          {/* Primary pathway */}
          <HeroToolCard
            to="/statements/main"
            minutes="45–60"
            title={<Bi en="Statement Types & Generalisation" zh="陈述类型与一般化" />}
            body={
              <Bi
                en="The main self-study notes. Watch the four-minute video, meet all eight terms, work the sorting drill, hunt for generalisations, take the exit check."
                zh="主要的自学笔记。观看 4 分钟视频、认识八个术语、完成分类练习、寻找一般化语句、通过退出检测。"
              />
            }
          />

          {/* Secondary tools */}
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <ToolCard
              to="/statements/diagnostic"
              minutes="15"
              title={<Bi en="Find Your Gap: Diagnostic" zh="找差距：诊断" />}
              body={
                <Bi
                  en="A quick self-test that pinpoints which pair you confuse (fact ⇄ opinion? claim ⇄ value?) and routes you straight into targeted practice."
                  zh="一次快速自测，准确定位你最容易混淆的一对术语（事实与意见？断言与价值观？），并将你直接导向针对性练习。"
                />
              }
            />
            <ToolCard
              to="/statements/intensive"
              minutes="120"
              title={<Bi en="Statement Types Intensive" zh="陈述类型强化课程" />}
              body={
                <Bi
                  en="A 120-minute deep session: reference guide, 24-statement rapid sort, two source deep-dives, four confusable-pair clinics, a create-your-own task, five exam-style questions, self-assessment, export code."
                  zh="120 分钟深度课程：参考手册、24 句快速分类、两份资料精读、四组易混淆对比诊所、创造练习、五道应试题、自我评估、导出成绩代码。"
                />
              }
            />
            <ToolCard
              to="/statements/claim-vs-evidence"
              minutes="30"
              title={<Bi en="Claim vs Evidence: The Source" zh="断言与证据：解读资料" />}
              body={
                <Bi
                  en="A separate skill: distinguishing what a source claims from what it actually evidences. Practises Level-3 evaluative comments the examiners look for in Question 1."
                  zh="另一项独立技能：分清资料中的“断言”与真正提供的“证据”。训练考官在第 1 题中期待的三级评价式回应。"
                />
              }
            />
            <ToolCard
              to="/statements/mindmap"
              minutes="10"
              title={<Bi en="Interactive Mind Map" zh="交互式思维导图" />}
              body={
                <Bi
                  en="All eight terms with definitions and example statements, arranged as an explorable map. Best used the night before or as a quick refresher between drills."
                  zh="将八个术语的定义与例句以可探索的思维导图呈现。适合考前复习或在练习之间快速温习。"
                />
              }
            />
          </div>

          {/* Teacher pathway — separated */}
          <div className="mt-14 pt-8 border-t border-[color:var(--color-line)]">
            <StaffToolCard
              to="/teachers/statements"
              title={<Bi en="Teacher Dashboards" zh="教师面板" />}
              body={
                <Bi
                  en="Lesson sequencing, timings and answer keys; import student export codes to aggregate class scores and flag students under 60%. Two dashboards: one for the main tool, one for the Intensive."
                  zh="教学排序、时长与答案；可导入学生导出代码，汇总班级成绩并标记低于 60% 的学生。共两个面板：一个针对主工具，一个针对强化课程。"
                />
              }
            />
          </div>
        </Container>
      </section>
    </>
  );
}

function HeroToolCard({
  to,
  minutes,
  title,
  body,
}: {
  to: string;
  minutes: string;
  title: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group grid gap-6 md:grid-cols-[1fr_auto] md:items-end bg-[color:var(--color-paper)] border border-[color:var(--color-line)] border-t-[4px] border-t-[color:var(--color-cobalt)] rounded-[8px] p-8 md:p-10 transition-all hover:border-[color:var(--color-ink)] hover:border-l-[color:var(--color-cobalt)]"
    >
      <div>
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-cobalt)] mb-3">
          <Bi en="Start here · main pathway" zh="从这里开始 · 主学习路径" />
        </p>
        <h3 className="font-display text-[28px] md:text-[34px] leading-[1.1] text-[color:var(--color-ink)] balance">
          {title}
        </h3>
        <p className="mt-4 text-[15.5px] leading-[1.55] text-[color:var(--color-ink-2)] max-w-[62ch] pretty">
          {body}
        </p>
      </div>
      <div className="flex md:flex-col md:items-end gap-4 md:gap-3">
        <span className="font-mono text-[12px] text-[color:var(--color-ink-3)] whitespace-nowrap tabular-nums">
          <Bi en={`${minutes} min`} zh={`${minutes} 分钟`} />
        </span>
        <span className="inline-flex items-center gap-2 text-[13.5px] font-semibold px-5 py-2.5 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] group-hover:bg-[color:var(--color-cobalt)] transition-colors">
          <Bi en="Open →" zh="打开 →" />
        </span>
      </div>
    </Link>
  );
}

function ToolCard({
  to,
  minutes,
  title,
  body,
}: {
  to: string;
  minutes: string;
  title: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-4 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-[8px] p-7 md:p-8 transition-all hover:border-[color:var(--color-ink)]"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[22px] md:text-[24px] leading-[1.15] text-[color:var(--color-ink)] balance">
          {title}
        </h3>
        <span className="text-[12.5px] text-[color:var(--color-ink-3)] whitespace-nowrap tabular-nums shrink-0">
          <Bi en={`${minutes} min`} zh={`${minutes} 分钟`} />
        </span>
      </div>
      <p className="text-[14.5px] leading-[1.55] text-[color:var(--color-ink-2)] pretty">{body}</p>
      <div className="mt-auto pt-2 flex items-center gap-2 text-[13px] font-semibold text-[color:var(--color-ink)] group-hover:text-[color:var(--color-cobalt)] transition-colors">
        <Bi en="Open →" zh="打开 →" />
      </div>
    </Link>
  );
}

function StaffToolCard({
  to,
  title,
  body,
}: {
  to: string;
  title: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-baseline items-start"
    >
      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-3)] whitespace-nowrap">
        <Bi en="For teachers" zh="教师专用" />
      </p>
      <div>
        <h3 className="font-display text-[20px] md:text-[22px] leading-[1.2] text-[color:var(--color-ink)] balance">
          {title}
        </h3>
        <p className="mt-2 text-[14px] leading-[1.55] text-[color:var(--color-ink-2)] pretty max-w-[68ch]">
          {body}
        </p>
      </div>
      <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[color:var(--color-ink-2)] group-hover:text-[color:var(--color-cobalt)] transition-colors whitespace-nowrap">
        <Bi en="Open →" zh="打开 →" />
      </span>
    </Link>
  );
}
