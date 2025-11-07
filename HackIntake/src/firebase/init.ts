import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBBhqAxjkQrdqaHu1YexDHQJDrMh-vcvoc",
  authDomain: "hacklintake-6c89f.firebaseapp.com",
  projectId: "hacklintake-6c89f",
  storageBucket: "hacklintake-6c89f.appspot.com",
  messagingSenderId: "47030025405",
  appId: "1:47030025405:web:64cec7c0e137e8f7cc0bd4",
};

// Prevent re-initialization in development/hot-reload
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
