import { useState, type KeyboardEvent } from 'react';
import { MAP_LINKS, MAP_NODES, linkedIds, type MapNode } from '../data/skillsMap';

/* Layout (viewBox 0 0 1056 520) — matches mockup board B. */
const SKILL = { x: 20, w: 248, h: 44, y0: 58, step: 64 };
const Q2 = { x: 408, w: 240, h: 116, y: { a: 116, b: 322 } as Record<string, number> };
const PAYS = { x: 744, w: 292, y: { q3: 60, c2: 186, c3: 360 } as Record<string, number>, h: { q3: 68, c2: 104, c3: 130 } as Record<string, number> };

interface Box { x: number; y: number; w: number; h: number }
function boxOf(n: MapNode): Box {
  if (n.col === 'skill') {
    const i = MAP_NODES.filter((m) => m.col === 'skill').indexOf(n);
    return { x: SKILL.x, y: SKILL.y0 + i * SKILL.step, w: SKILL.w, h: SKILL.h };
  }
  if (n.col === 'q2') return { x: Q2.x, y: Q2.y[n.id], w: Q2.w, h: Q2.h };
  return { x: PAYS.x, y: PAYS.y[n.id], w: PAYS.w, h: PAYS.h[n.id] };
}
const BOX = new Map(MAP_NODES.map((n) => [n.id, boxOf(n)]));
const STROKE = { a: '#134B70', b: '#508C9B', support: '#6E7684' } as const;

/** Link paths: right-middle of source → left side of target, staggered per incoming link. */
const PATHS = (() => {
  const incoming = new Map<string, number>();
  return MAP_LINKS.map((l) => {
    const s = BOX.get(l.from)!;
    const t = BOX.get(l.to)!;
    const k = incoming.get(l.to) ?? 0;
    incoming.set(l.to, k + 1);
    const x1 = s.x + s.w, y1 = s.y + s.h / 2;
    const x2 = t.x, y2 = Math.min(t.y + t.h - 8, t.y + 30 + k * 12);
    return { ...l, d: `M${x1},${y1} C${x1 + 72},${y1} ${x2 - 58},${y2} ${x2},${y2}` };
  });
})();

