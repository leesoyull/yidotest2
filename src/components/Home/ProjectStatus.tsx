
"use client"

import { useState, useEffect, useMemo } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { RevealItem } from '../SectionReveal';
import { Trophy, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function ProjectStatus() {
  const [stats2025, setStats2025] = useState(12);
  const [stats2026, setStats2026] = useState(8);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    // 1. 실적 수치 실시간 리스너
    const unsubStats = onSnapshot(doc(db, 'siteSettings', 'stats'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setStats2025(data.count2025 || 0);
        setStats2026(data.count2026 || 0);
      }
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

  // 누적 건수: 2025년 관리값 + 2026년 관리값 + 등록된 프로젝트 건수 (또는 요구사항에 맞춰 로직 조정 가능)
  // 여기서는 단순히 관리자가 입력한 값의 합계로 표시하거나, 합산 로직을 적용합니다.
  const totalCumulativeCount = useMemo(() => stats2025 + stats2026, [stats2025, stats2026]);

  const stats = [
    { label: '2025년 완수 실적', value: `${stats2025}건`, icon: <Calendar className="w-6 h-6" /> },
    { label: '2026년 완수 실적', value: `${stats2026}건`, icon: <Calendar className="w-6 h-6" /> },
    { label: '누적 시공 사례', value: `${totalCumulativeCount}건`, icon: <CheckCircle className="w-6 h-6" />, highlight: true },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {stats.map((stat, i) => {
        const content = (
          <div key={i} className={`p-8 rounded-2xl border-2 h-full transition-all duration-500 text-left ${
            stat.highlight 
            ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105 z-10 hover:bg-primary/90 cursor-pointer' 
            : 'bg-white border-muted hover:border-accent text-primary'
          }`}>
            <div className={`mb-6 flex items-center justify-between`}>
              <div className="text-accent">
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
              <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/60 font-medium flex justify-between items-center">
                <span>* 실시간 실적 반영 기준</span>
                <span className="text-accent font-bold flex items-center gap-1">상세보기 →</span>
              </div>
            )}
          </div>
        );

        return (
          <RevealItem key={i} delay={i * 100} className="relative group">
            {stat.highlight ? (
              <Link href="/projects">
                {content}
              </Link>
            ) : (
              content
            )}
          </RevealItem>
        );
      })}
    </div>
  );
}
