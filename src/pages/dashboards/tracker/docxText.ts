/**
 * Plain text of a .docx file, one paragraph per line. A .docx is a zip; this reads
 * the zip's central directory, inflates word/document.xml and strips the XML.
 * No library needed: the browser's DecompressionStream does the inflating.
 */
async function inflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  const out = new Blob([new Uint8Array(bytes)]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export async function zipEntry(buf: ArrayBuffer, name: string): Promise<Uint8Array | null> {
  const v = new DataView(buf);
  // End-of-central-directory record: last 22 bytes, plus up to 64 KB of comment.
  let eocd = -1;
  for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 22 - 0xffff); i--) {
    if (v.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd === -1) return null;
  const count = v.getUint16(eocd + 10, true);
  let p = v.getUint32(eocd + 16, true);
  const dec = new TextDecoder();
  for (let n = 0; n < count && p + 46 <= buf.byteLength; n++) {
    if (v.getUint32(p, true) !== 0x02014b50) return null;
    const method = v.getUint16(p + 10, true);
    const size = v.getUint32(p + 20, true);
    const nameLen = v.getUint16(p + 28, true);
    const extraLen = v.getUint16(p + 30, true);
    const commentLen = v.getUint16(p + 32, true);
    const local = v.getUint32(p + 42, true);
    const entryName = dec.decode(new Uint8Array(buf, p + 46, nameLen));
    if (entryName === name) {
      const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
      const data = new Uint8Array(buf.slice(start, start + size));
      if (method === 0) return data;
      if (method === 8) return inflateRaw(data);
      return null;
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  return null;
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

export function documentXmlToText(xml: string): string {
  return xml
    .replace(/<w:tab\/>/g, '\t')
    .replace(/<w:br\/>|<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(amp|lt|gt|quot|apos);/g, (_, e: string) => ENTITIES[e])
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCharCode(Number(d)));
}

export async function docxToText(file: Blob): Promise<string> {
  const xml = await zipEntry(await file.arrayBuffer(), 'word/document.xml');
  if (!xml) throw new Error('not a docx');
  return documentXmlToText(new TextDecoder().decode(xml));
}
