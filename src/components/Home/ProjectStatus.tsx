
"use client"

import { useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { RevealItem } from '../SectionReveal';
import { Trophy, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface YearlyStat {
  year: string;
  count: number;
}

export function ProjectStatus() {
  const db = useFirestore();
  const [yearlyStats, setYearlyStats] = useState<YearlyStat[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Firestore의 'siteSettings/stats' 문서를 실시간으로 감시합니다.
    const statsRef = doc(db, 'siteSettings', 'stats');
    
    const unsubscribe = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // 데이터베이스 내의 'yearlyStats' 맵을 배열로 변환
        const statsMap = data.yearlyStats || {};
        const sortedStats = Object.entries(statsMap)
          .map(([year, count]) => ({ 
            year: year.toString(), 
            count: Number(count) 
          }))
          .sort((a, b) => a.year.localeCompare(b.year));
          
        // 데이터가 비어있지 않은 경우에만 업데이트
        if (sortedStats.length > 0) {
          setYearlyStats(sortedStats);
        } else {
          // 문서가 있지만 비어있을 경우 기본값
          setYearlyStats([
            { year: '2025', count: 12 },
            { year: '2026', count: 8 }
          ]);
        }
      } else {
        // 문서가 아예 없는 경우 초기 기본값 설정
        setYearlyStats([
          { year: '2025', count: 12 },
          { year: '2026', count: 8 }
        ]);
      }
      setIsInitialLoading(false);
    }, (error) => {
      console.error("Firestore Stats Error:", error);
      // 에러 발생 시에도 빈 화면이 나오지 않도록 기본값 유지
      setYearlyStats([
        { year: '2025', count: 12 },
        { year: '2026', count: 8 }
      ]);
      setIsInitialLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  // 모든 연도의 실적 건수 합산
  const totalCumulativeCount = useMemo(() => {
    return yearlyStats.reduce((acc, curr) => acc + curr.count, 0);
  }, [yearlyStats]);

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[300px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-3 text-muted-foreground font-medium">데이터를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {/* 데이터베이스에서 불러온 연도별 실적 카드 */}
      {yearlyStats.map((stat, i) => (
        <RevealItem key={stat.year} delay={i * 100} className="relative group h-full">
          <div className="p-8 rounded-2xl border-2 h-full transition-all duration-500 text-left bg-white border-muted hover:border-accent group-hover:shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-accent bg-accent/10 p-2 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                {stat.year}년 완수 실적
              </p>
              <h4 className="text-4xl font-black text-primary">{stat.count.toLocaleString()}건</h4>
            </div>
          </div>
        </RevealItem>
      ))}

      {/* 누적 시공 사례 강조 카드 */}
      <RevealItem delay={yearlyStats.length * 100} className="relative group h-full">
        <Link href="/projects">
          <div className="p-8 rounded-2xl border-2 h-full transition-all duration-500 text-left bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105 z-10 hover:bg-primary/90 cursor-pointer">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-accent bg-white/10 p-2 rounded-lg">
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
