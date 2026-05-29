'use client';

import { useState } from 'react';
import { db, storage } from '@/firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('하자보수');
  const [year, setYear] = useState('2025');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !title) return alert('제목과 이미지를 모두 입력해주세요!');

    setLoading(true);
    try {
      // 1. 이미지 창고(Storage)에 사진 업로드
      const storageRef = ref(storage, `projects/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      // 2. 데이터베이스(Firestore)에 정보 저장 (카테고리, 연도 포함)
      await addDoc(collection(db, 'projects'), {
        title,
        category,
        year,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert('시공 사례가 성공적으로 등록되었습니다!');
      setTitle('');
      setImage(null);
    } catch (error) {
      console.error(error);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">새 시공 사례 등록</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">프로젝트 제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="예: OO아파트 대형 하자보수 공사"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">카테고리 선택</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="하자보수">하자보수</option>
            <option value="신축공사">신축공사</option>
            <option value="인테리어">인테리어</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">시공 연도</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="2026">2026년</option>
            <option value="2025">2025년</option>
            <option value="2024">2024년</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">시공 사진 첨부</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            className="mt-1 block w-full text-sm text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? '업로드 중...' : '시공 사례 등록하기'}
        </button>
      </form>
    </div>
  );
}
