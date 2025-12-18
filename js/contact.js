document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    // E-posta formatı kontrolü için basit regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    /**
     * Hata mesajını gösterir ve ilgili input'a hata sınıfı ekler.
     */
    function displayError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        const errorDiv = document.getElementById(inputElement.id + '-error');
        
        if (formGroup && errorDiv) {
            formGroup.classList.add('has-error');
            errorDiv.textContent = message;
        }
    }

    /**
     * Hata mesajını temizler ve ilgili input'tan hata sınıfını kaldırır.
     */
    function clearError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        const errorDiv = document.getElementById(inputElement.id + '-error');
        
        if (formGroup && errorDiv) {
            formGroup.classList.remove('has-error');
            errorDiv.textContent = '';
        }
    }

    /**
     * Tüm form alanlarını doğrulayan ana işlev.
     */
    function validateForm() {
        // Tüm hataları temizle
        [document.getElementById('name'), document.getElementById('email'), document.getElementById('message')].forEach(clearError);

        // Her alanı sırayla kontrol et ve sonucu topla
        const isNameValid = validateName(document.getElementById('name'));
        const isEmailValid = validateEmail(document.getElementById('email'));
        const isMessageValid = validateMessage(document.getElementById('message'));
        
        // Genel geçerliliği belirle
        return isNameValid && isEmailValid && isMessageValid;
    }

    /**
     * Form geri bildirim mesajını (başarı/hata) gösterir.
     */
    function showFeedback(type, message) {
        formMessage.textContent = message;
        formMessage.className = 'form-feedback'; // Sınıfları sıfırla
        formMessage.classList.add(type);
        
        // Birkaç saniye sonra gizle
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000); // 5 saniye sonra gizle
    }


    // --- ALAN BAZLI DOĞRULAMA FONKSİYONLARI ---
    
    function validateName(input) {
        const value = input.value.trim();
        clearError(input); // Önceki hatayı temizle
        
        if (value.length === 0) {
            displayError(input, 'Ad soyad alanı boş bırakılamaz.');
            return false;
        }
        
        // 1. Boşluk kontrolü (Ad ve Soyad ayrımı)
        if (!value.includes(' ')) {
             displayError(input, 'Lütfen adınız ve soyadınız arasında boşluk bırakarak tam adınızı girin.');
             return false;
        }

        // 2. Ad ve Soyadı ayır
        // LastIndexOf ile birden fazla kelime olsa bile son kelimeyi (soyadı) alırız.
        const nameParts = value.split(' ');
        const surname = nameParts[nameParts.length - 1]; // Son kelimeyi soyadı varsay
        
        // 3. Soyadı uzunluk kontrolü (YENİ KONTROL)
        if (surname.length < 3) {
             displayError(input, 'Soyadınız en az 3 karakter olmalıdır.');
             return false;
        }
        
        // Genel minimum uzunluk (opsiyonel ama iyi bir pratik)
        if (value.length < 5) { // Örneğin "Ali Yıl" toplamda 6 karakter
             displayError(input, 'Ad soyad toplamda en az 5 karakter olmalıdır.');
             return false;
        }
        
        return true;
    }

    function validateEmail(input) {
        const value = input.value.trim();
        clearError(input);
        if (value.length === 0) {
            displayError(input, 'E-posta adresi boş bırakılamaz.');
            return false;
        } else if (!emailRegex.test(value)) {
            displayError(input, 'Geçerli bir e-posta adresi girin.');
            return false;
        }
        return true;
    }

    function validateMessage(input) {
        const value = input.value.trim();
        clearError(input);
        if (value.length === 0) {
            displayError(input, 'Mesaj alanı boş bırakılamaz.');
            return false;
        } else if (value.length < 10) {
            displayError(input, 'Mesajınız en az 10 karakter olmalıdır.');
            return false;
        }
        return true;
    }

    // --- Olay Dinleyicileri ---

    // Form Gönderimi Olayı
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Varsayılan gönderimi durdur

        formMessage.classList.add('hidden'); // Yeni gönderimde eski mesajı gizle

        if (validateForm()) {
            // Form geçerliyse
            
            console.log('Form verileri:', new FormData(form));

            showFeedback('success', 'Mesajınız başarıyla gönderildi! Kısa süre içinde size dönüş yapacağız.');
            
            // Formu temizle
            form.reset();
            
            // Hata işaretlerini de temizle
            form.querySelectorAll('.form-group.has-error').forEach(group => {
                group.classList.remove('has-error');
            });
            
        } else {
            showFeedback('error', 'Lütfen hatalı alanları kontrol edip düzeltin.');
        }
    });

    // Anlık Geri Bildirim (Kullanıcı alandan ayrıldığında)
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.id === 'name') validateName(input);
            if (input.id === 'email') validateEmail(input);
            if (input.id === 'message') validateMessage(input);
        });
        
        // Kullanıcı yazarken hatalı alanın kırmızı çerçevesini hemen kaldırmak için
        input.addEventListener('input', () => {
            if (input.id === 'name') {
                 // Basit ve hızlı temizleme (daha fazla yazıldıkça)
                 const value = input.value.trim();
                 if (value.length >= 5 && value.includes(' ') && value.split(' ').pop().length >= 3) {
                     clearError(input);
                 }
            } else if (input.id === 'email' && emailRegex.test(input.value.trim())) {
                 clearError(input);
            } else if (input.id === 'message' && input.value.trim().length >= 10) {
                 clearError(input);
            }
        });
    });
});