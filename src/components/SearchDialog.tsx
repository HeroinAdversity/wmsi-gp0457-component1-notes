import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { search, type SearchEntry, type SearchFilter } from '../lib/searchIndex';

const FILTERS: { id: SearchFilter | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'Q1', label: 'Perspectives · Q1' },
  { id: 'Q2', label: 'Question 2' },
  { id: 'Glossary', label: 'Glossary' },
  { id: 'Practice', label: 'Practice papers' },
];

function Highlight({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return <>{text.split(re).map((part, i) => (i % 2 ? <mark key={i} className="rounded-[2px] bg-[color:var(--color-q2-ivory)] px-[1px] text-inherit">{part}</mark> : <Fragment key={i}>{part}</Fragment>))}</>;
}

export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<SearchFilter | 'all'>('all');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const groups = useMemo(() => search(q, filter), [q, filter]);
  const flat = useMemo(() => groups.flatMap((g) => g.hits), [groups]);
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);

  useEffect(() => { setCursor(0); }, [q, filter]);
  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const go = (e: SearchEntry) => { onClose(); navigate(e.to); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(flat.length - 1, c + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
    else if (e.key === 'Enter' && flat[cursor]) { e.preventDefault(); go(flat[cursor]); }
  };

  let n = -1;
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-[color:var(--color-q2-sea)]/40 px-3 pt-[calc(env(safe-area-inset-top)+56px)] md:pt-[12vh]" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="Search" className="w-full max-w-[680px] overflow-hidden rounded-[12px] bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]" onKeyDown={onKey}>
        <div className="flex items-center gap-2.5 border-b border-[color:var(--color-line)] px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden className="text-[color:var(--color-ink-3)]"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" /><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" /></svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search notes, terms, methods, papers…"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={flat[cursor] ? `sr-${cursor}` : undefined}
            className="flex-1 bg-transparent text-[17px] outline-none"
          />
          <button type="button" onClick={onClose} className="rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-2.5 py-0.5 text-[12px] text-[color:var(--color-ink-2)]">Esc</button>
        </div>
        <div className="flex flex-wrap gap-1.5 border-b border-[color:var(--color-line-soft)] px-4 py-2.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-full border px-2.5 py-0.5 text-[12px] ${filter === f.id ? 'border-[color:var(--color-q2-sea)] bg-[color:var(--color-q2-sea)] text-white' : 'border-[color:var(--color-line)] bg-[color:var(--color-paper)] text-[color:var(--color-ink-2)]'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div ref={listRef} id="search-results" role="listbox" className="max-h-[min(60vh,440px)] overflow-y-auto px-2 pb-2.5 pt-1">
          {groups.length === 0 && (
            <p className="px-3 py-5 text-[13.5px] text-[color:var(--color-ink-3)]">No matches. Try a shorter word, e.g. “bias”.</p>
          )}
          {groups.map((g) => (
            <div key={g.group}>
              <p className="px-2.5 pb-1 pt-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">{g.group} · {g.hits.length}</p>
              {g.hits.map((h) => {
                n += 1;
                const i = n;
                const active = i === cursor;
                return (
                  <button
                    key={h.to + h.title}
                    id={`sr-${i}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    data-active={active}
                    onMouseMove={() => setCursor(i)}
                    onClick={() => go(h)}
                    className={`flex w-full gap-3 rounded-[8px] px-2.5 py-2 text-left ${active ? 'bg-[color:var(--color-q2-coastal-tint)]' : ''}`}
                  >
                    <span className="mt-0.5 h-fit min-w-[44px] shrink-0 rounded-[3px] px-1.5 py-0.5 text-center font-mono text-[10.5px] font-semibold text-white" style={{ background: h.color }}>{h.badge}</span>
                    <span className="min-w-0">
                      <b className="block text-[14px] text-[color:var(--color-ink)]"><Highlight text={h.title} words={words} /></b>
                      <small className="block truncate text-[12.5px] text-[color:var(--color-ink-3)]"><Highlight text={h.detail} words={words} /></small>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="hidden gap-4 border-t border-[color:var(--color-line-soft)] px-4 py-2 font-mono text-[11px] text-[color:var(--color-ink-3)] md:flex">
          <span>↑↓ move</span><span>↵ open</span><span>Esc close</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
