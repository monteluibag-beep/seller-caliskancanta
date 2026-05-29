// Ortak JS — Firebase Auth + Drawer + Rates
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

export { app };

// Auth guard + sayfa başlatma
export function initPage(pageName, callback) {
  onAuthStateChanged(auth, (user) => {
    const loading = document.getElementById('loading-screen');
    if (!user) {
      window.location.href = '/index.html';
      return;
    }
    if (loading) loading.style.display = 'none';

    // Aktif nav
    document.querySelectorAll('.nav-item[data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === pageName);
    });
    document.querySelectorAll('.bnav[data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === pageName);
    });

    // Kullanıcı bilgisi
    const initials = (user.email||'U').substring(0,2).toUpperCase();
    ['user-av','user-av-d'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=initials; });
    ['user-name','user-name-d'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=user.displayName||user.email.split('@')[0]; });
    ['user-email','user-email-d'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=user.email; });

    if (callback) callback(user);
    fetchRates();
    setInterval(fetchRates, 5 * 60 * 1000);

    // Hamburger sidebar
    initSidebarCollapse();
  });
}

// Logout
window.doLogout = function() {
  signOut(auth).then(() => { window.location.href = '/index.html'; });
};

// Drawer
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

// ── HAMBURGER SIDEBAR COLLAPSE ──
function initSidebarCollapse() {
  const sidebar = document.querySelector('aside.sidebar');
  if (!sidebar) return;

  // 1. sidebar-brand içini yeniden düzenle
  const brand = sidebar.querySelector('.sidebar-brand');
  if (brand) {
    // Mevcut içeriği brand-info'ya taşı
    const existingHTML = brand.innerHTML;
    brand.innerHTML = `
      <div class="brand-info">${existingHTML}</div>
      <button class="sidebar-toggle" id="sidebar-toggle" title="Daralt / Genişlet">
        <svg class="hamburger-icon" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect class="line line-1" x="0" y="0"  width="18" height="2" rx="1" fill="currentColor"/>
          <rect class="line line-2" x="0" y="6"  width="14" height="2" rx="1" fill="currentColor"/>
          <rect class="line line-3" x="0" y="12" width="10" height="2" rx="1" fill="currentColor"/>
        </svg>
      </button>`;
  }

  // 2. Nav item'lardaki metin node'larını span.nav-text'e al + data-label ekle
  sidebar.querySelectorAll('.nav-item[data-page]').forEach(item => {
    // İkon dışındaki text node'u bul
    item.childNodes.forEach(node => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        const label = node.textContent.trim();
        item.setAttribute('data-label', label);
        const span = document.createElement('span');
        span.className = 'nav-text';
        span.textContent = label;
        node.replaceWith(span);
      }
    });
    // Varsa zaten span içindeyse data-label ekle
    if (!item.dataset.label) {
      const txt = item.querySelector('span, .nav-text');
      if (txt) item.setAttribute('data-label', txt.textContent.trim());
    }
  });

  // 3. Toggle butonu
  const btn = document.getElementById('sidebar-toggle');
  if (!btn) return;

  // Kayıtlı durum
  if (localStorage.getItem('sb-collapsed') === '1') {
    sidebar.classList.add('collapsed');
  }

  btn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sb-collapsed', sidebar.classList.contains('collapsed') ? '1' : '0');
  });
}

// Döviz kurları
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
