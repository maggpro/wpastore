// Device Detector для WPA.STORE
class DeviceDetector {
    constructor() {
        this.isMobile = this.checkIfMobile();
        this.init();
    }

    // Проверка мобильного устройства
    checkIfMobile() {
        // Проверяем User Agent
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = [
            'android', 'iphone', 'ipad', 'ipod', 'blackberry', 
            'windows phone', 'mobile', 'tablet', 'opera mini'
        ];
        
        const isMobileUA = mobileKeywords.some(keyword => 
            userAgent.includes(keyword)
        );

        // Проверяем размер экрана
        const isMobileScreen = window.innerWidth <= 768;
        
        // Проверяем touch поддержку
        const isTouchDevice = 'ontouchstart' in window || 
                             navigator.maxTouchPoints > 0;

        // Проверяем ориентацию
        const isPortrait = window.innerHeight > window.innerWidth;

        // Комбинированная проверка
        return isMobileUA || (isMobileScreen && isTouchDevice) || isPortrait;
    }

    // Инициализация
    init() {
        // Проверяем текущую страницу
        const currentPage = window.location.pathname.split('/').pop();
        
        // Если это главная страница и устройство мобильное
        if ((currentPage === '' || currentPage === 'index.html') && this.isMobile) {
            this.redirectToMobile();
        }
        
        // Если это мобильная версия и устройство десктопное
        if (currentPage === 'index-mobile.html' && !this.isMobile) {
            this.redirectToDesktop();
        }

        // Добавляем кнопку переключения версий
        this.addVersionToggle();
    }

    // Редирект на мобильную версию
    redirectToMobile() {
        // Проверяем, не переходили ли мы уже
        if (!sessionStorage.getItem('redirectedToMobile')) {
            sessionStorage.setItem('redirectedToMobile', 'true');
            
            // Показываем уведомление
            this.showRedirectNotification('Переключаемся на мобильную версию...', () => {
                window.location.href = 'index-mobile.html';
            });
        }
    }

    // Редирект на десктопную версию
    redirectToDesktop() {
        if (!sessionStorage.getItem('redirectedToDesktop')) {
            sessionStorage.setItem('redirectedToDesktop', 'true');
            
            this.showRedirectNotification('Переключаемся на десктопную версию...', () => {
                window.location.href = 'index.html';
            });
        }
    }

    // Показать уведомление о редиректе
    showRedirectNotification(message, callback) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'redirect-notification';
        notification.innerHTML = `
            <div class="redirect-content">
                <i class="fas fa-mobile-alt"></i>
                <span>${message}</span>
                <button class="redirect-close">×</button>
            </div>
        `;
        
        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideDown 0.3s ease-out;
        `;

        // Стили для содержимого
        const content = notification.querySelector('.redirect-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;

        // Стили для иконки
        const icon = notification.querySelector('i');
        icon.style.cssText = `
            font-size: 1.2rem;
            color: #ffd700;
        `;

        // Стили для кнопки закрытия
        const closeBtn = notification.querySelector('.redirect-close');
        closeBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 1.2rem;
            line-height: 1;
            margin-left: 0.5rem;
            transition: background 0.3s ease;
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.3)';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.2)';
        });

        // Обработка закрытия
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Добавляем на страницу
        document.body.appendChild(notification);

        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
                if (callback) callback();
            }
        }, 3000);

        // CSS анимация
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Добавить кнопку переключения версий
    addVersionToggle() {
        // Создаем кнопку переключения
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'version-toggle';
        toggleBtn.innerHTML = `
            <button class="toggle-button" title="Переключить версию">
                <i class="fas fa-mobile-alt"></i>
            </button>
        `;

        // Стили для кнопки
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
        `;

        const button = toggleBtn.querySelector('.toggle-button');
        button.style.cssText = `
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
        });

        // Обработка клика
        button.addEventListener('click', () => {
            const currentPage = window.location.pathname.split('/').pop();
            
            if (currentPage === 'index-mobile.html') {
                // Переход на десктопную версию
                window.location.href = 'index.html';
            } else {
                // Переход на мобильную версию
                window.location.href = 'index-mobile.html';
            }
        });

        // Добавляем на страницу
        document.body.appendChild(toggleBtn);

        // Скрываем кнопку на очень маленьких экранах
        if (window.innerWidth <= 480) {
            toggleBtn.style.display = 'none';
        }
    }

    // Статические методы для использования в других скриптах
    static isMobile() {
        return new DeviceDetector().isMobile;
    }

    static isDesktop() {
        return !new DeviceDetector().isMobile;
    }

    static getDeviceType() {
        const detector = new DeviceDetector();
        return detector.isMobile ? 'mobile' : 'desktop';
    }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    new DeviceDetector();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeviceDetector;
}
