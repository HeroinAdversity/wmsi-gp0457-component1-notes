import type { ActivityKind, ActivityStatus, ProgressState } from './progress';

export const CODE_PREFIX = 'WMSI2';
export const CODE_BEGIN = '---WMSI-CODE-BEGIN---';
export const CODE_END = '---WMSI-CODE-END---';
export const CODE_MAX = 8000;
export const ANSWER_TRIM = 1200;

export interface CompactActivity {
  i: string; t: string; k: ActivityKind; st: ActivityStatus;
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
  return { v: 1, scope, n: state.student.name, c: state.student.className, at: now.toISOString(), acts };
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

/** Answers are already trimmed to ANSWER_TRIM by toPayload; if the code is still too long, drop answer text (word counts stay). */
export async function encodeResultCode(p: ResultPayload): Promise<string> {
  const code = await encodeRaw(p);
  if (code.length <= CODE_MAX) return code;
  return encodeRaw({ ...p, acts: p.acts.map(({ a: _drop, ...rest }) => rest) });
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

export function wrapCodeForPdf(code: string, width = 56): string[] {
  const chunks = code.match(new RegExp(`.{1,${width}}`, 'g')) ?? [];
  return [CODE_BEGIN, ...chunks, CODE_END];
}

export function extractCode(text: string): string | null {
  const b = text.indexOf(CODE_BEGIN);
  const e = text.indexOf(CODE_END);
  if (b !== -1 && e > b) return text.slice(b + CODE_BEGIN.length, e).replace(/\s+/g, '');
  const m = text.match(/WMSI2\.[A-Za-z0-9]+\.[0-9a-f]{8}\.[A-Za-z0-9_-]+/);
  return m ? m[0] : null;
}
