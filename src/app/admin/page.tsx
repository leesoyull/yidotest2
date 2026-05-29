'use client';

import { useState } from 'react';
import { db, storage } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminPage() {
  // 로그인 보안용 상태
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 등록 폼 상태
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('2026');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // 로그인 체크
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'yido610' && password === 'yido610!') {
      setIsLoggedIn(true);
    } else {
      alert('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  // 시공사례 등록
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !title || !category) return alert('모든 항목을 입력하고 사진을 올려주세요!');

    setLoading(true);
    try {
      // 1. 이미지 저장
      const storageRef = ref(storage, `projects/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      // 2. Firestore 저장 (년 글자 빼고 숫자만 깔끔하게 저장)
      await addDoc(collection(db, 'projects'), {
        title,
        category,
        year: year.replace('년', ''),
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert('시공 사례가 성공적으로 등록되었습니다!');
      setTitle('');
      setImage(null);
      
      // 파일 입력창 초기화
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error(error);
      alert('업로드 중 오류가 발생했습니다. 파이어베이스 설정을 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 로그인 전 화면
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <form onSubmit={handleLogin} className="p-6 bg-white rounded-xl shadow-md w-full max-w-sm border">
          <h2 className="mb-6 text-xl font-bold text-center text-gray-800">이도건설 관리자 시스템</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="관리자 아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2.5 border rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border rounded-lg"
              required
            />
            <button type="submit" className="w-full p-2.5 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition">
              로그인
            </button>
          </div>
        </form>
      </div>
    );
  }

  // 로그인 성공 후 관리자 기능 화면
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-md border">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">새 시공 사례 등록</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">프로젝트 제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="예: 김포아파트 외벽 공사"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium text-gray-700">카테고리 선택</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-lg" required>
            <option value="">카테고리를 선택하세요</option>
            <option value="하자보수">하자보수</option>
            <option value="방수">방수</option>
            <option value="도장">도장</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">시공 연도</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-2 border rounded-lg">
            <option value="2026">2026년</option>
            <option value="2025">2025년</option>
            <option value="2024">2024년</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">시공 사진 첨부</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            className="w-full p-2 border rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 mt-4 text-white bg-blue-600 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? '업로드 중...' : '시공 사례 등록하기'}
        </button>
      </form>
    </div>
  );
}
