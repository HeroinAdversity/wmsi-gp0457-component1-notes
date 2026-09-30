# Q2 Research territory: design spec (v2)

**Date:** 2026-09-29 · **Status:** v2, **approved** by teacher on 2026-09-29 (palette Option 1 · 2(a) "Strong or Shaky?" · Appendix A style approved, lengthened)
**Mockups:** `docs/superpowers/mockups/q2-research-mockups-v2.html` (boards A–H). v1 is kept as `q2-research-mockups-v1.html`.

## 1. Goal

Add a Component 1 **Question 2** section to the WMSI GP0457 site:

- **2(a)** "Explain the strengths and weaknesses of the research outlined in Source 3." 8 marks, Table C.
- **2(b)** "'<claim>' Explain how this claim could be tested. You should consider the research methods and evidence that could be used." 8 marks, Table D.

The section also includes:
- a skills map linking the Q2 skills to C1 Q3, Component 2 and Component 3;
- a practice bank that won't run out;
- one student export ("My learning");
- a minimal teacher tracker.

**Success criteria**
- Every rule traces to Table C/D, the June 2026 examiner report, or the marking-workshop pack.
- A student can reach Level 3+ on an unseen Source 3 and claim using only the site.
- Works on a projector and at 375px. On phones, controls stay clear of the status-bar zone.
- Content lives in typed data files, so the section moves into the future merged app unchanged.
- The teacher can see, per student: what was submitted, quiz scores, a teacher mark for 2(a)/2(b), and 2–3 next steps.

## 2. Decisions

| # | Decision | Choice |
|---|---|---|
| — | Codebase | This repo, new `/research` namespace |
| 1, 8 | Colour | Q2 territory built from the teacher's two palettes (board A). **Option 1 approved:** Q2 pages only; the site shell stays as Q1. (Option 2, a whole-app re-skin, is deferred.) |
| — | Type | Unchanged Q1 system (DM Serif Display / Inter Tight / JetBrains Mono) |
| — | Language | English only; the EN/中文 toggle stays |
| 6 | Page names | **Approved:** 2(a) **"Strong or Shaky?"**, subtitle "Judging the strengths and weaknesses of research". 2(b) **"The Test Bench"**, subtitle "Designing research to test a claim". |
| 7 | Skills map | Three-column layout approved. Bigger text. Columns renamed "What you learn in class / Paper 1 · Question 2 / Where it earns marks again" |
| 10 | Density | Chain and cards are tighter: 13.5px body, 11–14px padding |
| 11 | Callouts | No coloured side-bar. Examiner advice is an **examiner's note** card (ivory, document icon, citation, "So:" action line) |
| 12 | Mobile top | Header starts below `env(safe-area-inset-top)` + 18px; 40px menu target; the top 44px is kept control-free |
| 2, 9, 15 | Practice | 11 reworded past papers + 22 mirror papers (180–220 words each), each with an answer scheme in the Appendix A style (§7) |
| 3, 4 | Teacher loop | `/my-learning` export (PDF/Word with result code + QR) → `/teachers/tracker` (§8) |
| 13 | AI marking | No student-facing AI. Rule-based "coach" now. Optional teacher-only AI second marker later (§9) |
| 14 | Repo name | Rename to `wmsi-gp0457-component1-notes` at build start, with your confirmation (§11) |

## 3. Evidence base

**Table C (2a).**
- L4 (7–8): "reasoned explanation of a **wide range** of evaluative points, including **both** strengths and weaknesses … clearly related to the purpose of the research."
- L3 (5–6): "explanation of a **range** of evaluative points."
- L2 (3–4): "mostly descriptive with little explanation."
- L1 (1–2): "asserted", or the research is "only described".

**Table D (2b).**
- L4: "reasoned explanation of a **wide range of methods and evidence** … clearly related to testing the claim."
- L2: "mostly descriptive."
- L1: methods and evidence not connected.

**June 2026 Principal Examiner Report, 2(a).**
- Weak answers covered one side only, listed without explaining, discussed methods not in the source, or speculated beyond it.
- Strong answers judged "fitness for purpose" and used methodological terms: sampling, representative, validity, reliability, relevance, accuracy, recency, ethics, confidence, triangulation.

**June 2026 Principal Examiner Report, 2(b).**
- Strong answers related the design to **both aspects of the claim**, explained *several* methods and sources in detail, and compared data across methods to "triangulate and verify".
- Weak answers asserted methods, listed many without linking them to the claim, or argued the issue itself.

