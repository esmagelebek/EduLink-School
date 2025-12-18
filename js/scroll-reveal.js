document.addEventListener('DOMContentLoaded', () => {
    // 1. Gözlemlemek istediğimiz elementleri seç
    const revealElements = document.querySelectorAll('[data-reveal="true"]');

    // Elementin ne kadarının görünür olması gerektiğini belirleyen ayarlar
    const observerOptions = {
        root: null, // viewport (tarayıcı penceresi) kök olarak kullanılır
        rootMargin: '0px',
        // Elementin %15'i görünür olduğunda tetikle
        threshold: 0.15 
    };

    // Intersection Observer'ı oluştur
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element görünür hale geldiğinde (isIntersecting: true)
                const element = entry.target;
                
                // data-reveal-delay niteliğinden gecikme süresini al (Yoksa 0 kullan)
                const delay = parseInt(element.dataset.revealDelay) || 0;

                // Gecikme süresi kadar bekleyip animasyonu başlat
                setTimeout(() => {
                    element.classList.add('is-visible');
                    // Gözlemlemeyi durdur (Animasyon sadece bir kez çalışmalı)
                    observer.unobserve(element);
                }, delay);
            }
        });
    }, observerOptions);

    // 2. Her bir elementi gözlemlemeye başla
    revealElements.forEach(element => {
        observer.observe(element);
    });
});