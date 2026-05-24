// 1. Tarayıcı ve Vercel dostu güvenli COMPAT CDN linkleri (eval içermez)
import firebase from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js';
import 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js';
import 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js';

const firebaseConfig = {
  apiKey: "AIzaSyAJ-Fy5Qai4gAFBa55cGer8O3l8neMy2zI",
  authDomain: "caliskancanta-seller.firebaseapp.com",
  projectId: "caliskancanta-seller",
  storageBucket: "caliskancanta-seller.firebasestorage.app",
  messagingSenderId: "161310364502",
  appId: "1:161310364502:web:47d52c38df6a3f60c6bcf7"
};

// Firebase'i güvenli yöntemle başlatıyoruz
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

// Auth guard - sayfayı korur
export function requireAuth(callback) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      document.getElementById('loading-screen')?.remove();
      callback(user);
    } else {
      window.location.href = '/index.html';
    }
  });
}

export function logout() {
  auth.signOut().then(() => {
    window.location.href = '/index.html';
  });
}

// Diğer sayfaların (Vite/Webpack veya düz import modülleri) bozulmaması için eski fonksiyon isimlerini birebir dışa aktarıyoruz
const collection = (database, path) => database.collection(path);
const getDocs = (queryInstance) => queryInstance.get();
const addDoc = (collectionInstance, data) => collectionInstance.add(data);
const doc = (database, collPath, docId) => database.collection(collPath).doc(docId);
const updateDoc = (docInstance, data) => docInstance.update(data);
const deleteDoc = (docInstance) => docInstance.delete();

// onSnapshot, query ve orderBy fonksiyonlarını v8 yapısına uygun köprü olarak kuruyoruz
const query = (collectionInstance, ...constraints) => {
  let q = collectionInstance;
  constraints.forEach(constraint => {
    if (constraint && constraint.type === 'orderBy') {
      q = q.orderBy(constraint.field, constraint.direction);
    }
  });
  return q;
};
const orderBy = (field, direction = 'asc') => ({ type: 'orderBy', field, direction });
const onSnapshot = (queryInstance, callback) => queryInstance.onSnapshot(callback);

const signInWithEmailAndPassword = (authInstance, email, password) => authInstance.signInWithEmailAndPassword(email, password);
const onAuthStateChanged = (authInstance, callback) => authInstance.onAuthStateChanged(callback);

export { 
  db, 
  auth, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  signInWithEmailAndPassword, 
  onAuthStateChanged 
};