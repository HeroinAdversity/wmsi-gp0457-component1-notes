export function ExaminerNote({ source, quote, action, compact = false }: { source: string; quote: string; action: string; compact?: boolean }) {
  return (
    <aside
      aria-label="Examiner's note"
      className={`mt-6 rounded-[6px] border border-[#D8D8A8] bg-[color:var(--color-q2-ivory-tint)] shadow-[0_1px_0_#D8D8A8,0_6px_14px_-8px_rgba(0,0,0,0.18)] ${compact ? 'px-3.5 py-3' : 'px-5 pt-[18px] pb-4'}`}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        {!compact && (
          <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden="true" className="flex-none">
            <path d="M2 1h12l6 6v17a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" fill="#fff" stroke="#021526" strokeWidth="1.4" />
            <path d="M14 1v6h6" fill="none" stroke="#021526" strokeWidth="1.4" />
            <path d="M5 12h11M5 16h11M5 20h7" stroke="#8C8C45" strokeWidth="1.4" />
          </svg>
        )}
        <span className="text-[12.5px] font-bold text-[color:var(--color-q2-sea)]">What the examiner saw</span>
        <span className="ml-auto font-mono text-[10.5px] text-[#6B6B3A]">{source}</span>
      </div>
      <blockquote className={`m-0 font-display leading-[1.45] text-[color:var(--color-q2-sea)] ${compact ? 'text-[15px]' : 'text-[18px]'}`}>
        <span className="text-[color:var(--color-q2-olive)]">“</span>{quote}<span className="text-[color:var(--color-q2-olive)]">”</span>
      </blockquote>
      <p className="mt-3 pt-2.5 border-t border-dashed border-[#CFCF9A] text-[13.5px] text-[color:var(--color-ink-2)] flex gap-2">
        <b className="text-[color:var(--color-q2-sea)] whitespace-nowrap">So:</b><span>{action}</span>
      </p>
    </aside>
  );
}
