import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA1VfXU3_-83dBc6Vdg1sTEiZDTpju6eJo",
  authDomain: "xenolyth-f6baa.firebaseapp.com",
  projectId: "xenolyth-f6baa",
  storageBucket: "xenolyth-f6baa.firebasestorage.app",
  messagingSenderId: "253188212810",
  appId: "1:253188212810:web:7a64aae2503d60945cfeb3"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
