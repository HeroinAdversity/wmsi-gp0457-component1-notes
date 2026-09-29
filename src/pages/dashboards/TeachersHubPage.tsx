import { Link } from 'react-router-dom';
import { Container, DisplayH1, Eyebrow, Lede } from '../../components/primitives';
import { Bi } from '../../lib/LanguageContext';

interface Entry {
  to: string;
  eyebrowEn: string;
  eyebrowZh: string;
  titleEn: string;
  titleZh: string;
  bodyEn: string;
  bodyZh: string;
  markable: boolean;
}

const ENTRIES: Entry[] = [
  {
    to: '/teachers/tracker',
    eyebrowEn: 'Q2 · Research',
    eyebrowZh: '第 2 题 · 研究',
    titleEn: 'Class tracker — Question 2',
    titleZh: '班级追踪 —— 第 2 题',
    bodyEn: "Drop students' My learning PDFs to see quiz scores and answers, add marks and next steps, export CSV.",
    bodyZh: '拖入学生的「我的学习」PDF，查看测验成绩与答案，填写分数与改进建议，导出 CSV。',
    markable: true,
  },
  {
    to: '/teachers/statements',
    eyebrowEn: 'Q1(b) · Statement Types',
    eyebrowZh: '第 1(b) 题 · 陈述类型',
    titleEn: 'Statement Types & Generalisation',
    titleZh: '陈述类型与一般化',
    bodyEn: 'Lesson sequencing, timings and answer keys for the main self-study tool. Import student export codes to aggregate class scores.',
    bodyZh: '主自学工具的教学排序、时长与答案。可导入学生导出代码，汇总班级成绩。',
    markable: false,
  },
  {
    to: '/teachers/statements-intensive',
    eyebrowEn: 'Q1(b) · Intensive',
    eyebrowZh: '第 1(b) 题 · 强化',
    titleEn: 'Statement Types Intensive',
    titleZh: '陈述类型强化课程',
    bodyEn: '120-minute intensive dashboard: aggregate class scores, flag students under 60%, export CSV.',
    bodyZh: '120 分钟强化课程面板：汇总班级成绩，标记低于 60% 的学生，导出 CSV。',
    markable: false,
  },
  {
    to: '/teachers/perspectives',
    eyebrowEn: 'Q1(c) · Perspectives',
    eyebrowZh: '第 1(c) 题 · 观点',
    titleEn: 'Identifying & Explaining Perspectives',
    titleZh: '识别与解释观点',
    bodyEn: 'Ingest export codes from the Perspectives tool. Read describe responses and the your-turn task, enter a mark per question, download the class CSV.',
    bodyZh: '导入学生从「识别与解释观点」工具生成的代码。查看描述题回答与「你来试试」作答，为每道题打分，下载全班 CSV。',
    markable: true,
  },
  {
    to: '/teachers/weighing-room',
    eyebrowEn: 'Q1(d) · Weighing Room',
    eyebrowZh: '第 1(d) 题 · 权衡室',
    titleEn: 'The Weighing Room — significance skills',
    titleZh: '「权衡室」—— 重要性判断技能',
    bodyEn: 'Ingest export codes from The Weighing Room. Five practice sets, self-selected bands and criteria; enter a mark per set (out of 8), download the class CSV.',
    bodyZh: '导入学生从「权衡室」工具生成的代码。五个练习组、自选评分带与所勾标准；为每组打分（满分 8），下载全班 CSV。',
    markable: true,
  },
];

export function TeachersHubPage() {
  return (
    <>
      <section className="pt-12 md:pt-16 pb-10 border-b border-[color:var(--color-line)]">
        <Container size="wide">
          <div className="max-w-[62ch]">
            <Eyebrow color="cobalt">
              <Bi en="Teacher dashboards" zh="教师面板" />
            </Eyebrow>
            <DisplayH1 className="mt-3">
              <Bi en="One dashboard per skill." zh="每项技能对应一个面板。" />
            </DisplayH1>
            <Lede className="mt-6">
              <Bi
                en="Each student tool generates a short export code once the student finishes. Paste those codes into the matching dashboard to read what they wrote, enter your marks, and download a class CSV."
                zh="学生完成每项工具后，会生成一段简短的导出代码。将代码粘贴到对应的教师面板中，即可查看学生作答、录入分数并下载全班 CSV。"
              />
            </Lede>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container size="wide">
          <div className="grid gap-5 md:grid-cols-2">
            {ENTRIES.map((e) => (
              <Link
                key={e.to}
                to={e.to}
                className="group flex flex-col gap-4 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-[8px] p-7 md:p-8 transition-all hover:border-[color:var(--color-ink)]"
              >
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-cobalt)]">
                    <Bi en={e.eyebrowEn} zh={e.eyebrowZh} />
                  </p>
                  {e.markable && (
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[color:var(--color-forest)]">
                      <Bi en="mark & export" zh="评分与导出" />
                    </span>
                  )}
                </div>
                <h2 className="font-display text-[22px] md:text-[24px] leading-[1.15] text-[color:var(--color-ink)] balance">
                  <Bi en={e.titleEn} zh={e.titleZh} />
                </h2>
                <p className="text-[14.5px] leading-[1.55] text-[color:var(--color-ink-2)] pretty">
                  <Bi en={e.bodyEn} zh={e.bodyZh} />
                </p>
                <div className="mt-auto pt-2 flex items-center gap-2 text-[13px] font-semibold text-[color:var(--color-ink)] group-hover:text-[color:var(--color-cobalt)] transition-colors">
                  <Bi en="Open →" zh="打开 →" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
