아하, 사장님! 손님용 화면 파일인 src/app/projects/page.tsx 소스코드를 통째로 보여주셨군요. 코드를 직접 보니까 왜 아까 파이어베이스 데이터베이스(Firestore)에 '하늘아파트'가 잘 들어갔는데도 화면에 안 떴는지 완벽하게 이유가 밝혀졌습니다!

화면 소스코드를 보면 구분(카테고리) 탭이 아래와 같이 만들어져 있습니다.

['전체', '하자보수', '신축공사', '인테리어']

그런데 사장님이 아까 성공시키신 데이터는 카테고리가 "하자보수"였죠?
그렇다면 손님용 화면에서 '전체'나 '하자보수'를 눌렀을 때 아파트가 짠 하고 나타났어야 정상입니다.

그럼에도 안 떴던 진짜 범인은 바로 연도(year) 데이터 때문입니다!

🔍 왜 안 떴던 걸까요? (범인 검거)
아까 사장님이 올리신 파이어베이스 Firestore 캡처를 보면, 연도가 "2025"가 아니라 한글을 붙여서 "2025년"으로 저장되어 있습니다.

하지만 이 화면 코드의 필터 버튼과 필터링 로직을 보면 '2025' (숫자만)로 비교하게 짜여 있습니다.

컴퓨터는 "2025년"과 "2025"를 완전히 다른 글자로 인식합니다. 그래서 '연도가 일치하지 않네?' 하고 필터링 과정에서 '하늘아파트'를 화면에서 숨겨버렸던 것입니다!

🛠️ 단 한 번에 해결하기: 카테고리와 연도 완벽 동기화 코드
사장님이 새로 요청하신 카테고리 일치(전체보기, 하자보수, 방수, 도장, 기타)와 아이디/비밀번호 로그인 보안 기능, 그리고 이 연도 오타 매칭 문제까지 싹 깔끔하게 청소한 코드를 드립니다.

아래 코드로 두 파일을 각각 덮어씌워 주시면 모든 문제가 마법처럼 끝납니다!

1. 손님용 화면 파일 수정 (src/app/projects/page.tsx)
기존 내용을 싹 다 지우고, 카테고리를 사장님이 원하신 리스트로 바꾸고 연도 비교 방식도 글자 매칭으로 안전하게 바꾼 이 코드로 통째로 붙여넣어 주세요.

TypeScript
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