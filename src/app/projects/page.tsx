'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/firebaseConfig';
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

  // 홈페이지 접속 시 파이어베이스 데이터베이스 실시간 연동 감지
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

  // 사장님이 원하셨던 [카테고리 + 시공연도] 자동 필터링 로직!
  const filteredProjects = projects.filter((project) => {
    const matchCategory = selectedCategory === '전체' || project.category === selectedCategory;
    const matchYear = selectedYear === '전체' || project.year === selectedYear;
    return matchCategory && matchYear;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">이도건설 시공 사례</h1>

      {/* 필터 조작 버튼 영역 */}
      <div className="flex flex-wrap gap-4 justify-center mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div className="flex items-center">
          <span className="font-semibold mr-2 text-gray-700">구분:</span>
          {['전체', '하자보수', '신축공사', '인테리어'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 m-1 rounded-full text-sm font-medium transition ${
                selectedCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center ml-4">
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
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{project.year}년</span>
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
