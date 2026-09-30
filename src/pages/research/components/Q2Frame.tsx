import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Container } from '../../../components/primitives';
import { Q2_SEQUENCE, q2Index } from '../../../lib/siteMap';

/**
 * Wraps every Question 2 route: a dark section bar that sticks under the site
 * header, then the page, then previous/next cards.
 */
export function Q2Frame() {
  const { pathname } = useLocation();
  const at = q2Index(pathname);
  const barRef = useRef<HTMLElement>(null);

  // Keep the current section visible when the bar scrolls sideways on phones.
  useEffect(() => {
    barRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [at]);

  const prev = at > 0 ? Q2_SEQUENCE[at - 1] : null;
  const next = at >= 0 && at < Q2_SEQUENCE.length - 1 ? Q2_SEQUENCE[at + 1] : null;

  return (
    <>
      <nav
        ref={barRef}
        aria-label="Question 2 sections"
        className="no-print sticky z-30 bg-[color:var(--color-q2-sea)] text-white"
        style={{ top: 'var(--site-header-h, 64px)' }}
      >
        <Container size="wide">
          <div className="flex items-center gap-1 overflow-x-auto py-2 whitespace-nowrap [scrollbar-width:none]">
            <span className="mr-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--color-q2-ivory)]">Question 2</span>
            {Q2_SEQUENCE.map((s, i) => (
              <Link
                key={s.to}
                to={s.to}
                aria-current={i === at ? 'page' : undefined}
                className={`rounded-full px-3 py-1 text-[13px] font-semibold ${
                  i === at ? 'bg-[color:var(--color-q2-ivory)] text-[color:var(--color-q2-sea)]' : 'text-[#cfd9e3] hover:bg-white/10 hover:text-white'
                }`}
              >
                {s.short}
              </Link>
            ))}
          </div>
        </Container>
      </nav>

      <Outlet />

      {(prev || next) && (
        <Container size="wide" className="no-print">
          <div className="mt-14 grid gap-3 border-t border-[color:var(--color-line)] pt-6 sm:grid-cols-2">
            {prev ? (
              <Link to={prev.to} className="rounded-[8px] border border-[color:var(--color-line)] bg-white px-4 py-3 hover:border-[color:var(--color-q2-storm)]">
                <small className="block font-mono text-[10.5px] uppercase tracking-[0.1em] text-[color:var(--color-ink-3)]">← Previous</small>
                <b className="font-display text-[19px] font-normal text-[color:var(--color-q2-sea)]">{prev.label}</b>
              </Link>
            ) : <span className="hidden sm:block" />}
            {next && (
              <Link to={next.to} className="rounded-[8px] border border-[color:var(--color-line)] bg-white px-4 py-3 text-right hover:border-[color:var(--color-q2-storm)]">
                <small className="block font-mono text-[10.5px] uppercase tracking-[0.1em] text-[color:var(--color-ink-3)]">Next →</small>
                <b className="font-display text-[19px] font-normal text-[color:var(--color-q2-sea)]">{next.label}</b>
              </Link>
            )}
          </div>
        </Container>
      )}
    </>
  );
}
