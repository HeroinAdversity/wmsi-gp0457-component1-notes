---
name: WMSI Global Perspectives
description: Exam-skill study site for Cambridge 0457 Paper 1, set as ivory study paper with one colour territory per question.
colors:
  paper: "#FCFBF6"
  paper-2: "#F4F2EA"
  paper-3: "#E8E5D8"
  line: "#E2DECD"
  line-soft: "#EDEADB"
  ink: "#1B222D"
  ink-2: "#4A5160"
  ink-3: "#7A8290"
  cobalt: "#2258C4"
  cobalt-soft: "#E8EFFB"
  cobalt-deep: "#143C8A"
  amber: "#8F5D0F"
  amber-soft: "#F5E7C6"
  forest: "#276A50"
  forest-soft: "#DFECDF"
  violet: "#6C3AB8"
  violet-soft: "#EDE3F7"
  ember: "#B33520"
  ember-soft: "#F7E4DE"
  q2-night: "#201E43"
  q2-sea: "#021526"
  q2-sapphire: "#03346E"
  q2-storm: "#134B70"
  q2-sage: "#508C9B"
  q2-sage-ink: "#35697A"
  q2-coastal: "#6EACDA"
  q2-coastal-tint: "#E7F1FA"
  q2-ivory: "#E2E2B6"
  q2-ivory-tint: "#F4F4E2"
  q2-arctic: "#EEEEEE"
  q2-olive: "#8C8C45"
typography:
  display:
    fontFamily: "DM Serif Display, Georgia, Noto Serif SC, serif"
    fontSize: "clamp(38px, 5.5vw, 64px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  display-q2:
    fontFamily: "DM Serif Display, Georgia, Noto Serif SC, serif"
    fontSize: "60px"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "DM Serif Display, Georgia, Noto Serif SC, serif"
    fontSize: "clamp(28px, 3.6vw, 42px)"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  title:
    fontFamily: "DM Serif Display, Georgia, Noto Serif SC, serif"
    fontSize: "clamp(20px, 2.2vw, 26px)"
    fontWeight: 400
    lineHeight: 1.25
  subtitle:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.3
  lede:
    fontFamily: "Inter Tight, -apple-system, Segoe UI, Noto Sans SC, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Inter Tight, -apple-system, Segoe UI, Noto Sans SC, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.65
  body-dense:
    fontFamily: "Inter Tight, -apple-system, Segoe UI, Noto Sans SC, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "JetBrains Mono, ui-monospace, Consolas, monospace"
    fontSize: "10.5px"
    fontWeight: 600
    letterSpacing: "0.16em"
rounded:
  hairline: "2px"
  chip: "3px"
  inner: "5px"
  card: "6px"
  panel: "8px"
  pill: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter-desktop: "32px"
  section-mobile: "56px"
  section-desktop: "80px"
  container-narrow: "780px"
  container-default: "980px"
  container-wide: "1180px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  chip:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  card:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.card}"
    padding: "24px"
  q2-mark-card:
    backgroundColor: "{colors.q2-night}"
    textColor: "#E9E8F5"
    rounded: "{rounded.panel}"
    padding: "20px 22px"
  q2-examiner-note:
    backgroundColor: "{colors.q2-ivory-tint}"
    textColor: "{colors.q2-sea}"
    rounded: "{rounded.card}"
    padding: "18px 20px 16px"
  q2-tab-active:
    textColor: "{colors.q2-sea}"
    typography: "{typography.body-dense}"
  q2-inner-panel:
    backgroundColor: "{colors.q2-arctic}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.inner}"
    padding: "10px 12px"
---

# Design System: WMSI Global Perspectives

## Overview

**Creative North Star: "The Marked Script on the Study Desk"**

The site is ivory study paper under a serif voice: warm off-white ground (paper), warm near-black ink, DM Serif Display for every heading, Inter Tight for reading text, and JetBrains Mono for the small administrative voice of the exam (marks, tables, source lines). Each Paper 1 question owns a colour territory. Q1(a) is violet, Q1(b) cobalt, Q1(c) amber and Q1(d) forest. Q2 has its own teacher-chosen palette of Deep Sapphire night, Storm, Sage, Coastal and Olive-Ivory. The shell stays the same everywhere: the paper, the header, the footer and the serif. Only the territory colour changes.

The Q2 territory is a working bench, not a brochure. Students act on real Source 3 text: they tap features, build three-step chains and fill the Who/How/What/Why matrix, with the mark scheme visible beside them. The first viewport shows a mono label, a big serif title, an italic serif subtitle and a tab bar. Below that, the content sits on the left and a sticky Deep Sapphire "The mark" card sits on the right. On phones that card becomes a collapsible strip. Q2 is an extension of the shipped Q1 page pattern, not a new world (FORM: no roll — no concept tournament and no seed key, because this extends an existing surface).

