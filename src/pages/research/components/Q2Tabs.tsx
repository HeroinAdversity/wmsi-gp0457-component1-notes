export function Q2Tabs<T extends string>({ tabs, active, onChange }: {
  tabs: readonly { id: T; label: string }[]; active: T; onChange: (t: T) => void;
}) {
  return (
    <nav role="tablist" className="mt-7 flex gap-6 overflow-x-auto border-b border-[color:var(--color-line)] text-[13px] font-semibold [scrollbar-width:none]">
      {tabs.map((t) => (
        <button
          key={t.id} role="tab" aria-selected={active === t.id} onClick={() => onChange(t.id)}
          className={`whitespace-nowrap py-3 border-b-2 -mb-px transition-colors ${active === t.id
            ? 'border-[color:var(--color-q2-sea)] text-[color:var(--color-q2-sea)]'
            : 'border-transparent text-[color:var(--color-ink-3)] hover:text-[color:var(--color-ink)]'}`}
        >{t.label}</button>
      ))}
    </nav>
  );
}
