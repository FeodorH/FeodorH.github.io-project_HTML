// ===== ФУНКЦИИ ДЛЯ СЛАЙДЕРА =====
function initializeSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    // Функция для показа слайда
    function showSlide(index) {
        // Корректируем индекс
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        currentSlide = index;
        
        // Скрываем все слайды
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Показываем текущий слайд
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }
    
    // Следующий слайд
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Обработчики событий
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Переход по точкам
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            showSlide(parseInt(this.dataset.slide));
        });
    });
    
    // Инициализация
    showSlide(0);
}

// ===== ФУНКЦИИ ДЛЯ ФОРМЫ =====
function initializeForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');
    
    // Валидация поля
    function validateField(field) {
        const value = field.value.trim();
        let error = '';
        
        // Очистка предыдущих ошибок
        field.classList.remove('error', 'valid');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
        
        // Проверка обязательных полей
        if (field.hasAttribute('required') && !value) {
            error = 'Это поле обязательно для заполнения';
        }
        
        // Проверка email
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = 'Введите корректный email адрес';
            }
        }
        
        // Проверка телефона (обновленная регулярка)
        else if (field.name === 'phone' && value) {
            // Разрешаем любой формат с цифрами, скобками, пробелами, дефисами и плюсом
            const phoneRegex = /^[\+\d][\d\s\-\(\)]{9,}$/;
            const cleanPhone = value.replace(/\D/g, '');
            
            if (!phoneRegex.test(value) || cleanPhone.length < 10) {
                error = 'Введите корректный номер телефона (минимум 10 цифр)';
            }
        }
        
        // Проверка длины
        else if (field.hasAttribute('minlength') && value.length < parseInt(field.minlength)) {
            error = `Минимум ${field.minlength} символов`;
        }
        else if (field.hasAttribute('maxlength') && value.length > parseInt(field.maxlength)) {
            error = `Максимум ${field.maxlength} символов`;
        }
        
        // Отображение результата
        if (error) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = 'color: #e74c3c; font-size: 12px; margin-top: 5px;';
            errorDiv.textContent = error;
            field.parentNode.appendChild(errorDiv);
        } else if (value) {
            field.classList.add('valid');
        }
        
        return !error;
    }
    
    // Валидация всей формы
    function validateForm() {
        let isValid = true;
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Сообщения формы
    function showMessage(type, text) {
        if (!formMessage) return;
        
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => formMessage.style.display = 'none', 5000);
        }
    }
    
    // Индикатор загрузки
    function setLoading(isLoading) {
        if (!submitBtn || !btnText || !btnLoader) return;
        
        submitBtn.disabled = isLoading;
        btnText.style.display = isLoading ? 'none' : 'inline';
        btnLoader.style.display = isLoading ? 'inline-flex' : 'none';
    }
    
    // Валидация при потере фокуса
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', function() {
            this.classList.remove('error', 'valid');
            const errorDiv = this.parentNode.querySelector('.field-error');
            if (errorDiv) errorDiv.remove();
        });
    });
    
    // Отправка формы
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showMessage('error', 'Исправьте ошибки в форме');
            return;
        }
        
        setLoading(true);
        showMessage('info', 'Отправка...');
        
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                showMessage('success', 'Сообщение отправлено! Мы скоро свяжемся с вами.');
                contactForm.reset();
                contactForm.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
            } else {
                showMessage('error', 'Ошибка отправки. Попробуйте еще раз.');
            }
        } catch {
            showMessage('error', 'Ошибка сети. Проверьте соединение.');
        } finally {
            setLoading(false);
        }
    });
}

// ===== ФУНКЦИИ ДЛЯ НАВИГАЦИИ =====
function initializeNavigation() {
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (!target) return;
            
            e.preventDefault();
            
            // Закрытие мобильного меню
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu?.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Прокрутка
            const header = document.querySelector('.navbar');
            const offset = header ? header.offsetHeight : 0;
            const position = target.offsetTop - offset;
            
            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });
            
            // Обновление активной ссылки
            updateActiveLink(targetId);
        });
    });
    
    // Активная ссылка при прокрутке
    function updateActiveLink(targetId) {
        document.querySelectorAll('.nav-menu a, .mobile-menu a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === targetId);
        });
    }
    
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (menuClose && mobileMenu) {
        menuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Закрытие по клику на ссылку в мобильном меню
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Закрытие по клику вне меню
    document.addEventListener('click', (e) => {
        if (mobileMenu?.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !menuToggle?.contains(e.target)) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    initializeSlider();
    initializeForm();
    initializeNavigation();
    
    // Выпадающие меню
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            const menu = this.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.cssText = 'opacity: 1; visibility: visible; transform: translateY(0);';
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            const menu = this.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.cssText = 'opacity: 0; visibility: hidden; transform: translateY(10px);';
            }
        });
    });
});