Density is compact on purpose. The teacher asked for tight working components, so dense Q2 components use about 13.5px body text. Long-form prose keeps 15.5px with a 65ch measure. The teacher has rejected side-bar callouts ("they look like AI"). Advice from the examiner goes in the ExaminerNote card, which is a paper slip, not a stripe.

**Key Characteristics:**
- Ivory paper ground, warm ink, hairline rules (#E2DECD) instead of heavy boxes.
- DM Serif Display at weight 400 for all headings, and italic serif for subtitles and quoted claims.
- Mono small caps are only for exam metadata (marks, tables, sources, dates).
- One colour territory per question. Q2 colours stay on Q2 pages.
- Flat surfaces. Elevation is reserved for the examiner's note, the dropdown and the drawer.
- Icons are drawn SVG with a 1.8 stroke in currentColor.

## Colors

The palette is restrained. Warm paper neutrals carry about 90% of every screen, and one question territory supplies the accent.

### Primary
- **Warm Ink** (ink): the primary text colour, the primary button fill and the brand roundel stroke. It is softer than black, like printed ink on paper.
- **Classroom Cobalt** (cobalt): the site-wide focus ring, text selection and primary button hover. It is also the Q1(b) territory colour.

### Secondary (Q1 territories)
- **Perspective Amber** (amber), **Weighing Forest** (forest) and **First-Read Violet** (violet): each is the accent for one Q1 sub-question. Each has a `-soft` fill for chips and a `-tint`/`-deep` pair in the stylesheet.

### Tertiary (Q2 territory, only on /research, /my-learning and /teachers/tracker)
- **Deep Sapphire Night** (q2-night): fills "The mark" card, the chain-builder header band, the 2(a) node on the skills map and the phone mark strip. It is the heaviest surface on the page, and there is only one per viewport.
- **Black Sea** (q2-sea): the Q2 title and heading ink, the active tab underline, the selected-feature outline and the ink inside the examiner's note.
- **Storm** (q2-storm): the Q2 accent for labels and subtitles, the 2(a)/hub tone, claim part 1, the strength superscript and the Q2 focus ring.
- **Blue Sage** (q2-sage), with **Sage Ink** (q2-sage-ink) for text: Sage is the 2(b) tone and claim part 2. Sage fills and lines only. Small Sage text always uses sage-ink.
- **Coastal** (q2-coastal), with **Coastal Tint** (q2-coastal-tint): strength highlights. The tint fills the phrase, a 2px Coastal underline marks it, and Coastal fills the S cells of the point-target strip.
- **Olive** (q2-olive), **Olive Ivory** (q2-ivory) and **Ivory Tint** (q2-ivory-tint): the examiner's note paper (Ivory Tint on a #D8D8A8 border, with Olive quote marks and rules), claim part 3, the Coach dot, and the "The mark" label and bold text on the night card.
- **Arctic** (q2-arctic): the flat inner panel for sub-cards inside Q2 components (claim-part explainers, hub-card sentence frames).

### Neutral
- **Study Paper** (paper): the page ground and header (at 90% opacity with a blur).
- **Paper 2 / Paper 3** (paper-2, paper-3): footer band, secondary buttons, chips and quiet fills.
- **Hairline / Soft Hairline** (line, line-soft): every rule, card border and tab-bar baseline.
- **Ink 2 / Ink 3** (ink-2, ink-3): lede and support text, and inactive tabs and meta.
- **Ember** (ember, ember-soft): reserved for real warnings. In Q2 it also marks weakness highlights (ember-soft fill with a 2px #E0A493 underline, ember superscript) and the W cells of the point-target strip (#E9A08F on #3A1109).

### Named Rules
**The Territory Rule.** Each question's colours stay in its own territory. Q2 tokens are never used on Q1 pages. The Q1 shell (paper, header, footer, serif) is never recoloured for Q2.

**The Small-Text Contrast Rule.** Coastal and Sage never carry text under 18px. Use sage-ink for small Sage text. Coastal only fills, underlines and backs dark text.

**The Claim-Part Rule.** Claim parts are always Storm (1), Sage (2) and Olive (3), as a 3px inset underline in the claim and as a square swatch or chip fill in the explainers and coverage chips.

**The Strength/Weakness Rule.** Strength is always Coastal and weakness is always ember, both in the annotated source and in the S/W target strip. Never swap them or reuse them for anything else on Q2.

## Typography

**Display Font:** DM Serif Display (with Georgia, Noto Serif SC)
**Body Font:** Inter Tight (with -apple-system, Segoe UI, Noto Sans SC)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, Consolas)
**Chinese:** Noto Sans SC, used on `body.lang-zh` with `palt` spacing.

**Character:** A high-contrast editorial serif sits over a narrow, efficient grotesque. The serif does the talking and the sans does the work. Mono appears only when the exam itself is speaking.

### Hierarchy
- **Display** (400, clamp 38 to 64px, 1.1): Q1 page titles. Q2 titles use a stepped 40px/60px size at 1.04, in Black Sea.
- **Subtitle** (400 italic serif, 19px to 22px): the Q2 subtitle line under the title, in the territory accent (Storm, or Sage Ink for 2(b)).
- **Headline** (400, clamp 28 to 42px, 1.18): section heads such as "Find it, then follow it through."
- **Title** (400, clamp 20 to 26px, 1.25): card and panel heads. Source headings on the bench use 19px serif.
- **Quoted claim / examiner quote** (serif, 22px to 29px for claims, 18px for examiner quotes, about 1.4): verbatim exam text is always set in serif.
- **Lede** (17px to 18px, 1.7, ink-2, max 62ch). Q2 lede: 15.5px to 16.5px, max 64ch.
- **Body** (15.5px, 1.65 to 1.75, max 65ch): long prose. Annotated source text is 15px at 1.85 so the highlights have room.
- **Dense body** (13px to 13.5px, about 1.55): the working text inside Q2 components (mark card, chain columns, coach, tabs, matrix cells).
- **Label** (mono 600, 10.5px to 11px, uppercase, 0.1 to 0.18em tracking): exam metadata such as marks, tables, source lines, dates and export field labels.

### Named Rules
**The Serif-Is-The-Exam Rule.** Quoted source claims and examiner-report quotes are always set in DM Serif Display. Student-facing instructions are always set in Inter Tight.

**The Plain-Words Rule.** Skills-map box labels are at least 15px and use no jargon ("Break a claim into parts", not "Claim deconstruction").

## Layout

Containers are centred with 20px gutters on mobile and 32px on desktop. There are three widths: narrow (780px), default (980px) and wide (1180px, used by every Q2 page). Q1 sections use 56px/80px vertical padding.

The Q2 bench is two columns at `lg`: content on the left and a sticky mark card on the right (`top: 96px`, self-start). Below `lg`, the mark card becomes a collapsible Deep Sapphire strip directly under the tabs. The tab bar scrolls sideways on phones with the scrollbar hidden and keeps the active tab in view. Inside components, grids collapse from 3 or 2 columns to 1 at `md`. The hub path row is 5-up on desktop.

The sticky header on phones is padded `calc(env(safe-area-inset-top) + 18px)`, and the navigation drawer (300px, max 85vw) uses the same top padding plus bottom safe-area padding. Full navigation appears at `xl`. Below that, a 40px round menu button opens the drawer.

## Elevation & Depth

Surfaces are flat. Depth comes from paper tone steps (paper, paper-2, white card, Arctic inner panel) and 1px hairlines. The Q2 mark card creates depth through the value contrast of the night fill, not through a shadow.

### Shadow Vocabulary
- **Paper slip** (`box-shadow: 0 1px 0 #D8D8A8, 0 6px 14px -8px rgba(0,0,0,0.18)`): the examiner's note only. It is a sheet lying on the page.
- **Popover** (`box-shadow: 0 10px 30px -14px rgba(0,0,0,0.3)`): floating menus and popovers in the Q2 pages.
- **Drawer** (`shadow-2xl`): the mobile navigation drawer.
- **Inset underline** (`box-shadow: inset 0 -2px 0 <tone>`, or 3px for claim parts): highlight underlines. This is a text device, not elevation.

### Named Rules
**The Flat-Paper Rule.** Cards sit flat on hairlines. A shadow means a physical slip or a floating layer, never decoration.

## Shapes

Corners are small and consistent: 2px on inline highlight spans and swatches, 3px on chips and S/W cells, 5px on inner panels, 6px on cards, the examiner's note and bench panels, and 8px on the mark card and hub panels. Buttons, chips, the language toggle and round controls are full pills or circles. Borders are 1px hairlines. Dashed rules separate the examiner's "So:" line (#CFCF9A) and mark supporting links and not-yet-covered chips.

## Components

### Buttons
- **Shape:** full pill (9999px).
- **Primary:** Warm Ink fill with Study Paper text, 14px/600, 10px by 20px padding. Hover moves to Cobalt, and pressed nudges it down 1px.
- **Secondary:** paper-2 with a hairline border. Hover darkens the border to ink.
- **Ghost:** transparent with ink-2 text. Hover adds a paper-2 fill.
- **Focus:** 2px Cobalt outline with a 2px offset (Storm on Q2 pages).

### Chips
- **Style:** mono 11px/600 uppercase, 0.1em tracking, pill, with a soft territory fill and deep territory text. Q2 status chips use 3px corners with a territory fill and white mono text, or a dashed ink-3 outline when a part is not yet covered.

### Cards / Containers
- **Corner Style:** 6px.
- **Background:** white on paper.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px hairline (line).
- **Internal Padding:** 20px to 28px for full cards and 10px to 14px for dense Q2 sub-cards.

### Inputs / Fields
- **Style:** the export name field is a bare underline field with a mono placeholder and a mono uppercase label.
- **Focus:** the global focus ring.

### Navigation
- **Header:** sticky paper at 90% opacity with a backdrop blur and a hairline base. It holds the W roundel, a serif wordmark, and 13.5px/600 links in ink-2. The active link is ink with an underline. On the right is a mono 中文 pill toggle.
- **Q2 tabs:** 13px/600 with a 24px gap on a hairline baseline. The active tab is Black Sea with a 2px underline and inactive tabs are ink-3.
- **Drawer (below xl):** a right-side 300px sheet with 19px serif links.

### The Mark Card (signature)
A Deep Sapphire night panel (8px) that stays sticky beside the bench. It has a mono Olive-Ivory "The mark" label and a definition list of Marks / Marked on / Time / Command word, with keys in #B9B8D6 and values in white mono. A hairline (white at 15%) separates the level rule, whose bold text is Olive Ivory, and the target. The 2(a) target is the S/W point strip. On phones the card collapses into a mono summary strip with a chevron icon.

### Examiner's Note (signature)
An Olive-Ivory paper slip: Ivory Tint fill, #D8D8A8 border and the paper-slip shadow. The header has a drawn document icon, "What the examiner saw" in 12.5px bold and a mono source line. The quote is set in 18px serif with Olive quote marks. A dashed rule leads to a "So:" action line at 13.5px. There is a compact variant. This card is the only container for examiner advice.

### Source Annotator (bench)
A white 6px panel with a serif source heading and a mono provenance line. Tappable features are 2px spans. Strengths have a Coastal Tint fill and a Coastal underline, and weaknesses have an ember-soft fill and a #E0A493 underline, each with a mono superscript id. The selected feature gets a 2px Black Sea outline. The selected feature opens a three-column chain (What they did, then Effect on the evidence, then Link to the aim) under a night header band.

### Icons
Drawn inline SVG on a 24-unit viewBox, with a 1.8 stroke, round caps and joins, and currentColor. The set is check, cross, chevron and swap.

## Do's and Don'ts

### Do:
- **Do** keep Q2 colours on Q2 pages (/research, /my-learning, /teachers/tracker) and keep the shared Q1 shell unchanged around them.
- **Do** put all examiner advice in the ExaminerNote card: Ivory Tint slip, serif quote, "So:" action line.
- **Do** set dense component text at about 13.5px (13px minimum) and keep long prose at 15.5px with a 65ch measure.
- **Do** use sage-ink for any Sage-coloured text under 18px, and use Coastal only as a fill or underline.
- **Do** colour claim parts Storm (1), Sage (2) and Olive (3), and strengths Coastal and weaknesses ember, every time.
- **Do** pad the mobile header and drawer with `calc(env(safe-area-inset-top) + 18px)`.
- **Do** draw icons as inline SVG with a 1.8 stroke in currentColor.
- **Do** keep skills-map labels at 15px or larger and in plain words.

### Don't:
- **Don't** put a coloured border-left or border-right wider than 1px on any card or callout. The teacher said side-bar callouts "look like AI".
- **Don't** use glyphs or emoji as icons.
- **Don't** set Coastal or Sage text below 18px.
- **Don't** put more than one Deep Sapphire night surface of weight in a viewport. The mark card is the anchor.
- **Don't** add shadows to flat cards. Shadows belong to the examiner's slip, popovers and the drawer.

### Open decisions (not yet ruled on by the teacher; not system rules)
- The mono uppercase labels above Q2 titles and cards are inherited from Q1. They are currently in the build, but they are not endorsed as a pattern for new surfaces.
- The treatments inherited from the revision sheet chrome (halftone band, rotated stamp, hard offset shadows, text-shadowed title) are in the build, but they are not endorsed.
- The site-wide floating "My notes" button overlaps content on phones. Its placement is undecided.