**Marking workshop (Nov 2025 feedback on specimen scripts).**

| Script | 2(a) | What the examiner said | 2(b) | What the examiner said |
|---|---|---|---|---|
| A | **8/8** | "reasoned explanation of **five** evaluative points, including both strengths and weaknesses" | **8/8** | "internet search, survey, case study, interview" (four methods), clearly related to the claim |
| B | 4/8 | "a range of evaluative points that are mostly descriptive" | 3/8 | "methods … described, with little explanation … not related to testing this claim" |
| C | 2/8 | "a limited range" | 4/8 | — |

Script A's 2(b) also:
- unpacked the claim's scope ("*most people* is far too many people to ask");
- planned triangulation against a large published study.

## 4. The experienced teacher's notes, checked against the mark scheme (#5)

| Note | Verdict | Evidence | What the site teaches |
|---|---|---|---|
| **Research methods:** case study, survey, observation, experiment, interview, secondary data analysis, mixed methods, each with the data it yields and its pros/cons | ✅ Checks out | The indicative content lists interviews, surveys, questionnaires, case studies, observation, secondary/literature review, and internet and media searches. Experiments appear in the June 2026 /11 report. | Kept as the Toolkit's method cards. Add *internet & media search* as its own card (the mark scheme lists it separately). *Mixed methods* is taught as **triangulation**, the examiner's word. |
| **Sources of information:** internet, experts, books/articles/papers, stakeholders, organisations, judged on reliability, accessibility, breadth vs depth | ✅ Checks out | The 2(b) evidence list names police, insurance companies, government, pressure groups, charities and national organisations. The report praises "reputable organisations with research expertise". | Kept. These become the **Who** column vocabulary. The same criteria feed C2 Table E. |
| **Reliability of an argument:** expertise, accuracy, type of information, logic, evidence, bias, tone, reason to lie | ⚠️ Right skill, mostly a Q3 skill | This matches the Q3 Table F indicative content (reasoning, language/tone, evidence, bias/vested interest). For 2(a) the mark scheme also uses **research-design** points that aren't in the note: research question, sample size and representativeness, setting/conditions, recording, ethics, single method with no triangulation. | Kept for Q3 and for judging *who was asked* in 2(a). Add a separate 2(a) "research design" checklist: aim/question · who & how many · where & when · how recorded · ethics · one method or several · does the conclusion fit the data? |
| **Testing claims:** reputable source? cited? expertise? coverage? calculations checkable? criteria clear? | ✅ Useful; partial fit | "Reputable organisation", "expertise" and "large coverage" are exactly what a strong **Why** argues. "Check calculations" / "know the criteria" is about verifying *existing* evidence, which is marginal for 2(b). | Kept as prompts for the **Why** column. |
| **2(a): 1 strength + 1 weakness is enough; 2 + 1 to be safe** | ❌ Too few for the top band | L4 needs a "**wide range**", and Script A got 8/8 with **five** points. With 2–3 points the best likely outcome is L2–L3 ("a range"). | **Minimum 2 + 2. Level 4 target: 5 explained points (3 + 2 or 2 + 3)**, each with the three-step chain. Keep the teacher's core idea (reverse-engineer from the mark scheme). |
| **2(b): Who / How / What / Why matrix** | ✅ The strongest idea, kept as the lynchpin | Table D rewards methods **and** evidence, each explained and tied to the claim. Who + How = method; What = evidence; Why = the link to the claim. | Kept, with two fixes: (1) the **What** cell must name the **evidence type** (statistics, testimony, documents; qualitative/quantitative; primary/secondary); (2) each row is tagged with the **part of the claim** it tests. |
| **2(b): 3 methods, 3 developed points** | ⚠️ Close | Script A's full mark used 4 methods. The report says "explaining in detail several methods and several sources of evidence". | **3 fully developed rows minimum; 4 is safer, or 3 + one "compare" line** (triangulation, which the report praises). |
| **2(b): do NOT critique the methods** | ✅ Keep, with one refinement | No descriptor rewards critique, so it wastes time. But Script A (8/8) used a limitation to *justify the next method* ("too many people to ask, so a big study…"). | Rule: "Don't critique for its own sake. A limitation is allowed only when it explains why you add another method." The coach flags critique words in the **Why** column. |

