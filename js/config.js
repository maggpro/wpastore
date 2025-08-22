// Конфигурация для WPA каталога
const WPA_CONFIG = {
    // GitHub настройки
    github: {
        owner: 'your-username',        // Ваш GitHub username
        repo: 'WPA.STORE',            // Название репозитория
        token: '',                     // GitHub Personal Access Token (оставьте пустым для публичного доступа)
        useIssuesAsDB: true,          // Использовать GitHub Issues как базу данных
        autoSync: true,               // Автоматическая синхронизация
        syncInterval: 5 * 60 * 1000   // Интервал синхронизации (5 минут)
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
    },
    
    // Загрузить конфигурацию из LocalStorage
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('wpa_config');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(WPA_CONFIG, parsed);
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
    }
};

// Инициализация конфигурации
document.addEventListener('DOMContentLoaded', () => {
    ConfigManager.loadFromLocalStorage();
    
    // Проверяем GitHub настройки
    const githubValidation = ConfigManager.validateGitHubConfig();
    if (!githubValidation.valid) {
        console.warn('GitHub конфигурация не настроена:', githubValidation.message);
    }
});

// Глобальные функции конфигурации
window.WPA_CONFIG = WPA_CONFIG;
window.ConfigManager = ConfigManager;
