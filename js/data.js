// Данные для WPA каталога
const WPA_DATA = {
    // Категории приложений
    categories: [
        {
            id: 'productivity',
            name: 'Продуктивность',
            icon: 'fas fa-briefcase',
            description: 'Приложения для повышения эффективности работы',
            color: '#667eea'
        },
        {
            id: 'entertainment',
            name: 'Развлечения',
            icon: 'fas fa-gamepad',
            description: 'Игры и развлекательные приложения',
            color: '#f093fb'
        },
        {
            id: 'social',
            name: 'Социальные сети',
            icon: 'fas fa-users',
            description: 'Приложения для общения и социальных сетей',
            color: '#4facfe'
        },
        {
            id: 'education',
            name: 'Образование',
            icon: 'fas fa-graduation-cap',
            description: 'Обучающие приложения и курсы',
            color: '#43e97b'
        },
        {
            id: 'health',
            name: 'Здоровье',
            icon: 'fas fa-heartbeat',
            description: 'Приложения для здоровья и фитнеса',
            color: '#fa709a'
        },
        {
            id: 'finance',
            name: 'Финансы',
            icon: 'fas fa-wallet',
            description: 'Банковские и финансовые приложения',
            color: '#ffecd2'
        },
        {
            id: 'travel',
            name: 'Путешествия',
            icon: 'fas fa-plane',
            description: 'Приложения для путешествий и навигации',
            color: '#a8edea'
        },
        {
            id: 'shopping',
            name: 'Покупки',
            icon: 'fas fa-shopping-cart',
            description: 'Магазины и сервисы покупок',
            color: '#ff9a9e'
        }
    ],

    // Примеры приложений
    apps: [
        {
            id: 1,
            name: 'Calm - Дыхательные упражнения',
            description: 'Приложение для медитации и дыхательных упражнений. Помогает снять стресс, улучшить сон и общее самочувствие. Включает различные техники дыхания, звуки природы и управляемые медитации.',
            category: 'health',
            developer: 'MaggPro',
            version: '1.0.0',
            rating: 4.9,
            downloads: 25000,
            website: 'https://maggpro.github.io/calm/#breath',
            icon: 'https://maggpro.github.io/calm/assets/icon-192.png',
            screenshots: [
                'https://maggpro.github.io/calm/assets/screenshot1.png',
                'https://maggpro.github.io/calm/assets/screenshot2.png'
            ],
            features: ['Дыхательные упражнения', 'Медитации', 'Звуки природы', 'Таймер сна', 'Отслеживание прогресса'],
            status: 'approved',
            featured: true,
            dateAdded: '2024-01-20'
        },
        {
            id: 2,
            name: 'WPA Task Manager',
            description: 'Мощный менеджер задач с возможностью создания проектов, установки дедлайнов и отслеживания прогресса.',
            category: 'productivity',
            developer: 'WPA Solutions',
            version: '2.1.0',
            rating: 4.8,
            downloads: 15420,
            website: 'https://wpataskmanager.com',
            icon: '', // Используем FontAwesome иконку
            screenshots: [
                'https://via.placeholder.com/400x300/667eea/ffffff?text=Screenshot+1',
                'https://via.placeholder.com/400x300/667eea/ffffff?text=Screenshot+2'
            ],
            features: ['Управление проектами', 'Таймер Pomodoro', 'Синхронизация', 'Отчеты'],
            status: 'approved',
            dateAdded: '2024-01-15'
        },
        {
            id: 3,
            name: 'WPA Chat',
            description: 'Быстрый и безопасный мессенджер для общения с друзьями и коллегами.',
            category: 'social',
            developer: 'WPA Communications',
            version: '1.5.2',
            rating: 4.6,
            downloads: 8920,
            website: 'https://wpachat.com',
            icon: '', // Используем FontAwesome иконку
            screenshots: [
                'https://via.placeholder.com/400x300/4facfe/ffffff?text=Screenshot+1',
                'https://via.placeholder.com/400x300/4facfe/ffffff?text=Screenshot+2'
            ],
            features: ['Групповые чаты', 'Голосовые сообщения', 'Шифрование', 'Файлы'],
            status: 'approved',
            dateAdded: '2024-01-10'
        },
        {
            id: 4,
            name: 'WPA Fitness Tracker',
            description: 'Отслеживайте свои тренировки, питание и прогресс в достижении фитнес-целей.',
            category: 'health',
            developer: 'WPA Health',
            version: '3.0.1',
            rating: 4.9,
            downloads: 12350,
            website: 'https://wpafitness.com',
            icon: '', // Используем FontAwesome иконку
            screenshots: [
                'https://via.placeholder.com/400x300/fa709a/ffffff?text=Screenshot+1',
                'https://via.placeholder.com/400x300/fa709a/ffffff?text=Screenshot+2'
            ],
            features: ['Отслеживание тренировок', 'Дневник питания', 'Аналитика', 'Социальные функции'],
            status: 'approved',
            dateAdded: '2024-01-08'
        },
        {
            id: 5,
            name: 'WPA Language Learning',
            description: 'Изучайте новые языки с помощью интерактивных уроков и практических упражнений.',
            category: 'education',
            developer: 'WPA Education',
            version: '2.3.0',
            rating: 4.7,
            downloads: 6780,
            website: 'https://wpalanguage.com',
            icon: '', // Используем FontAwesome иконку
            screenshots: [
                'https://via.placeholder.com/400x300/43e97b/ffffff?text=Screenshot+1',
                'https://via.placeholder.com/400x300/43e97b/ffffff?text=Screenshot+2'
            ],
            features: ['Интерактивные уроки', 'Говорение', 'Грамматика', 'Прогресс'],
            status: 'approved',
            dateAdded: '2024-01-05'
        },
        {
            id: 6,
            name: 'WPA Budget Manager',
            description: 'Управляйте своими финансами, отслеживайте расходы и планируйте бюджет.',
            category: 'finance',
            developer: 'WPA Finance',
            version: '1.8.5',
            rating: 4.5,
            downloads: 4560,
            website: 'https://wpabudget.com',
            icon: '', // Используем FontAwesome иконку
            screenshots: [
                'https://via.placeholder.com/400x300/ffecd2/333333?text=Screenshot+1',
                'https://via.placeholder.com/400x300/ffecd2/333333?text=Screenshot+2'
            ],
            features: ['Отслеживание расходов', 'Планирование бюджета', 'Категории', 'Отчеты'],
            status: 'approved',
            dateAdded: '2024-01-03'
        }
    ],

    // Приложения на рассмотрении
    pendingApps: [
        {
            id: 7,
            name: 'WPA Recipe Book',
            description: 'Коллекция рецептов с пошаговыми инструкциями и возможностью создания собственных рецептов.',
            category: 'lifestyle',
            developer: 'WPA Kitchen',
            version: '1.0.0',
            rating: 0,
            downloads: 0,
            website: 'https://wparecipes.com',
            icon: 'https://via.placeholder.com/80/ff9a9e/ffffff?text=RB',
            screenshots: [
                'https://via.placeholder.com/400x300/ff9a9e/ffffff?text=Screenshot+1'
            ],
            features: ['Коллекция рецептов', 'Пошаговые инструкции', 'Создание рецептов', 'Поиск'],
            status: 'pending',
            dateAdded: '2024-01-20'
        }
    ]
};