**Conclusion.** The teacher's system is the lynchpin, with Who/How/What/Why at the centre of 2(b). Cambridge's material adds four things: the 5-point target for 2(a), the research-design checklist, evidence types in *What*, and claim-part coverage plus triangulation.

## 5. Skills and links

Unchanged from v1 in substance; now labelled for students ("What you learn in class"). Board B shows it.

| Skill (student label) | 2(a) | 2(b) | C1 Q3 | C2 Report | C3 Project |
|---|---|---|---|---|---|
| Set a research question | ● judge the aim | ● the claim is the aim | | ● | ● Table A |
| Choose research methods | ● judge the method | ● How | | ● | ● Table A |
| Choose sources of information | ● who was asked | ● Who | ○ | ● Table E | ● |
| Judge reliability & bias | ● | | ● | ● Table E | ● Table E |
| Judge if research fits its aim | ● link to aim | ○ Why | | ● Table E | ● Table E |
| Break a claim into parts | | ● | ○ | ● | ○ |
| Explain in a chain | ● | ● | ● | ● | ● |

The three bridge panels on the hub are unchanged from v1:
- 2(a) ↔ C2 Table E
- 2(b) ↔ C3 Table A
- Q2 ↔ Q3

## 6. Routes and pages

| Route | Page | Contents |
|---|---|---|
| `/research` | Hub, "Research, inside out." | Skills map (SVG; vertical chain on phones), link table, three bridges, learning path |
| `/research/toolkit` | Toolkit | 8 method cards · 5 source types · reliability checklist (Q3) · **research-design checklist (2a)** · testing-claims prompts · glossary · method↔data quiz |
| `/research/evaluate` | 2(a) **Strong or Shaky?** | Overview · The move (source annotator + 3-step chain + S/W tally) · Traps · Worked examples L1–L4 · Practice · Checklist · spot-it quiz |
| `/research/design` | 2(b) **The Test Bench** | Overview · Split the claim (+ quiz) · The matrix (coverage meter + coach) · Traps · Worked examples L1–L4 · Practice · Checklist |
| `/research/practice` | Practice bank | 33 items, filter reworded/mirror, write → self-assess → unlock the answer scheme; printable "mock Q2" per item |
| `/revision/research` | Revision sheet | One printable page |
| `/my-learning` | Student export (**new, site-wide**) | Progress + all answers + quiz results → PDF / Word / result code |
| `/teachers/tracker` | Class tracker (**new**) | Import PDFs or codes; marks, next steps, comments; CSV; backup/restore |

The **2(a) chain:**
1. What they did
2. Effect on the evidence
3. Link to the aim

**Traps**, from the examiner report:
- **2(a):** one side only · a list with no explanation · methods not in the source · speculating beyond the source · judging the topic instead of the research.
- **2(b):** listing methods without reasons · ignoring part of the claim · arguing the issue · critiquing your own methods · vague "Who".

**Checklists** (6 each) map one-to-one onto the L4 descriptor phrases.

## 7. Practice bank (#2, #9, #15)

**A. Reworded past papers (11).**
- Each past Source 3 is rewritten in new words with every research feature kept: who, how many, where, how recorded, ethics, the conclusion drawn.
- Each 2(b) claim is reworded with the same parts (subject / change or comparison / scope).
- Sessions: Jun 2025 /11 /12 /13 · Nov 2025 /11 /12 /13 · Mar 2026 /12 · Jun 2026 /11 /12 /13 · Workshop specimen.
- Labelled "Reworded from <session>". Cambridge's wording is not reproduced, which also answers the v1 copyright question.

**B. Mirror papers (22 = 2 per session).**
- Each is a new topic and scenario built on the *same skeleton of strengths and weaknesses* as its parent. For example, the June 2026 /12 skeleton: clear aim · one small organisation · confidentiality · recording · inexperienced interviewee · noisy setting · missing data · national conclusion from one case.
- Each mirror also gets a new 2(b) claim of the same *type*: count, trend, comparison, cause-effect, "many/most", or opinion of a group.
- Topics are chosen from the 0457 topic list, so they double as topic practice.

**Every item carries a Cambridge-style answer scheme:**
- **2(a):** indicative strengths and weaknesses (with the chain written out for 2 of them) + a note on how Table C levels apply to this source.
- **2(b):** claim parts · indicative methods · indicative evidence · a model 3-row matrix · a model L4 paragraph.
- A "what a Level 2 answer would look like" line, so students can see the gap.

