
"use client"

import { ReactNode } from 'react';
import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionReveal({ children, className, id }: SectionRevealProps) {
  const ref = useReveal();
  return (
    <section id={id} ref={ref} className={cn("py-20 overflow-hidden", className)}>
      {children}
    </section>
  );
}

export function RevealItem({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div 
      className={cn("reveal-item reveal-hidden", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