export function SkillsMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const lit = selected ? linkedIds(selected) : null;
  const toggle = (id: string) => setSelected((s) => (s === id ? null : id));
  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(id); }
  };
  const nodeOpacity = (id: string) => (!lit || lit.has(id) ? 1 : 0.3);
  const linkOpacity = (from: string, to: string) => (!lit || (lit.has(from) && lit.has(to) && (from === selected || to === selected)) ? 1 : 0.08);

  return (
    <div className="mt-7">
      {/* Desktop / tablet: three-column map */}
      <div className="hidden md:block rounded-[8px] border border-[color:var(--color-line)] bg-white [background-image:radial-gradient(circle_at_1px_1px,#E4E4DA_1px,transparent_0)] [background-size:22px_22px]">
        <svg viewBox="0 0 1056 520" className="block w-full h-auto" role="group" aria-label="Skills map: skills learnt in class link to Question 2, which links to Question 3, the Individual Report and the Team Project">
          <g fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight={600} letterSpacing="1.6" fill="#6E7684">
            <text x="20" y="34">WHAT YOU LEARN IN CLASS</text>
            <text x="408" y="34">PAPER 1 · QUESTION 2</text>
            <text x="744" y="34">WHERE IT EARNS MARKS AGAIN</text>
          </g>
          <g fill="none" strokeLinecap="round">
            {PATHS.map((p, i) => (
              <path key={i} d={p.d} stroke={STROKE[p.kind]} strokeWidth={p.kind === 'support' ? 1.6 : 2.5}
                strokeDasharray={p.kind === 'support' ? '5 5' : undefined}
                style={{ opacity: linkOpacity(p.from, p.to) }}
                className="transition-opacity duration-300 motion-reduce:transition-none" />
            ))}
          </g>
          {MAP_NODES.map((n) => {
            const b = BOX.get(n.id)!;
            const common = {
              role: 'button', tabIndex: 0, 'aria-pressed': selected === n.id, 'aria-label': `${n.title}. Show its links.`,
              onClick: () => toggle(n.id), onKeyDown: (e: KeyboardEvent) => onKey(e, n.id),
              style: { opacity: nodeOpacity(n.id), cursor: 'pointer' },
              className: 'transition-opacity duration-300 motion-reduce:transition-none focus:outline-none [&:focus-visible>rect]:stroke-[#134B70] [&:focus-visible>rect]:[stroke-width:3]',
            } as const;
            if (n.col === 'skill') {
              return (
                <g key={n.id} {...common}>
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="6" fill="#fff" stroke="#D5D9DE" />
                  <text x={b.x + 16} y={b.y + 28} fontSize="15.5" fontWeight={600} fill="#021526">{n.title}</text>
                </g>
              );
            }
            if (n.col === 'q2') {
              const dark = n.tone === 'a';
              return (
                <g key={n.id} {...common}>
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="8" fill={dark ? '#201E43' : '#fff'} stroke={dark ? 'none' : '#508C9B'} strokeWidth={2.5} />
                  <text x={b.x + 18} y={b.y + 28} fill={dark ? '#E2E2B6' : '#35697A'} fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight={600} letterSpacing="1.4">{n.lines[0]}</text>
                  <text x={b.x + 18} y={b.y + 62} fill={dark ? '#fff' : '#021526'} fontFamily="DM Serif Display, Georgia, serif" fontSize="27">{n.title}</text>
                  {n.lines.slice(1).map((l, i) => (
                    <text key={l} x={b.x + 18} y={b.y + 88 + i * 17} fill={dark ? '#D6D5EA' : '#4A5160'} fontSize="14">{l}</text>
                  ))}
                </g>
              );
            }
            return (
              <g key={n.id} {...common}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="6" fill="#fff" stroke="#D5D9DE" />
                <text x={b.x + 16} y={b.y + 28} fontSize="14.5" fontWeight={700} fill="#021526">{n.title}</text>
                {n.lines.map((l, i) => (
                  <text key={l} x={b.x + 16} y={b.y + 50 + i * 20 + (n.id === 'c3' && i >= 2 ? 6 : 0)} fontSize="13.5" fill="#4A5160">{l}</text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Phone: vertical chain */}
      <div className="md:hidden flex flex-col">
        <div className="grid grid-cols-2 gap-2">
          {MAP_NODES.filter((n) => n.col === 'skill').map((n) => {
            const feeds = MAP_LINKS.filter((l) => l.from === n.id);
            return (
              <div key={n.id} className="rounded-[6px] border border-[color:var(--color-line)] bg-white px-3 py-2.5 text-[13px] font-semibold text-[color:var(--color-q2-sea)]">
                {n.title}
                <span className="mt-1.5 flex flex-wrap gap-1" aria-label={`Feeds ${feeds.map((l) => (l.to === 'a' ? '2(a)' : '2(b)')).join(' and ')}`}>
                  {feeds.map((l) => (
                    <span key={l.to} className={`rounded-[3px] px-1.5 py-px font-mono text-[10px] ${l.to === 'a' ? 'bg-[color:var(--color-q2-night)] text-[color:var(--color-q2-ivory)]' : 'border border-[color:var(--color-q2-sage)] text-[color:var(--color-q2-sage-ink)]'}`}>
                      {l.to === 'a' ? '2(a)' : '2(b)'}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
        <Connector />
        <div className="rounded-[6px] bg-[color:var(--color-q2-night)] px-3.5 py-3 text-white">
          <p className="font-mono text-[10px] tracking-[0.12em] text-[color:var(--color-q2-ivory)]">2(a) · TABLE C · 8</p>
          <p className="font-display text-[21px]">Strong or Shaky?</p>
        </div>
        <Connector />
        <div className="rounded-[6px] border-2 border-[color:var(--color-q2-sage)] bg-white px-3.5 py-3">
          <p className="font-mono text-[10px] tracking-[0.12em] text-[color:var(--color-q2-sage-ink)]">2(b) · TABLE D · 8</p>
          <p className="font-display text-[21px] text-[color:var(--color-q2-sea)]">The Test Bench</p>
        </div>
        <Connector />
        <div className="grid grid-cols-1 gap-2">
          {MAP_NODES.filter((n) => n.col === 'pays').map((n) => (
            <div key={n.id} className="rounded-[6px] border border-[color:var(--color-line)] bg-white px-3 py-2.5 text-[13px]">
              <b className="block text-[color:var(--color-q2-sea)]">{n.title}</b>
              {n.lines.map((l) => <span key={l} className="block text-[color:var(--color-ink-2)]">{l}</span>)}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 hidden md:flex flex-wrap gap-6 text-[13px] text-[color:var(--color-ink-2)]">
        <span className="inline-flex items-center gap-2"><i className="inline-block w-7 border-t-[3px] border-[color:var(--color-q2-storm)]" />Feeds 2(a)</span>
        <span className="inline-flex items-center gap-2"><i className="inline-block w-7 border-t-[3px] border-[color:var(--color-q2-sage)]" />Feeds 2(b)</span>
        <span className="inline-flex items-center gap-2"><i className="inline-block w-7 border-t-2 border-dashed border-[color:var(--color-ink-3)]" />Supporting link</span>
        <span className="text-[color:var(--color-ink-3)]">Tap a box to show only its links.</span>
      </div>
    </div>
  );
}

function Connector() {
  return <div className="mx-auto h-[18px] w-[2px] bg-[color:var(--color-q2-storm)]" aria-hidden />;
}
