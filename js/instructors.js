// Global değişkenler ve veriler
const instructorsData = [
   {
        id: 'ahmet',
        name: 'Ahmet Yılmaz',
        title: 'Python & Veri Bilimi Uzmanı',
        area: 'Veri Bilimi',
        bio: 'Ahmet Yılmaz, 10 yılı aşkın tecrübesiyle Python programlama ve büyük veri analizi alanlarında uzmandır. Alanındaki en popüler kursları sunmaktadır. Eğitmen, karmaşık verileri anlaşılır ve pratik uygulamalarla öğretme konusunda tutkuludur.',
        image: 'images/egitmen1.jpeg',
        social: {
            linkedin: 'https://www.linkedin.com/in/ahmet-yilmaz',
            twitter: 'https://twitter.com/ahmetdata'
        }
    },
    {
        id: 'elif',
        name: 'Elif Demir',
        title: 'Web Geliştirme Eğitmeni',
        area: 'Web Geliştirme',
        bio: 'Elif Demir, Full-Stack Web Geliştirici olarak sektörde 8 yıllık deneyime sahiptir. HTML5, CSS3, JavaScript ve React konularında uzmandır. Öğrencileri projeler yoluyla gerçek dünya becerileri kazanmaya teşvik eder.',
        image: 'images/elif.jpg',
        social: {
            linkedin: 'https://www.linkedin.com/in/elif-demir',
            github: 'https://github.com/elif-dev'
         }
    },
    {
        id: 'mehmet',
        name: 'Mehmet Kaya',
        title: 'Yapay Zeka Mühendisi',
        area: 'Yapay Zeka',
        bio: 'Mehmet Kaya, Yapay Zeka Mühendisliği alanında yüksek lisans derecesine sahiptir. Derin öğrenme ve doğal dil işleme (NLP) üzerine odaklanmaktadır. En güncel AI trendlerini kurslarına yansıtır.',
        image: 'images/egitmen3.jpeg',
        social: {
          linkedin: 'https://www.linkedin.com/in/mehmet-kaya'
         }
    },
    {
        id: 'ayşe',
        name: 'Ayşe Öztürk',
        title: 'UX/UI Tasarımcı',
        area: 'Tasarım',
 // Görsel yolu hatası almamak için geçici olarak elif.jpg kullanılıyor
        image: 'images/elif.jpg', 
        social: {
           linkedin: 'https://www.linkedin.com/in/ayse-ozturk'
        }
    },
];

// Elementleri yakalıyoruz. HTML'deki ID'ler ile eşleşmeli.
const gridContainer = document.querySelector('.instructor-grid');
const filterSelect = document.getElementById('instructor-filter');
const searchInput = document.getElementById('instructor-search');
const noResultsMessage = document.getElementById('no-results-message');

// Modal konteyneri oluşturma (DOM'a hemen eklenmeli)
const instructorDetailsContainer = document.createElement('div');
instructorDetailsContainer.classList.add('instructor-details-container', 'js-modal-container');
document.body.appendChild(instructorDetailsContainer);

/**
 * Alan adını filtre değeri için kullanılacak bir formata dönüştürür
 * (küçük harf, boşlukları tire ile değiştirme, özel karakterleri kaldırma).
 * Örn: "Veri Bilimi" -> "veri-bilimi"
 */
function normalizeArea(area) {
    if (!area) return '';
    return area
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/\s/g, '-') 
        .replace(/[^\w-]/g, '')
        .trim();
}


/**
 * Eğitmen kartlarını DOM'da oluşturur ve gösterir.
 */
