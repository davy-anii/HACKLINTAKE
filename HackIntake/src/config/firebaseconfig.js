// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBhqAxjkQrdqaHu1YexDHQJDrMh-vcvoc",
  authDomain: "hacklintake-6c89f.firebaseapp.com",
  projectId: "hacklintake-6c89f",
  storageBucket: "hacklintake-6c89f.firebasestorage.app",
  messagingSenderId: "47030025405",
  appId: "1:47030025405:web:64cec7c0e137e8f7cc0bd4",
  measurementId: "G-7TWXX8QL5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);