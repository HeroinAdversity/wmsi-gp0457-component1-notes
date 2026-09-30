import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { FOOTER_MAP, GROUPS, PLAIN_LINKS, currentPage, type SiteGroup, type SitePage } from '../lib/siteMap';
import { Container } from './primitives';
import { useSearchShortcut } from '../lib/useSearchShortcut';

// Search carries the whole practice bank, so it loads only when first opened.
const SearchDialog = lazy(() => import('./SearchDialog'));

export function SiteLayout() {
  const { lang, toggle } = useLanguage();
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  useSearchShortcut(openSearch);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader lang={lang} toggleLang={toggle} onSearch={() => setSearchOpen(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      {searchOpen && <Suspense fallback={null}><SearchDialog onClose={() => setSearchOpen(false)} /></Suspense>}
    </div>
  );
}

function SearchIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}>
      <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

function SiteHeader({
  lang,
  toggleLang,
  onSearch,
}: {
  lang: 'en' | 'zh';
  toggleLang: () => void;
  onSearch: () => void;
}) {
  const { pathname, hash } = useLocation();
  const [openMenu, setOpenMenu] = useState<SiteGroup['id'] | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number>();

  // Publish the header height so sticky sub-bars can sit right under it.
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty('--site-header-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { setOpenMenu(null); }, [pathname, hash]);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenMenu(null); };
    const onDown = (e: MouseEvent) => { if (!headerRef.current?.contains(e.target as Node)) setOpenMenu(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [openMenu]);

  const canHover = typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;
  const hoverOpen = (id: SiteGroup['id']) => { if (!canHover) return; window.clearTimeout(closeTimer.current); setOpenMenu(id); };
  const hoverClose = () => { if (!canHover) return; closeTimer.current = window.setTimeout(() => setOpenMenu(null), 180); };

  const linkCls = (active: boolean) =>
    `whitespace-nowrap inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[13.5px] font-semibold transition-colors ${
      active ? 'text-[color:var(--color-ink)]' : 'text-[color:var(--color-ink-3)] hover:text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-2)]'
    }`;

  return (
    <header
      ref={headerRef}
      className="no-print sticky top-0 z-40 pt-[calc(env(safe-area-inset-top)+18px)] lg:pt-0 bg-[color:var(--color-paper)]/95 backdrop-blur-md border-b border-[color:var(--color-line)]"
    >
      <Container size="wide" className="relative">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <WMSIMark />
            <p className="hidden sm:block font-display text-[16px] leading-tight text-[color:var(--color-ink)]">
              WMSI Global Perspectives
            </p>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5 flex-1" aria-label="Main">
            <Link to="/" className={linkCls(pathname === '/')}>Home</Link>
            {GROUPS.map((g) => {
              const active = g.match(pathname, hash);
              const open = openMenu === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  aria-expanded={open}
                  aria-controls={`mega-${g.id}`}
                  onClick={() => setOpenMenu(open ? null : g.id)}
                  onMouseEnter={() => hoverOpen(g.id)}
                  onMouseLeave={hoverClose}
                  className={`${linkCls(active)} ${open ? 'bg-[color:var(--color-paper-2)] text-[color:var(--color-ink)]' : ''}`}
                >
                  {g.label} <Chevron open={open} />
                </button>
              );
            })}
            {PLAIN_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className={linkCls(l.end ? pathname === l.to : pathname.startsWith(l.to))}>{l.label}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSearch}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] bg-white px-3 py-[7px] text-[13px] text-[color:var(--color-ink-3)] hover:border-[color:var(--color-ink-3)] min-w-[150px]"
            >
              <SearchIcon />
              <span className="flex-1 text-left">Search notes…</span>
              <kbd className="font-mono text-[10.5px] rounded border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-1.5">/</kbd>
            </button>
            <button
              type="button"
              onClick={onSearch}
              aria-label="Search"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-[color:var(--color-line)] text-[color:var(--color-ink)]"
            >
              <SearchIcon size={16} />
            </button>
            <button
              type="button"
              onClick={toggleLang}
              className="font-mono text-[12px] font-semibold px-3.5 py-2 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-paper)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)] transition-colors"
              aria-label={lang === 'en' ? 'Switch to Chinese' : 'Switch to English'}
            >
              {lang === 'en' ? '中文' : 'EN'}
            </button>
            <MobileMenu onSearch={onSearch} />
          </div>
        </div>

        {GROUPS.map((g) => (
          <MegaMenu
            key={g.id}
            group={g}
            open={openMenu === g.id}
            onEnter={() => hoverOpen(g.id)}
            onLeave={hoverClose}
            other={GROUPS.find((x) => x.id !== g.id)!}
            onSwitch={(id) => setOpenMenu(id)}
          />
        ))}
      </Container>
    </header>
  );
}

