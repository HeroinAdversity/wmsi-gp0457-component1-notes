import type { ReactNode } from 'react';
import { Container } from '../../../components/primitives';

export function Q2Header({ label, title, subtitle, lede, tone, children }: {
  label: string; title: string; subtitle?: string; lede?: ReactNode; tone: 'a' | 'b' | 'hub'; children?: ReactNode;
}) {
  const accent = tone === 'b' ? 'text-[color:var(--color-q2-sage-ink)]' : 'text-[color:var(--color-q2-storm)]';
  return (
    <section className="pt-10 md:pt-12">
      <Container size="wide">
        <p className={`font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] ${accent}`}>{label}</p>
        <h1 className="mt-3 font-display text-[40px] md:text-[60px] leading-[1.04] tracking-[-0.02em] text-[color:var(--color-q2-sea)]">{title}</h1>
        {subtitle && <p className={`mt-1.5 font-display italic text-[19px] md:text-[22px] ${accent}`}>{subtitle}</p>}
        {lede && <div className="mt-4 max-w-[64ch] text-[15.5px] md:text-[16.5px] leading-[1.6] text-[color:var(--color-ink-2)]">{lede}</div>}
        {children}
      </Container>
    </section>
  );
}
