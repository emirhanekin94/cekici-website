/**
 * XXX OTO ÇEKİCİ & KURTARMA - GELİŞMİŞ ETKİLEŞİM, ÖZEL BÖLGE SEÇİCİ VE WHATSAPP FORMU
 */

document.addEventListener('DOMContentLoaded', () => {
  const PHONE_NUMBER = '905516756624';

  // 1. Mobil Menü Aç/Kapat (Üstten Dikey Akordeon Şeklinde Açılır, Asla Yandan Değil)
  const menuBtn = document.querySelector('.menu-toggle-btn');
  const mainNav = document.querySelector('.main-nav');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = menuBtn.classList.toggle('active');
      mainNav.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', isActive);
    });

    // Menü içindeki linke tıklandığında menüyü kapat
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mainNav.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Dışarı tıklandığında menüyü kapat
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuBtn.contains(e.target)) {
        menuBtn.classList.remove('active');
        mainNav.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
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

  // 4. Özel Gelişmiş Bölge Seçici (Custom Luxury Region Picker)
  const regionPicker = document.getElementById('region-picker');
  if (regionPicker) {
    const trigger = document.getElementById('region-picker-trigger');
    const popover = document.getElementById('region-picker-popover');
    const selectedText = document.getElementById('picker-selected-text');
    const hiddenInput = document.getElementById('hidden-region-input');
    const searchInput = document.getElementById('picker-search-input');
    const filterTabs = regionPicker.querySelectorAll('.picker-tab-btn');
    const items = regionPicker.querySelectorAll('.picker-item-row');

    if (trigger && popover) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = popover.classList.contains('open');
        if (isOpen) {
          popover.classList.remove('open');
          trigger.classList.remove('active');
        } else {
          popover.classList.add('open');
          trigger.classList.add('active');
          if (searchInput) {
            setTimeout(() => searchInput.focus(), 60);
          }
        }
      });

      // Arama filtresi
      if (searchInput) {
        searchInput.addEventListener('input', () => {
          const query = searchInput.value.toLowerCase().trim();
          items.forEach(item => {
            const name = (item.getAttribute('data-name') || '').toLowerCase();
            const sub = (item.getAttribute('data-sub') || '').toLowerCase();
            if (name.includes(query) || sub.includes(query)) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        });
      }

      // Kategori sekmeleri
      filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.stopPropagation();
          filterTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const filter = tab.getAttribute('data-filter');

          items.forEach(item => {
            const cat = item.getAttribute('data-category') || '';
            if (filter === 'all' || cat.includes(filter)) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });

      // Bölge seçimi
      items.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const regionName = item.getAttribute('data-name');
          const regionEta = item.getAttribute('data-eta');

          if (hiddenInput) hiddenInput.value = regionName;
          if (selectedText) {
            selectedText.innerHTML = `<span>📍 ${regionName} Çekici (${regionEta})</span>`;
          }

          items.forEach(i => i.classList.remove('selected'));
          item.classList.add('selected');

          popover.classList.remove('open');
          trigger.classList.remove('active');
        });
      });

      // Dışarı tıklama ile popover'ı kapat
      document.addEventListener('click', (e) => {
        if (!regionPicker.contains(e.target)) {
          popover.classList.remove('open');
          trigger.classList.remove('active');
        }
      });
    }
  }

  // 5. Gelişmiş WhatsApp Teklif Formu Gönderme (Seçmeli Dropdown Destekli)
  const wpForms = document.querySelectorAll('.wp-contact-form');
  wpForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
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

  // 6. Bölge Kartları "Tümünü Göster" Mekanizması (Mobilde 4, Masaüstünde 12)
  const regionCards = document.querySelectorAll('#regions-container .region-card-luxury');
  const showMoreRegionsBtn = document.getElementById('btn-toggle-all-regions');

  if (regionCards.length > 0 && showMoreRegionsBtn) {
    const isMobile = window.innerWidth <= 768;
    const initialLimit = isMobile ? 4 : 12;

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

  // 7. Bölge Filtreleme Sekmeleri
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
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

        if (showMoreRegionsBtn) {
          showMoreRegionsBtn.style.display = (filterVal === 'all') ? 'inline-flex' : 'none';
        }
      });
    });
  }

  // 8. Google Müşteri Yorumları Tümünü Göster / Gizle
  const toggleReviewsBtn = document.getElementById('btn-toggle-reviews');
  const reviewsContainer = document.getElementById('reviews-container');

  if (toggleReviewsBtn && reviewsContainer) {
    toggleReviewsBtn.addEventListener('click', () => {
      const isExpanded = reviewsContainer.classList.toggle('expanded');
      toggleReviewsBtn.classList.toggle('active', isExpanded);

      const btnText = toggleReviewsBtn.querySelector('span');
      const btnIcon = toggleReviewsBtn.querySelector('svg');

      if (isExpanded) {
        if (btnText) btnText.textContent = 'Daha Az Yorum Göster';
        if (btnIcon) btnIcon.style.transform = 'rotate(180deg)';
      } else {
        const isMobile = window.innerWidth <= 768;
        if (btnText) {
          btnText.textContent = isMobile 
            ? 'Tüm Yorumları Göster (18 Yorum)' 
            : 'Tüm Google Yorumlarını Göster (18 Gerçek Yorum)';
        }
        if (btnIcon) btnIcon.style.transform = 'rotate(0deg)';

        const reviewsSection = document.getElementById('yorumlar');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // 9. Galeri Sayfası Filtreleme Sekmeleri
  const galleryFilterTabs = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryFilterTabs.length > 0 && galleryItems.length > 0) {
    galleryFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        galleryFilterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filterVal = tab.getAttribute('data-gallery-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
});