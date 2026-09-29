import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { Container } from './primitives';

type NavLinkDef = {
  to: string;
  en: string;
  zh: string;
  end?: boolean;
  /**
   * If set, this link only counts as active when the current URL hash
   * starts with `activeHashPrefix`. Used to split /perspectives into
   * two nav entries — Perspectives (Q1c) and Significance (Q1d) — that
   * share a pathname but live under different hash namespaces.
   */
  activeHashPrefix?: 'weigh' | 'not-weigh';
};

const NAV_LINKS: NavLinkDef[] = [
  { to: '/', en: 'Home', zh: '首页', end: true },
  { to: '/source-recall', en: 'First Read', zh: '初读' },
  { to: '/statements', en: 'Statements', zh: '陈述类型' },
  { to: '/perspectives', en: 'Perspectives', zh: '观点', activeHashPrefix: 'not-weigh' },
  { to: '/perspectives#weigh', en: 'Significance', zh: '重要性', activeHashPrefix: 'weigh' },
  { to: '/research', en: 'Research', zh: '研究' },
  { to: '/revision', en: 'Revision Sheets', zh: '复习页' },
  { to: '/my-learning', en: 'My learning', zh: '我的学习' },
  { to: '/teachers', en: 'Teachers', zh: '教师面板' },
];

/**
 * Custom active-check: two nav entries can share the same pathname
 * (Perspectives and Significance both live at /perspectives) but the
 * URL hash picks between them.
 */
function isNavActive(link: NavLinkDef, pathname: string, hash: string): boolean {
  const linkPath = link.to.split('#')[0];
  const pathMatches = link.end ? pathname === linkPath : pathname.startsWith(linkPath);
  if (!pathMatches) return false;
  if (!link.activeHashPrefix) return true;
  const inWeigh = hash === '#weigh' || hash.startsWith('#weigh-');
  return link.activeHashPrefix === 'weigh' ? inWeigh : !inWeigh;
}

export function SiteLayout() {
  const { lang, toggle } = useLanguage();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader lang={lang} toggleLang={toggle} />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader({
  lang,
  toggleLang,
}: {
  lang: 'en' | 'zh';
  toggleLang: () => void;
}) {
  const { pathname, hash } = useLocation();
  return (
    <header className="sticky top-0 z-40 pt-[calc(env(safe-area-inset-top)+18px)] lg:pt-0 bg-[color:var(--color-paper)]/90 backdrop-blur-md border-b border-[color:var(--color-line)]">
      <Container size="wide">
        <div className="flex items-center justify-between gap-6 py-3">
          <Link to="/" className="flex items-center gap-3 group">
            <WMSIMark />
            <p className="hidden sm:block font-display text-[16px] leading-tight text-[color:var(--color-ink)]">
              WMSI Global Perspectives
            </p>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((l) => {
              const active = isNavActive(l, pathname, hash);
              return (
                <Link
                  key={`${l.to}#${l.activeHashPrefix ?? ''}`}
                  to={l.to}
                  className={`text-[13.5px] font-semibold transition-colors relative py-1 ${
                    active
                      ? 'text-[color:var(--color-ink)] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-[color:var(--color-ink)]'
                      : 'text-[color:var(--color-ink-3)] hover:text-[color:var(--color-ink)]'
                  }`}
                >
                  {lang === 'zh' ? l.zh : l.en}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLang}
              className="font-mono text-[12px] font-semibold px-3.5 py-2 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-paper)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)] transition-colors"
              aria-label={lang === 'en' ? 'Switch to Chinese' : 'Switch to English'}
            >
              {lang === 'en' ? '中文' : 'EN'}
            </button>

            <MobileMenu lang={lang} />
          </div>
        </div>
      </Container>
    </header>
  );
}

function MobileMenu({ lang }: { lang: 'en' | 'zh' }) {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-[color:var(--color-line)] text-[color:var(--color-ink)]"
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
          <rect y="0" width="18" height="2" fill="currentColor" />
          <rect y="6" width="18" height="2" fill="currentColor" />
          <rect y="12" width="18" height="2" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[color:var(--color-ink)]/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[300px] max-w-[85vw] bg-[color:var(--color-paper)] border-l border-[color:var(--color-line)] shadow-2xl flex flex-col">
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
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col p-2">
              {NAV_LINKS.map((l) => {
                const active = isNavActive(l, pathname, hash);
                return (
                  <Link
                    key={`${l.to}#${l.activeHashPrefix ?? ''}`}
                    to={l.to}
                    className={`font-display text-[19px] px-4 py-3 rounded-md ${
                      active
                        ? 'bg-[color:var(--color-paper-2)] text-[color:var(--color-ink)]'
                        : 'text-[color:var(--color-ink-2)]'
                    }`}
                  >
                    {lang === 'zh' ? l.zh : l.en}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function SiteFooter() {
  const { lang } = useLanguage();
  return (
    <footer className="mt-24 border-t border-[color:var(--color-line)] py-10 bg-[color:var(--color-paper-2)]">
      <Container size="wide">
        <div className="flex items-center gap-3 mb-3">
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
      <span className="font-display text-[16px] leading-none text-[color:var(--color-ink)]">W</span>
    </div>
  );
}
