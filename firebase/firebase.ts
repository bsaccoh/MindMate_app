import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCJe6hKxlbCRIWB9qiRE1-ddkplg9BwD-o",
  authDomain: "ecotrack-e27d0.firebaseapp.com",
  projectId: "ecotrack-e27d0",
  storageBucket: "ecotrack-e27d0.firebasestorage.app",
  messagingSenderId: "123529972193",
  appId: "1:123529972193:web:b6ab61312ad2fc629d6aa0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);