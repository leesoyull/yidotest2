
"use client"

import { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { RevealItem } from '../SectionReveal';

const categories = ['전체', '하자보수', '방수', '도장', '기타'];

const works = [
  { id: 1, cat: '하자보수', title: '아파트 외벽 균열 보수', sub: '공동주택 · 경기도', img: 'port-crack-repair' },
  { id: 2, cat: '방수', title: '옥상 우레탄 방수 공사', sub: '상업시설 · 경기도', img: 'port-waterproofing' },
  { id: 3, cat: '도장', title: '빌라 외벽 도장 리뉴얼', sub: '다세대주택 · 경기도', img: 'port-painting' },
  { id: 4, cat: '하자보수', title: '지하주차장 누수 보수', sub: '공동주택 · 경기도', img: 'port-parking-leak' },
  { id: 5, cat: '방수', title: '욕실 방수 재시공', sub: '주거시설 · 경기도', img: 'port-bathroom' },
  { id: 6, cat: '기타', title: '타일 탈락 교체 보수', sub: '상업시설 · 경기도', img: 'port-tile-repair' },
];

export function PortfolioGrid() {
  const [filter, setFilter] = useState('전체');

  const filteredWorks = works.filter(w => filter === '전체' || w.cat === filter);

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
          <RevealItem key={work.id} delay={i * 100} className="group cursor-pointer">
            <div className="bg-white rounded-2xl overflow-hidden border shadow-sm group-hover:shadow-xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={PlaceHolderImages.find(p => p.id === work.img)?.imageUrl || ''}
                  alt={work.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  data-ai-hint={PlaceHolderImages.find(p => p.id === work.img)?.imageHint}
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {work.cat}
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs text-accent font-bold mb-2 uppercase tracking-tight">{work.sub}</div>
                <h4 className="text-lg font-bold text-primary group-hover:text-accent transition-colors mb-4">{work.title}</h4>
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
