import { initPage, app } from '/_common.js';
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

initPage('dashboard', (user) => {
  const displayName = user.displayName || user.email.split('@')[0].toUpperCase();
  const initials = displayName.charAt(0).toUpperCase();
  ['user-av-drawer','user-av-sidebar'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=initials; });
  ['user-name-drawer','user-name-sidebar'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=displayName; });
  ['user-email-drawer','user-email-sidebar'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=user.email; });
  const d = new Date();
  const days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const el =  const el =  const el =  const el =  const el =  constxtContent = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ', ' + days[d.getDay()];
});

document.addEventListener('DOMContedocument.addEventListener('DOth = getAuth(app);
  document.querySelectorAll('.btn-logout-trigger, [data-action="doLogout"], .sidebar-logout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      signOut(auth).then(() => { window.location.href = '/index.html'; });
    });
  });
});