function MegaMenu({
  group, open, onEnter, onLeave, other, onSwitch,
}: {
  group: SiteGroup; open: boolean; onEnter: () => void; onLeave: () => void; other: SiteGroup; onSwitch: (id: SiteGroup['id']) => void;
}) {
  const { pathname } = useLocation();
  const { hash } = useLocation();
  const current = currentPage(group, pathname, hash) ?? group.pages[0];
  const [focus, setFocus] = useState<SitePage>(current);
  useEffect(() => { if (open) setFocus(current); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;
  return (
    <div
      id={`mega-${group.id}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="hidden xl:grid absolute left-5 right-5 md:left-8 md:right-8 top-[calc(100%-4px)] z-50 grid-cols-[300px_1fr] overflow-hidden rounded-[10px] border border-[color:var(--color-line)] bg-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.25)]"
    >
      <div className="border-r border-[color:var(--color-line)] bg-[color:var(--color-paper)] p-2">
        {group.pages.map((p) => {
          const on = p === focus;
          return (
            <Link
              key={p.to}
              to={p.to}
              onMouseEnter={() => setFocus(p)}
              onFocus={() => setFocus(p)}
              className={`flex items-start gap-2.5 rounded-[7px] px-2.5 py-2 ${on ? 'bg-white shadow-[0_0_0_1px_var(--color-line)]' : ''}`}
            >
              <span className="mt-0.5 shrink-0 rounded-[3px] px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-white" style={{ background: p.color }}>{p.badge}</span>
              <span>
                <b className="block text-[14px] text-[color:var(--color-ink)]">{p.title}</b>
                <small className="block text-[12px] leading-[1.35] text-[color:var(--color-ink-3)]">{p.blurb}</small>
              </span>
            </Link>
          );
        })}
      </div>
      <div className="px-6 py-5">
        <h3 className="font-display text-[24px] text-[color:var(--color-q2-sea)]">{focus.title}</h3>
        <p className="mt-0.5 font-mono text-[11px] text-[color:var(--color-ink-3)]">{focus.meta}</p>
        <p className="mt-4 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">What it tests</p>
        <ul className="mt-2 grid grid-cols-2 gap-x-5 gap-y-1.5 text-[13px]">
          {focus.tests.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: focus.color }} />
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {focus.branches.map((b) => (
            <Link key={b.to} to={b.to} className="rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-3 py-1 text-[12.5px] text-[color:var(--color-ink)] hover:border-[color:var(--color-q2-storm)]">
              {b.label}
            </Link>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-4 border-t border-[color:var(--color-line-soft)] pt-3 text-[12.5px] text-[color:var(--color-ink-3)]">
          <Link to={group.foot.to} className="font-semibold text-[color:var(--color-q2-storm)]">{group.foot.label}</Link>
          <span>
            Also in Paper 1:{' '}
            <button type="button" onClick={() => onSwitch(other.id)} className="font-semibold text-[color:var(--color-q2-storm)]">{other.label}</button>
          </span>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (open) setExpanded(Object.fromEntries(GROUPS.map((g) => [g.id, g.match(pathname, hash)])));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const plain = 'block border-b border-[color:var(--color-line-soft)] px-2 py-3 font-display text-[20px] text-[color:var(--color-ink)]';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-[color:var(--color-line)] text-[color:var(--color-ink)]"
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
          <rect y="0" width="18" height="2" fill="currentColor" />
          <rect y="6" width="18" height="2" fill="currentColor" />
          <rect y="12" width="18" height="2" fill="currentColor" />
        </svg>
      </button>

      {/* Portalled to <body>: the header's backdrop-blur makes it the containing
          block for fixed children, which clipped the panel to header height. */}
      {open && createPortal(
        <div className="fixed inset-0 z-[75] xl:hidden">
          <div className="absolute inset-0 bg-[color:var(--color-ink)]/45" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[320px] max-w-[88vw] pt-[calc(env(safe-area-inset-top)+18px)] pb-[env(safe-area-inset-bottom)] bg-[color:var(--color-paper)] border-l border-[color:var(--color-line)] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--color-line)]">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
                Menu
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-[color:var(--color-paper-2)]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              onClick={() => { setOpen(false); onSearch(); }}
              className="mx-4 mt-3 mb-1 flex items-center gap-2 rounded-[10px] border border-[color:var(--color-line)] bg-white px-3 py-2.5 text-[15px] text-[color:var(--color-ink-3)]"
            >
              <SearchIcon size={15} /> Search notes…
            </button>
            <nav className="flex-1 overflow-y-auto px-3 pb-6" aria-label="Main">
              <Link to="/" className={plain}>Home</Link>
              {GROUPS.map((g) => {
                const isOpen = !!expanded[g.id];
                return (
                  <div key={g.id} className="border-b border-[color:var(--color-line-soft)]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded((e) => ({ ...e, [g.id]: !isOpen }))}
                      className="flex w-full items-center justify-between px-2 py-3 font-display text-[20px] text-[color:var(--color-ink)]"
                    >
                      {g.label} <Chevron open={isOpen} />
                    </button>
                    {isOpen && (
                      <div className="pb-2">
                        {g.pages.map((p) => {
                          const on = currentPage(g, pathname, hash) === p;
                          return (
                            <Link key={p.to} to={p.to} className={`flex gap-2.5 rounded-lg px-2 py-2 ${on ? 'bg-[color:var(--color-paper-2)]' : ''}`}>
                              <span className="mt-0.5 h-fit shrink-0 rounded-[3px] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white" style={{ background: p.color }}>{p.badge}</span>
                              <span>
                                <b className="block text-[16px] font-semibold text-[color:var(--color-ink)]">{p.title}</b>
                                <small className="block text-[13px] leading-[1.35] text-[color:var(--color-ink-3)]">{p.blurb}</small>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {PLAIN_LINKS.map((l) => (
                <Link key={l.to} to={l.to} className={plain}>{l.label}</Link>
              ))}
            </nav>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function SiteFooter() {
  const { lang } = useLanguage();
  return (
    <footer className="no-print mt-24 border-t border-[color:var(--color-line)] py-10 bg-[color:var(--color-paper-2)]">
      <Container size="wide">
        <nav aria-label="Site map" className="grid gap-x-6 gap-y-7 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {FOOTER_MAP.map((col) => (
            <div key={col.heading}>
              <p className="mb-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">{col.heading}</p>
              {col.links.map((l) => (
                <Link
                  key={l.to + l.label}
                  to={l.to}
                  className={`block py-0.5 hover:underline ${l.sub ? 'pl-3 text-[12.5px] text-[color:var(--color-ink-2)]' : 'text-[13px] text-[color:var(--color-ink)]'}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="mt-10 flex items-center gap-3 mb-3">
          <WMSIMark />
          <div>
            <p className="font-display text-[15px] text-[color:var(--color-ink)]">
              Wesley Methodist School International, Ipoh
            </p>
            <p className="text-[13px] text-[color:var(--color-ink-3)] mt-0.5">
              IGCSE Global Perspectives 0457
            </p>
          </div>
        </div>
        <p className="text-[13px] text-[color:var(--color-ink-2)] max-w-[62ch] leading-relaxed">
          {lang === 'zh'
            ? '面向 Y10 学生与教师的自学与教学资源。所有内容以剑桥考试大纲与牛津教材第三版为依据。凡出自剑桥历年真题的题目与资料均在页面上清楚标注，其余为原创练习。'
            : 'Self-study and teaching resources for Y10. Content aligned to the Cambridge 0457 syllabus and the Oxford Global Perspectives 3rd edition textbook. Released past-paper material is labelled inline; everything else is original practice.'}
        </p>
      </Container>
    </footer>
  );
}

function WMSIMark() {
  return (
    <div className="w-10 h-10 rounded-full border-2 border-[color:var(--color-ink)] flex items-center justify-center bg-[color:var(--color-paper)] shrink-0">
      <span className="font-display text-[15px] leading-none tracking-[-0.02em] text-[color:var(--color-ink)]">GP</span>
    </div>
  );
}
