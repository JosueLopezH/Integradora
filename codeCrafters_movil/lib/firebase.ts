// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyDhiDuWlVeTTvHHp4ljgnRrwX_GA4xVOzI",
  authDomain: "casilleros-1721c.firebaseapp.com",
  projectId: "casilleros-1721c",
  storageBucket: "casilleros-1721c.firebasestorage.app",
  messagingSenderId: "201214396056",
  appId: "1:201214396056:web:cd12e3711790c5ab0132ed",
  measurementId: "G-XH9K0H3DKZ"
};


// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);

// Inicializa Firestore
export const firebase_db = getFirestore(firebase); // Asegúrate de exportar db

export const analytics = getAnalytics(firebase);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(firebase);