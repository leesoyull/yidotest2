
"use client"

import { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Home/Footer';
import { PortfolioGrid } from '@/components/Home/PortfolioGrid';
import { SectionReveal, RevealItem } from '@/components/SectionReveal';

function PortfolioContent() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <SectionReveal className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <RevealItem>
                <span className="text-accent font-bold text-xs tracking-widest uppercase">Portfolio</span>
              </RevealItem>
              <RevealItem delay={100}>
                <h2 className="font-headline text-3xl md:text-4xl font-bold">성실하게 완수된 시공 사례</h2>
              </RevealItem>
              <RevealItem delay={200}>
                <p className="text-muted-foreground text-base font-light">
                  이도건설이 직접 시공한 현장의 기록입니다. <br/>
                  분야별 전문성을 바탕으로 최상의 품질을 약속드립니다.
                </p>
              </RevealItem>
            </div>
            <PortfolioGrid />
          </div>
        </SectionReveal>
      </div>
      <Footer />
    </main>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PortfolioContent />
    </Suspense>
  );
}
