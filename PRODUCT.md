# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** Year 10 IGCSE Global Perspectives (0457) students at Wesley Methodist School International, Ipoh. They use the site in class (projected, or on laptops) and on their phones at home for self-study and revision. Pages must work both on a classroom projector and at 375px.
- **Secondary:** the WMSI GP teacher (and colleagues), who sequence lessons with the site and collect students' exported worksheets.

## Product Purpose

Exam-skill study site for Cambridge 0457 Paper 1 (Component 1). Each question on the paper gets its own "territory": notes, anatomy of the question, traps, worked examples at each mark level, practice, and a checklist. Success means students write answers the way the Cambridge mark scheme and examiner reports reward them.

- Question 1 (a–d) is shipped.
- Question 2 (2a: evaluate research; 2b: design research to test a claim) is the next territory.

## Positioning

Built from the real Cambridge documents: 2025–2026 mark schemes, principal examiner reports, and marked scripts from the Cambridge marking workshop. It is combined with a WMSI teacher's classroom heuristics (for example, the Who | How | What | Why matrix for Q2(b)). Everything is reverse-engineered from the level descriptors, not from generic study advice.

## Operating Context

- Taught in lessons and used for self-study.
- Students export their notes and answers as Word or PDF (the existing notes-export) and hand them in, e.g. on Google Classroom.
- For Q2, this export is the only thing that returns to the teacher. There are no export codes or dashboards for Q2.

## Capabilities and Constraints

- Vite + React + TypeScript + Tailwind v4 SPA, deployed on Netlify from `main`.
- No backend. Student state lives in localStorage.
- Q1 pages are bilingual (EN/中文). Q2 is English-only for now, and the existing toggle must not break on Q2 pages.
- All content (the Q1 site, this Q2 territory, and later the `gp-hub` Component 2/3 material) will eventually merge into one app. The app form is **undecided** (PWA or a store-wrapped web app). The build must therefore stay mobile-first, keep content in typed data files separate from page components, and use stable route namespaces.

## Brand Commitments

- WMSI GP0457 editorial-academic identity as shipped in `src/styles.css`.
- Each Paper 1 question keeps its own colour territory.
- The accent-border callout style is intentional (see `.impeccable/config.json` in the GP folder).

## Evidence on Hand

- Past papers, inserts, mark schemes and examiner reports for June 2025, Nov 2025, March 2026 and June 2026: `../../Past Year Paper/`
- Cambridge marking workshop pack (guidance, specimen mark schemes P1–P3, marked scripts A–I): `../../Cambridge Marking Workshop/`
- Oxford Complete Global Perspectives 3rd ed. (markdown): `../../Oxford GP O level book third edition new syllabus-1.md`
- Teacher's classroom notes on research methods, sources, reliability and testing claims (captured in the Q2 spec)

Do not invent student results, testimonials or examiner quotes. Past-paper material is labelled inline with its session.

## Product Principles

1. The mark scheme is the spec. Every rule on a page traces to a level descriptor or an examiner-report line.
2. Teach the move, then drill it. Every heuristic comes with a worked example and a practice rep.
3. One skill, many papers. Show how a Paper 1 skill carries into Components 2 and 3.
4. Built to merge. Content is data, routes are namespaced, and layouts are mobile-first.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Full `prefers-reduced-motion` support and print styles (already present in the shipped site).
