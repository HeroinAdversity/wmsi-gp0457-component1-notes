import { Container } from '../../components/primitives';
import { RevisionSheetShell, SheetMasthead, SidebarPanel } from '../../components/RevisionSheetChrome';
import { DESIGN_TRAPS } from './data/design';
import { EVALUATE_TRAPS } from './data/evaluate';
import { METHODS, RELIABILITY, RESEARCH_DESIGN_CHECK, SOURCES } from './data/toolkit';

/* ══════════════════════════════════════════════════════════════════
   Research — Revision Sheet (Q2(a) Strong or Shaky? + Q2(b) The Test Bench)
   All content comes from the Q2 data files; nothing new is written here.
   ══════════════════════════════════════════════════════════════════ */

const CHAIN = [
  ['What they did', 'Quote or name the feature from Source 3.'],
  ['Effect on the evidence', 'More/less accurate, honest, complete, representative?'],
  ['Link to the aim', 'So more/less useful for finding out… (the research purpose).'],
] as const;

const MATRIX = [
  ['Who', 'National police / statistics office'],
  ['How', 'Secondary data analysis of yearly figures'],
  ['What', 'Thefts per year, 10 years — quantitative, secondary'],
  ['Why', 'Whole-country figures over time test “going up” and “across the country”.'],
] as const;

export function ResearchRevisionSheetPage() {
  return (
    <RevisionSheetShell accent="q2">
      <Container size="wide" className="pt-8 md:pt-12 pb-16">
        <SheetMasthead index="4 of 4" paper="Paper 1" question="Q2(a)+(b)" marks="16 marks"
          title="Research" tagline="Strong or Shaky? judges research. The Test Bench designs it. Neither argues the issue." />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <SidebarPanel eyebrow="2(a) · Strong or Shaky? · Table C · 8 marks" foot="Aim: 5 explained points · minimum 2 strengths + 2 weaknesses">
            <ol className="space-y-2 p-4 text-[13.5px]">
              {CHAIN.map(([t, d], i) => (
                <li key={t}><b className="text-[color:var(--color-q2-sea)]">{i + 1} · {t}</b> — {d}</li>
              ))}
            </ol>
            <div className="border-t border-[color:var(--color-line)] p-4 text-[13px]">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--sheet-accent)]">Where to look</p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4">{RESEARCH_DESIGN_CHECK.map((c) => <li key={c.id}>{c.question}</li>)}</ul>
            </div>
          </SidebarPanel>

          <SidebarPanel eyebrow="2(b) · The Test Bench · Table D · 8 marks" variant="ink" foot="Aim: 3 developed rows (4 safer) + one compare line">
            <div className="p-4 text-[13.5px]">
              <p><b className="text-[color:var(--color-q2-sea)]">Split the claim first:</b> What is measured · Change or comparison · Scope or group. Test every part at least twice.</p>
              <dl className="mt-3 grid grid-cols-[70px_1fr] gap-y-1.5 text-[13px]">
                {MATRIX.map(([k, v]) => (
                  <div key={k} className="contents"><dt className="font-display text-[17px] text-[color:var(--color-q2-sea)]">{k}</dt><dd className="m-0">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-3 rounded-[4px] bg-[color:var(--color-q2-arctic)] px-2.5 py-1.5 text-[12.5px]"><b>Compare:</b> if police figures, insurance claims and a driver survey all rise, the claim is supported.</p>
              <p className="mt-2 text-[12.5px]">Justify — don’t critique. A limitation only belongs if it explains why you add another method.</p>
            </div>
          </SidebarPanel>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <SidebarPanel eyebrow="Eight methods → the data they give">
            <ul className="space-y-1 p-4 text-[12.5px]">{METHODS.map((m) => <li key={m.id}><b>{m.name}</b> — {m.data}</li>)}</ul>
          </SidebarPanel>
          <SidebarPanel eyebrow="Five sources (the “Who”)">
            <ul className="space-y-1 p-4 text-[12.5px]">{SOURCES.map((s) => <li key={s.id}><b>{s.name}</b> — {s.reliability}</li>)}</ul>
          </SidebarPanel>
          <SidebarPanel eyebrow="Reliability checklist (Q3 + who was asked)">
            <ul className="p-4 text-[12.5px] columns-2 gap-4">{RELIABILITY.map((r) => <li key={r.id} className="break-inside-avoid">• {r.label}</li>)}</ul>
          </SidebarPanel>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <SidebarPanel eyebrow="2(a) traps" variant="ink">
            <ul className="space-y-1 p-4 text-[13px]">{EVALUATE_TRAPS.map((t) => <li key={t.id}>✕ {t.title}</li>)}</ul>
          </SidebarPanel>
          <SidebarPanel eyebrow="2(b) traps" variant="ink">
            <ul className="space-y-1 p-4 text-[13px]">{DESIGN_TRAPS.map((t) => <li key={t.id}>✕ {t.title}</li>)}</ul>
          </SidebarPanel>
        </div>
      </Container>
    </RevisionSheetShell>
  );
}