The scheme unlocks only after the student saves an attempt. Appendix A has a full worked sample for review.

## 8. Student export and teacher tracker (#3, #4)

**Progress store.** Every Q2 interaction writes to a single `wne_progress_v1` record in localStorage. It holds quiz results, practice answers, self-assessed levels, checklist ticks and matrix rows. Q1 tools can register with the same store later, so `/my-learning` grows into the whole-app export.

**`/my-learning` (student).**
- Name + class fields.
- A progress list (each activity: score / status).
- Buttons: **Download PDF**, **Word**, **Copy code**.
- The PDF and Word files reuse the existing `notes-export` and contain:
  1. a summary table of quiz scores and statuses;
  2. every written answer in full;
  3. self-assessments;
  4. a **result code** box with a QR code.
- The code is `WMSI2.<scope>.<payload>`. The payload is JSON, deflate-compressed (browser `CompressionStream`), then base64url.
- The code includes a checksum, which catches copy errors. It is **not** tamper-proof, and the page says so honestly.
- Answers longer than the code budget are summarised in the code (scores, levels, word counts). Full answers always stay in the PDF.

**`/teachers/tracker` (teacher).**
- **Import:** drop PDFs (the code is read from the PDF text with pdf.js, loaded only on this page), drop Word files, or paste codes. Existing base64 codes from Q1 dashboards still decode (`lib/dashboards.ts`).
- **One row per student:** last submission · quiz total · 2(a) mark /8 · 2(b) mark /8 · next-step chips. Sortable; class filter.
- **Student panel:**
  - read their answers;
  - enter teacher marks;
  - toggle next-step chips (Both S & W · Link to aim · Explain, don't list · Only what's in the source · Both parts of claim · Name evidence type · Don't argue the issue);
  - add one comment.
- **Storage:** the teacher's browser only. **Back up / Restore** (JSON file) and **Export CSV** for the markbook. Nothing leaves the device.
- Minimal by design: no logins, no server, no student accounts.

## 9. AI evaluator: decision (#13)

**Recommendation:**
- **Phase 1:** no AI; ship a rule-based **coach** inside the pages.
- **Later, optional:** a teacher-only **"AI second marker"** inside the tracker, run with your own Gemini key on the **paid** tier.

**Why not a student-facing Gemini evaluator**
1. **Terms of service.** The Gemini API Additional Terms say you "will not use the Services as part of a website, application, or other service … that is directed towards or is likely to be accessed by individuals under the age of 18." Year 10 students are under 18, so a student-facing marker would breach the terms whichever tier you pay for.
2. **Privacy on the free tier.** On unpaid services Google uses submitted content "to provide, improve, and develop Google products and services and machine learning technologies", and "human reviewers may read, annotate, and process your API input and output." That is not appropriate for minors' work. The paid tier does not use prompts for training.
3. **Keys can't be hidden in a static site.** The key would have to sit behind a Netlify Function, which adds a server, quota abuse risk and cost control.
4. **Free-tier limits are small and change often.** Third-party guides quote roughly 15 requests/minute and up to about 1,500/day for Flash models, but Google changes these; check the quota page in AI Studio. A class of 30 submitting at once would hit the per-minute limit.
5. **Reliability.** A model's level judgements drift and would need your moderation anyway.

**What Phase 1 does instead (free, offline, private)**
- **2(a) coach:** counts strengths and weaknesses; checks each point has an effect ("so / this means…") and a link to the aim; flags points about features that aren't in the source (by matching against the item's feature list).
- **2(b) coach:** claim-part coverage meter; checks each **What** names an evidence type; flags critique words in **Why**; nudges towards a comparison/triangulation line.
- **Self-assessment:** against the L1–L4 checklist, then the answer scheme unlocks.

**Optional Phase 2 (teacher-only)**
- In `/teachers/tracker`, a "Second marker" button sends one answer + the item's answer scheme + Table C/D to Gemini, using **your** paid key stored only in your browser.
- It returns a suggested level, 2 strengths, 2 next steps and quoted evidence. **You** confirm the mark.
- Only you (an adult) use it, and names can be stripped before sending. Paid-tier cost for a class set is a few cents.
- Check with the school's data-protection policy (Malaysian PDPA) before switching it on.
- If WMSI has Google Workspace for Education, Gemini in Classroom is the compliant student-facing route to consider instead.

## 10. Visual system

This extends the Q1 world. Q2 tokens go in `src/styles.css` `@theme`:

