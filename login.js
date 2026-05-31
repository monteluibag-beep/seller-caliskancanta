// Firebase Konfigürasyonu
const firebaseConfig = {
  apiKey: "AIzaSyAJ-Fy5Qai4gAFBa55cGer8O3l8neMy2zI",
  authDomain: "caliskancanta-seller.firebaseapp.com",
  projectId: "caliskancanta-seller",
  storageBucket: "caliskancanta-seller.firebasestorage.app",
  messagingSenderId: "161310364502",
  appId: "1:161310364502:web:47d52c38df6a3f60c6bcf7"
};

// Başlatma
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Zaten giriş yapılmışsa direkt içeri al
auth.onAuthStateChanged((user) => {
  if (user) window.location.href = '/dashboard.html';
});

// Giriş Tetikleyicisi
async function doLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const btn = document.gaetElementById('login-btn');
  const err = document.getElementById('error-msg');
  const errText = document.getElementById('error-text');

  if (!email || !password) {
    errText.textContent = 'Email ve şifre zorunludur.';
    err.classList.add('show');
    return;
  }

  err.classList.remove('show');
  btn.innerHTML = '<i class="ti ti-loader"></i> Giriş yapılıyor...';
  btn.disabled = true;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = '/dashboard.html';
  } catch(e) {
    btn.innerHTML = '<i class="ti ti-login"></i> Giriş Yap';
    btn.disabled = false;
    let msg = 'Giriş başarısız.';
    if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password') msg = 'Email veya şifre hatalı.';
    if (e.code === 'auth/user-not-found') msg = 'Kullanıcı bulunamadı.';
    if (e.code === 'auth/too-many-requests') msg = 'Çok fazla deneme. Lütfen bekleyin.';
    errText.textContent = msg;
    err.classList.add('show');
  }
}

// Sayfa tamamen yüklendiğinde butonları ve tuşları bağla
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', doLogin);
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doLogin();
  });
});