
"use client"

import { useState, useEffect, useMemo } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { RevealItem } from '../SectionReveal';
import { Trophy, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface YearlyStat {
  year: string;
  count: number;
}

export function ProjectStatus() {
  const [yearlyStats, setYearlyStats] = useState<YearlyStat[]>([]);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 실적 통계 실시간 리스너 (동적 리스트)
    const unsubStats = onSnapshot(doc(db, 'siteSettings', 'stats'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const statsMap = data.yearlyStats || {};
        const sortedStats = Object.entries(statsMap)
          .map(([year, count]) => ({ year, count: Number(count) }))
          .sort((a, b) => a.year.localeCompare(b.year)); // 오름차순 (2025, 2026...)
        setYearlyStats(sortedStats);
      }
      setLoading(false);
    });

    // 2. 실제 등록된 프로젝트 건수 리스너
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      setProjectCount(snapshot.size);
    });

    return () => {
      unsubStats();
      unsubProjects();
    };
  }, []);

  // 누적 건수: 모든 관리자 입력 실적 + 실제 등록 건수 (필요에 따라 로직 조정)
  const totalCumulativeCount = useMemo(() => {
    const adminTotal = yearlyStats.reduce((acc, curr) => acc + curr.count, 0);
    // 실제 등록 건수를 더할지, 아니면 관리자 입력값만 쓸지 결정 가능
    // 여기서는 모든 수치를 합산합니다.
    return adminTotal;
  }, [yearlyStats]);

  if (loading) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
              <h4 className="text-4xl font-black">{stat.count}건</h4>
            </div>
          </div>
        </RevealItem>
      ))}

      {/* 누적 시공 사례 카드 (항상 마지막에 표시) */}
      <RevealItem delay={yearlyStats.length * 100} className="relative group lg:col-span-1 h-full">
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
              <h4 className="text-4xl font-black">{totalCumulativeCount}건</h4>
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
