
"use client"

import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { RevealItem } from '../SectionReveal';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { MapPin } from 'lucide-react';

const categories = ['전체', '하자보수', '방수', '도장', '기타'];
const years = ['전체', '2025', '2026'];

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  imageUrl: string;
  location?: string;
  createdAt: any;
}

export function PortfolioGrid() {
  const db = useFirestore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('전체');
  const [yearFilter, setYearFilter] = useState('전체');

  useEffect(() => {
    // 인덱스 오류 방지를 위해 단순 쿼리 후 클라이언트 사이드 정렬
    const projectsRef = collection(db, 'projects');
    const unsubscribe = onSnapshot(projectsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Project[];
      
      // 최신순 정렬 (createdAt 기준)
      const sortedData = data.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      
      setProjects(sortedData);
      setLoading(false);
    }, (error) => {
      console.error("Portfolio fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const filteredWorks = useMemo(() => {
    return projects.filter(w => {
      const matchCat = catFilter === '전체' || w.category === catFilter;
      const matchYear = yearFilter === '전체' || w.year === yearFilter;
      return matchCat && matchYear;
    });
  }, [projects, catFilter, yearFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground font-bold">시공 사례를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-6 bg-muted/20 p-8 rounded-[2rem] border border-muted">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold transition-all border",
                catFilter === cat 
                  ? "bg-primary text-white border-primary shadow-lg" 
                  : "bg-white text-muted-foreground hover:border-accent"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {years.map(yr => (
            <button
              key={yr}
              onClick={() => setYearFilter(yr)}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-black transition-all border",
                yearFilter === yr 
                  ? "bg-accent text-white border-accent shadow-md" 
                  : "bg-white text-muted-foreground hover:bg-muted"
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
            <RevealItem key={work.id} delay={i * 50} className="group">
              <div className="bg-white rounded-[2rem] overflow-hidden border shadow-sm group-hover:shadow-xl transition-all duration-500">
                <div className="relative h-64 overflow-hidden bg-muted/10">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">{work.category}</div>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full">{work.year}년</div>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-black text-primary group-hover:text-accent transition-colors mb-4 line-clamp-1">{work.title}</h4>
                  <div className="flex justify-between items-center pt-4 border-t border-muted">
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {work.location || '전국 시공'}
                    </span>
                    <span className="text-primary group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-muted/10 rounded-[3rem] border-2 border-dashed border-muted">
          <p className="font-bold text-primary/50">등록된 시공 사례가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
