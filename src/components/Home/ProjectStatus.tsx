
"use client"

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import { RevealItem } from '../SectionReveal';
import { Trophy, Calendar, CheckCircle } from 'lucide-react';

export function ProjectStatus() {
  const db = useFirestore();
  const { data: portfolios } = useCollection(collection(db, 'portfolios'));

  const portfolioCount = useMemo(() => portfolios?.length || 0, [portfolios]);
  
  // 2025년(12건) + 2026년(8건) + 관리자 등록 건수
  const totalCumulativeCount = useMemo(() => 12 + 8 + portfolioCount, [portfolioCount]);

  const stats = [
    { label: '2025년 완수 실적', value: '12건', icon: <Calendar className="w-6 h-6" /> },
    { label: '2026년 완수 실적', value: '8건', icon: <Calendar className="w-6 h-6" /> },
    { label: '누적 시공 사례', value: `${totalCumulativeCount}건`, icon: <CheckCircle className="w-6 h-6" />, highlight: true },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {stats.map((stat, i) => (
        <RevealItem key={i} delay={i * 100} className="relative group">
          <div className={`p-8 rounded-2xl border-2 transition-all duration-500 ${
            stat.highlight 
            ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105 z-10' 
            : 'bg-white border-muted hover:border-accent text-primary'
          }`}>
            <div className={`mb-6 flex items-center justify-between`}>
              <div className={`${stat.highlight ? 'text-accent' : 'text-accent'}`}>
                {stat.icon}
              </div>
              {stat.highlight && <Trophy className="w-5 h-5 text-accent animate-bounce" />}
            </div>
            <div className="space-y-2">
              <p className={`text-xs font-bold tracking-widest uppercase ${stat.highlight ? 'text-white/70' : 'text-muted-foreground'}`}>
                {stat.label}
              </p>
              <h4 className="text-4xl font-black">{stat.value}</h4>
            </div>
            {stat.highlight && (
              <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/60 font-medium">
                * 기존 실적 및 신규 등록 건 합산 기준
              </div>
            )}
          </div>
        </RevealItem>
      ))}
    </div>
  );
}
