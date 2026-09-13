/**
 * XXX OTO ÇEKİCİ & KURTARMA - TEMEL ETKİLEŞİM VE DÖNÜŞÜM SCRİPTİ
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobil Menü Aç/Kapat
  const menuBtn = document.querySelector('.menu-toggle-btn');
  const mainNav = document.querySelector('.main-nav');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const isOpen = mainNav.classList.contains('active');
      menuBtn.setAttribute('aria-expanded', isOpen);
      menuBtn.innerHTML = isOpen ? '✕' : '☰';
    });
  }

  // 2. SSS (FAQ) Akordiyon Etkileşimi
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Diğer açık olanları kapat
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Tıklananı aç/kapat
        item.classList.toggle('active', !isActive);
      });
    }
  });

  // 3. Akıllı WhatsApp Konum Gönderme
  // Eğer kullanıcı konum butonuna tıklarsa GPS konumunu alıp direkt WhatsApp mesajına ekler
  const geoLocationBtns = document.querySelectorAll('.btn-send-location');
  geoLocationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = '905516756624';
      
      if (navigator.geolocation) {
        btn.innerHTML = '<span>📍 Konum alınıyor...</span>';
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
            const message = encodeURIComponent(`Merhaba XXX Oto Çekici, yolda kaldım acil çekiciye ihtiyacım var.\n📍 Canlı Konumum: ${mapsUrl}`);
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
            btn.innerHTML = '<span>💬 WhatsApp Konum Gönder</span>';
          },
          (error) => {
            // Konum izni verilmezse standart WhatsApp mesajına yönlendir
            const defaultMsg = encodeURIComponent('Merhaba XXX Oto Çekici, acil oto çekici / yol yardıma ihtiyacım var. Bulunduğum bölge: ');
            window.open(`https://wa.me/${phone}?text=${defaultMsg}`, '_blank');
            btn.innerHTML = '<span>💬 WhatsApp Konum Gönder</span>';
          },
          { timeout: 8000, enableHighAccuracy: true }
        );
      } else {
        const defaultMsg = encodeURIComponent('Merhaba XXX Oto Çekici, acil oto çekici / yol yardıma ihtiyacım var.');
        window.open(`https://wa.me/${phone}?text=${defaultMsg}`, '_blank');
      }
    });
  });
});
