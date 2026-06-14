import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, setDoc, updateDoc, query, where, serverTimestamp, deleteDoc, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Replace with actual Firebase config from your project settings
const firebaseConfig = {
  apiKey: "AIzaSyA1VfXU3_-83dBc6Vdg1sTEiZDTpju6eJo",
  authDomain: "xenolyth-f6baa.firebaseapp.com",
  projectId: "xenolyth-f6baa",
  storageBucket: "xenolyth-f6baa.firebasestorage.app",
  messagingSenderId: "253188212810",
  appId: "1:253188212810:web:7a64aae2503d60945cfeb3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  auth, 
  db, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  setDoc,
  updateDoc,
  deleteDoc,
  query, 
  where,
  orderBy,
  serverTimestamp
};
