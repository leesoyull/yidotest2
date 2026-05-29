
'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Home/Footer';
import { SectionReveal, RevealItem } from '@/components/SectionReveal';

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  imageUrl: string;
  location?: string;
  createdAt: any;
}

export default function ProjectsPage() {
  const db = useFirestore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedYear, setSelectedYear] = useState('전체');

  useEffect(() => {
    // 인스턴스 중복 방지를 위해 통합된 useFirestore를 사용합니다.
    const q = collection(db, 'projects');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      
      // 최신 등록 순으로 정렬
      setProjects(projectData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    });
    return () => unsubscribe();
  }, [db]);

  const filteredProjects = projects.filter((project) => {
    const projectYearClean = project.year ? project.year.replace('년', '') : '';
    const matchCategory = selectedCategory === '전체' || project.category === selectedCategory;
    const matchYear = selectedYear === '전체' || projectYearClean === selectedYear;
    return matchCategory && matchYear;
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-24">
        <SectionReveal className="py-0">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <RevealItem>
                <span className="text-accent font-bold text-xs tracking-widest uppercase">Performance & Portfolio</span>
              </RevealItem>
              <RevealItem delay={100}>
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">이도건설 시공 사례</h2>
              </RevealItem>
              <RevealItem delay={200}>
                <p className="text-muted-foreground text-base font-light">
                  정직한 마음과 숙련된 기술로 완수해온 이도건설의 발자취입니다.<br/>
                  각 연도별, 분야별 시공 내역을 투명하게 공개합니다.
                </p>
              </RevealItem>
            </div>

            <div className="flex flex-col gap-6 mb-16 bg-muted/30 p-8 rounded-[2rem] border border-muted/50">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <span className="font-bold text-primary text-sm min-w-[60px]">시공 분야</span>
                <div className="flex flex-wrap gap-2">
                  {['전체', '하자보수', '방수', '도장', '기타'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                        selectedCategory === cat 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-white text-muted-foreground border hover:border-accent hover:text-accent'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <span className="font-bold text-primary text-sm min-w-[60px]">시공 연도</span>
                <div className="flex flex-wrap gap-2">
                  {['전체', '2026', '2025'].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setSelectedYear(yr)}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedYear === yr 
                        ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                        : 'bg-white text-muted-foreground border hover:bg-muted'
                      }`}
                    >
                      {yr === '전체' ? '전체 연도' : `${yr}년`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="text-center py-32 bg-muted/10 rounded-[3rem] border-2 border-dashed border-muted">
                <p className="text-lg font-bold text-primary/50">해당 조건의 시공 사례가 아직 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, i) => (
                  <RevealItem key={project.id} delay={i * 50} className="group">
                    <div className="bg-white rounded-[2rem] overflow-hidden border border-muted shadow-sm hover:shadow-2xl transition-all duration-500">
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                          {project.category}
                        </div>
                        <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full">
                          {project.year.includes('년') ? project.year : `${project.year}년`}
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="text-xl font-black text-primary group-hover:text-accent transition-colors line-clamp-2 min-h-[3.5rem] mb-4">
                          {project.title}
                        </h3>
                        <div className="flex justify-between items-center pt-6 border-t border-muted">
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Construction Completed</span>
                          <span className="text-accent group-hover:translate-x-2 transition-transform">→</span>
                        </div>
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </div>
            )}
          </div>
        </SectionReveal>
      </div>
      <Footer />
    </main>
  );
}
