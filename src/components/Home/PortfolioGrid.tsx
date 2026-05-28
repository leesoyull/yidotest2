
"use client"

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { RevealItem } from '../SectionReveal';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';

const categories = ['전체', '하자보수', '방수', '도장', '기타'];

export function PortfolioGrid() {
  const db = useFirestore();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [filter, setFilter] = useState('전체');

  const portfolioQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: portfolios, loading } = useCollection(portfolioQuery);

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setFilter(categoryParam);
    } else {
      setFilter('전체');
    }
  }, [categoryParam]);

  const filteredWorks = useMemo(() => {
    if (!portfolios) return [];
    return portfolios.filter(w => filter === '전체' || w.category === filter);
  }, [portfolios, filter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground font-bold text-sm">시공 사례를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="text-center py-32 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
        <div className="mb-4">
          <Image
            src="https://picsum.photos/seed/empty/200/200"
            alt="No items"
            width={100}
            height={100}
            className="mx-auto opacity-20 grayscale"
          />
        </div>
        <h3 className="text-xl font-bold text-primary">등록된 시공 사례가 없습니다.</h3>
        <p className="text-sm text-muted-foreground mt-2">관리자 페이지에서 첫 사례를 등록해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-bold transition-all border",
              filter === cat 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "bg-white text-muted-foreground border-muted hover:border-accent hover:text-accent"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredWorks.map((work, i) => (
          <RevealItem key={work.id} delay={i * 100} className="group">
            <div className="bg-white rounded-2xl overflow-hidden border shadow-sm group-hover:shadow-xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={work.imageUrl}
                  alt={work.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {work.category}
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs text-accent font-bold mb-2 uppercase tracking-tight">{work.subText}</div>
                <h4 className="text-lg font-bold text-primary group-hover:text-accent transition-colors mb-4 line-clamp-1">{work.title}</h4>
                <div className="flex justify-between items-center pt-4 border-t border-muted">
                   <span className="text-[10px] text-muted-foreground font-medium">시공 완료</span>
                   <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </RevealItem>
        ))}
      </div>
    </div>
  );
}
