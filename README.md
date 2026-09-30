# WMSI · IGCSE Global Perspectives 0457

Interactive teaching resources for **Year 10, Term 1** at Wesley Methodist School International, Ipoh. Bilingual (EN / 中文). Covers the two Paper 1 skill families that underpin the whole course:

- **Perspectives** — global · national · local · personal, and the Five Elements that turn a perspective into a mark-scheme answer.
- **Statement types** — bias, claim, fact, generalisation, opinion, prediction, value, vested interest.

## Stack

- Vite + React + TypeScript
- Tailwind v4
- React Router (SPA)
- Legacy static tools preserved and served under `/legacy/*`
- Content aligned to the Cambridge IGCSE 0457 syllabus and the **Oxford Global Perspectives 3rd edition** textbook

## Contents

| Route | What it is |
|---|---|
| `/` | Home — the two strands, three learning pathways, source note |
| `/perspectives` | **Full React port** — 7-tab tool: Overview / Framework / Case study / Practice / Exam practice / Your turn / Checklist. Content extended with Oxford Ch. 1 material (values-experience-knowledge, regional level, owner-vs-product, nine evaluative elements). |
| `/perspectives/weighing-room` | The Weighing Room — Q1(d) significance skills (served from `/legacy/`) |
| `/statements` | **Full React port** — Statement Types hub, linking to every self-contained tool |
| `/statements/main` → `/legacy/…and-Generalisation_TOOL.html` | Main self-study notes: video + eight terms + sorting drill + generalisation hunter + exit check |
| `/statements/diagnostic` → `/legacy/…Find-Your-Gap…TOOL.html` | 15-min diagnostic that pinpoints confused pairs and routes to targeted practice |
| `/statements/intensive` → `/legacy/…Statement-Types-Intensive_TOOL.html` | 120-min deep session: reference, 24-statement rapid sort, source deep-dives, four confusable-pair clinics, five exam-style Qs, self-assessment, export code |
| `/statements/claim-vs-evidence` → `/legacy/…Claim-vs-Evidence_TOOL.html` | Separate Paper 1 Q1 skill: claim vs sourced evidence, Level-3 evaluative comments |
| `/statements/mindmap` → `/legacy/mindmap.html` | Interactive mind map of all eight terms |
| `/teachers/statements` → `/legacy/…Teacher-Dashboard.html` | Lesson sequencing, timings, answer keys; imports student export codes |
| `/teachers/statements-intensive` → `/legacy/…Intensive_Teacher-Dashboard.html` | Aggregates class scores from the Intensive, flags students under 60%, exports CSV |
| `/research` | **Q2 hub** — "Research, inside out.": skills map linking Q2 to Q3, the Individual Report (C2) and the Team Project (C3) |
| `/research/toolkit` | Q2 Toolkit — 8 methods, 5 sources, reliability (Q3) and research-design (2a) checklists, testing prompts, glossary, quiz |
| `/research/evaluate` | Q2(a) **Strong or Shaky?** — annotated Source 3, three-step chain builder with coach, traps, Level 1–4 ladder, spot-it quiz |
| `/research/design` | Q2(b) **The Test Bench** — claim splitter, Who/How/What/Why matrix with coverage meter and coach, traps, worked levels |
| `/research/practice(/:id)` | Practice bank — 11 reworded past papers + 22 mirror papers, answer schemes unlock after an attempt, print as mock paper |
| `/revision/research` | Q2 revision sheet |
| `/my-learning` | Student export — progress summary + answers as Word/PDF with a checksummed result code |
| `/teachers/tracker` | Class tracker — drop students' My learning PDFs or paste codes; marks, next-step chips, comments, CSV, backup/restore |

The legacy static HTML tools (`legacy/*.html`) still open standalone from the filesystem — no build required.

## Tests

```bash
npm test           # vitest: progress store, result codes, coach, tracker store, practice-bank audit
```

Practice-bank content is audited automatically (word counts, quotes present in the source, non-overlapping highlights, full answer schemes, 11 reworded + 22 mirrors). `scripts/check-verbatim.py` checks a bank item for 6-word runs shared with its Cambridge insert (inserts live in the git-ignored `.cache/papers/`).

## Local development

```bash
cd "Types of statements/lesson notes"
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # preview built site
npm run typecheck  # tsc --noEmit
```

## Design system

- Palette: warm ivory paper (`#F7F3EA`) + deep ink (`#111417`) + electric cobalt accent (`#0B4CA6`), with supporting forest, amber, ember and violet for topic/level coding
- Type: **DM Serif Display** (editorial headers), **Inter Tight** (body), **JetBrains Mono** (labels & tabular), **Noto Sans SC / Serif SC** (Chinese)
- Motion: restrained — hover states, page transitions, no scroll hijack
- Full `prefers-reduced-motion` and print styles

## Deployment

Netlify auto-builds from `main` using `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

`/legacy/*` is served as-is (see redirect rule), so nothing that worked before is lost.

## Regenerating the Statement Types video

Video source and regeneration instructions live in `legacy/video-source.md`. The video itself is served from `public/legacy/assets/statement-types-overview.mp4`.

## Content sources

- **Cambridge IGCSE Global Perspectives 0457 syllabus** and released past papers (labelled inline; June 2026 Q1(c), March 2026, etc.)
- **Oxford Cambridge IGCSE & O Level Complete Global Perspectives, 3rd edition** — used for the "textbook enrichment" callouts on `/perspectives`
- Original practice passages by the WMSI GP teacher (labelled "Original practice" inline)
