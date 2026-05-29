'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

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

  useEffect(() => {
    // 1. 구글 파이어베이스의 'projects' 방을 생성일자(createdAt) 최신순으로 정렬해서 감시 시작
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectList: ProjectItem[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        
        // 2. 사장님이 확인해주신 진짜 데이터베이스 필드명과 100% 일치시켜 매칭
        projectList.push({
          id: docSnap.id,
          title: data.title || '이름 없음',       // 'title' 필드 맵핑
          category: data.category || '기타',     // 'category' 필드 맵핑
          year: String(data.year || ''),           // 'year' 필드 맵핑
          imageUrl: data.imageUrl || '',           // 'imageUrl' 필드 맵핑
          description: data.description || data.location || '', 
        });
      });

      setProjects(projectList);
      setLoading(false);
    }, (error) => {
      console.error("시공사례 로딩 실패:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = ['전체', ...Array.from(new Set(projects.map((p) => p.category)))];

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
    <div className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-accent text-sm font-bold uppercase tracking-wider block mb-2">Portfolio</span>
          <h1 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">
            시공 사례
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-medium">
            이도건설이 성실과 책임감으로 완공한 현장 목록입니다.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-white text-muted-foreground border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-gray-200 shadow-sm max-w-xl mx-auto">
            <p className="text-muted-foreground font-medium">선택하신 카테고리의 시공 사례가 아직 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-[2rem] border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1.5">
                      <span className="text-xs font-semibold">이미지 준비중</span>
                    </div>
                  )}
                  {project.year && (
                    <span className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {project.year}년 시공
                    </span>
                  )}
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-accent text-xs font-bold tracking-wide uppercase block mb-1">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300 line-clamp-1">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 font-medium">
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
    </div>
  );
}
