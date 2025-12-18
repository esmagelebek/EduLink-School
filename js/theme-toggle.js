document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    // Butonun içindeki <i> ikon elementini seçiyoruz
    const icon = toggleButton ? toggleButton.querySelector('i') : null; 

    // 1. Temayı ve İkonu Güncelleyen Fonksiyon
    const updateTheme = (isDarkMode) => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            if (icon) {
                // Karanlık mod: Güneş ikonunu göster (Açık moda geçiş teklifi)
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            if (icon) {
                // Açık mod: Ay ikonunu göster (Karanlık moda geçiş teklifi)
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    };

    // 2. Yüklenirken Mevcut Temayı Kontrol Etme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        // Kaydedilmiş tema varsa onu kullan
        updateTheme(savedTheme === 'dark');
    } else {
        // Yoksa sistem tercihini kullan
        updateTheme(prefersDark);
    }

    // 3. Tıklama Olayı (Toggle Etme)
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            // Mevcut temanın tersine geçiş yap
            updateTheme(currentTheme !== 'dark');
        });
    }
});