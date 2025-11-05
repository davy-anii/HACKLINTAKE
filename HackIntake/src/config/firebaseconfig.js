// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6oEE8d8Z_py9Rqbaho5wn_SzgbxQMRcY",
  authDomain: "hacklintake-e64f2.firebaseapp.com",
  projectId: "hacklintake-e64f2",
  storageBucket: "hacklintake-e64f2.firebasestorage.app",
  messagingSenderId: "774228829651",
  appId: "1:774228829651:web:0102777a6a69d30584bb26",
  measurementId: "G-9EHWRMYP3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);