// Функции для работы с данными
const DataManager = {
    // Получить все одобренные приложения
    getApprovedApps() {
        return WPA_DATA.apps.filter(app => app.status === 'approved');
    },

    // Получить приложения по категории
    getAppsByCategory(categoryId) {
        return WPA_DATA.apps.filter(app => app.category === categoryId && app.status === 'approved');
    },

    // Получить приложения на рассмотрении
    getPendingApps() {
        return WPA_DATA.pendingApps;
    },

    // Получить приложение по ID
    getAppById(id) {
        const allApps = [...WPA_DATA.apps, ...WPA_DATA.pendingApps];
        return allApps.find(app => app.id === id);
    },

    // Получить категорию по ID
    getCategoryById(id) {
        return WPA_DATA.categories.find(cat => cat.id === id);
    },

    // Поиск приложений
    searchApps(query) {
        const searchTerm = query.toLowerCase();
        return WPA_DATA.apps.filter(app => 
            app.name.toLowerCase().includes(searchTerm) ||
            app.description.toLowerCase().includes(searchTerm) ||
            app.developer.toLowerCase().includes(searchTerm)
        );
    },

    // Получить рекомендуемые приложения (по рейтингу)
    getFeaturedApps() {
        return WPA_DATA.apps
            .filter(app => app.status === 'approved')
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);
    },

    // Получить недавно добавленные приложения
    getRecentApps() {
        return WPA_DATA.apps
            .filter(app => app.status === 'approved')
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 6);
    },

    // Добавить новое приложение
    addApp(appData) {
        const newApp = {
            ...appData,
            id: Date.now(),
            rating: 0,
            downloads: 0,
            status: 'pending',
            dateAdded: new Date().toISOString().split('T')[0]
        };
        WPA_DATA.pendingApps.push(newApp);
        this.saveToLocalStorage();
        console.log('Добавлено новое приложение:', newApp);
        return newApp;
    },

    // Одобрить приложение
    approveApp(appId) {
        const pendingIndex = WPA_DATA.pendingApps.findIndex(app => app.id === appId);
        if (pendingIndex !== -1) {
            const app = WPA_DATA.pendingApps.splice(pendingIndex, 1)[0];
            app.status = 'approved';
            WPA_DATA.apps.push(app);
            this.saveToLocalStorage();
            console.log('Приложение одобрено:', app);
            return true;
        }
        return false;
    },

    // Отклонить приложение
    rejectApp(appId) {
        const pendingIndex = WPA_DATA.pendingApps.findIndex(app => app.id === appId);
        if (pendingIndex !== -1) {
            const app = WPA_DATA.pendingApps.splice(pendingIndex, 1)[0];
            this.saveToLocalStorage();
            console.log('Приложение отклонено:', app);
            return true;
        }
        return false;
    },

    // Сохранить в LocalStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('wpa_catalog_data', JSON.stringify(WPA_DATA));
            console.log('Данные сохранены в LocalStorage');
        } catch (error) {
            console.error('Ошибка сохранения в LocalStorage:', error);
        }
    },

    // Загрузить из LocalStorage
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('wpa_catalog_data');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(WPA_DATA, parsed);
                console.log('Данные загружены из LocalStorage');
            }
        } catch (error) {
            console.error('Ошибка загрузки из LocalStorage:', error);
        }
    },

    // Инициализация данных
    init() {
        this.loadFromLocalStorage();
        // Если данных нет, используем начальные
        if (!localStorage.getItem('wpa_catalog_data')) {
            this.saveToLocalStorage();
        }
        console.log('DataManager инициализирован');
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    DataManager.init();
    console.log('WPA_DATA загружен:', WPA_DATA);
});
