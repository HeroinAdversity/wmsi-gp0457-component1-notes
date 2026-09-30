import { Link } from 'react-router-dom';
import { Container, DisplayH1, Eyebrow, Lede } from '../components/primitives';
import { REVISION_SHEETS } from '../lib/siteMap';

type Accent = 'cobalt' | 'amber' | 'forest' | 'q2';

interface Sheet {
  to?: string;
  paper: string;
  question: string;
  marks: string;
  title: string;
  tagline: string;
  accent: Accent;
  status: 'live' | 'next';
}

const SHEETS: Sheet[] = REVISION_SHEETS.map((s) => ({
  to: s.to, paper: 'Paper 1', question: s.question, marks: s.marks,
  title: s.title, tagline: s.tagline, accent: s.accent, status: 'live',
}));

const ACCENT: Record<Accent, { text: string; border: string; tint: string; deep: string }> = {
  cobalt: {
    text: 'text-[color:var(--color-cobalt)]',
    border: 'border-[color:var(--color-cobalt)]',
    tint: 'bg-[color:var(--color-cobalt-tint)]',
    deep: 'text-[color:var(--color-cobalt-deep)]',
  },
  amber: {
    text: 'text-[color:var(--color-amber)]',
    border: 'border-[color:var(--color-amber)]',
    tint: 'bg-[color:var(--color-amber-tint)]',
    deep: 'text-[color:var(--color-amber-deep)]',
  },
  forest: {
    text: 'text-[color:var(--color-forest)]',
    border: 'border-[color:var(--color-forest)]',
    tint: 'bg-[color:var(--color-forest-tint)]',
    deep: 'text-[color:var(--color-forest-deep)]',
  },
  q2: {
    text: 'text-[color:var(--color-q2-storm)]',
    border: 'border-[color:var(--color-q2-storm)]',
    tint: 'bg-[color:var(--color-q2-coastal-tint)]',
    deep: 'text-[color:var(--color-q2-sea)]',
  },
};

export function RevisionSheetsIndexPage() {
  return (
    <>
      <section className="pt-12 md:pt-16 pb-8">
        <Container size="wide">
          <Eyebrow color="ink">Revision · IGCSE 0457</Eyebrow>
          <DisplayH1 className="mt-3 max-w-[22ch]">Revision Sheets</DisplayH1>
          <Lede className="mt-6 max-w-[62ch]">
            One dense one-pager per skill. Nothing hidden behind clicks — everything visible at once,
            arranged so confusable ideas sit next to each other. Meant for the last day before an exam
            and for the plastic sleeve in the front of your file.
          </Lede>
        </Container>
      </section>

      <Container size="wide">
        <div className="grid gap-6 md:grid-cols-3 pb-16">
          {SHEETS.map((s) => (
            <SheetCard key={s.title} sheet={s} />
          ))}
        </div>
      </Container>
    </>
  );
}

function SheetCard({ sheet }: { sheet: Sheet }) {
  const a = ACCENT[sheet.accent];
  const live = sheet.status === 'live' && sheet.to;

  const inner = (
    <>
      <div className={`px-5 py-3 ${a.tint} border-b border-[color:var(--color-line)] flex items-baseline justify-between`}>
        <p className={`font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] ${a.deep}`}>
          {sheet.paper} · {sheet.question}
        </p>
        <p className={`font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] ${a.deep}`}>
          {sheet.marks}
        </p>
      </div>
      <div className="p-5 md:p-6 flex flex-col gap-3 min-h-[220px]">
        <h2 className="font-display text-[28px] leading-tight tracking-[-0.015em] text-[color:var(--color-ink)]">
          {sheet.title}
        </h2>
        <p className="text-[14px] leading-[1.55] text-[color:var(--color-ink-2)]">{sheet.tagline}</p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          {live ? (
            <span className={`inline-flex items-center gap-2 text-[13px] font-semibold ${a.text}`}>
              Open sheet →
            </span>
          ) : (
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
              Coming next
            </span>
          )}
        </div>
      </div>
    </>
  );

  const shellCls =
    'bg-[color:var(--color-paper)] border border-[color:var(--color-ink)] overflow-hidden transition-transform ' +
    (live ? 'hover:-translate-y-[2px]' : 'opacity-70');

  return live ? (
    <Link to={sheet.to!} className={`block ${shellCls}`}>
      {inner}
    </Link>
  ) : (
    <div className={shellCls} aria-disabled>
      {inner}
    </div>
  );
}
