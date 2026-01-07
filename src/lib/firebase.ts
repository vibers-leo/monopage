// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// 환경 변수가 제대로 있는지 확인
if (!firebaseConfig.apiKey) {
  console.warn(
    "⚠️ Firebase Config가 누락되었습니다. .env.local 파일을 확인해주세요.\n" +
    "기능이 제한된 상태로 실행됩니다."
  );
  
  // 더미 객체나 null 처리를 할 수도 있지만, 
  // 여기서는 타입 오류 방지를 위해 any 캐스팅을 하거나 조건부 export를 해야 함.
  // 하지만 가장 안전한 건 '앱은 실행되되, Firebase 기능 호출 시 에러' 상태로 두는 것보다
  // 초기화 자체를 막는 가드 절을 두는 것입니다.
}

try {
  // SSR 환경 중복 초기화 방지
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase 초기화 에러:", error);
}

export { app, auth, db, storage };
