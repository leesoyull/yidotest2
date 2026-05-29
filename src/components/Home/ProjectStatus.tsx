
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export function ProjectStatus() {
  // 1. 구글 창고에서 실시간으로 가져올 숫자 저장고 만들기 (기본값 0)
  const [stats, setStats] = useState({
    year2025: 0,
    year2026: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  // 2. 구글 Cloud Firestore의 siteSettings/stats 문서 실시간 감시 카메라 가동
  useEffect(() => {
    const statsRef = doc(db, 'siteSettings', 'stats');
    
    const unsubscribe = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStats({
          year2025: data.year2025 || 0,
          year2026: data.year2026 || 0,
          total: data.total || 0
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("실적 데이터 로딩 실패:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // 화면 나갈 때 감시 종료
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-8">
      {/* 2025년 실적 카드 */}
      <div className="bg-muted/10 p-8 rounded-[2rem] border border-muted/50 text-center hover:shadow-lg transition-all">
        <span className="text-muted-foreground text-sm font-semibold block mb-2">2025년 누적 실적</span>
        <div className="text-4xl font-black text-primary">
          <span className="text-accent">{stats.year2025}</span> 건
        </div>
      </div>

      {/* 2026년 실적 카드 */}
      <div className="bg-muted/10 p-8 rounded-[2rem] border border-muted/50 text-center hover:shadow-lg transition-all">
        <span className="text-muted-foreground text-sm font-semibold block mb-2">2026년 진행 실적</span>
        <div className="text-4xl font-black text-primary">
          <span className="text-emerald-600">{stats.year2026}</span> 건
        </div>
      </div>

      {/* 총 누적 실적 카드 */}
      <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/20 text-center hover:shadow-xl transition-all md:col-span-1">
        <span className="text-primary/70 text-sm font-bold block mb-2">총 시공 실적</span>
        <div className="text-4xl font-black text-primary">
          <span className="text-red-600">{stats.total}</span> 건
        </div>
      </div>
    </div>
  );
}
