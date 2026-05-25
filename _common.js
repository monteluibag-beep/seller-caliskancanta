// Ortak Fonksiyonlar ve Başlatma

/**
 * Sayfa başlatma fonksiyonu
 * - Auth kontrol et
 * - Loading screen'i kapat
 * - Kullanıcı bilgisini doldur
 * - Callback'i çalıştır
 */
export function initPage(pageName, callback) {
  console.log(`📄 Initializing page: ${pageName}`);
  
  // Loading screen'i kapat
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
    console.log('✅ Loading screen hidden');
  }
  
  // Kullanıcı bilgisini kontrol et
  checkAndFillUserData();
  
  // Sayfa-spesifik callback'i çalıştır
  if (callback && typeof callback === 'function') {
    try {
      callback();
      console.log(`✅ Page callback executed for ${pageName}`);
    } catch (error) {
      console.error(`❌ Page callback error:`, error);
    }
  }
  
  // Exchange rates'i yükle (async)
  loadExchangeRates();
}

/**
 * Kullanıcı bilgisini localStorage'dan al ve DOM'a doldur
 */
function checkAndFillUserData() {
  try {
    const sessionStr = localStorage.getItem('__cc_user_session');
    if (!sessionStr) {
      console.warn('⚠️  No user session in localStorage, redirecting to login');
      window.location.href = '/index.html';
      return;
    }
    
    const user = JSON.parse(sessionStr);
    const userName = user.displayName || user.email.split('@')[0];
    const userInitial = user.email.charAt(0).toUpperCase();
    
    // Tüm user bilgisi alanlarını doldur
    const userEmailElements = document.querySelectorAll('[id$="-email"], [id$="-email-drawer"], [id$="-email-sidebar"]');
    userEmailElements.forEach(el => {
      if (el) el.textContent = user.email;
    });
    
    const userNameElements = document.querySelectorAll('[id$="-name"], [id$="-name-drawer"], [id$="-name-sidebar"]');
    userNameElements.forEach(el => {
      if (el) el.textContent = userName;
    });
    
    const userAvatarElements = document.querySelectorAll('[id$="-av"], [id$="-av-drawer"], [id$="-av-sidebar"]');
    userAvatarElements.forEach(el => {
      if (el) el.textContent = userInitial;
    });
    
    console.log(`✅ User data filled: ${user.email}`);
  } catch (error) {
    console.error('❌ User data loading error:', error);
  }
}

/**
 * Para birimi dönüşüm oranlarını yükle
 */
async function loadExchangeRates() {
  try {
    // Demo veriler (gerçek API çağrısı yapılabilir)
    const rates = {
      USD: { symbol: '$', rate: 32.50, change: '+0.5%' },
      EUR: { symbol: '€', rate: 35.20, change: '-0.2%' },
      GBP: { symbol: '£', rate: 40.80, change: '+0.1%' }
    };
    
    // USD
    const usdEl = document.getElementById('r-usd');
    const usdChgEl = document.getElementById('r-usd-c');
    if (usdEl) usdEl.textContent = rates.USD.rate.toFixed(2);
    if (usdChgEl) usdChgEl.textContent = rates.USD.change;
    
    // EUR
    const eurEl = document.getElementById('r-eur');
    const eurChgEl = document.getElementById('r-eur-c');
    if (eurEl) eurEl.textContent = rates.EUR.rate.toFixed(2);
    if (eurChgEl) eurChgEl.textContent = rates.EUR.change;
    
    // GBP
    const gbpEl = document.getElementById('r-gbp');
    const gbpChgEl = document.getElementById('r-gbp-c');
    if (gbpEl) gbpEl.textContent = rates.GBP.rate.toFixed(2);
    if (gbpChgEl) gbpChgEl.textContent = rates.GBP.change;
    
    // Zaman
    const timeEl = document.getElementById('r-time');
    if (timeEl) {
      const now = new Date();
      timeEl.textContent = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    }
    
    console.log('✅ Exchange rates loaded');
  } catch (error) {
    console.warn('⚠️  Exchange rates loading failed:', error);
  }
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
 * Exchange rates'i al (dummy implementation)
 */
export function getRates() {
  return {
    USD: 32.50,
    EUR: 35.20,
    GBP: 40.80
  };
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
