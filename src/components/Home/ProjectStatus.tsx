
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export function ProjectStatus() {
  const [yearlyStats, setYearlyStats] = useState<{ [key: string]: number }>({});
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // siteSettings 컬렉션의 stats 문서 정밀 조준
    const statsDocRef = doc(db, 'siteSettings', 'stats');
    
    const unsubscribe = onSnapshot(statsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // 파이어베이스 스토리지 상의 'yearlyStats' 객체 추출
        const firebaseYearlyStats = data.yearlyStats || {};
        
        const tempStats: { [key: string]: number } = {};
        let calcTotal = 0;

        Object.keys(firebaseYearlyStats).forEach((key) => {
          // 키 값에서 숫자 4자리 추출
          const yearMatch = key.match(/\d{4}/);
          if (!yearMatch) return;

          const year = yearMatch[0];
          const count = Number(firebaseYearlyStats[key]) || 0;

          if (count > 0) {
            tempStats[year] = (tempStats[year] || 0) + count;
            calcTotal += count;
          }
        });

        // 연도 오름차순 정렬
        const sortedStats = Object.keys(tempStats)
          .sort((a, b) => Number(a) - Number(b))
          .reduce((acc, key) => {
            acc[key] = tempStats[key];
            return acc;
          }, {} as { [key: string]: number });

        setYearlyStats(sortedStats);
        setTotalCount(calcTotal);
      }
      setLoading(false);
    }, (error) => {
      console.error("실적 데이터 동기화 실패:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const activeYears = Object.keys(yearlyStats);

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      {activeYears.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-muted/5 rounded-[2rem] border border-dashed">
          등록된 시공 실적이 없습니다. 
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(activeYears.length + 1, 4)} gap-6 justify-center`}>
          
          {/* 동적 연도 카드 */}
          {activeYears.map((year) => (
            <div 
              key={year} 
              className="bg-white p-8 rounded-[2rem] border border-muted/70 text-center shadow-sm hover:shadow-md transition-all duration-300"
            >
              <span className="text-muted-foreground text-sm font-semibold block mb-2">{year}년 누적 실적</span>
              <div className="text-4xl font-black text-primary">
                <span className="text-accent">{yearlyStats[year]}</span> 건
              </div>
            </div>
          ))}

          {/* 총계 누적 카드 */}
          <div 
            className="bg-primary/[0.02] p-8 rounded-[2rem] border border-primary/20 text-center shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <span className="text-primary/70 text-sm font-bold block mb-2">전체 누적 실적</span>
            <div className="text-4xl font-black text-primary">
              <span className="text-red-600">{totalCount}</span> 건
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
