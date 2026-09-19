/**
 * TUZLA YOL YARDIM - GOOGLE ADS CLICK FRAUD & BOT KORUMA KALKANI
 * 
 * Bu modül; Google Ads reklamlarından gelen ziyaretçileri analiz eder,
 * rakiplerin mükerrer tıklamalarını (Click Fraud), otomatik bot taramalarını
 * ve hızlı sıçrama (rapid-bounce) manipülasyonlarını tespit edip sınırlar.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ty_ads_tracker';
  const BOT_FLAG_KEY = 'ty_bot_detected';
  const FRAUD_THRESHOLD_HOURS = 2; // Aynı kullanıcının 2 saat içinde mükerrer reklam tıklaması
  const MAX_ALLOWED_ADS_CLICKS = 2; // 2 saatte en fazla 2 reklam tıklaması normal kabul edilir

  // 1. Google Ads Parametrelerini Tespit Et
  const urlParams = new URLSearchParams(window.location.search);
  const isGoogleAdsClick = urlParams.has('gclid') || 
                           urlParams.has('wbraid') || 
                           urlParams.has('gbraid') || 
                           urlParams.has('gad_source') || 
                           (urlParams.get('utm_source') === 'google' && urlParams.get('utm_medium') === 'cpc');

  const gclidValue = urlParams.get('gclid') || urlParams.get('gad_source') || 'cpc_traffic';

  // 2. Reklam Tıklama Geçmişini Takip Et & Kaydet
  function trackAdsClick() {
    if (!isGoogleAdsClick) return;

    try {
      const now = Date.now();
      const rawData = localStorage.getItem(STORAGE_KEY);
      let history = rawData ? JSON.parse(rawData) : { clicks: [], flagged: false };

      // Son 24 saatten eski kayıtları temizle
      history.clicks = history.clicks.filter(time => (now - time) < 24 * 60 * 60 * 1000);

      // Yeni tıklamayı ekle
      history.clicks.push(now);

      // Son 2 saatteki tıklama sayısını kontrol et
      const recentClicks = history.clicks.filter(time => (now - time) < FRAUD_THRESHOLD_HOURS * 60 * 60 * 1000);

      if (recentClicks.length > MAX_ALLOWED_ADS_CLICKS) {
        history.flagged = true;
        handleSuspiciousClick(recentClicks.length);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      // LocalStorage kısıtlı veya gizli sekmede hata fırlatmasını önle
    }
  }

  // 3. Şüpheli Tıklama & Manipülasyon Durumunda Yapılacaklar
  function handleSuspiciousClick(clickCount) {
    console.warn(`[Güvenlik Uyarısı] Mükerrer Google Ads tıklaması tespit edildi (${clickCount}x).`);

    // Google Analytics 4 / Google Ads Güvenlik Olayı Bildir
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'suspected_click_fraud', {
        event_category: 'Security',
        event_label: `Repeated Ads Clicks (${clickCount}x in ${FRAUD_THRESHOLD_HOURS}h)`,
        value: clickCount,
        non_interaction: true
      });
    }

    // İlgili oturumu işaretle
    sessionStorage.setItem('ty_suspicious_traffic', 'true');
  }

  // 4. Görünmez Bot Tuzağı (Honeypot Trap)
  function initHoneypot() {
    // DOM'da gizli tuzak linki oluştur (Sadece botlar tıklar)
    const trap = document.createElement('a');
    trap.href = '#oto-cekici-bot-trap';
    trap.className = 'ty-hp-trap';
    trap.setAttribute('aria-hidden', 'true');
    trap.setAttribute('tabindex', '-1');
    trap.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:auto;';
    trap.textContent = 'Acil Çekici Servisi İndirimi';

    trap.addEventListener('click', function (e) {
      e.preventDefault();
      // İnsan gözünün göremediği butona tıklayan doğrudan bottur!
      sessionStorage.setItem(BOT_FLAG_KEY, 'true');
      console.warn('[Güvenlik] Otomatik bot tuzağı tetiklendi.');

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'bot_trap_triggered', {
          event_category: 'Security',
          event_label: 'Honeypot Click Detected',
          non_interaction: true
        });
      }
    });

    document.body.appendChild(trap);
  }

  // 5. Buton Tıklama Koruması (Debounce & Flood Prevention)
  function initButtonThrottle() {
    const contactLinks = document.querySelectorAll('a[href^="tel:"], .btn-send-location, .floating-btn');
    let lastClickTime = 0;
    let rapidClickCount = 0;

    contactLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const now = Date.now();
        const diff = now - lastClickTime;

        if (diff < 800) {
          // 800ms içinde mükerrer hızlı tıklama (spam/bot davranışı)
          rapidClickCount++;
          if (rapidClickCount > 3) {
            e.preventDefault();
            console.warn('[Güvenlik] Hızlı tıklama spamı engellendi.');
            return false;
          }
        } else {
          rapidClickCount = 0;
        }

        lastClickTime = now;
      }, { passive: false });
    });
  }

  // Başlatıcı
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      trackAdsClick();
      initHoneypot();
      initButtonThrottle();
    });
  } else {
    trackAdsClick();
    initHoneypot();
    initButtonThrottle();
  }
})();
