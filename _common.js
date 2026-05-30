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

const LOGO_B64 = "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";

export function initPage(pageName, callback) {
  onAuthStateChanged(auth, (user) => {
    const loading = document.getElementById('loading-screen');
    if (!user) { window.location.href = '/index.html'; return; }
    if (loading) loading.style.display = 'none';

    document.querySelectorAll('.nav-item[data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === pageName);
    });
    document.querySelectorAll('.bnav[data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === pageName);
    });

    const initials = (user.email||'U').substring(0,2).toUpperCase();
    ['user-av','user-av-d'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=initials; });
    ['user-name','user-name-d'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=user.displayName||user.email.split('@')[0]; });
    ['user-email','user-email-d'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=user.email; });

    if (callback) callback(user);
    fetchRates();
    setInterval(fetchRates, 5 * 60 * 1000);
    initSidebar();
  });
}

window.doLogout = function() {
  signOut(auth).then(() => { window.location.href = '/index.html'; });
};

// Çıkış butonlarını dinle
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-logout-trigger, .sidebar-logout-btn, [data-action="doLogout"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      signOut(auth).then(() => { window.location.href = '/index.html'; });
    });
  });
});
// drawer fonksiyonları initSidebar içinde tanımlı

function initSidebar() {
  const sidebar = document.querySelector('aside.sidebar');
  if (!sidebar) return;

  const brand = sidebar.querySelector('.sidebar-brand');
  if (brand) {
    // Logoyu ekle (sadece yoksa)
    if (!brand.querySelector('img.cc-logo')) {
      const img = document.createElement('img');
      img.src = 'data:image/png;base64,' + LOGO_B64;
      img.className = 'cc-logo';
      img.alt = 'Çalışkan Çanta';
      img.style.cssText = 'height:32px;max-width:160px;object-fit:contain;display:block;flex:1;min-width:0';
      brand.innerHTML = '';
      brand.appendChild(img);
    }

    // Toggle butonunu ekle (sadece yoksa)
    if (!brand.querySelector('.sidebar-toggle')) {
      const btn = document.createElement('button');
      btn.id = 'sidebar-toggle';
      btn.className = 'sidebar-toggle';
      btn.title = 'Daralt';
      btn.innerHTML = '<svg width="18" height="14" viewBox="0 0 18 14" fill="none"><rect x="0" y="0" width="18" height="2" rx="1" fill="currentColor"/><rect x="0" y="6" width="14" height="2" rx="1" fill="currentColor"/><rect x="0" y="12" width="10" height="2" rx="1" fill="currentColor"/></svg>';
      brand.appendChild(btn);
    }
  }

  // Nav item text'leri span'a al
  sidebar.querySelectorAll('.nav-item[data-page]').forEach(item => {
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
  });

  // Toggle event
  const btn = document.getElementById('sidebar-toggle');
  if (btn) {
    if (localStorage.getItem('sb-collapsed') === '1') sidebar.classList.add('collapsed');
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('sb-collapsed', sidebar.classList.contains('collapsed') ? '1' : '0');
    });
  }

  // Drawer event listeners - tüm sayfalarda çalışsın
  function openDrawer() {
    document.getElementById('drawer')?.classList.add('open');
    document.getElementById('drawer-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    document.getElementById('drawer')?.classList.remove('open');
    document.getElementById('drawer-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Hamburger - mob topbar
  document.querySelectorAll('[data-action="openDrawer"], .hamburger, #btn-open-drawer-mob').forEach(el => {
    el.addEventListener('click', openDrawer);
  });

  // Bottom nav "Daha" butonu
  const drawerBottom = document.getElementById('btn-open-drawer-bottom');
  if (drawerBottom) drawerBottom.addEventListener('click', openDrawer);

  // Drawer kapat
  document.querySelectorAll('[data-action="closeDrawer"], .drawer-close, #drawer-overlay').forEach(el => {
    el.addEventListener('click', closeDrawer);
  });

  // Drawer nav item tıklanınca kapat
  document.querySelectorAll('.drawer .nav-item').forEach(el => {
    el.addEventListener('click', closeDrawer);
  });

  // Aktif bnav
  const currentPage = document.querySelector('aside .nav-item.active')?.dataset?.page;
  if (currentPage) {
    document.querySelectorAll('.bnav[data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === currentPage);
    });
  }
}

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
    if(ce) ce.innerHTML='<span class="'+cls+'">'+arrow+Math.abs(pct)+'%</span>';
    if(r.mobId){const m=document.getElementById(r.mobId);if(m)m.textContent='₺'+val.toFixed(2);}
  });
  const t=document.getElementById('r-time');
  if(t) t.textContent=timeStr+' güncellendi';
}
