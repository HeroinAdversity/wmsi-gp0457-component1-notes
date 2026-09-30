export type PartId = 1 | 2 | 3;
export type EvidenceTag = 'quantitative' | 'qualitative' | 'primary' | 'secondary';
export type SessionCode =
  | 'J25-11' | 'J25-12' | 'J25-13' | 'N25-11' | 'N25-12' | 'N25-13'
  | 'M26-12' | 'J26-11' | 'J26-12' | 'J26-13' | 'SP-25';

export const SESSIONS: Record<SessionCode, string> = {
  'J25-11': 'June 2025 · 0457/11',
  'J25-12': 'June 2025 · 0457/12',
  'J25-13': 'June 2025 · 0457/13',
  'N25-11': 'November 2025 · 0457/11',
  'N25-12': 'November 2025 · 0457/12',
  'N25-13': 'November 2025 · 0457/13',
  'M26-12': 'March 2026 · 0457/12',
  'J26-11': 'June 2026 · 0457/11',
  'J26-12': 'June 2026 · 0457/12',
  'J26-13': 'June 2026 · 0457/13',
  'SP-25': 'Specimen 2025 · 0457/01',
};

/** One step-by-step explanation: what the researcher did → effect on the evidence → link to the aim. */
export interface Chain { what: string; effect: string; aim: string }

/** A highlightable feature of Source 3. `quote` must appear verbatim in the source paragraphs. */
export interface Feature { id: string; kind: 'S' | 'W'; quote: string; label: string; chain: Chain }

export interface ClaimPart {
  id: PartId;
  label: 'What' | 'Change' | 'Comparison' | 'Scope' | 'Group' | 'Cause';
  /** Exact substring of the claim text. */
  phrase: string;
  /** What the research must therefore include. */
  need: string;
}

export interface MatrixRow {
  who: string; how: string; what: string;
  evidence: EvidenceTag[];
  why: string;
  tests: PartId[];
}

export interface AnswerScheme {
  strengths: string[];
  weaknesses: string[];
  chainsWritten: { kind: 'S' | 'W'; text: string }[];
  levelNote2a: string;
  level2Example2a: string;
  methods: string[];
  evidence: string[];
  modelMatrix: MatrixRow[];
  compareLine: string;
  modelParagraph2b: string;
  level2Example2b: string;
}

export interface BankItem {
  id: string;
  kind: 'reworded' | 'mirror';
  parent: SessionCode;
  title: string;
  topic: string;
  source: { heading: string; paragraphs: string[] };
  aim: string;
  aimKeywords: string[];
  features: Feature[];
  claim: { text: string; parts: ClaimPart[] };
  scheme: AnswerScheme;
}
