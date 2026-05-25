import { requireAuth, logout } from './firebase.js';

// 1. GÜVENLİK DUVARI: Oturumu kontrol et, yükleme ekranını kapat, bilgileri bas
requireAuth((user) => {
    // Profil alanlarını doldur
    const emailFields = ['user-email-drawer', 'user-email-sidebar'];
    emailFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = user.email;
    });

    const nameFields = ['user-name-drawer', 'user-name-sidebar'];
    nameFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = user.email.split('@')[0].toUpperCase();
    });

    const avFields = ['user-av-drawer', 'user-av-sidebar'];
    avFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = user.email.charAt(0).toUpperCase();
    });

    // Sayfa tarihini ekrana bas
    initDate();
});

// 2. TARİH FONKSİYONU
function initDate() {
    const d = new Date();
    const days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
    const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    const el = document.getElementById('today-date');
    if(el) el.textContent = d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear()+', '+days[d.getDay()];
}

// 3. MOBİL ÇEKMECE (DRAWER) KONTROLLERİ (CSP Engeline takılmayan harici dinleyiciler)
function openDrawer() {
    document.getElementById('drawer')?.classList.add('open');
    document.getElementById('drawer-overlay')?.classList.add('show');
}

function closeDrawer() {
    document.getElementById('drawer')?.classList.remove('open');
    document.getElementById('drawer-overlay')?.classList.remove('show');
}

// Sayfa yüklenince buton olaylarını bağla
document.addEventListener('DOMContentLoaded', () => {
    // Çekmeceyi açma butonları
    document.getElementById('btn-open-drawer-mob')?.addEventListener('click', openDrawer);
    document.getElementById('btn-open-drawer-bottom')?.addEventListener('click', openDrawer);

    // Çekmeceyi kapatma butonları
    document.getElementById('btn-close-drawer')?.addEventListener('click', closeDrawer);
    document.getElementById('drawer-overlay')?.addEventListener('click', closeDrawer);

    // Menü linklerine tıklandığında çekmeceyi otomatik kapat
    document.querySelectorAll('.drawer .nav-item').forEach(item => {
        item.addEventListener('click', closeDrawer);
    });

    // Güvenli çıkış yapma olayı
    document.querySelectorAll('.btn-logout-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
});