// Firebase Config & Auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJ-Fy5Qai4gAFBa55cGer8O3l8neMy2zI",
  authDomain: "caliskancanta-seller.firebaseapp.com",
  projectId: "caliskancanta-seller",
  storageBucket: "caliskancanta-seller.firebasestorage.app",
  messagingSenderId: "161310364502",
  appId: "1:161310364502:web:47d52c38df6a3f60c6bcf7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Auth guard - sayfayı korur
export function requireAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById('loading-screen')?.remove();
      callback(user);
    } else {
      window.location.href = '/index.html';
    }
  });
}

export function logout() {
  signOut(auth).then(() => {
    window.location.href = '/index.html';
  });
}

export { db, auth, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, signInWithEmailAndPassword, onAuthStateChanged };