| Token | Hex | Job |
|---|---|---|
| `--color-q2-night` | #201E43 Deep Sapphire | Mark card, matrix header, chain header |
| `--color-q2-sea` | #021526 Black Sea | Q2 heading ink, primary buttons |
| `--color-q2-sapphire` | #03346E Sapphire Blue | 2(a) headings, nav underline |
| `--color-q2-storm` | #134B70 Storm Blue | 2(a) accent + text, claim part 1 |
| `--color-q2-sage` | #508C9B Blue Sage | 2(b) accent (fills/large only), claim part 2 |
| `--color-q2-sage-ink` | #35697A | 2(b) small text |
| `--color-q2-coastal` / `-tint` | #6EACDA / #E7F1FA | Strength highlight, map lines, focus ring halo |
| `--color-q2-ivory` / `-tint` | #E2E2B6 / #F4F4E2 | Examiner's notes, next-step chips, claim part 3 (#8C8C45) |
| `--color-q2-arctic` | #EEEEEE Arctic Gray | Quiet panels, claim-part boxes |

- Weaknesses keep a soft ember highlight (#F7E4DE), used only for "weakness".
- Coastal Blue and Blue Sage never carry small text.

**New components:** `ExaminerNote` (replaces `Callout` on Q2 pages; Q1 can adopt it later), `MarkCard`, `SourceAnnotator`, `ChainBuilder`, `ClaimSplitter`, `WhoHowWhatWhy`, `CoverageMeter`, `Coach`, `SkillsMap`, `PracticeBank`, `ProgressStore`, `TrackerTable`.

**Mobile header:**
- `padding-top: calc(env(safe-area-inset-top) + 18px)` with `viewport-fit=cover`;
- sticky below the status bar;
- 40px menu target;
- "My notes" FAB at the bottom-right, clear of the home indicator.

## 11. Repo rename (#14)

- **Proposed name:** `wmsi-gp0457-component1-notes`. Display name: "WMSI GP0457 · Component 1 Comprehensive Notes".
- **Steps:**
  1. `gh repo rename` (GitHub keeps redirects from the old URL);
  2. update the local `origin` remote and the README;
  3. confirm Netlify still deploys (it tracks the repo through the GitHub app; re-link it if it doesn't).
- This is an outward-facing change, so I'll ask before running it.

## 12. Data model and merge readiness

```
src/pages/research/
  data/  types.ts toolkit.ts skillsMap.ts evaluate.ts design.ts
         bank/ reworded/*.ts  mirrors/*.ts   (one file per item: source, features, claim, answer scheme)
  components/  (listed in §10)
  pages/  ResearchHub Toolkit Evaluate Design Practice RevisionSheet
src/pages/my-learning/   MyLearningPage.tsx
src/pages/dashboards/    TrackerPage.tsx
src/lib/progress.ts      shared progress store + code encode/decode (+ checksum)
```

- No exam content lives in page components.
- `/research/*`, `/my-learning` and `/teachers/tracker` are stable routes.
- React 18 now; the code avoids APIs that differ in React 19 / Router 7 (`gp-hub`).

## 13. Out of scope

- Chinese translation.
- The Phase 2 AI marker.
- The whole-app re-skin (Option 2).
- A PWA shell.
- Porting Q1 tools into `/my-learning` (they can register later).

## 14. Build phases

1. Repo rename (with confirmation); tokens; nav; routes; `ExaminerNote`, `MarkCard`; safe-area header.
2. Progress store + code encode/decode + tests.
3. Toolkit data + page + quiz.
4. Hub + skills map.
5. Strong or Shaky? (annotator, chain, tally, coach, quiz).
6. The Test Bench (splitter, matrix, coverage, coach, quiz).
7. Practice bank: 11 reworded + 22 mirrors with answer schemes (written in batches of ~6 for your review).
8. `/my-learning` export (PDF/Word/code/QR).
9. `/teachers/tracker` (import, marks, chips, CSV, backup).
10. Revision sheet; Home, Revision and Teachers index links.
11. Verification:
    - build;
    - desktop + 375px screenshots;
    - PDF round trip: export → drop into the tracker → row appears;
    - print; reduced motion;
    - Impeccable detector + finish review.

---

## Appendix A: sample mirror paper and answer scheme (for approval of style)

**Mirror of June 2026 /12 · Q2-M-0612-A**

> **Source 3: A student's project**
> For my business studies course, I wanted to find out how much food restaurants waste. I had read a newspaper article saying that food waste was a growing problem, so I decided to carry out my own research. I emailed a small café near my school and arranged to interview the owner's nephew, Daniel, who was helping out during the school holidays.
>
> Before we started, I told Daniel that the café would not be named in my project, and he agreed that I could take notes. He had worked there for two weeks. We talked at the counter at lunchtime, so he often stopped to serve customers, and sometimes I had to repeat my questions.
>
> Daniel said that the café threw away "about three bags" of food every night. He did not know exactly what was in them because the cook emptied the bins. He thought most of it was bread and salad left over from lunch. When I asked whether the amount had changed over the last few years, he said I would have to ask his uncle, who was away on holiday.
>
> From what Daniel told me, and from the newspaper article, I decided that restaurants across the country waste far more food than they used to.

*(≈210 words. All mirror papers are 180–220 words, the upper end of the 116–203-word range in the 2025–26 inserts.)*

**(a) Explain the strengths and weaknesses of the research outlined in Source 3. [8]**

*Indicative strengths*
- Clear aim (how much food restaurants waste), which focuses the questions.
- Primary, first-hand data from inside a food business.
- Anonymity offered: ethical, and may make answers more honest.
- Notes taken, so there is a record to refer back to.
- The student asked about change over time, which is directly relevant to the conclusion about trends.
- Some secondary material (a newspaper article) was used alongside the interview.

*Indicative weaknesses*
- One small café: not representative of "restaurants across the country".
- The interviewee is a temporary helper of two weeks, and a relative. He has limited knowledge (the cook handles the bins) and may want to protect the family business.
- "About three bags" is an estimate: not measured, and the contents are unknown.
- Interruptions while serving customers, so answers may be incomplete.
- Notes rather than a recording, so they may be inaccurate.
- No data over time (the uncle was away), yet it concludes "more than they used to".
- "He thought most of it was bread and salad": a guess, not evidence.
- The newspaper article is unnamed and undated, so its reliability can't be checked, and it may have shaped the student's expectations (confirmation bias).
- One interview is the only primary method: no triangulation.
- No research question defining "how much" (weight? cost? per day?).

*Two chains written out*
- **W:** Only one café was used → one small café can't represent the whole restaurant industry, so the evidence is unrepresentative → the aim was how much restaurants waste, so a national conclusion is not supported.
- **S:** Daniel was told the café would not be named → he is more likely to be honest about waste without fear of harming the business → more honest figures make the evidence more useful for finding out how much is wasted.

*Applying Table C to this source.* Level 4 needs about 5 of these points, from both columns, each explained with its effect and linked to the aim of measuring restaurant food waste. An answer that lists "small sample, biased, noisy" without saying what each does to the evidence is Level 2.

**(b) "Young people waste more food than older people." Explain how this claim could be tested. [8]**

*Claim parts:* ① food waste (amount) · ② comparison ("more than") · ③ groups (young vs older, which must be defined, e.g. 15–24 vs 55+).

*Indicative methods:* survey or questionnaire of households by age group · a two-week food-waste diary (self-recorded observation) · weighing household food waste (experiment/measurement) · interviews with a council waste officer or a food-waste charity · secondary research into national food-waste studies that break results down by age.

*Indicative evidence:* quantitative kg/person/week by age group (primary) · national statistics by age (secondary) · qualitative reasons (testimony) · expert opinion from organisations with research expertise.

*Model matrix*

| Who | How | What (evidence) | Why | Tests |
|---|---|---|---|---|
| 100 households, split by age of main shopper | Food-waste diary for 2 weeks, weighing waste daily | kg wasted per person per week, by age group (quantitative, primary) | Measures the amount directly and lets the two age groups be compared on the same scale | ① ② ③ |
| National food-waste charity / government waste agency | Secondary analysis of published surveys | National waste figures broken down by age (quantitative, secondary) | Large national samples mean the comparison isn't limited to one town | ① ② ③ |
| Young and older adults from the diary sample | Short follow-up interviews | Reasons for wasting food (qualitative testimony) | Explains *why* any difference exists, which strengthens the comparison | ② ③ |
| Compare | — | Do the diary and national figures agree? | Triangulation: if both show the same gap, the claim is better supported | — |

*A Level 2 answer looks like:* "I would do a survey and an interview and look on the internet." The methods are named but not explained, and nothing is tied to "young vs older".
