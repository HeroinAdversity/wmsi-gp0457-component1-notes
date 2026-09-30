import { useEffect, useState } from 'react';
import { Container } from './primitives';
import { Bi } from '../lib/LanguageContext';

/**
 * A page-level footer that gives students:
 *  - a name field (used for the export filename & the docx/pdf header)
 *  - two export buttons (Word, PDF)
 *  - a fallback "open my notes" button that mirrors the floating FAB
 *
 * The name field autosaves to localStorage under wne_<toolId>_studentName so
 * students only enter it once per lesson.
 */
export function ExportFooter({ toolId }: { toolId: string }) {
  const storageKey = `wne_${toolId}_studentName`;
  const [name, setName] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) setName(saved);
    } catch { /* storage disabled */ }
  }, [storageKey]);

  return (
    <section className="no-print border-t border-[color:var(--color-line)] mt-16 md:mt-24 pt-12 pb-16">
      <Container size="wide">
        <div className="max-w-[720px]">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
            <Bi en="Export your worksheet" zh="导出你的作业" />
          </p>
          <h2 className="font-display text-[28px] md:text-[32px] leading-[1.15] text-[color:var(--color-ink)] mt-3">
            <Bi
              en="Download a Word or PDF worksheet."
              zh="下载 Word 或 PDF 版作业。"
            />
          </h2>
          <p className="mt-4 text-[14.5px] leading-[1.55] text-[color:var(--color-ink-2)]">
            <Bi
              en="Enter your name, then click Word or PDF. Your notes, every answer, self-check tick, and practice state on this page are bundled into a single, printable worksheet you can hand in."
              zh="填写姓名，然后点击 Word 或 PDF 下载。你的笔记、每一个答案、自查勾选和练习状态都会整合到一份可打印的作业中。"
            />
          </p>

          <div className="mt-6 grid gap-3">
            <label className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
              <Bi en="Your full name" zh="姓名" />
            </label>
            <input
              id="wne-student-name"
              type="text"
              value={name}
              onChange={(e) => {
                const v = e.target.value;
                setName(v);
                try { localStorage.setItem(storageKey, v); } catch {}
              }}
              placeholder="e.g. Amara binti Rahman"
              className="w-full max-w-[420px] bg-[color:var(--color-paper)] border-b-2 border-[color:var(--color-ink-3)] focus:border-[color:var(--color-violet)] outline-none font-mono text-[15px] text-[color:var(--color-ink)] py-2"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              id="wne-export-docx"
              type="button"
              className="inline-flex items-center gap-2 text-[13.5px] font-semibold px-5 py-3 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-ink-2)] transition-colors"
            >
              <Bi en="Export worksheet (Word)" zh="导出作业（Word）" />
            </button>
            <button
              id="wne-export-pdf"
              type="button"
              className="inline-flex items-center gap-2 text-[13.5px] font-semibold px-5 py-3 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-ink-2)] transition-colors"
            >
              <Bi en="Export worksheet (PDF)" zh="导出作业（PDF）" />
            </button>
            <button
              id="wne-open-notes"
              type="button"
              className="inline-flex items-center gap-2 text-[13.5px] font-semibold px-5 py-3 rounded-full border border-[color:var(--color-ink)] text-[color:var(--color-ink)] hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-paper)] transition-colors"
            >
              <Bi en="Open my notes" zh="打开我的笔记" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
