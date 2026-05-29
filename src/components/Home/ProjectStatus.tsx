
"use client"

import { useState, useEffect, useMemo } from 'react';
import { collection, doc, onSnapshot, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { RevealItem } from '../SectionReveal';
import { Trophy, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface YearlyStat {
  year: string;
  count: number;
}

export function ProjectStatus() {
  const db = useFirestore();
  const [yearlyStats, setYearlyStats] = useState<YearlyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실적 통계 실시간 리스너 (관리자가 입력한 연도별 건수)
    const statsRef = doc(db, 'siteSettings', 'stats');
    const unsubStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const statsMap = data.yearlyStats || {};
        const sortedStats = Object.entries(statsMap)
          .map(([year, count]) => ({ year, count: Number(count) }))
          .sort((a, b) => a.year.localeCompare(b.year)); // 연도순 정렬
        setYearlyStats(sortedStats);
      }
      setLoading(false);
    }, (error) => {
      console.error("Stats fetch error:", error);
      setLoading(false);
    });

    return () => unsubStats();
  }, [db]);

  // 누적 건수 계산 (모든 연도별 실적의 합)
  const totalCumulativeCount = useMemo(() => {
    return yearlyStats.reduce((acc, curr) => acc + curr.count, 0);
  }, [yearlyStats]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {/* 관리자가 등록한 연도별 카드들 */}
      {yearlyStats.map((stat, i) => (
        <RevealItem key={stat.year} delay={i * 100} className="relative group h-full">
          <div className="p-8 rounded-2xl border-2 h-full transition-all duration-500 text-left bg-white border-muted hover:border-accent text-primary">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-accent">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                {stat.year}년 완수 실적
              </p>
              <h4 className="text-4xl font-black">{stat.count.toLocaleString()}건</h4>
            </div>
          </div>
        </RevealItem>
      ))}

      {/* 누적 시공 사례 카드 (항상 마지막에 표시) */}
      <RevealItem delay={(yearlyStats.length + 1) * 100} className="relative group lg:col-span-1 h-full">
        <Link href="/projects">
          <div className="p-8 rounded-2xl border-2 h-full transition-all duration-500 text-left bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105 z-10 hover:bg-primary/90 cursor-pointer">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-accent">
                <CheckCircle className="w-6 h-6" />
              </div>
              <Trophy className="w-5 h-5 text-accent animate-bounce" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-widest uppercase text-white/70">
                누적 시공 사례
              </p>
              <h4 className="text-4xl font-black">{totalCumulativeCount.toLocaleString()}건</h4>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/60 font-medium flex justify-between items-center">
              <span>* 실시간 실적 반영 기준</span>
              <span className="text-accent font-bold flex items-center gap-1">전체보기 →</span>
            </div>
          </div>
        </Link>
      </RevealItem>
    </div>
  );
}