function renderInstructors(instructors) {
 // gridContainer null ise, burada bir hata oluşur ve konsolda görürüz.
    if (!gridContainer) {
        console.error("gridContainer bulunamadı. HTML'deki '.instructor-grid' sınıfını kontrol edin.");
        return;
    }
    gridContainer.innerHTML = '';
    if (instructors.length === 0) {
        if(noResultsMessage) noResultsMessage.style.display = 'block';
        return;
    }
    if(noResultsMessage) noResultsMessage.style.display = 'none';
    instructors.forEach((instructor, index) => {
       const delay = 100 + (index % 4) * 100; 

        const cardHTML = `
            <a href="#" class="instructor-link" data-instructor-id="${instructor.id}"  ">
                <div class="instructor-card card">
                    <img src="${instructor.image}" alt="${instructor.name}">
                    <h3>${instructor.name}</h3>
                    <p>${instructor.title}</p>
                    <span class="instructor-area">${instructor.area}</span>
                </div>
            </a>
        `;
        gridContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

 
    if (typeof initScrollReveal === 'function') {
       initScrollReveal(); 
    }
}

/**
 * Eğitmen listesini filtreler ve arama yapar.
 */
function filterInstructors() {
    // Elementler bulunamazsa fonksiyon çalışmaz.
    if (!searchInput || !filterSelect) {
        console.error("Filtreleme inputları bulunamadı. HTML ID'lerini (instructor-search, instructor-filter) kontrol edin.");
        return;
    }

    // DÜZELTME: Arama ve filtre değerlerini tek bir normalize fonksiyonu ile standartlaştırın
    const rawSearchTerm = searchInput.value;
    // Arama terimini sadece küçük harfe çevirmek yeterli, çünkü arama
    // eğitmenin adı, unvanı ve alanı içinde yapılıyor. Normalize işlemine gerek yok.
    const searchTerm = rawSearchTerm.toLowerCase(); 

    // Seçilen filtre değerini normalize edilmiş alan formatıyla aynı yapın.
    const selectedAreaValue = filterSelect.value.toLowerCase().trim(); 

 // Konsol çıktısı ekleyelim, neyi aradığımızı görelim
    console.log('Filtreleme çalışıyor. Aranan:', searchTerm, '| Seçilen Alan Değeri:', selectedAreaValue);
    const filtered = instructorsData.filter(instructor => {

 // 1. Arama Kontrolü: Türkçe karakterler aramada sorun çıkarıyorsa, 
        // hem eğitmen adını hem de arama terimini normalize etmek gerekebilir.
        // Ancak bu örnekte, arama metninde normalize edilmiş kelimeler beklenmediği için
        // sadece basit .toLowerCase() kullanmak daha doğrudur.

        const matchesSearch = 
            instructor.name.toLowerCase().includes(searchTerm) || 
            instructor.title.toLowerCase().includes(searchTerm) ||
            instructor.area.toLowerCase().includes(searchTerm);

     // 2. Filtre Kontrolü: eğitmenin alanını normalizeArea fonksiyonu ile filtre değeriyle karşılaştır.
        const instructorNormalizedArea = normalizeArea(instructor.area);

        const matchesFilter = 
            selectedAreaValue === 'all' || 
            instructorNormalizedArea === selectedAreaValue; // DÜZELTME: Artık normalizeArea kullanılıyor

        return matchesSearch && matchesFilter;
    });

// Konsolda kaç sonuç bulduğumuzu görelim
    console.log('Bulunan Eğitmen Sayısı:', filtered.length);
    renderInstructors(filtered);
}


// Modal fonksiyonu (Değişiklik yok)
function openInstructorModal(instructor) {
    const socialIcons = Object.keys(instructor.social).map(platform => {
        let iconClass;
        if (platform === 'linkedin') iconClass = 'fa-linkedin-in';
        else if (platform === 'github') iconClass = 'fa-github';
        else iconClass = 'fa-brands fa-' + platform; 

        return `<a href="${instructor.social[platform]}" target="_blank" aria-label="${platform}" class="social-icon"><i class="fab ${iconClass}"></i></a>`;
    }).join('');

    const modalHTML = `
        <div id="modal-${instructor.id}" class="detail-modal js-instructor-modal active-modal">
            <div class="detail-content card">
                <button class="close-btn" aria-label="Kapat" data-close-modal>X</button>
                <img src="${instructor.image}" alt="${instructor.name}" class="detail-img">
                <h4>${instructor.name} <small>(${instructor.area})</small></h4>
                <p class="instructor-bio">${instructor.bio}</p>
                <div class="social-links" style="margin-bottom: 20px; display:flex; justify-content:center; gap: 15px;">
                    ${socialIcons}
                </div>
                <a href="courses.html?instructor=${instructor.id}" class="btn">Derslerini Görüntüle</a>
            </div>
        </div>
    `;

    instructorDetailsContainer.innerHTML = modalHTML;

    const modal = document.querySelector('.js-instructor-modal');
    setTimeout(() => {
        modal.style.opacity = 1;
        modal.style.visibility = 'visible';
        document.body.style.overflow = 'hidden'; 
    }, 10);
}


// Olay Dinleyicilerini BAĞLA
if (searchInput && filterSelect) {
 // Filtre seçeneklerini DOLDUR
    // DÜZELTME: Filtre değerlerini normalizeArea fonksiyonu ile oluştur
    const uniqueAreas = [...new Set(instructorsData.map(i => i.area))];
    uniqueAreas.forEach(area => {
        const option = document.createElement('option');
        const filterValue = normalizeArea(area); // DÜZELTME: normalizeArea kullanılıyor
        option.value = filterValue;
        option.textContent = area;
        filterSelect.appendChild(option);
    });

    searchInput.addEventListener('input', filterInstructors);
    filterSelect.addEventListener('change', filterInstructors);
}

// İlk Render
renderInstructors(instructorsData);

// Kart tıklamalarını dinle (Delegasyon)
if (gridContainer) {
   gridContainer.addEventListener('click', (e) => {
        const link = e.target.closest('.instructor-link');
        if (!link) return;

        e.preventDefault(); 
        const instructorId = link.dataset.instructorId;
        const instructor = instructorsData.find(i => i.id === instructorId);

        if (instructor) {
          openInstructorModal(instructor);
        }
    });
}

// Modal Kapatma İşlevi
instructorDetailsContainer.addEventListener('click', (e) => {
    const modal = e.currentTarget.querySelector('.js-instructor-modal');
// Eğer modal elemanının kendisine ya da kapatma butonuna tıklandıysa
    if (modal && (e.target === modal || e.target.closest('[data-close-modal]'))) {
        modal.style.opacity = 0;
        document.body.style.overflow = 'auto'; 
        setTimeout(() => {
          instructorDetailsContainer.innerHTML = ''; 
    }, 300); 
   }
});


// Geri Kalan Global İşlevsellik (Smooth Scroll, Back to Top)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function (e) {
        if(this.closest('.instructor-card') || this.closest('.js-modal-container')) {
           return; 
        }
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return; 

        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
   });
});

const backToTopButton = document.createElement('button');
backToTopButton.id = 'back-to-top';
backToTopButton.setAttribute('aria-label', 'Sayfa başına dön');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTopButton);

const toggleVisibility = () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
    } else {
// DÜZELTME: backToopButton -> backToTopButton düzeltildi
      backToTopButton.classList.remove('show');
    }
};

window.addEventListener('scroll', toggleVisibility);

backToTopButton.addEventListener('click', () => {
   window.scrollTo({
        top: 0,
        behavior: 'smooth'
 });
});
renderInstructors(instructorsData);