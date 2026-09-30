import type { ActivityKind, ActivityStatus, ProgressState } from './progress';

export const CODE_PREFIX = 'WMSI2';
export const CODE_BEGIN = '---WMSI-CODE-BEGIN---';
export const CODE_END = '---WMSI-CODE-END---';
export const CODE_MAX = 8000;
export const ANSWER_TRIM = 1200;

export interface CompactActivity {
  // 'q1' only appears on tracker rows read from old Q1 codes; `a` then holds a summary.
  i: string; t: string; k: ActivityKind | 'q1'; st: ActivityStatus;
  s?: number; m?: number; l?: 1 | 2 | 3 | 4; a?: string; w?: number;
}
export interface ResultPayload { v: 1; scope: string; n: string; c: string; at: string; acts: CompactActivity[] }
export type DecodeResult = { ok: true; payload: ResultPayload } | { ok: false; error: string };

const ERR_CHANGED = 'This code is incomplete or was changed. Copy it again from the PDF.';
const ERR_NOT_CODE = 'This is not a WMSI result code.';

function words(s: string): number { return s.trim() ? s.trim().split(/\s+/).length : 0; }

export function toPayload(state: ProgressState, scope = 'q2', now: Date = new Date()): ResultPayload {
  const acts: CompactActivity[] = Object.values(state.activities).map((r) => {
    const c: CompactActivity = { i: r.id, t: r.title, k: r.kind, st: r.status };
    if (r.score !== undefined) c.s = r.score;
    if (r.max !== undefined) c.m = r.max;
    if (r.selfLevel !== undefined) c.l = r.selfLevel;
    if (r.answerText) { c.a = r.answerText.slice(0, ANSWER_TRIM); c.w = words(r.answerText); }
    return c;
  });
  return { v: 1, scope, n: state.student.name.trim(), c: state.student.className.trim(), at: now.toISOString(), acts };
}

export function fnv1a(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Blob([new Uint8Array(bytes)]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}
function toB64url(bytes: Uint8Array): string {
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b64);
  return Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
}

async function encodeRaw(p: ResultPayload): Promise<string> {
  const packed = toB64url(await pipe(new TextEncoder().encode(JSON.stringify(p)), new CompressionStream('deflate-raw')));
  return `${CODE_PREFIX}.${p.scope}.${fnv1a(packed)}.${packed}`;
}

/**
 * Answers are trimmed to ANSWER_TRIM by toPayload. If the code is still too long,
 * shorten every answer step by step, then drop answer text from the oldest
 * activities first — word counts always stay, and as much text as fits is kept.
 */
export async function encodeResultCode(p: ResultPayload): Promise<string> {
  let code = await encodeRaw(p);
  if (code.length <= CODE_MAX) return code;
  for (const limit of [600, 300, 150, 60]) {
    code = await encodeRaw({ ...p, acts: p.acts.map((a) => (a.a ? { ...a, a: a.a.slice(0, limit) } : a)) });
    if (code.length <= CODE_MAX) return code;
  }
  const acts = p.acts.map((a) => (a.a ? { ...a, a: a.a.slice(0, 60) } : a));
  for (let i = 0; i < acts.length; i++) {
    if (!acts[i].a) continue;
    const { a: _drop, ...rest } = acts[i];
    acts[i] = rest;
    code = await encodeRaw({ ...p, acts });
    if (code.length <= CODE_MAX) return code;
  }
  return code;
}

export async function decodeResultCode(raw: string): Promise<DecodeResult> {
  const code = raw.replace(/\s+/g, '');
  const parts = code.split('.');
  if (parts.length !== 4 || parts[0] !== CODE_PREFIX) return { ok: false, error: ERR_NOT_CODE };
  const [, scope, sum, packed] = parts;
  if (!/^[0-9a-f]{8}$/.test(sum) || fnv1a(packed) !== sum) return { ok: false, error: ERR_CHANGED };
  try {
    const json = new TextDecoder().decode(await pipe(fromB64url(packed), new DecompressionStream('deflate-raw')));
    const p = JSON.parse(json) as ResultPayload;
    if (p.v !== 1 || p.scope !== scope || typeof p.n !== 'string' || !Array.isArray(p.acts)) return { ok: false, error: ERR_CHANGED };
    return { ok: true, payload: p };
  } catch {
    return { ok: false, error: ERR_CHANGED };
  }
}

/** Line width used when a code is printed; a copied line of exactly this width continues on the next. */
export const CODE_LINE = 56;

export function wrapCodeForPdf(code: string, width = CODE_LINE): string[] {
  const chunks = code.match(new RegExp(`.{1,${width}}`, 'g')) ?? [];
  return [CODE_BEGIN, ...chunks, CODE_END];
}

export function extractCode(text: string): string | null {
  const b = text.indexOf(CODE_BEGIN);
  const e = text.indexOf(CODE_END);
  if (b !== -1 && e > b) return text.slice(b + CODE_BEGIN.length, e).replace(/\s+/g, '');
  // No markers: the code may still be split over lines (a PDF or Word copy, or a
  // browser that turns line breaks into spaces). Printed lines are exactly
  // CODE_LINE long, so keep joining the next token while the last piece is full.
  const tokens = text.split(/\s+/);
  const start = tokens.findIndex((t) => /WMSI2\.[A-Za-z0-9]+\.[0-9a-f]{8}\./.test(t));
  if (start === -1) return null;
  const first = tokens[start].slice(tokens[start].indexOf('WMSI2')).match(/^WMSI2\.[A-Za-z0-9]+\.[0-9a-f]{8}\.[A-Za-z0-9_-]*/);
  if (!first) return null;
  let code = first[0];
  let last = tokens[start].length - tokens[start].indexOf('WMSI2') === code.length ? code : '';
  for (let i = start + 1; last.length === CODE_LINE && i < tokens.length && /^[A-Za-z0-9_-]+$/.test(tokens[i]); i++) {
    code += tokens[i];
    last = tokens[i];
  }
  return code;
}
