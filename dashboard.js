import { initPage } from '/_common.js';
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { app } from '/_common.js';

initPage('dashboard', (user) => {
  // Kullanıcı bilgisi
  const displayName = user.displayName || user.email.split('@')[0].toUpperCase();
  const initials = displayName.charAt(0).toUpperCase();
  ['user-av-drawer','user-av-sidebar'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=initials; });
  ['user-name-drawer','user-name-sidebar'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=displayName; });
  ['user-email-drawer','user-email-sidebar'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=user.email; });

  // Tarih
  const d = new Date();
  const days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const el = document.getElementById('today-date');
  if (el) el.textContent = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ', ' + days[d.getDay()];
});

// Drawer
function openDrawer() {
  document.getElementById('drawer')?.classList.add('open');
  document.getElementById('drawer-overlay')?.classList.add('show');
}
function closeDrawer() {
  document.getElementById('drawer')?.classList.remove('open');
  document.getElementById('drawer-overlay')?.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-open-drawer-mob')?.addEventListener('click', openDrawer);
  document.getElementById('btn-open-drawer-bottom')?.addEventListener('click', openDrawer);
  document.getElementById('btn-close-drawer')?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay')?.addEventListener('click', closeDrawer);
  document.querySelectorAll('.drawer .nav-item').forEach(item => item.addEventListener('click', closeDrawer));

  // Çıkış
  const auth = getAuth(app);
  document.querySelectorAll('.btn-logout-trigger, [data-action="doLogout"], .sidebar-logout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      signOut(auth).then(() => { window.location.href = '/index.html'; });
    });
  });
});
