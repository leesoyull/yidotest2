'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  year: string;
  imageUrl?: string;
  description?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const fixedCategories = ['전체', '하자보수', '방수', '도장', '기타'];

  useEffect(() => {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectList: ProjectItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        projectList.push({
          id: docSnap.id,
          title: data.title || '이름 없음',
          category: data.category || '기타',
          year: String(data.year || ''),
          imageUrl: data.imageUrl || '',
          description: data.description || data.location || '', 
        });
      });
      setProjects(projectList);
      setLoading(false);
    }, (error) => {
      console.error("데이터 로딩 실패:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProjects = selectedCategory === '전체'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* ⭐ [로고 업데이트] 메인 홈페이지와 100% 동일한 정식 로고 헤더 */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* 메인 로고 영역: 정식 집 모양 심볼 적용 */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              {/* 메인 홈페이지와 동일한 집 모양 SVG 아이콘 */}
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter text-primary">
              이도건설
            </span>
          </Link>

          {/* 내비게이션 메뉴 */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#about" className="text-gray-600 hover:text-primary font-bold text-sm transition-colors">회사소개</Link>
            <Link href="/#business" className="text-gray-600 hover:text-primary font-bold text-sm transition-colors">사업분야</Link>
            <Link href="/projects" className="text-primary font-bold text-sm border-b-2 border-primary pb-1">시공사례</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/#contact" 
              className="bg-primary hover:bg-primary/95 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              무료 견적 받기
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-5rem)]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-accent text-sm font-bold uppercase tracking-wider block mb-2">Portfolio</span>
            <h1 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">
              시공 사례
            </h1>
            <p className="mt-3 text-base text-muted-foreground font-medium">
              이도건설이 성실과 책임감으로 완공한 현장 목록입니다.
            </p>
          </div>

          {/* 고정 카테고리 탭 필터 */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {fixedCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'bg-white text-muted-foreground border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 시공사례 그리드 리스트 */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-200 shadow-sm max-w-xl mx-auto">
              <p className="text-muted-foreground font-bold">
                '{selectedCategory}' 카테고리에 등록된 시공 사례가 아직 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white rounded-[2rem] border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* 카드 상단 이미지 영역 */}
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">
                        이미지 준비중
                      </div>
                    )}
                    {project.year && (
                      <span className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm">
                        {project.year}년 시공
                      </span>
                    )}
                  </div>

                  {/* 카드 하단 텍스트 영역 */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-accent text-[10px] font-black tracking-widest uppercase block mb-1">
                        {project.category}
                      </span>
                      <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300 line-clamp-1">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
