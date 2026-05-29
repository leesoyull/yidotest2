import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZQdV2UseeUN21YB44oW7x-NtWoRkhKQY",
  authDomain: "yidotest2.firebaseapp.com",
  projectId: "yidotest2",
  storageBucket: "yidotest2.firebasestorage.app",
  messagingSenderId: "849314346632",
  appId: "1:849314346632:web:d98204e05e75294efe913d",
  measurementId: "G-M0RTN77LVF"
};

// 파이어베이스 초기화
const app = initializeApp(firebaseConfig);

// 다른 관리자 페이지나 시공사례 화면에서 불러다 쓸 수 있도록 내보내기(export)
export const db = getFirestore(app);
export const storage = getStorage(app);

