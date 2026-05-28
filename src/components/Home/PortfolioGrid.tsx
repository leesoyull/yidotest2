
"use client"

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { RevealItem } from '../SectionReveal';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';

const categories = ['전체', '하자보수', '방수', '도장', '기타'];
const years = ['전체', '2025', '2026'];

export function PortfolioGrid() {
  const db = useFirestore();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [catFilter, setCatFilter] = useState('전체');
  const [yearFilter, setYearFilter] = useState('전체');

  const portfolioQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, 'portfolios');
  }, [db]);

  const { data: rawPortfolios, loading } = useCollection(portfolioQuery);

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setCatFilter(categoryParam);
    } else {
      setCatFilter('전체');
    }
  }, [categoryParam]);

  const filteredWorks = useMemo(() => {
    if (!rawPortfolios) return [];
    
    // 메모리에서 최신순 정렬 후 필터링 적용
    const sorted = [...rawPortfolios].sort((a: any, b: any) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });

    return sorted.filter(w => {
      const matchCat = catFilter === '전체' || w.category === catFilter;
      const matchYear = yearFilter === '전체' || w.year === yearFilter;
      return matchCat && matchYear;
    });
  }, [rawPortfolios, catFilter, yearFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground font-bold text-sm">시공 사례를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        {/* Category Selector */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold transition-all border",
                catFilter === cat 
                  ? "bg-primary text-white border-primary shadow-lg" 
                  : "bg-white text-muted-foreground border-muted hover:border-accent hover:text-accent"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Year Selector */}
        <div className="flex flex-wrap justify-center gap-2">
          {years.map(yr => (
            <button
              key={yr}
              onClick={() => setYearFilter(yr)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-black transition-all border",
                yearFilter === yr 
                  ? "bg-accent text-white border-accent shadow-md" 
                  : "bg-white text-muted-foreground border-muted hover:bg-muted"
              )}
            >
              {yr === '전체' ? '전체 연도' : `${yr}년`}
            </button>
          ))}
        </div>
      </div>

      {filteredWorks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorks.map((work, i) => (
            <RevealItem key={work.id} delay={i * 100} className="group">
              <div className="bg-white rounded-3xl overflow-hidden border shadow-sm group-hover:shadow-xl transition-all duration-500">
                <div className="relative h-64 overflow-hidden bg-muted/20">
                  {work.imageUrl && (
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {work.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full">
                    {work.year}년 실적
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[10px] text-accent font-black mb-2 uppercase tracking-tight">{work.subText || '전국 시공 지원'}</div>
                  <h4 className="text-xl font-black text-primary group-hover:text-accent transition-colors mb-4 line-clamp-1">{work.title}</h4>
                  <div className="flex justify-between items-center pt-4 border-t border-muted">
                     <span className="text-[10px] text-muted-foreground font-bold">시공 완료</span>
                     <span className="text-primary group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
          <h3 className="text-xl font-bold text-primary">해당 조건의 시공 사례가 없습니다.</h3>
          <p className="text-sm text-muted-foreground mt-2">관리자 페이지에서 시공 사례를 등록해 보세요.</p>
        </div>
      )}
    </div>
  );
}
