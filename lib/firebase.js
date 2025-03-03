import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmzG-u57t0tmLI0N-6Dvr3kTlRuKk-LkU",
  authDomain: "estee-gold-studio.firebaseapp.com",
  projectId: "estee-gold-studio",
  storageBucket: "estee-gold-studio.firebasestorage.app",
  messagingSenderId: "259875063589",
  appId: "1:259875063589:web:0c95ff3bcf2bc590e37ccc",
  measurementId: "G-4W9HCNDZQX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
