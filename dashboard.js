import { requireAuth, logout } from './firebase.js';

// Döviz kurları
let rates = { USD: 0, EUR: 0, GBP: 0 };
let prevRates = { USD: 0, EUR: 0, GBP: 0 };

async function fetchRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/TRY');
    const data = await res.json();
    if (data.result === 'success') {
      prevRates = { ...rates };
      rates.USD = parseFloat((1 / data.rates.USD).toFixed(4));
      rates.EUR = parseFloat((1 / data.rates.EUR).toFixed(4));
      rates.GBP = parseFloat((1 / data.rates.GBP).toFixed(4));
    }
  } catch (e) {}
  updateRateUI();
}

function updateRateUI() {
  const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  [
    { key: 'USD', valId: 'r-usd', chgId: 'r-usd-c' },
    { key: 'EUR', valId: 'r-eur', chgId: 'r-eur-c' },
    { key: 'GBP', valId: 'r-gbp', chgId: 'r-gbp-c' }
  ].forEach(r => {
    const val = rates[r.key], prev = prevRates[r.key] || val;
    const diff = val - prev, pct = prev ? ((diff / prev) * 100).toFixed(2) : '0.00';
    const up = diff >= 0, cls = up ? 'up' : 'dn', arrow = up ? '▲' : '▼';
    const ve = document.getElementById(r.valId), ce = document.getElementById(r.chgId);
    if (ve) ve.textContent = '₺' + val.toFixed(2);
    if (ce) ce.innerHTML = `<span class="${cls}">${arrow}${Math.abs(pct)}%</span>`;
  });
  const t = document.getElementById('r-time');
  if (t) t.textContent = timeStr + ' güncellendi';
}

// 1. AUTH GUARD
requireAuth((user) => {
  // Kullanıcı bilgisi — tüm ID varyantları
  const displayName = user.displayName || user.email.split('@')[0].toUpperCase();
  const initials = displayName.charAt(0).toUpperCase();

  ['user-av-drawer', 'user-av-sidebar'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = initials;
  });
  ['user-name-drawer', 'user-name-sidebar'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = displayName;
  });
  ['user-email-drawer', 'user-email-sidebar'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = user.email;
  });

  initDate();

  // Döviz kurlarını başlat
  fetchRates();
  setInterval(fetchRates, 5 * 60 * 1000);
});

// 2. TARİH
function initDate() {
  const d = new Date();
  const days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const el = document.getElementById('today-date');
  if (el) el.textContent = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ', ' + days[d.getDay()];
}

// 3. DRAWER
function openDrawer() {
  document.getElementById('drawer')?.classList.add('open');
  document.getElementById('drawer-overlay')?.classList.add('show');
}
function closeDrawer() {
  document.getElementById('drawer')?.classList.remove('open');
  document.getElementById('drawer-overlay')?.classList.remove('show');
}

// 4. EVENT LİSTENER'LAR
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-open-drawer-mob')?.addEventListener('click', openDrawer);
  document.getElementById('btn-open-drawer-bottom')?.addEventListener('click', openDrawer);
  document.getElementById('btn-close-drawer')?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay')?.addEventListener('click', closeDrawer);
  document.querySelectorAll('.drawer .nav-item').forEach(item => item.addEventListener('click', closeDrawer));

  // Çıkış — hem class hem data-action
  document.querySelectorAll('.btn-logout-trigger, [data-action="doLogout"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      logout().catch(() => { window.location.href = '/index.html'; });
    });
  });
});

cat >> ~/seller-caliskancanta/dashboard.js << 'EOF'

// Hamburger sidebar collapse
function initSidebarCollapse() {
  const sidebar = document.querySelector('aside.sidebar');
  if (!sidebar) return;

  const brand = sidebar.querySelector('.sidebar-brand');
  if (brand) {
    const existingHTML = brand.innerHTML;
    brand.innerHTML = `
      <div class="brand-info">${existingHTML}</div>
      <button class="sidebar-toggle" id="sidebar-toggle" title="Daralt / Genislet">
        <svg class="hamburger-icon" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect class="line line-1" x="0" y="0"  width="18" height="2" rx="1" fill="currentColor"/>
          <rect class="line line-2" x="0" y="6"  width="14" height="2" rx="1" fill="currentColor"/>
          <rect class="line line-3" x="0" y="12" width="10" height="2" rx="1" fill="currentColor"/>
        </svg>
      </button>`;
  }

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
    if (!item.dataset.label) {
      const txt = item.querySelector('span, .nav-text');
      if (txt) item.setAttribute('data-label', txt.textContent.trim());
    }
  });

  const btn = document.getElementById('sidebar-toggle');
  if (!btn) return;

  if (localStorage.getItem('sb-collapsed') === '1') sidebar.classList.add('collapsed');

  btn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sb-collapsed', sidebar.classList.contains('collapsed') ? '1' : '0');
  });
}

document.addEventListener('DOMContentLoaded', () => { initSidebarCollapse(); });
EOF