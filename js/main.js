/**
 * XXX OTO ÇEKİCİ & KURTARMA - GELİŞMİŞ ETKİLEŞİM VE WHATSAPP FORMU SCRİPTİ
 */

document.addEventListener('DOMContentLoaded', () => {
  const PHONE_NUMBER = '905516756624';

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

    // Menü içindeki linke tıklandığında menüyü kapat
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        if (menuBtn) {
          menuBtn.innerHTML = '☰';
          menuBtn.setAttribute('aria-expanded', false);
        }
      });
    });
  }

  // 2. SSS (FAQ) Akordiyon Etkileşimi
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        item.classList.toggle('active', !isActive);
      });
    }
  });

  // 3. Akıllı WhatsApp Konum Gönderme Butonları
  const geoLocationBtns = document.querySelectorAll('.btn-send-location');
  geoLocationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (navigator.geolocation) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>📍 Konum tespiti yapılıyor...</span>';
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
            const message = encodeURIComponent(`Merhaba XXX Oto Çekici, yolda kaldım acil çekiciye ihtiyacım var.\n📍 Canlı Konumum: ${mapsUrl}`);
            window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
            btn.innerHTML = originalText;
          },
          (error) => {
            const defaultMsg = encodeURIComponent('Merhaba XXX Oto Çekici, acil oto çekici / yol yardıma ihtiyacım var. Bulunduğum bölge: ');
            window.open(`https://wa.me/${PHONE_NUMBER}?text=${defaultMsg}`, '_blank');
            btn.innerHTML = originalText;
          },
          { timeout: 8000, enableHighAccuracy: true }
        );
      } else {
        const defaultMsg = encodeURIComponent('Merhaba XXX Oto Çekici, acil oto çekici / yol yardıma ihtiyacım var.');
        window.open(`https://wa.me/${PHONE_NUMBER}?text=${defaultMsg}`, '_blank');
      }
    });
  });

  // 4. WhatsApp İletişim / Teklif Formu Gönderme (Tüm Sayfalarda Çalışır)
  const wpForms = document.querySelectorAll('.wp-contact-form');
  wpForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fromInput = form.querySelector('[name="from_location"]');
      const toInput = form.querySelector('[name="to_location"]');
      const carInput = form.querySelector('[name="car_model"]');
      const phoneInput = form.querySelector('[name="user_phone"]');
      const noteInput = form.querySelector('[name="user_note"]');

      const fromVal = fromInput ? fromInput.value.trim() : 'Belirtilmedi';
      const toVal = toInput ? toInput.value.trim() : 'Belirtilmedi';
      const carVal = carInput ? carInput.value.trim() : 'Belirtilmedi';
      const phoneVal = phoneInput ? phoneInput.value.trim() : 'Belirtilmedi';
      const noteVal = noteInput ? noteInput.value.trim() : '';

      let text = `🚨 *YENİ ÇEKİCİ / YOL YARDIM TALEBİ*\n\n`;
      text += `📍 *Nereden (Konum):* ${fromVal}\n`;
      text += `🏁 *Nereye (Hedef):* ${toVal}\n`;
      text += `🚗 *Araç Modeli / Arıza Durumu:* ${carVal}\n`;
      if (phoneVal !== 'Belirtilmedi') {
        text += `📞 *İletişim Numarası:* ${phoneVal}\n`;
      }
      if (noteVal) {
        text += `📝 *Ek Not:* ${noteVal}\n`;
      }
      text += `\nLütfen en kısa sürede fiyat ve varış süresi bilgisi veriniz.`;

      const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    });
  });

  // 5. Bölge Filtreleme Sekmeleri
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  const regionCards = document.querySelectorAll('.region-card-luxury');

  if (filterTabs.length > 0 && regionCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filterVal = tab.getAttribute('data-filter');

        regionCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal || (filterVal && category && category.includes(filterVal))) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
