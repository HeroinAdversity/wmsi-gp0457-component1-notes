import { decodePayload } from '../../../lib/dashboards';
import type { ResultPayload } from '../../../lib/resultCode';

/** Q1 tools that exported base64 codes before the WMSI2 result code existed. */
const TOOL_TITLE: Record<string, string> = {
  diagnostic: 'Q1 · Find your gap (diagnostic)',
  'statement-types': 'Q1 · Statement types',
  'statement-types-intensive': 'Q1 · Statement types intensive',
  'identifying-perspectives': 'Q1(c) · Identifying perspectives',
  'significance-judgement': 'Q1(d) · Weighing room',
};

const human = (k: string) => k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/^./, (c) => c.toUpperCase());

/** One "Label: value" line per top-level field; long text is shortened, nested data is counted. */
export function summarise(data: unknown): string {
  if (data === null || typeof data !== 'object') return String(data ?? '');
  return Object.entries(data as Record<string, unknown>).map(([k, v]) => {
    let s: string;
    if (v === null || v === undefined) s = '—';
    else if (typeof v === 'boolean') s = v ? 'yes' : 'no';
    else if (typeof v === 'string' || typeof v === 'number') s = String(v);
    else if (Array.isArray(v)) s = v.every((x) => typeof x === 'string' || typeof x === 'number') ? v.join(', ') : `${v.length} items`;
    else s = `${Object.keys(v).length} items`;
    return `${human(k)}: ${s.length > 300 ? `${s.slice(0, 300)}…` : s}`;
  }).join('\n');
}

/**
 * Read an old Q1 code (base64 JSON: toolId, studentName, timestamp, data) as a
 * tracker payload. Old codes carry no class, so the class is left blank.
 */
export function decodeLegacyCode(raw: string): ResultPayload | null {
  const env = decodePayload(raw.replace(/\s+/g, ''));
  if (!env || env.toolId.startsWith('dashboard-')) return null;
  return {
    v: 1, scope: 'q1', n: env.studentName, c: '', at: env.timestamp,
    acts: [{ i: `q1:${env.toolId}`, t: TOOL_TITLE[env.toolId] ?? `Q1 · ${human(env.toolId)}`, k: 'q1', st: 'done', a: summarise(env.data) }],
  };
}
