// Конфигурация для WPA каталога
const WPA_CONFIG = {
    // GitHub настройки
    github: {
        owner: 'maggpro',             // GitHub username для публичного каталога
        repo: 'wpastore',             // Название репозитория для публичного каталога
        token: '',                     // GitHub Personal Access Token (только для админов)
        useIssuesAsDB: true,          // Использовать GitHub Issues как публичную базу данных
        autoSync: true,               // Автоматическая синхронизация
        syncInterval: 5 * 60 * 1000,  // Интервал синхронизации (5 минут)
        publicReadOnly: true          // Публичный доступ только для чтения
    },
    
    // Настройки приложения
    app: {
        name: 'WPA.STORE',
        version: '2.0.0',
        description: 'Магазин WPA приложений с GitHub интеграцией',
        defaultCategory: 'productivity',
        itemsPerPage: 12,
        searchDebounce: 300,
        enableNotifications: true,
        enableAnimations: true
    },
    
    // Настройки UI
    ui: {
        theme: 'light',               // light, dark, auto
        language: 'ru',               // ru, en
        showRatings: true,
        showDownloads: true,
        showCategories: true,
        enableFilters: true,
        enableSorting: true
    },
    
    // Настройки кэширования
    cache: {
        enabled: true,
        maxAge: 10 * 60 * 1000,      // 10 минут
        storageKey: 'wpa_catalog_cache'
    }
};

// Функции для работы с конфигурацией
const ConfigManager = {
    // Получить значение конфигурации
    get(key, defaultValue = null) {
        const keys = key.split('.');
        let value = WPA_CONFIG;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue;
            }
        }
        
        return value;
    },
    
    // Установить значение конфигурации
    set(key, value) {
        const keys = key.split('.');
        const lastKey = keys.pop();
        let target = WPA_CONFIG;
        
        for (const k of keys) {
            if (!target[k] || typeof target[k] !== 'object') {
                target[k] = {};
            }
            target = target[k];
        }
        
        target[lastKey] = value;
        this.saveToLocalStorage();
        
        // Если устанавливаем токен, сохраняем его только для текущей сессии
        if (key === 'github.token' && value) {
            sessionStorage.setItem('github_token', value);
            console.log('🔑 GitHub токен установлен для текущей сессии (админ режим)');
        }
    },
    
    // Загрузить конфигурацию из LocalStorage
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('wpa_config');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(WPA_CONFIG, parsed);
            }
            
            // Проверяем URL параметры для токена (только для админов)
            const urlParams = new URLSearchParams(window.location.search);
            const tokenFromUrl = urlParams.get('token');
            if (tokenFromUrl && tokenFromUrl.startsWith('github_pat_')) {
                WPA_CONFIG.github.token = tokenFromUrl;
                console.log('🔑 GitHub токен загружен из URL параметров (админ режим)');
            }
        } catch (error) {
            console.error('Ошибка загрузки конфигурации:', error);
        }
    },
    
    // Сохранить конфигурацию в LocalStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('wpa_config', JSON.stringify(WPA_CONFIG));
        } catch (error) {
            console.error('Ошибка сохранения конфигурации:', error);
        }
    },
    
    // Сбросить конфигурацию к значениям по умолчанию
    reset() {
        // Перезагружаем страницу для сброса
        if (confirm('Сбросить все настройки? Это перезагрузит страницу.')) {
            localStorage.removeItem('wpa_config');
            localStorage.removeItem('wpa_catalog_data');
            location.reload();
        }
    },
    
    // Проверить валидность GitHub настроек
    validateGitHubConfig() {
        const owner = this.get('github.owner');
        const repo = this.get('github.repo');
        
        if (!owner || owner === 'your-username') {
            return {
                valid: false,
                message: 'Не настроен GitHub username'
            };
        }
        
        if (!repo) {
            return {
                valid: false,
                message: 'Не настроено название репозитория'
            };
        }
        
        return { valid: true };
    },
    
    // Получить GitHub URL
    getGitHubUrl() {
        const owner = this.get('github.owner');
        const repo = this.get('github.repo');
        return `https://github.com/${owner}/${repo}`;
    },
    
    // Получить GitHub Issues URL
    getGitHubIssuesUrl() {
        return `${this.getGitHubUrl()}/issues`;
    },
    
    // Получить GitHub API URL
    getGitHubApiUrl() {
        const owner = this.get('github.owner');
        const repo = this.get('github.repo');
        return `https://api.github.com/repos/${owner}/${repo}`;
    },
    
    // Быстрая установка GitHub токена (только для админов)
    setGitHubToken(token) {
        if (token && token.startsWith('github_pat_')) {
            this.set('github.token', token);
            console.log('🔑 GitHub токен установлен (админ режим)');
            return true;
        } else {
            console.error('❌ Неверный формат GitHub токена');
            return false;
        }
    },
    
    // Проверить, настроен ли токен (админ режим)
    hasGitHubToken() {
        return !!this.get('github.token');
    },
    
    // Проверить, доступен ли админ режим
    isAdminMode() {
        return this.hasGitHubToken();
    },
    
    // Получить режим работы
    getWorkMode() {
        if (this.isAdminMode()) {
            return 'admin';
        } else {
            return 'public';
        }
    }
};

// Инициализация конфигурации
document.addEventListener('DOMContentLoaded', () => {
    ConfigManager.loadFromLocalStorage();
    
    // Проверяем GitHub настройки
    const githubValidation = ConfigManager.validateGitHubConfig();
    if (!githubValidation.valid) {
        console.warn('GitHub конфигурация не настроена:', githubValidation.message);
    } else {
        console.log('✅ GitHub конфигурация валидна');
        console.log('📡 Репозиторий:', ConfigManager.getGitHubUrl());
        console.log('🔑 Режим работы:', ConfigManager.getWorkMode());
        console.log('👑 Админ режим:', ConfigManager.isAdminMode() ? 'Доступен' : 'Недоступен');
    }
    
    // Добавляем глобальную функцию для установки токена (только для админов)
    window.setGitHubToken = (token) => {
        if (ConfigManager.setGitHubToken(token)) {
            console.log('🎉 GitHub токен установлен! Админ режим активирован.');
            // Перезагружаем страницу для применения токена
            setTimeout(() => location.reload(), 1000);
        }
    };
    
    // Добавляем глобальную функцию для проверки режима
    window.getWorkMode = () => ConfigManager.getWorkMode();
    window.isAdminMode = () => ConfigManager.isAdminMode();
});

// Глобальные функции конфигурации
window.WPA_CONFIG = WPA_CONFIG;
window.ConfigManager = ConfigManager;
