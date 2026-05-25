// Firebase Authentication Management
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJ-Fy5Qai4gAFBa55cGer8O3l8neMy2zI",
  authDomain: "caliskancanta-seller.firebaseapp.com",
  projectId: "caliskancanta-seller",
  storageBucket: "caliskancanta-seller.firebasestorage.app",
  messagingSenderId: "161310364502",
  appId: "1:161310364502:web:47d52c38df6a3f60c6bcf7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Persistence ayarla
await setPersistence(auth, browserLocalPersistence).catch(e => console.warn("Persistence hatası:", e));

console.log("✅ Firebase initialized");

let currentUser = null;
let authCallbacks = [];

// Auth state listener
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  console.log("🔐 Auth state changed:", user ? user.email : "No user");
  
  // Tüm callback'leri çağır
  authCallbacks.forEach(callback => callback(user));
});

/**
 * Kullanıcı giriş yapmış mı kontrol et
 * @param {Function} callback - Kullanıcı bilgisi ile çağrılacak fonksiyon
 */
export function requireAuth(callback) {
  // Loading screen'i kapat
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) loadingScreen.style.display = 'none';
  
  if (currentUser) {
    // Zaten login'di
    callback(currentUser);
    console.log("✅ User already authenticated:", currentUser.email);
  } else {
    // Login'i bekle (callback'i çalıştırmadan yapılacak yok)
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsub();
        callback(user);
        console.log("✅ User authenticated:", user.email);
      }
    });
  }
}

/**
 * Kullanıcı giriş yap
 */
export async function login(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Login successful:", result.user.email);
    return result.user;
  } catch (error) {
    console.error("❌ Login failed:", error.message);
    throw error;
  }
}

/**
 * Kullanıcı çıkış yap
 */
export async function logout() {
  try {
    await signOut(auth);
    console.log("✅ Logout successful");
    window.location.href = '/index.html';
  } catch (error) {
    console.error("❌ Logout failed:", error.message);
    throw error;
  }
}

/**
 * Güncel kullanıcı bilgisini al
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Auth durumunu dinle
 */
export function onAuthChange(callback) {
  authCallbacks.push(callback);
  return () => {
    authCallbacks = authCallbacks.filter(cb => cb !== callback);
  };
}
