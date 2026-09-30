import { useMemo, useState } from 'react';
import { NoteTile, TileGrid } from '../../components/NoteTiles';
import { Container, DisplayH1, DisplayH2, DisplayH3, Body, Eyebrow, Lede } from '../../components/primitives';
import { Bi } from '../../lib/LanguageContext';
import { ExportFooter } from '../../components/ExportFooter';
import { useNotesExport, nx, usePersistentState } from '../../lib/useNotesExport';
import { TOOL_ID, BRANCHES, KIND_COLOR, type Branch } from './mindMapData';

/* ══════════════════ Root ══════════════════ */
export function MindMapPage() {
  const [query, setQuery] = useState('');
  const [openIds, setOpenIds] = usePersistentState<Record<string, boolean>>(TOOL_ID, 'open', {});

  useNotesExport({
    toolId: TOOL_ID,
    pageTitleEn: 'Types of Statements — Mind Map',
    subtitleEn: 'IGCSE Global Perspectives 0457 · Reference',
    filenameStem: 'GP_Statement_Types_Mindmap',
    studentNameSelector: '#wne-student-name',
    exportDocxSelector: '#wne-export-docx',
    exportPdfSelector: '#wne-export-pdf',
    openNotesSelector: '#wne-open-notes',
    collect: () => collectMindMap(),
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BRANCHES;
    return BRANCHES.filter((b) => {
      const hay = [
        b.name,
        b.zh,
        b.badge,
        stripTags(b.def),
        stripTags(b.note || ''),
        (b.signals || []).join(' '),
        (b.more || []).join(' '),
        b.children.map((c) => `${c.name} ${c.sub}`).join(' '),
        (b.pairs || []).map((p) => `${p[0]} ${p[1]}`).join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const expandAll = () => setOpenIds(Object.fromEntries(BRANCHES.map((b) => [b.id, true])));
  const collapseAll = () => setOpenIds({});
  const toggle = (id: string) => setOpenIds((s) => ({ ...s, [id]: !s[id] }));

  return (
    <>
      {/* HERO */}
      <section className="pt-12 md:pt-16 pb-8">
        <Container size="wide">
          <Eyebrow color="amber">
            <Bi en="Q1(b) · Reference · Mind map" zh="第 1(b) 题 · 参考 · 思维导图" />
          </Eyebrow>
          <DisplayH1 className="mt-3 max-w-[26ch]">
            <Bi en="Types of Statements — Mind Map" zh="陈述类型 —— 思维导图" />
          </DisplayH1>
          <Lede className="mt-6">
            <Bi
              en="Every term, its definition, and the traps that catch people out. Tap any branch to open it, or search across all definitions, signal words, and examples."
              zh="每个术语的定义与常见陷阱。点击卡片展开，或直接搜索定义、信号词与例子。"
            />
          </Lede>
        </Container>
      </section>

      <Container size="wide">
        <section className="py-8 md:py-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search terms, definitions, signal words…"
                aria-label="Search the mind map"
                className="w-full bg-[color:var(--color-paper)] border border-[color:var(--color-line)] focus:border-[color:var(--color-amber)] focus:ring-1 focus:ring-[color:var(--color-amber)] outline-none rounded-full py-2.5 px-4 text-[14px] text-[color:var(--color-ink)]"
              />
            </div>
            <button
              type="button"
              onClick={expandAll}
              className="text-[12.5px] font-semibold px-3 py-2 rounded-full border border-[color:var(--color-ink-3)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="text-[12.5px] font-semibold px-3 py-2 rounded-full border border-[color:var(--color-ink-3)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
            >
              Collapse all
            </button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 font-mono text-[11.5px] text-[color:var(--color-ink-3)]">
            <LegendItem color="amber">Tested directly in Q1(b)</LegendItem>
            <LegendItem color="cobalt">Supports Q2 · Q3 · Q4</LegendItem>
            <LegendItem color="violet">Commonly confused pairs</LegendItem>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((b) => (
              <BranchCard key={b.id} branch={b} open={!!openIds[b.id]} onToggle={() => toggle(b.id)} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="mt-6 text-[14px] text-[color:var(--color-ink-3)]">
              No branch matches "{query}". Try a different search.
            </p>
          )}
        </section>
      </Container>

      <ExportFooter toolId={TOOL_ID} />
    </>
  );
}

function LegendItem({ color, children }: { color: 'amber' | 'cobalt' | 'violet'; children: React.ReactNode }) {
  const cls =
    color === 'amber'
      ? 'bg-[color:var(--color-amber)]'
      : color === 'cobalt'
      ? 'bg-[color:var(--color-cobalt)]'
      : 'bg-[color:var(--color-violet)]';
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${cls}`} />
      {children}
    </span>
  );
}

function BranchCard({ branch, open, onToggle }: { branch: Branch; open: boolean; onToggle: () => void }) {
  const kindColor = KIND_COLOR[branch.kind];
  const borderCls =
    kindColor === 'amber'
      ? 'border-[color:var(--color-amber)]'
      : kindColor === 'cobalt'
      ? 'border-[color:var(--color-cobalt)]'
      : 'border-[color:var(--color-violet)]';
  const eyebrowCls =
    kindColor === 'amber'
      ? 'text-[color:var(--color-amber)]'
      : kindColor === 'cobalt'
      ? 'text-[color:var(--color-cobalt)]'
      : 'text-[color:var(--color-violet)]';
  return (
    <div className={`bg-[color:var(--color-paper)] border ${borderCls} border-t-[4px] rounded-md`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left p-5 md:p-6 flex items-baseline justify-between gap-3"
      >
        <div>
          <p className={`font-mono text-[11px] font-semibold uppercase tracking-[0.14em] ${eyebrowCls}`}>
            {branch.badge}
          </p>
          <p className="mt-2 font-display text-[22px] text-[color:var(--color-ink)]">
            {branch.name} <span className="ml-2 text-[15px] text-[color:var(--color-ink-3)]">{branch.zh}</span>
          </p>
        </div>
        <span
          className={`text-[color:var(--color-ink-3)] text-[18px] transition-transform ${open ? 'rotate-90' : ''}`}
          aria-hidden="true"
        >
          ›
        </span>
      </button>

      {open && (
        <div className="px-5 md:px-6 pb-6 grid gap-4">
          <p className="text-[14px] leading-[1.65] text-[color:var(--color-ink)]" dangerouslySetInnerHTML={{ __html: branch.def }} />

          {(branch.yes || branch.no) && (
            <div className="grid gap-3 md:grid-cols-2">
              {branch.yes && (
                <div className="bg-[color:var(--color-forest-soft)] border border-[color:var(--color-forest)]/40 rounded-md p-4">
                  <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-forest-deep)]">
                    ✓ {branch.kind === 'priority' ? 'IS' : 'Example'}
                  </p>
                  <p className="mt-2 text-[13.5px] italic leading-[1.6] text-[color:var(--color-ink)]">"{branch.yes}"</p>
                </div>
              )}
              {branch.no && (
                <div className="bg-[color:var(--color-ember-soft)] border border-[color:var(--color-ember)]/40 rounded-md p-4">
                  <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ember)]">
                    ✗ Not this
                  </p>
                  <p className="mt-2 text-[13.5px] italic leading-[1.6] text-[color:var(--color-ink)]">"{branch.no}"</p>
                </div>
              )}
            </div>
          )}

          {branch.note && (
            <p
              className="text-[13.5px] leading-[1.6] text-[color:var(--color-ink-2)] bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)]/40 p-3 pl-4 rounded-[6px]"
              dangerouslySetInnerHTML={{ __html: branch.note }}
            />
          )}

          {branch.signals && (
            <div className="flex flex-wrap gap-2">
              {branch.signals.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[12px] px-2.5 py-1 rounded-md bg-[color:var(--color-amber-soft)] text-[color:var(--color-amber-deep)]"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {branch.more && branch.more.length > 0 && (
            <div>
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
                More examples
              </p>
              <TileGrid cols={2} className="mt-2">
                {branch.more.map((m, i) => (
                  <NoteTile key={i} accent="var(--color-cobalt)">{m}</NoteTile>
                ))}
              </TileGrid>
            </div>
          )}

          {branch.pairs && branch.pairs.length > 0 && (
            <div>
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
                The pairs
              </p>
              <div className="mt-2 grid gap-2">
                {branch.pairs.map(([label, sub], i) => (
                  <div
                    key={i}
                    className="bg-[color:var(--color-paper-2)] border border-[color:var(--color-line)] rounded-md p-3"
                  >
                    <p className="text-[13.5px] font-semibold text-[color:var(--color-ink)]">{label}</p>
                    <p className="text-[13px] text-[color:var(--color-ink-2)] mt-1">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
              Quick recap
            </p>
            <div className="mt-2 grid gap-1.5">
              {branch.children.map((c, i) => (
                <div key={i} className="text-[13.5px] leading-[1.55]">
                  <span className="font-semibold text-[color:var(--color-ink)]">{c.name}:</span>{' '}
                  <span className={c.ex ? 'italic text-[color:var(--color-ink-2)]' : 'text-[color:var(--color-ink-2)]'}>
                    {c.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, '');
}

/* ══════════════════ collect() ══════════════════ */
function collectMindMap() {
  const sections: Array<{ heading: string; blocks: any[] }> = [];
  const blocks: any[] = [
    nx.p([
      nx.text(
        'A one-page reference of all eight statement types plus the common-confusions pairs, extracted from the Mind Map view.',
        { italic: true },
      ),
    ]),
  ];
  BRANCHES.forEach((b) => {
    blocks.push(nx.h(3, `${b.name} — ${b.badge}`));
    blocks.push(nx.p(stripTags(b.def)));
    if (b.yes) blocks.push(nx.p([nx.text('Example: ', { bold: true }), nx.text(b.yes)]));
    if (b.no) blocks.push(nx.p([nx.text('Not this: ', { bold: true }), nx.text(b.no)]));
    if (b.signals?.length) {
      blocks.push(nx.p([nx.text('Signal words: ', { bold: true }), nx.text(b.signals.join(', '))]));
    }
    if (b.note) blocks.push(nx.p([nx.text('Note: ', { bold: true }), nx.text(stripTags(b.note))]));
  });
  sections.push({ heading: 'Mind Map — reference', blocks });
  return { sections };
}
