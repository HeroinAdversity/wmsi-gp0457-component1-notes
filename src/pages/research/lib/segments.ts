export interface Segment { text: string; id?: string }

/** Split `text` into plain runs and marked runs, one per quote found (reading order; overlaps skipped). */
export function segmentText(text: string, marks: { id: string; quote: string }[]): Segment[] {
  const hits = marks
    .map((m) => ({ id: m.id, start: text.indexOf(m.quote), len: m.quote.length }))
    .filter((h) => h.start >= 0)
    .sort((a, b) => a.start - b.start);
  const out: Segment[] = [];
  let pos = 0;
  for (const h of hits) {
    if (h.start < pos) continue;
    if (h.start > pos) out.push({ text: text.slice(pos, h.start) });
    out.push({ text: text.slice(h.start, h.start + h.len), id: h.id });
    pos = h.start + h.len;
  }
  if (pos < text.length) out.push({ text: text.slice(pos) });
  return out;
}
