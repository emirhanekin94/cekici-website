/**
 * XXX OTO ÇEKİCİ & KURTARMA - GELİŞMİŞ ETKİLEŞİM, WHATSAPP FORMU VE TÜMÜNÜ GÖSTER MANTIĞI
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

  // 3. Akıllı WhatsApp Konum Gönderme Butonları (Tek Tuşla GPS Konum İletimi)
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

  // 4. Gelişmiş WhatsApp Teklif Formu Gönderme (Seçmeli Dropdown Destekli)
  const wpForms = document.querySelectorAll('.wp-contact-form');
  wpForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Select veya text alanları al
      const regionSelect = form.querySelector('[name="region_select"]');
      const fromInput = form.querySelector('[name="from_location"]');
      const vehicleSelect = form.querySelector('[name="vehicle_type_select"]');
      const problemSelect = form.querySelector('[name="problem_select"]');
      const carInput = form.querySelector('[name="car_model"]');
      const toInput = form.querySelector('[name="to_location"]');
      const phoneInput = form.querySelector('[name="user_phone"]');
      const noteInput = form.querySelector('[name="user_note"]');

      const locationVal = (regionSelect && regionSelect.value) ? regionSelect.value : (fromInput ? fromInput.value.trim() : 'Belirtilmedi');
      const vehicleVal = (vehicleSelect && vehicleSelect.value) ? vehicleSelect.value : 'Otomobil';
      const problemVal = (problemSelect && problemSelect.value) ? problemSelect.value : (carInput ? carInput.value.trim() : 'Genel Çekici Talebi');
      const toVal = toInput ? toInput.value.trim() : 'En Yakın Sanayi / Servis';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const noteVal = noteInput ? noteInput.value.trim() : '';

      let text = `🚨 *YENİ ÇEKİCİ / YOL YARDIM TALEBİ*\n\n`;
      text += `📍 *Bulunduğu Bölge:* ${locationVal}\n`;
      text += `🚗 *Araç Türü:* ${vehicleVal}\n`;
      text += `⚠️ *Yaşanan Problem:* ${problemVal}\n`;
      if (toVal) {
        text += `🏁 *Gidilecek Hedef:* ${toVal}\n`;
      }
      if (phoneVal) {
        text += `📞 *İletişim Tel:* ${phoneVal}\n`;
      }
      if (noteVal) {
        text += `📝 *Ek Açıklama:* ${noteVal}\n`;
      }
      text += `\nLütfen en kısa sürede sabit fiyat ve varış süresi bildiriniz.`;

      const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    });
  });

  // 5. Bölge Kartları "Tümünü Göster" Mekanizması (Mobilde 4, Masaüstünde 12)
  const regionCards = document.querySelectorAll('#regions-container .region-card-luxury');
  const showMoreRegionsBtn = document.getElementById('btn-toggle-all-regions');

  if (regionCards.length > 0 && showMoreRegionsBtn) {
    const isMobile = window.innerWidth <= 768;
    const initialLimit = isMobile ? 4 : 12;

    // İlk sınırın üzerindeki kartları gizle
    regionCards.forEach((card, index) => {
      if (index >= initialLimit) {
        card.classList.add('is-hidden-initially');
      }
    });

    let regionsExpanded = false;
    showMoreRegionsBtn.addEventListener('click', () => {
      regionsExpanded = !regionsExpanded;
      regionCards.forEach((card, index) => {
        if (index >= initialLimit) {
          if (regionsExpanded) {
            card.classList.remove('is-hidden-initially');
          } else {
            card.classList.add('is-hidden-initially');
          }
        }
      });

      showMoreRegionsBtn.innerHTML = regionsExpanded 
        ? `<span>Daha Az Bölge Göster ▲</span>` 
        : `<span>Tüm Bölgeleri Göster (${regionCards.length} Bölge) ▼</span>`;
    });
  }

  // 6. Müşteri Yorumları "Tümünü Göster" Mekanizması (Mobilde 3, Masaüstünde 6)
  const reviewCards = document.querySelectorAll('#reviews-container .review-card');
  const showMoreReviewsBtn = document.getElementById('btn-toggle-all-reviews');

  if (reviewCards.length > 0 && showMoreReviewsBtn) {
    const isMobile = window.innerWidth <= 768;
    const initialReviewLimit = isMobile ? 3 : 6;

    reviewCards.forEach((card, index) => {
      if (index >= initialReviewLimit) {
        card.classList.add('is-hidden-initially');
      }
    });

    let reviewsExpanded = false;
    showMoreReviewsBtn.addEventListener('click', () => {
      reviewsExpanded = !reviewsExpanded;
      reviewCards.forEach((card, index) => {
        if (index >= initialReviewLimit) {
          if (reviewsExpanded) {
            card.classList.remove('is-hidden-initially');
          } else {
            card.classList.add('is-hidden-initially');
          }
        }
      });

      showMoreReviewsBtn.innerHTML = reviewsExpanded 
        ? `<span>Daha Az Yorum Göster ▲</span>` 
        : `<span>Tüm Müşteri Yorumlarını Göster (${reviewCards.length} Gerçek Yorum) ▼</span>`;
    });
  }

  // 7. Bölge Filtreleme Sekmeleri
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  if (filterTabs.length > 0 && regionCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filterVal = tab.getAttribute('data-filter');

        // Filtre tıklandığında gizlenmiş olanları aç veya filtreye göre göster
        regionCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal || (filterVal && category && category.includes(filterVal))) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });

        // Eğer filtre yapılıyorsa "Tümünü Göster" butonunu gizle
        if (showMoreRegionsBtn) {
          showMoreRegionsBtn.style.display = (filterVal === 'all') ? 'inline-flex' : 'none';
        }
      });
    });
  }
});
