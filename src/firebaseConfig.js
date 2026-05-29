import { initializeApp, getApps, getApp } from "firebase/app";
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

// [안전장치 추가] 이미 연결되어 있으면 기존 연결을 쓰고, 없으면 새로 초기화해라!
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

// 자바스크립트가 바로 알아듣는 쉬운 방식으로 변경!
if (typeof window !== "undefined") {
  window.db = db;
  window.storage = storage;
}
