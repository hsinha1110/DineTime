import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9i4Gvknv7YN-tGzY2-yG1J5L2e8ZOCJk",
  authDomain: "dinetime-6b1d0.firebaseapp.com",
  projectId: "dinetime-6b1d0",
  storageBucket: "dinetime-6b1d0.firebasestorage.app",
  messagingSenderId: "70771562476",
  appId: "1:70771562476:web:3adc8ff3f221adf04792c9",
  measurementId: "G-6M8E8HPE3B",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
