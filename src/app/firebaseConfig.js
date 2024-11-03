// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCADR2zOd5AJI4FFr7q18eg3PS2vdzMfHQ",
  authDomain: "bitcode-254c2.firebaseapp.com",
  projectId: "bitcode-254c2",
  storageBucket: "bitcode-254c2.firebasestorage.app",
  messagingSenderId: "757918649331",
  appId: "1:757918649331:web:d4635e9a969a07d3c06086",
  measurementId: "G-DVFK7VR62Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };