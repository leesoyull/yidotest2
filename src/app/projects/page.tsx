
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  imageUrl: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedYear, setSelectedYear] = useState('전체');

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setProjects(projectData);
    });
    return () => unsubscribe();
  }, []);

  // 사장님이 원하셨던 필터링 로직 (년 글자 포함 여부 체크로 안전하게 보정)
  const filteredProjects = projects.filter((project) => {
    const matchCategory = selectedCategory === '전체' || project.category === selectedCategory;
    
    // DB에 '2025년'으로 들어가든 '2025'로 들어가든 둘 다 잡히도록 수정!
    const projectYearClean = project.year ? project.year.replace('년', '') : '';
    const matchYear = selectedYear === '전체' || projectYearClean === selectedYear;
    
    return matchCategory && matchYear;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">이도건설 시공 사례</h1>

      {/* 사장님 맞춤 필터 조작 버튼 영역 */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div className="flex items-center flex-wrap">
          <span className="font-semibold mr-2 text-gray-700">구분:</span>
          {['전체', '하자보수', '방수', '도장', '기타'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 m-1 rounded-full text-sm font-medium transition ${
                selectedCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat === '전체' ? '전체보기' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center flex-wrap">
          <span className="font-semibold mr-2 text-gray-700">연도:</span>
          {['전체', '2026', '2025', '2024'].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 m-1 rounded-full text-sm font-medium transition ${
                selectedYear === yr ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {yr === '전체' ? '전체' : `${yr}년`}
            </button>
          ))}
        </div>
      </div>

      {/* 사진 리스트 자동 출력 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center text-gray-500 col-span-3 py-16 bg-gray-50 rounded-xl border border-dashed">
            <p className="text-lg font-medium">해당 조건의 시공 사례가 아직 없습니다.</p>
            <p className="text-sm text-gray-400 mt-1">관리자 페이지에서 첫 사례를 등록해 보세요!</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-200">
              <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex gap-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{project.category}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {project.year.includes('년') ? project.year : `${project.year}년`}
                  </span>
                </div>
                <h3 className="text-base font-semibold mt-2.5 text-gray-900 line-clamp-2">{project.title}</h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}