document.addEventListener('DOMContentLoaded', () => {
    // Tüm kurs kartlarını, arama çubuğunu ve filtre kontrollerini yakala
    const courseCards = document.querySelectorAll('.course-card');
    const searchInput = document.getElementById('course-search');
    const filterButtons = document.querySelectorAll('.filter-controls label.filter-btn');

    // Aktif arama metni ve kategori bilgisini tutacak değişkenler
    let currentSearchTerm = '';
    let currentCategory = 'all'; // Varsayılan: Tümü

    // --- KURS DETAY VERİSİ (Modal İçeriği için) ---
    const courseData = {
        python: {
            title: "Python Programlamaya Giriş ve İleri Seviye",
            tag: "Yazılım & Veri",
            description: "Temel programlama mantığından başlayarak, veri bilimi ve otomasyon için gerekli tüm ileri Python becerilerini kazanın. Bu kurs, kariyerine sağlam bir adım atmak isteyenler için idealdir.",
            duration: "30 Saat",
            instructor: "Ayşe Yılmaz",
            certificate: "Var (E-Devlet Onaylı)",
            outcomes: [
                "Python dilinin temel sözdizimini (syntax) öğrenmek.",
                "Nesne Yönelimli Programlama (OOP) konseptlerini uygulamak.",
                "Pandas ve NumPy kütüphaneleriyle veri manipülasyonu yapmak.",
                "API entegrasyonları ile web servislerine bağlanmak.",
                "Projelerle pratik deneyim kazanarak portföy oluşturmak."
            ]
        },
        webgelistirme: {
            title: "Modern Web Geliştirme (HTML, CSS, JS)",
            tag: "Web Geliştirme",
            description: "HTML5, CSS3 ve modern JavaScript (ES6+) kullanarak tamamen duyarlı (responsive) ve dinamik web siteleri geliştirmeyi baştan sona öğrenin.",
            duration: "25 Saat",
            instructor: "Mehmet Demir",
            certificate: "Var",
            outcomes: [
                "Semantic HTML yapısını ve erişilebilirlik (Accessibility) kurallarını uygulamak.",
                "CSS Flexbox ve Grid ile kompleks layoutlar oluşturmak.",
                "DOM manipülasyonu ve olay dinleyicileri (event listeners) ile interaktif arayüzler tasarlamak.",
                "Git ve GitHub kullanarak takım çalışmasına uyum sağlamak."
            ]
        },
        yapayzeka: {
            title: "Yapay Zeka ve Makine Öğrenmesi Temelleri",
            tag: "Yapay Zeka & Veri",
            description: "Yapay zeka (AI) ve makine öğrenmesi (ML) dünyasına giriş yapın. Algoritmaların nasıl çalıştığını anlayın ve temel tahmin modelleri oluşturun.",
            duration: "40 Saat",
            instructor: "Zeynep Kaya",
            certificate: "Var",
            outcomes: [
                "Denetimli (Supervised) ve Denetimsiz (Unsupervised) öğrenme farkını anlamak.",
                "Regresyon ve Sınıflandırma (Classification) algoritmalarını uygulamak.",
                "Model değerlendirme metriklerini (Accuracy, Precision, Recall) kullanmak.",
                "Temel veri ön işleme (preprocessing) tekniklerini öğrenmek."
            ]
        },
        siber: {
            title: "Pratik Siber Güvenlik ve Ağ Savunması",
            tag: "Siber Güvenlik",
            description: "Ağ güvenliği temellerini, sızma testi (penetration testing) metodolojilerini ve kurumları yaygın siber tehditlere karşı koruma stratejilerini öğrenin.",
            duration: "35 Saat",
            instructor: "Emre Yıldız",
            certificate: "Var",
            outcomes: [
                "Temel ağ protokollerinin (TCP/IP) güvenlik açıklarını tespit etmek.",
                "Parola kırma ve kimlik avı (Phishing) tekniklerinden korunma yöntemlerini uygulamak.",
                "Güvenlik duvarı (Firewall) ve Saldırı Tespit Sistemlerini (IDS) yapılandırmak.",
                "Zararlı yazılım (Malware) analizi temellerini öğrenmek."
            ]
        },
        uiux: {
            title: "Profesyonel UI/UX Tasarım Eğitimi",
            tag: "Tasarım",
            description: "Kullanıcı deneyimi (UX) araştırması yapmayı, kullanıcı arayüzü (UI) taslakları oluşturmayı ve Figma/Sketch gibi araçlarla prototip hazırlamayı öğrenin.",
            duration: "20 Saat",
            instructor: "Deniz Akın",
            certificate: "Var",
            outcomes: [
                "Kullanıcı ihtiyaç analizi (User Persona) ve senaryo oluşturma.",
                "Wireframe (tel kafes) ve High-Fidelity (yüksek çözünürlüklü) prototipler oluşturma.",
                "Erişilebilirlik (Accessibility) standartlarına uygun tasarım ilkelerini uygulamak.",
                "Tasarım süreçlerini (Design Thinking) adım adım yönetmek."
            ]
        },
        veribilimi: {
            title: "Büyük Veri Analizi ve Veri Görselleştirme",
            tag: "Yapay Zeka & Veri",
            description: "Büyük veri kümelerini işlemek, derinlemesine analizler yapmak ve bulguları etkili görselleştirme araçlarıyla sunmayı öğrenin.",
            duration: "32 Saat",
            instructor: "Burcu Öztürk",
            certificate: "Var",
            outcomes: [
                "SQL ile büyük veri tabanlarında sorgulama yapmak.",
                "Tableau veya Power BI gibi araçlarla etkileşimli panolar (dashboard) oluşturmak.",
                "İstatistiksel analiz yöntemlerini kullanarak anlamlı sonuçlar çıkarmak.",
                "Veri temizleme ve hazırlama (ETL) süreçlerini otomatikleştirmek."
            ]
        }
    };

    // --- FİLTRELEME İŞLEVİ ---

    /**
     * Kursları mevcut arama terimine ve seçili kategoriye göre filtreler.
     */
    function filterCourses() {
        const searchTerm = currentSearchTerm.toLowerCase().trim();

        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const cardCategory = card.dataset.category; 

            // 1. Arama Filtresi Kontrolü
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);

            // 2. Kategori Filtresi Kontrolü
            const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;

            // Hem arama terimiyle eşleşiyorsa hem de kategoriyle eşleşiyorsa göster
            if (matchesSearch && matchesCategory) {
                card.classList.remove('hidden');
                card.style.display = 'flex'; // CSS'teki varsayılan display
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });
    }

    // --- FİLTRELEME OLAY DİNLEYİCİLERİ ---

    // 1. Arama Çubuğu Olayı
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            currentSearchTerm = event.target.value;
            filterCourses();
        });
    }

    // 2. Kategori Butonu Olayı
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;

            // Radio input'u check et (CSS vurgusu için)
            const correspondingRadio = document.getElementById('filter-' + category);
            if (correspondingRadio) {
                correspondingRadio.checked = true; 
            }

            // JS ile filtreleme yapmak için kategori bilgisini kaydet
            currentCategory = category;
            filterCourses();

            // Arama çubuğunu temizle
            searchInput.value = '';
            currentSearchTerm = '';
        });
    });

    // Sayfa yüklendiğinde ilk filtrelemeyi yap
    filterCourses();

    // --- MODAL İŞLEMLERİ ---

    const modal = document.getElementById('course-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const detailButtons = document.querySelectorAll('.course-detail-btn');
    
    // Modal içindeki DOM elementlerini yakalama
    const modalTitle = document.getElementById('modal-title');
    const modalTag = document.getElementById('modal-tag');
    const modalDescription = document.getElementById('modal-description');
    const modalDuration = document.getElementById('modal-duration');
    const modalInstructor = document.getElementById('modal-instructor');
    const modalCertificate = document.getElementById('modal-certificate');
    const modalOutcomes = document.getElementById('modal-outcomes');


    /**
     * Tıklanan kursa ait modalı açar ve içeriğini doldurur.
     * @param {string} courseKey - courseData nesnesindeki anahtar (örneğin 'python')
     */
    function openCourseModal(courseKey) {
        const data = courseData[courseKey];

        if (!data) return; 

        // İçeriği doldur
        modalTitle.textContent = data.title;
        modalTag.textContent = data.tag;
        modalDescription.textContent = data.description;
        modalDuration.textContent = data.duration;
        modalInstructor.textContent = data.instructor;
        modalCertificate.textContent = data.certificate;

        // Öğrenim Çıktılarını temizle ve yeniden doldur
        modalOutcomes.innerHTML = '';
        data.outcomes.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            modalOutcomes.appendChild(li);
        });

        // Modalı göster
        modal.style.display = 'block';
        // Modal açıldığında body'nin kaymasını engelle
        document.body.style.overflow = 'hidden'; 
    }

    // Detaylı İncele Butonları için olay dinleyicisi
    detailButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Varsayılan buton davranışını engelle
            const courseKey = button.dataset.course;
            openCourseModal(courseKey);
        });
    });

    // Kapatma Butonu
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Kaymayı geri aç
    });

    // Modal dışına tıklanırsa kapat
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Kaymayı geri aç
        }
    });

    // ESC tuşuna basılırsa kapat
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});