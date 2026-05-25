// Ortak Fonksiyonlar ve Başlatma

/**
 * Sayfa başlatma fonksiyonu
 * - Loading screen'i kapat
 * - Exchange rates yükle
 * - Sayfa callback'ini çalıştır
 */
export function initPage(pageName, callback) {
  console.log(`📄 Initializing page: ${pageName}`);
  
  // 1. Loading screen'i kapat (en önemli)
  try {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
      console.log('✅ Loading screen hidden');
    }
  } catch (error) {
    console.error('⚠️  Loading screen error:', error);
  }
  
  // 2. Exchange rates'i yükle (async, arka planda)
  loadExchangeRates();
  
  // 3. Sayfa-spesifik callback'i çalıştır
  if (callback && typeof callback === 'function') {
    try {
      callback();
      console.log(`✅ Page callback executed for ${pageName}`);
    } catch (error) {
      console.error(`❌ Page callback error:`, error);
    }
  }
}

/**
 * Exchange rates'i al (demo data)
 */
export function getRates() {
  return {
    USD: 32.50,
    EUR: 35.20,
    GBP: 40.80
  };
}

/**
 * Para formatı fonksiyonu
 */
export function fmt(amount) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount);
}

/**
 * Bugünün tarihini formatla
 */
export function formatDate(date = new Date()) {
  const days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${days[date.getDay()]}`;
}

/**
 * Global drawer fonksiyonları
 */
window.openDrawer = function() {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('show');
};

window.closeDrawer = function() {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
};

/**
 * Logout fonksiyonu
 */
window.doLogout = async function() {
  try {
    // localStorage'dan session sil
    localStorage.removeItem('__cc_user_session');
    localStorage.removeItem('__isLocallyAuthenticated');
    
    // Firebase logout (varsa)
    try {
      const { logout } = await import('./firebase.js');
      await logout();
    } catch (error) {
      console.warn('⚠️  Firebase logout failed:', error);
      window.location.href = '/index.html';
    }
  } catch (error) {
    console.error('❌ Logout error:', error);
    window.location.href = '/index.html';
  }
};

/**
 * Global initPage fonksiyonu (HTML script type="module" içinden erişim için)
 */
window.initPage = initPage;
window.fmt = fmt;
window.formatDate = formatDate;
window.getRates = getRates;

console.log('✅ _common.js module loaded');
