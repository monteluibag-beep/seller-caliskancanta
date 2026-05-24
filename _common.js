// Firebase compat SDK
const firebaseConfig = {
  apiKey: "AIzaSyAJ-Fy5Qai4gAFBa55cGer8O3l8neMy2zI",
  authDomain: "caliskancanta-seller.firebaseapp.com",
  projectId: "caliskancanta-seller",
  storageBucket: "caliskancanta-seller.firebasestorage.app",
  messagingSenderId: "161310364502",
  appId: "1:161310364502:web:47d52c38df6a3f60c6bcf7"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

export function initPage(pageName, callback) {
  console.log("Firebase Auth başlatılıyor...");

  // onAuthStateChanged fonksiyonuna ikinci bir parametre olarak hata yakalayıcı ekliyoruz:
  auth.onAuthStateChanged((user) => {
    console.log("Auth durumu değişti, kullanıcı:", user);
    if (!user) { window.location.href = '/index.html'; return; }
    
    document.getElementById('loading-screen')?.remove();
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === pageName);
    });
    document.querySelectorAll('.bnav').forEach(el => {
      el.classList.toggle('active', el.dataset.page === pageName);
    });
    const av = document.getElementById('user-av');
    const name = document.getElementById('user-name');
    const email = document.getElementById('user-email');
    if(av) av.textContent = (user.email||'U').substring(0,2).toUpperCase();
    if(name) name.textContent = user.displayName || user.email.split('@')[0];
    if(email) email.textContent = user.email;
    callback(user);
    fetchRates();
    setInterval(fetchRates, 5*60*1000);
  }, (error) => {
    // EĞER FIREBASE BURADA ÇÖKÜYORSA HATAYI EKRANA VE KONSOLA BASACAK:
    console.error("Firebase Auth Hatası Yakalandı:", error);
    alert("Firebase Hatası: " + error.message);
    document.getElementById('loading-screen').innerHTML = `<p style="color:red; padding:20px;">Firebase Bağlantı Hatası: ${error.message}</p>`;
  });
}

window.doLogout = function() {
  auth.signOut().then(() => { window.location.href = '/index.html'; });
};

window.openDrawer = function() {
  document.getElementById('drawer')?.classList.add('open');
  document.getElementById('drawer-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeDrawer = function() {
  document.getElementById('drawer')?.classList.remove('open');
  document.getElementById('drawer-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
};

let rates = { USD:38.45, EUR:41.82, GBP:48.90 };
let prevRates = { USD:38.12, EUR:41.55, GBP:48.60 };

export function getRates() { return rates; }
export const fmt = n => '₺' + n.toLocaleString('tr-TR', {minimumFractionDigits:2, maximumFractionDigits:2});
export const fmtCur = (n, cur) => ({TRY:'₺',USD:'$',EUR:'€',GBP:'£'}[cur]) + n.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2});
export const toTRY = (n, cur) => cur==='TRY' ? n : n*(rates[cur]||1);

async function fetchRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/TRY');
    const data = await res.json();
    if(data.result === 'success') {
      prevRates = {...rates};
      rates.USD = parseFloat((1/data.rates.USD).toFixed(4));
      rates.EUR = parseFloat((1/data.rates.EUR).toFixed(4));
      rates.GBP = parseFloat((1/data.rates.GBP).toFixed(4));
    }
  } catch(e) {}
  updateRateUI();
}

function updateRateUI() {
  const timeStr = new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
  [{key:'USD',valId:'r-usd',chgId:'r-usd-c',mobId:'mob-usd'},{key:'EUR',valId:'r-eur',chgId:'r-eur-c',mobId:'mob-eur'},{key:'GBP',valId:'r-gbp',chgId:'r-gbp-c',mobId:null}].forEach(r => {
    const val=rates[r.key], prev=prevRates[r.key], diff=val-prev, pct=((diff/prev)*100).toFixed(2);
    const up=diff>=0, cls=up?'up':'dn', arrow=up?'▲':'▼';
    const ve=document.getElementById(r.valId), ce=document.getElementById(r.chgId);
    if(ve) ve.textContent='₺'+val.toFixed(2);
    if(ce) ce.innerHTML=`<span class="${cls}">${arrow}${Math.abs(pct)}%</span>`;
    if(r.mobId){const m=document.getElementById(r.mobId);if(m)m.textContent='₺'+val.toFixed(2);}
  });
  const t=document.getElementById('r-time');
  if(t) t.textContent=timeStr+' güncellendi';
}