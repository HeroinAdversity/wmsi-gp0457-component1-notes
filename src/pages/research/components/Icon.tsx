/** Small drawn icons for the Q2 pages — one 1.8 stroke, currentColor. */
const PATHS = {
  check: 'M4 12.5l5 5L20 6.5',
  cross: 'M6 6l12 12M18 6L6 18',
  chevron: 'M6 9l6 6 6-6',
  swap: 'M4 9h15l-4-4M20 15H5l4 4',
} as const;

export function Icon({ name, size = 14, className = '' }: { name: keyof typeof PATHS; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={`inline-block shrink-0 ${className}`}
      fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  );
}
