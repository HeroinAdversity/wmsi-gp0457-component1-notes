import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Container } from './primitives';
import { NotesLayer, PageNotesButton } from './NotesLayer';
import { ActiveTabProvider } from '../lib/activeTab';
import { Q1_SEQUENCE, Q2_SEQUENCE, q1Index, q2Index } from '../lib/siteMap';

type Step = { to: string; label: string; short: string };

interface Theme {
  bar: string;
  pill: string;
  idle: string;
  title: string;
  hover: string;
}

const Q1_THEME: Theme = {
  bar: 'bg-[color:var(--color-ink)]',
  pill: 'bg-[color:var(--color-paper)] text-[color:var(--color-ink)]',
  idle: 'text-[#c9ced8] hover:bg-white/10 hover:text-white',
  title: 'text-[color:var(--color-ink)]',
  hover: 'hover:border-[color:var(--color-cobalt)]',
};

const Q2_THEME: Theme = {
  bar: 'bg-[color:var(--color-q2-sea)]',
  pill: 'bg-[color:var(--color-q2-ivory)] text-[color:var(--color-q2-sea)]',
  idle: 'text-[#cfd9e3] hover:bg-white/10 hover:text-white',
  title: 'text-[color:var(--color-q2-sea)]',
  hover: 'hover:border-[color:var(--color-q2-storm)]',
};

/**
 * Wraps every route in a question: a dark section bar that sticks under the
 * site header, then the page (with highlights and notes), then previous/next cards.
 */
function SectionFrame({ name, steps, at, theme }: { name: string; steps: Step[]; at: number; theme: Theme }) {
  const barRef = useRef<HTMLElement>(null);

  // Keep the current section visible when the bar scrolls sideways on phones.
  useEffect(() => {
    barRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [at]);

  // Page tab bars stick just under this bar, so publish its height.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const root = document.documentElement.style;
    const set = () => root.setProperty('--section-bar-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => { ro.disconnect(); root.removeProperty('--section-bar-h'); };
  }, []);

  const { pathname } = useLocation();
  // Revision sheets carry their own previous/next sheet links.
  const onSheet = pathname.startsWith('/revision/');
  const prev = !onSheet && at > 0 ? steps[at - 1] : null;
  const next = !onSheet && at >= 0 && at < steps.length - 1 ? steps[at + 1] : null;
  // 1(c) → 1(d) only changes the hash, so the layout won't scroll up on its own.
  const toTop = () => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

  return (
    <ActiveTabProvider>
      <nav
        ref={barRef}
        aria-label={`${name} sections`}
        className={`no-print sticky z-30 text-white ${theme.bar}`}
        style={{ top: 'var(--site-header-h, 64px)' }}
      >
        <Container size="wide">
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-2 whitespace-nowrap [scrollbar-width:none]">
              <span className="mr-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--color-q2-ivory)]">{name}</span>
              {steps.map((s, i) => (
                <Link
                  key={s.to}
                  to={s.to}
                  onClick={toTop}
                  aria-current={i === at ? 'page' : undefined}
                  className={`rounded-full px-3 py-1 text-[13px] font-semibold ${i === at ? theme.pill : theme.idle}`}
                >
                  {s.short}
                </Link>
              ))}
            </div>
            <PageNotesButton dark />
          </div>
        </Container>
      </nav>

      <NotesLayer>
        <Outlet />
      </NotesLayer>

      {(prev || next) && (
        <Container size="wide" className="no-print">
          <div className="mt-14 grid gap-3 border-t border-[color:var(--color-line)] pt-6 sm:grid-cols-2">
            {prev ? (
              <Link to={prev.to} onClick={toTop} className={`rounded-[8px] border border-[color:var(--color-line)] bg-white px-4 py-3 ${theme.hover}`}>
                <small className="block font-mono text-[10.5px] uppercase tracking-[0.1em] text-[color:var(--color-ink-3)]">← Previous</small>
                <b className={`font-display text-[19px] font-normal ${theme.title}`}>{prev.label}</b>
              </Link>
            ) : <span className="hidden sm:block" />}
            {next && (
              <Link to={next.to} onClick={toTop} className={`rounded-[8px] border border-[color:var(--color-line)] bg-white px-4 py-3 text-right ${theme.hover}`}>
                <small className="block font-mono text-[10.5px] uppercase tracking-[0.1em] text-[color:var(--color-ink-3)]">Next →</small>
                <b className={`font-display text-[19px] font-normal ${theme.title}`}>{next.label}</b>
              </Link>
            )}
          </div>
        </Container>
      )}
    </ActiveTabProvider>
  );
}

export function Q1Frame() {
  const { pathname, hash } = useLocation();
  return <SectionFrame name="Question 1" steps={Q1_SEQUENCE} at={q1Index(pathname, hash)} theme={Q1_THEME} />;
}

export function Q2Frame() {
  const { pathname } = useLocation();
  return <SectionFrame name="Question 2" steps={Q2_SEQUENCE} at={q2Index(pathname)} theme={Q2_THEME} />;
}
