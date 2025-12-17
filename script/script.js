// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
        });
    }
    
    // Выпадающее меню для десктопа
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        if (window.innerWidth > 991) {
            // Для десктопа - по наведению
            dropdown.addEventListener('mouseenter', function() {
                this.querySelector('.dropdown-menu').style.display = 'block';
            });
            
            dropdown.addEventListener('mouseleave', function() {
                this.querySelector('.dropdown-menu').style.display = 'none';
            });
        } else {
            // Для мобильных - по клику
            const dropdownToggle = dropdown.querySelector('a');
            
            dropdownToggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 991) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            mainMenu.classList.remove('active');
            
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Закрытие меню
                    mainMenu.classList.remove('active');
                }
            }
        });
    });
});

// Адаптация меню при изменении размера окна
window.addEventListener('resize', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const mainMenu = document.getElementById('main-menu');
    
    if (window.innerWidth > 991) {
        // Для десктопа
        mainMenu.classList.remove('active');
        
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            dropdown.querySelector('.dropdown-menu').style.display = 'none';
        });
    } else {
        // Для мобильных
        dropdowns.forEach(dropdown => {
            dropdown.querySelector('.dropdown-menu').style.display = 'none';
        });
    }
});
