// WPA.STORE Mobile App - Полностью переписанная версия
class WPAMobileApp {
    constructor() {
        this.currentPage = 'home';
        this.searchQuery = '';
        this.init();
    }

    init() {
        console.log('🚀 Инициализация мобильного приложения WPA.STORE...');
        
        // Инициализация компонентов
        this.initComponents();
        
        // Инициализация страниц
        this.initPages();
        
        // Инициализация навигации
        this.setupNavigation();
        
        // Инициализация поиска
        this.initSearch();
        
        // Инициализация форм
        this.initForms();
        
        // Инициализация PWA
        this.initPWA();
        
        // Загрузка данных
        this.loadData();
        
        // Показываем домашнюю страницу
        this.showPage('home');
        
        // Откладываем настройку событий до полной загрузки DOM
        setTimeout(() => {
            this.setupEvents();
        }, 100);
        
        console.log('✅ Мобильное приложение инициализировано');
    }

    // Инициализация компонентов
    initComponents() {
        console.log('🔧 Инициализация компонентов...');
        if (typeof Components !== 'undefined') {
            Components.init();
        }
    }

    // Инициализация страниц
    initPages() {
        console.log('📱 Инициализация страниц...');
        
        // Заполняем категории в форме добавления приложения
        const categorySelect = document.getElementById('appCategory');
        if (categorySelect && typeof WPA_DATA !== 'undefined') {
            categorySelect.innerHTML = '<option value="">Выберите категорию</option>';
            WPA_DATA.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
            console.log('Категории добавлены в форму:', WPA_DATA.categories.length);
        }
    }

    // Настройка навигации
    setupNavigation() {
        console.log('🧭 Настройка навигации...');
        
        // Находим все tab-link элементы
        const tabLinks = document.querySelectorAll('.tab-link');
        console.log('Найдено tab-link элементов:', tabLinks.length);
        
        tabLinks.forEach((link, index) => {
            const page = link.getAttribute('data-page');
            console.log(`Настройка tab-link ${index + 1}:`, page);
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('👆 Клик по tab-link:', page);
                this.showPage(page);
            });
        });
    }

    // Показать страницу
    showPage(pageName) {
        console.log('🔄 Переход на страницу:', pageName);
        
        // Скрываем все страницы
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.style.display = 'none';
        });
        
        // Показываем нужную страницу
        const targetPage = document.querySelector(`[data-name="${pageName}"]`);
        if (targetPage) {
            targetPage.style.display = 'block';
            this.currentPage = pageName;
            console.log('✅ Страница показана:', pageName);
            
            // Загружаем контент страницы
            this.loadPageContent(pageName);
        } else {
            console.error('❌ Страница не найдена:', pageName);
        }
        
        // Обновляем активную вкладку
        this.updateActiveTab(pageName);
    }

    // Обновление активной вкладки
    updateActiveTab(pageName) {
        const tabLinks = document.querySelectorAll('.tab-link');
        tabLinks.forEach(link => {
            link.classList.remove('tab-link-active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('tab-link-active');
            }
        });
    }

    // Загрузка контента страницы
    loadPageContent(pageName) {
        console.log('📥 Загрузка контента для страницы:', pageName);
        
        switch (pageName) {
            case 'home':
                this.loadHomePage();
                break;
            case 'categories':
                this.loadCategoriesPage();
                break;
            case 'submit':
                this.loadSubmitPage();
                break;
            case 'admin':
                this.loadAdminPage();
                break;
            case 'settings':
                this.loadSettingsPage();
                break;
            default:
                console.warn('⚠️ Неизвестная страница:', pageName);
        }
    }

    // Инициализация поиска
    initSearch() {
        console.log('🔍 Инициализация поиска...');
        
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-button');

        if (searchInput && searchBtn) {
            // Поиск по кнопке
            searchBtn.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });

            // Поиск по Enter
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });

            console.log('✅ Поиск инициализирован');
        } else {
            console.error('❌ Элементы поиска не найдены');
        }
    }

    // Выполнение поиска
    performSearch(query) {
        console.log('🔍 Выполнение поиска:', query);
        
        this.searchQuery = query.trim();
        
        if (!this.searchQuery) {
            return;
        }

        // Создаем страницу результатов поиска
        const searchResults = this.searchApps(this.searchQuery);
        console.log('Результаты поиска:', searchResults.length);
        
        // Показываем результаты на главной странице
        this.showSearchResults(searchResults);
    }

    // Поиск приложений
    searchApps(query) {
        if (typeof DataManager !== 'undefined') {
            return DataManager.searchApps(query);
        }
        return [];
    }

    // Показать результаты поиска
    showSearchResults(results) {
        const featuredApps = document.getElementById('featuredApps');
        const recentApps = document.getElementById('recentApps');
        
        if (featuredApps) {
            featuredApps.innerHTML = '';
            if (results.length > 0) {
                results.forEach(app => {
                    const card = this.createAppCard(app);
                    if (card) featuredApps.appendChild(card);
                });
            } else {
                featuredApps.innerHTML = '<p class="no-results">Ничего не найдено</p>';
            }
        }
    }

    // Инициализация форм
    initForms() {
        console.log('📝 Инициализация форм...');
        
        const submitForm = document.getElementById('submitAppForm');
        if (submitForm) {
            submitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAppSubmission();
            });
            console.log('✅ Форма отправки инициализирована');
        } else {
            console.error('❌ Форма отправки не найдена');
        }
    }

    // Инициализация PWA
    initPWA() {
        console.log('📱 Инициализация PWA...');
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ ServiceWorker зарегистрирован:', registration);
                    this.setupPWAInstall();
                })
                .catch(error => {
                    console.log('❌ Ошибка регистрации ServiceWorker:', error);
                });
        } else {
            console.log('ℹ️ Service Worker не поддерживается');
        }
    }

    // Настройка PWA установки
    setupPWAInstall() {
        console.log('📥 Настройка PWA установки...');
        
        let deferredPrompt;
        const installContainer = document.getElementById('pwaInstallContainer');
        const installBtn = document.getElementById('pwaInstallBtn');

        // Слушаем событие beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            if (installContainer) {
                installContainer.style.display = 'block';
                console.log('✅ Кнопка PWA установки показана');
            }
        });

        // Обработчик клика по кнопке установки
        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    
                    if (outcome === 'accepted') {
                        this.showNotification('Приложение установлено!', 'success');
                        if (installContainer) {
                            installContainer.style.display = 'none';
                        }
                    }
                    
                    deferredPrompt = null;
                }
            });
            console.log('✅ Кнопка PWA установки настроена');
        }
    }

    // Загрузка данных
    async loadData() {
        console.log('📊 Загрузка данных...');
        
        try {
            // Инициализируем DataManager если он есть
            if (typeof DataManager !== 'undefined') {
                DataManager.init();
                console.log('✅ DataManager инициализирован');
            }
            
            console.log('✅ Все данные загружены');
        } catch (error) {
            console.error('❌ Ошибка загрузки данных:', error);
        }
    }

    // Загрузка главной страницы
    async loadHomePage() {
        console.log('🏠 Загрузка главной страницы...');
        
        try {
            let featuredApps = [];
            let recentApps = [];
            
            // Всегда пытаемся загрузить из GitHub (публичный каталог)
            if (typeof ConfigManager !== 'undefined' && window.GitHubDB) {
                const useGitHub = ConfigManager.get('github.useIssuesAsDB', true);
                
                if (useGitHub) {
                    console.log('📡 Загрузка из публичного каталога GitHub...');
                    const githubDB = new GitHubDB({
                        owner: ConfigManager.get('github.owner', 'maggpro'),
                        repo: ConfigManager.get('github.repo', 'wpastore'),
                        token: ConfigManager.get('github.token', '') // Не требуется для чтения
                    });
                    
                    try {
                        const allApps = await githubDB.getAllApps();
                        const approvedApps = allApps.filter(app => app.status === 'approved');
                        featuredApps = approvedApps.filter(app => app.featured).slice(0, 6);
                        recentApps = approvedApps.slice(0, 6);
                        
                        console.log('✅ Загружено из GitHub:', { 
                            total: allApps.length, 
                            approved: approvedApps.length,
                            featured: featuredApps.length, 
                            recent: recentApps.length 
                        });
                    } catch (githubError) {
                        console.warn('⚠️ Ошибка загрузки из GitHub:', githubError.message);
                        // Продолжаем с fallback данными
                    }
                }
            }
            
            // Fallback на локальные данные
            if (featuredApps.length === 0 && typeof DataManager !== 'undefined') {
                console.log('📂 Fallback на локальные данные...');
                featuredApps = DataManager.getFeaturedApps();
                recentApps = DataManager.getRecentApps();
            }
            
            // Fallback на статические данные
            if (featuredApps.length === 0 && typeof WPA_DATA !== 'undefined') {
                console.log('📄 Fallback на статические данные...');
                featuredApps = WPA_DATA.apps.filter(app => app.featured).slice(0, 6);
                recentApps = WPA_DATA.apps.slice(0, 6);
            }
            
            console.log('🎯 Финальные данные:', { featured: featuredApps.length, recent: recentApps.length });
            
            this.renderApps(featuredApps, 'featuredApps');
            this.renderApps(recentApps, 'recentApps');
            
        } catch (error) {
            console.error('❌ Ошибка загрузки главной страницы:', error);
            // Последний fallback на статические данные
            if (typeof WPA_DATA !== 'undefined') {
                const featuredApps = WPA_DATA.apps.filter(app => app.featured).slice(0, 6);
                const recentApps = WPA_DATA.apps.slice(0, 6);
                this.renderApps(featuredApps, 'featuredApps');
                this.renderApps(recentApps, 'recentApps');
            }
        }
    }

    // Загрузка страницы категорий
    loadCategoriesPage() {
        console.log('📂 Загрузка страницы категорий...');
        
        const categoriesContainer = document.getElementById('categoriesGrid');
        console.log('🔍 Контейнер категорий:', categoriesContainer);
        console.log('📊 WPA_DATA доступен:', typeof WPA_DATA !== 'undefined');
        
        if (categoriesContainer && typeof WPA_DATA !== 'undefined') {
            categoriesContainer.innerHTML = '';
            console.log('📋 Категории для загрузки:', WPA_DATA.categories);
            
            WPA_DATA.categories.forEach((category, index) => {
                console.log(`🎯 Создание карточки для категории ${index + 1}:`, category.name);
                const card = this.createCategoryCard(category);
                if (card) {
                    categoriesContainer.appendChild(card);
                    console.log(`✅ Карточка ${category.name} добавлена`);
                } else {
                    console.error(`❌ Не удалось создать карточку для ${category.name}`);
                }
            });
            console.log('✅ Загружено категорий:', WPA_DATA.categories.length);
        } else {
            console.error('❌ Контейнер категорий не найден или WPA_DATA недоступен');
            if (!categoriesContainer) {
                console.error('❌ categoriesContainer не найден');
            }
            if (typeof WPA_DATA === 'undefined') {
                console.error('❌ WPA_DATA не определен');
            }
        }
    }

    // Загрузка страницы добавления приложения
    loadSubmitPage() {
        console.log('➕ Загрузка страницы добавления приложения...');
        // Форма уже инициализирована
    }

    // Загрузка админ страницы
    loadAdminPage() {
        console.log('👑 Загрузка админ страницы...');
        this.loadPendingApps();
    }

    // Загрузка страницы настроек
    loadSettingsPage() {
        console.log('⚙️ Загрузка страницы настроек...');
        this.loadSettings();
    }

    // Загрузка ожидающих приложений
    async loadPendingApps() {
        console.log('⏳ Загрузка ожидающих приложений...');
        
        const pendingContainer = document.getElementById('pendingApps');
        if (!pendingContainer) {
            console.error('❌ Контейнер ожидающих приложений не найден');
            return;
        }
        
        pendingContainer.innerHTML = '<p class="loading">Загрузка ожидающих приложений...</p>';
        
        try {
            let pendingApps = [];
            
            // Всегда пытаемся загрузить из GitHub (публичный каталог)
            if (typeof ConfigManager !== 'undefined' && window.GitHubDB) {
                const useGitHub = ConfigManager.get('github.useIssuesAsDB', true);
                
                if (useGitHub) {
                    console.log('📡 Загрузка ожидающих из GitHub...');
                    const githubDB = new GitHubDB({
                        owner: ConfigManager.get('github.owner', 'maggpro'),
                        repo: ConfigManager.get('github.repo', 'wpastore'),
                        token: ConfigManager.get('github.token', '')
                    });
                    
                    try {
                        const allApps = await githubDB.getAllApps();
                        pendingApps = allApps.filter(app => app.status === 'pending');
                        console.log('✅ Загружено ожидающих из GitHub:', pendingApps.length);
                    } catch (githubError) {
                        console.warn('⚠️ Ошибка загрузки из GitHub:', githubError.message);
                        // Показываем предупреждение для админов
                        pendingContainer.innerHTML = `
                            <div class="warning-block">
                                <h3>⚠️ Нужен доступ к GitHub</h3>
                                <p>Для модерации приложений необходим GitHub токен.</p>
                                <button class="button button-fill" onclick="mobileApp.showPage('settings')">
                                    Настроить токен
                                </button>
                            </div>
                        `;
                        return;
                    }
                }
            }
            
            // Fallback на локальные данные
            if (pendingApps.length === 0 && typeof DataManager !== 'undefined') {
                console.log('📂 Fallback на локальные данные...');
                pendingApps = DataManager.getPendingApps();
            }
            
            console.log('📋 Финальные ожидающие приложения:', pendingApps.length);
            
            pendingContainer.innerHTML = '';
            
            if (pendingApps.length > 0) {
                pendingApps.forEach(app => {
                    const card = this.createPendingAppCard(app);
                    if (card) {
                        pendingContainer.appendChild(card);
                    }
                });
            } else {
                pendingContainer.innerHTML = '<p class="no-apps">Нет приложений на рассмотрении</p>';
            }
            
        } catch (error) {
            console.error('❌ Ошибка загрузки ожидающих приложений:', error);
            pendingContainer.innerHTML = '<p class="error">Ошибка загрузки приложений</p>';
        }
    }

    // Загрузка настроек
    loadSettings() {
        console.log('⚙️ Загрузка настроек...');
        
        if (typeof ConfigManager !== 'undefined') {
            const owner = ConfigManager.get('github.owner', '');
            const repo = ConfigManager.get('github.repo', '');
            const token = ConfigManager.get('github.token', '');
            const useIssues = ConfigManager.get('github.useIssuesAsDB', false);
            
            const ownerInput = document.getElementById('githubOwner');
            const repoInput = document.getElementById('githubRepo');
            const tokenInput = document.getElementById('githubToken');
            const useIssuesSelect = document.getElementById('useIssuesAsDB');
            
            if (ownerInput) ownerInput.value = owner;
            if (repoInput) repoInput.value = repo;
            if (tokenInput) tokenInput.value = token;
            if (useIssuesSelect) useIssuesSelect.value = useIssues.toString();
        }
    }

    // Рендеринг приложений
    renderApps(apps, containerId) {
        console.log(`🎨 Рендеринг приложений в контейнер: ${containerId}`);
        
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            if (apps.length > 0) {
                apps.forEach(app => {
                    const card = this.createAppCard(app);
                    if (card) {
                        container.appendChild(card);
                    }
                });
                console.log(`✅ Рендерено ${apps.length} приложений в ${containerId}`);
            } else {
                container.innerHTML = '<p class="no-apps">Приложений пока нет</p>';
                console.log(`ℹ️ Контейнер ${containerId} пуст`);
            }
        } else {
            console.error(`❌ Контейнер ${containerId} не найден`);
        }
    }

    // Создание карточки приложения
    createAppCard(app) {
        if (typeof Components !== 'undefined') {
            return Components.createAppCard(app);
        }
        
        // Fallback создание карточки
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <div class="app-card-header">
                <div class="app-icon">
                    ${app.icon ? `<img src="${app.icon}" alt="${app.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">` : ''}
                    <i class="fas fa-mobile-alt" style="display: ${app.icon ? 'none' : 'block'};"></i>
                </div>
                <div class="app-info">
                    <h3 class="app-name">${app.name}</h3>
                    <p class="app-description">${app.description}</p>
                    <div class="app-meta">
                        <span class="developer">👨‍💻 ${app.developer}</span>
                        <span class="category">📂 ${this.getCategoryName(app.category)}</span>
                    </div>
                </div>
            </div>
            <div class="app-card-actions">
                <button class="button button-small button-outline info-btn" onclick="event.stopPropagation(); mobileApp.showAppDetails(${JSON.stringify(app).replace(/"/g, '&quot;')})">
                    <i class="fas fa-info-circle"></i> Подробнее
                </button>
                ${app.website ? `<button class="button button-small button-fill install-btn" onclick="event.stopPropagation(); mobileApp.installWPAApp(${JSON.stringify(app).replace(/"/g, '&quot;')})">
                    <i class="fas fa-download"></i> Установить
                </button>` : ''}
            </div>
        `;
        
        card.addEventListener('click', () => {
            this.showAppDetails(app);
        });
        
        return card;
    }

    // Установка WPA приложения
    installWPAApp(app) {
        console.log('📱 Установка WPA приложения:', app.name);
        
        if (!app.website) {
            this.showNotification('❌ У приложения нет веб-сайта для установки', 'error');
            return;
        }

        // Проверяем, поддерживает ли браузер установку PWA
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            // Пытаемся установить как PWA
            this.installAsPWA(app);
        } else {
            // Fallback: открываем в новом окне
            this.openWPAApp(app);
        }
    }

    // Установка как PWA
    async installAsPWA(app) {
        try {
            // Проверяем, есть ли уже установленное приложение
            if (window.matchMedia('(display-mode: standalone)').matches) {
                this.showNotification('ℹ️ Приложение уже установлено', 'info');
                return;
            }

            // Пытаемся получить манифест приложения
            // Формируем правильный URL для манифеста
            let manifestUrl;
            try {
                console.log('🔍 Исходный website:', app.website);
                
                // Убираем хэш из URL перед формированием пути к манифесту
                const baseUrl = app.website.split('#')[0];
                console.log('🔍 Base URL без хэша:', baseUrl);
                
                // Если website заканчивается на /, добавляем manifest.json
                if (baseUrl.endsWith('/')) {
                    manifestUrl = baseUrl + 'manifest.json';
                } else {
                    // Иначе добавляем /manifest.json
                    manifestUrl = baseUrl + '/manifest.json';
                }
                
                console.log('🔍 Ищем манифест по адресу:', manifestUrl);
                console.log('🔍 Проверяем, что URL сформирован правильно');
                
                const response = await fetch(manifestUrl);
                
                if (response.ok) {
                    const manifest = await response.json();
                    console.log('✅ Манифест найден:', manifest);
                    this.showNotification('🎉 Приложение поддерживает PWA установку!', 'success');
                    
                    // Пытаемся установить как PWA
                    try {
                        await this.installPWA(manifest, app);
                    } catch (error) {
                        console.log('❌ Ошибка PWA установки, открываем как веб-приложение:', error);
                        this.openWPAApp(app);
                    }
                } else {
                    // Манифест не найден, открываем как обычное веб-приложение
                    console.log('📱 Манифест не найден, открываем как веб-приложение');
                    this.openWPAApp(app);
                }
            } catch (error) {
                console.log('PWA установка недоступна, открываем как веб-приложение');
                this.openWPAApp(app);
            }
        } catch (error) {
            console.log('❌ Ошибка при установке PWA:', error);
            this.openWPAApp(app);
        }
    }

    // Установка PWA приложения
    async installPWA(manifest, app) {
        console.log('🚀 Попытка установки PWA:', app.name);
        
        // Проверяем, поддерживает ли браузер установку PWA
        if (!('BeforeInstallPromptEvent' in window)) {
            console.log('📱 Браузер не поддерживает PWA установку');
            this.showNotification('📱 Ваш браузер не поддерживает PWA установку. Открываю как веб-приложение.', 'info');
            this.openWPAApp(app);
            return;
        }

        // Проверяем, есть ли уже установленное приложение
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('✅ Приложение уже установлено');
            this.showNotification('ℹ️ Приложение уже установлено на ваше устройство', 'info');
            return;
        }

        // Пытаемся показать prompt для установки
        try {
            // Открываем приложение в новом окне для установки
            const newWindow = window.open(app.website, '_blank');
            
            if (newWindow) {
                this.showNotification('🌐 Приложение открыто. Используйте меню браузера для установки PWA.', 'info');
                
                // Добавляем в историю установленных приложений
                this.addToInstalledApps(app);
                
                // Показываем инструкцию по установке
                setTimeout(() => {
                    this.showNotification('💡 Для установки: нажмите ⋮ → "Установить приложение"', 'info');
                }, 2000);
            } else {
                this.showNotification('❌ Не удалось открыть приложение. Возможно, заблокирован popup.', 'error');
            }
        } catch (error) {
            console.log('❌ Ошибка при открытии PWA:', error);
            this.openWPAApp(app);
        }
    }

    // Открытие WPA приложения
    openWPAApp(app) {
        this.showNotification(`🌐 Открываю "${app.name}" в новом окне`, 'info');
        
        // Открываем в новом окне/вкладке
        const newWindow = window.open(app.website, '_blank');
        
        if (newWindow) {
            // Добавляем в историю установленных приложений
            this.addToInstalledApps(app);
            this.showNotification(`✅ "${app.name}" добавлено в список установленных приложений`, 'success');
        } else {
            this.showNotification('❌ Не удалось открыть приложение. Возможно, заблокирован popup', 'error');
        }
    }

    // Добавление в список установленных приложений
    addToInstalledApps(app) {
        try {
            const installedApps = JSON.parse(localStorage.getItem('wpa_installed_apps') || '[]');
            const existingIndex = installedApps.findIndex(installed => installed.website === app.website);
            
            if (existingIndex === -1) {
                installedApps.push({
                    ...app,
                    installedAt: new Date().toISOString(),
                    lastUsed: new Date().toISOString()
                });
                
                localStorage.setItem('wpa_installed_apps', JSON.stringify(installedApps));
                console.log('✅ Приложение добавлено в список установленных');
            }
        } catch (error) {
            console.error('Ошибка сохранения в список установленных:', error);
        }
    }

    // Создание карточки категории
    createCategoryCard(category) {
        console.log(`🎨 Создание карточки для категории: ${category.name}`);
        
        if (typeof Components !== 'undefined') {
            console.log('🔧 Используем Components.createCategoryCard');
            return Components.createCategoryCard(category);
        }
        
        // Fallback создание карточки категории
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-icon">
                <i class="fas ${this.getCategoryIcon(category.id)}"></i>
            </div>
            <div class="category-content">
                <h3 class="category-name">${category.name}</h3>
                <p class="category-description">${category.description || 'Приложения в этой категории'}</p>
                <div class="category-count">${this.getCategoryAppCount(category.id)} приложений</div>
            </div>
        `;
        
        console.log(`🎯 Добавляем обработчик клика для ${category.name}`);
        card.addEventListener('click', (e) => {
            console.log(`👆 Клик по карточке категории: ${category.name}`);
            e.preventDefault();
            e.stopPropagation();
            this.showCategoryApps(category);
        });
        
        // Добавляем обработчик для touch событий
        card.addEventListener('touchstart', (e) => {
            console.log(`👆 Touch start по карточке категории: ${category.name}`);
        });
        
        console.log(`✅ Карточка ${category.name} создана и настроена`);
        return card;
    }

    // Создание карточки ожидающего приложения
    createPendingAppCard(app) {
        if (typeof Components !== 'undefined') {
            return Components.createPendingAppCard(app);
        }
        
        // Fallback создание карточки
        const card = document.createElement('div');
        card.className = 'pending-app-card';
        card.innerHTML = `
            <div class="app-info">
                <h3>${app.name}</h3>
                <p>${app.description}</p>
                <div class="app-meta">
                    <span class="developer">${app.developer}</span>
                    <span class="category">${this.getCategoryName(app.category)}</span>
                </div>
            </div>
            <div class="app-actions">
                <button class="button button-small button-success approve-btn" data-id="${app.id}">
                    <i class="fas fa-check"></i> Одобрить
                </button>
                <button class="button button-small button-danger reject-btn" data-id="${app.id}">
                    <i class="fas fa-times"></i> Отклонить
                </button>
            </div>
        `;
        
        // Добавляем обработчики для кнопок
        const approveBtn = card.querySelector('.approve-btn');
        const rejectBtn = card.querySelector('.reject-btn');
        
        if (approveBtn) {
            approveBtn.addEventListener('click', () => this.approveApp(app.id));
        }
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => this.rejectApp(app.id));
        }
        
        return card;
    }

    // Получение названия категории
    getCategoryName(categoryId) {
        if (typeof WPA_DATA !== 'undefined') {
            const category = WPA_DATA.categories.find(cat => cat.id === categoryId);
            return category ? category.name : 'Неизвестно';
        }
        return 'Неизвестно';
    }

    // Получение иконки категории
    getCategoryIcon(categoryId) {
        const iconMap = {
            'productivity': 'fa-briefcase',
            'entertainment': 'fa-gamepad',
            'education': 'fa-graduation-cap',
            'health': 'fa-heartbeat',
            'finance': 'fa-chart-line',
            'social': 'fa-users',
            'utilities': 'fa-tools',
            'games': 'fa-dice'
        };
        return iconMap[categoryId] || 'fa-folder';
    }

    // Получение количества приложений в категории
    getCategoryAppCount(categoryId) {
        if (typeof WPA_DATA !== 'undefined') {
            return WPA_DATA.apps.filter(app => app.category === categoryId && app.status !== 'rejected').length;
        }
        return 0;
    }

    // Показать детали приложения
    showAppDetails(app) {
        console.log('📱 Показать детали приложения:', app.name);
        
        // Создаем модальное окно с деталями
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-app-info">
                        <div class="modal-app-icon">
                            ${app.icon ? `<img src="${app.icon}" alt="${app.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">` : ''}
                            <i class="fas fa-mobile-alt" style="display: ${app.icon ? 'none' : 'block'};"></i>
                        </div>
                        <div class="modal-app-title">
                            <h2>${app.name}</h2>
                            <p class="modal-app-developer">👨‍💻 ${app.developer}</p>
                        </div>
                    </div>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="app-description-section">
                        <h3>📝 Описание</h3>
                        <p>${app.description}</p>
                    </div>
                    
                    <div class="app-details-section">
                        <h3>ℹ️ Детали</h3>
                        <div class="app-details-grid">
                            <div class="detail-item">
                                <span class="detail-label">📂 Категория:</span>
                                <span class="detail-value">${this.getCategoryName(app.category)}</span>
                            </div>
                            ${app.version ? `<div class="detail-item">
                                <span class="detail-label">🏷️ Версия:</span>
                                <span class="detail-value">${app.version}</span>
                            </div>` : ''}
                            ${app.website ? `<div class="detail-item">
                                <span class="detail-label">🌐 Сайт:</span>
                                <span class="detail-value"><a href="${app.website}" target="_blank">${app.website}</a></span>
                            </div>` : ''}
                        </div>
                    </div>
                    
                    ${app.screenshots && app.screenshots.length > 0 ? `
                    <div class="app-screenshots-section">
                        <h3>📸 Скриншоты</h3>
                        <div class="screenshots-grid">
                            ${app.screenshots.map(screenshot => `
                                <img src="${screenshot}" alt="Скриншот ${app.name}" onclick="window.open('${screenshot}', '_blank')">
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="modal-actions">
                        ${app.website ? `<button class="button button-fill button-large install-btn" onclick="mobileApp.installWPAApp(${JSON.stringify(app).replace(/"/g, '&quot;')})">
                            <i class="fas fa-download"></i> Установить приложение
                        </button>` : ''}
                        <button class="button button-outline button-large" onclick="window.open('${app.website}', '_blank')">
                            <i class="fas fa-external-link-alt"></i> Открыть в браузере
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем обработчик закрытия
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Закрытие по клику вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }

    // Показать приложения категории
    showCategoryApps(category) {
        console.log('📂 Показать приложения категории:', category.name);
        
        // Переходим на главную страницу
        this.showPage('home');
        
        // Ждем немного, чтобы страница загрузилась
        setTimeout(() => {
            this.showCategoryAppsContent(category);
        }, 100);
    }

    // Показать содержимое категории на главной странице
    showCategoryAppsContent(category) {
        console.log('🎯 Отображение приложений категории:', category.name);
        
        try {
            let categoryApps = [];
            
            // Пытаемся загрузить из GitHub
            if (typeof ConfigManager !== 'undefined' && window.GitHubDB) {
                const useGitHub = ConfigManager.get('github.useIssuesAsDB', true);
                
                if (useGitHub) {
                    console.log('📡 Загрузка приложений категории из GitHub...');
                    // Здесь можно добавить загрузку из GitHub по категории
                }
            }
            
            // Fallback на локальные данные
            if (categoryApps.length === 0 && typeof WPA_DATA !== 'undefined') {
                console.log('📂 Fallback на локальные данные для категории:', category.name);
                categoryApps = WPA_DATA.apps.filter(app => 
                    app.category === category.id && 
                    app.status !== 'rejected'
                );
            }
            
            console.log(`📋 Найдено приложений в категории ${category.name}:`, categoryApps.length);
            
            // Обновляем заголовки
            this.updateCategoryHeaders(category.name);
            
            // Показываем приложения категории
            if (categoryApps.length > 0) {
                this.renderApps(categoryApps, 'featuredApps');
                this.renderApps(categoryApps, 'recentApps');
                
                // Показываем уведомление
                this.showNotification(`📂 Показано ${categoryApps.length} приложений в категории "${category.name}"`, 'info');
            } else {
                // Показываем сообщение об отсутствии приложений
                this.showNoAppsInCategory(category.name);
            }
            
        } catch (error) {
            console.error('❌ Ошибка при загрузке приложений категории:', error);
            this.showNotification('Ошибка при загрузке приложений категории', 'error');
        }
    }

    // Обновление заголовков для категории
    updateCategoryHeaders(categoryName) {
        console.log('🏷️ Обновление заголовков для категории:', categoryName);
        
        // Обновляем заголовок рекомендуемых приложений
        const featuredTitle = document.querySelector('.block-title');
        if (featuredTitle) {
            featuredTitle.innerHTML = `📂 Приложения: ${categoryName}`;
        }
        
        // Обновляем заголовок недавних приложений
        const recentTitle = document.querySelectorAll('.block-title')[1];
        if (recentTitle) {
            recentTitle.innerHTML = `⭐ Все приложения в категории "${categoryName}"`;
        }
        
        // Добавляем кнопку возврата
        this.addBackToAllButton();
    }

    // Добавление кнопки возврата ко всем приложениям
    addBackToAllButton() {
        console.log('🔙 Добавление кнопки возврата');
        
        // Удаляем существующую кнопку, если есть
        const existingBtn = document.querySelector('.back-to-all-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        // Создаем кнопку возврата
        const backBtn = document.createElement('button');
        backBtn.className = 'button button-outline button-small back-to-all-btn';
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Показать все приложения';
        backBtn.style.margin = '0 1rem 1rem';
        
        backBtn.addEventListener('click', () => {
            console.log('🔙 Возврат ко всем приложениям');
            this.loadHomePage();
        });
        
        // Вставляем кнопку после первого заголовка
        const firstTitle = document.querySelector('.block-title');
        if (firstTitle) {
            firstTitle.parentNode.insertBefore(backBtn, firstTitle.nextSibling);
        }
    }

    // Показать сообщение об отсутствии приложений в категории
    showNoAppsInCategory(categoryName) {
        console.log('📭 Показ сообщения об отсутствии приложений в категории:', categoryName);
        
        const featuredApps = document.getElementById('featuredApps');
        const recentApps = document.getElementById('recentApps');
        
        if (featuredApps) {
            featuredApps.innerHTML = `
                <div class="no-apps">
                    <i class="fas fa-folder-open" style="font-size: 2rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p>В категории "${categoryName}" пока нет приложений</p>
                    <button class="button button-fill" onclick="mobileApp.showPage('submit')">
                        <i class="fas fa-plus"></i> Добавить первое приложение
                    </button>
                </div>
            `;
        }
        
        if (recentApps) {
            recentApps.innerHTML = '';
        }
        
        // Обновляем заголовки
        this.updateCategoryHeaders(categoryName);
        this.addBackToAllButton();
    }

    // Одобрить приложение
    async approveApp(appId) {
        console.log('✅ Одобрение приложения:', appId);
        
        try {
            // Всегда пытаемся одобрить в GitHub (публичный каталог)
            if (typeof ConfigManager !== 'undefined' && window.GitHubDB) {
                const useGitHub = ConfigManager.get('github.useIssuesAsDB', true);
                
                if (useGitHub) {
                    const token = ConfigManager.get('github.token', '');
                    if (!token) {
                        this.showNotification('⚠️ Нужен GitHub токен для модерации. Настройте его в разделе "Настройки"', 'error');
                        this.showPage('settings');
                        return;
                    }
                    
                    console.log('📡 Одобрение в GitHub...');
                    const githubDB = new GitHubDB({
                        owner: ConfigManager.get('github.owner', 'maggpro'),
                        repo: ConfigManager.get('github.repo', 'wpastore'),
                        token: token
                    });
                    
                    await githubDB.approveApp(appId);
                    this.showNotification('🎉 Приложение одобрено и опубликовано в каталоге!', 'success');
                    console.log('✅ Приложение одобрено в GitHub');
                    
                    // Перезагружаем данные
                    await this.loadPendingApps();
                    await this.loadHomePage();
                    return;
                }
            }
            
            // Fallback на локальные данные
            if (typeof DataManager !== 'undefined') {
                if (DataManager.approveApp(appId)) {
                    this.showNotification('Приложение одобрено локально (не в публичном каталоге)', 'warning');
                    this.loadPendingApps();
                    this.loadHomePage();
                } else {
                    this.showNotification('Ошибка при одобрении приложения', 'error');
                }
            } else {
                this.showNotification('Система модерации недоступна', 'error');
            }
            
        } catch (error) {
            console.error('❌ Ошибка одобрения приложения:', error);
            this.showNotification('Ошибка при одобрении: ' + error.message, 'error');
        }
    }

    // Отклонить приложение
    async rejectApp(appId) {
        console.log('❌ Отклонение приложения:', appId);
        
        try {
            // Всегда пытаемся отклонить в GitHub (публичный каталог)
            if (typeof ConfigManager !== 'undefined' && window.GitHubDB) {
                const useGitHub = ConfigManager.get('github.useIssuesAsDB', true);
                
                if (useGitHub) {
                    const token = ConfigManager.get('github.token', '');
                    if (!token) {
                        this.showNotification('⚠️ Нужен GitHub токен для модерации. Настройте его в разделе "Настройки"', 'error');
                        this.showPage('settings');
                        return;
                    }
                    
                    console.log('📡 Отклонение в GitHub...');
                    const githubDB = new GitHubDB({
                        owner: ConfigManager.get('github.owner', 'maggpro'),
                        repo: ConfigManager.get('github.repo', 'wpastore'),
                        token: token
                    });
                    
                    await githubDB.rejectApp(appId);
                    this.showNotification('✅ Приложение отклонено', 'info');
                    console.log('✅ Приложение отклонено в GitHub');
                    
                    // Перезагружаем данные
                    await this.loadPendingApps();
                    return;
                }
            }
            
            // Fallback на локальные данные
            if (typeof DataManager !== 'undefined') {
                if (DataManager.rejectApp(appId)) {
                    this.showNotification('Приложение отклонено локально', 'info');
                    this.loadPendingApps();
                } else {
                    this.showNotification('Ошибка при отклонении приложения', 'error');
                }
            } else {
                this.showNotification('Система модерации недоступна', 'error');
            }
            
        } catch (error) {
            console.error('❌ Ошибка отклонения приложения:', error);
            this.showNotification('Ошибка при отклонении: ' + error.message, 'error');
        }
    }

    // Обработка отправки приложения
    async handleAppSubmission() {
        console.log('📤 Отправка приложения...');
        
        const formData = {
            name: document.getElementById('appName').value.trim(),
            description: document.getElementById('appDescription').value.trim(),
            category: document.getElementById('appCategory').value,
            developer: document.getElementById('appDeveloper').value.trim(),
            version: document.getElementById('appVersion').value.trim() || '1.0.0',
            website: document.getElementById('appWebsite').value.trim(),
            icon: document.getElementById('appIcon').value.trim(),
            screenshots: document.getElementById('appScreenshots').value.trim()
                .split(',')
                .map(url => url.trim())
                .filter(url => url && this.isValidUrl(url)),
            features: []
        };

        console.log('Данные формы:', formData);

        // Валидация
        if (!formData.name || !formData.description || !formData.category || !formData.developer) {
            this.showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }

        if (!formData.website || !this.isValidUrl(formData.website)) {
            this.showNotification('Пожалуйста, введите корректный URL веб-сайта', 'error');
            return;
        }

        if (formData.icon && !this.isValidUrl(formData.icon)) {
            this.showNotification('Пожалуйста, введите корректный URL иконки', 'error');
            return;
        }

        try {
            // Сначала сохраняем локально для всех пользователей
            if (typeof DataManager !== 'undefined') {
                const newApp = DataManager.addApp(formData);
                this.showNotification('✅ Приложение отправлено на модерацию!', 'success');
                console.log('✅ Приложение добавлено локально:', newApp);
                
                // Пытаемся отправить в GitHub (если есть токен админа)
                if (typeof ConfigManager !== 'undefined' && window.GitHubDB) {
                    const useGitHub = ConfigManager.get('github.useIssuesAsDB', true);
                    const token = ConfigManager.get('github.token', '');
                    
                    if (useGitHub && token) {
                        console.log('📤 Дополнительная отправка в GitHub (админ режим)...');
                        try {
                            const githubDB = new GitHubDB({
                                owner: ConfigManager.get('github.owner', 'maggpro'),
                                repo: ConfigManager.get('github.repo', 'wpastore'),
                                token: token
                            });
                            
                            await githubDB.addApp(formData);
                            this.showNotification('🚀 Приложение также отправлено в публичный каталог GitHub!', 'success');
                            console.log('✅ Приложение отправлено в GitHub');
                        } catch (githubError) {
                            console.log('⚠️ GitHub отправка не удалась, но локально сохранено:', githubError);
                            this.showNotification('ℹ️ Приложение сохранено локально. Админ может опубликовать его позже.', 'info');
                        }
                    } else {
                        console.log('ℹ️ GitHub токен не настроен, приложение сохранено локально');
                        this.showNotification('ℹ️ Приложение сохранено локально. Админ может опубликовать его позже.', 'info');
                    }
                }
            } else {
                this.showNotification('❌ Ошибка: система недоступна', 'error');
                return;
            }
            
            // Очищаем форму
            document.getElementById('submitAppForm').reset();
            
            // Переходим на главную страницу
            this.showPage('home');
        } catch (error) {
            this.showNotification('Ошибка при отправке приложения: ' + error.message, 'error');
            console.error('❌ Ошибка отправки:', error);
        }
    }

    // Валидация URL
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Сохранение настроек
    saveSettings() {
        console.log('💾 Сохранение настроек...');
        
        if (typeof ConfigManager !== 'undefined') {
            const owner = document.getElementById('githubOwner').value.trim();
            const repo = document.getElementById('githubRepo').value.trim();
            const token = document.getElementById('githubToken').value.trim();
            const useIssues = document.getElementById('useIssuesAsDB').value === 'true';

            ConfigManager.set('github.owner', owner);
            ConfigManager.set('github.repo', repo);
            ConfigManager.set('github.token', token);
            ConfigManager.set('github.useIssuesAsDB', useIssues);

            this.showNotification('Настройки сохранены!', 'success');
            
            // Перезагружаем данные если включили GitHub
            if (useIssues) {
                setTimeout(() => this.loadData(), 1000);
            }
        } else {
            this.showNotification('ConfigManager не доступен', 'error');
        }
    }

    // Очистка кэша
    clearCache() {
        console.log('🧹 Очистка кэша...');
        
        try {
            if (typeof DataManager !== 'undefined') {
                DataManager.clearCache();
                this.showNotification('✅ Кэш очищен! Перезагружаем страницу...', 'success');
                
                // Перезагружаем страницу через 2 секунды
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                this.showNotification('❌ DataManager не доступен', 'error');
            }
        } catch (error) {
            console.error('❌ Ошибка очистки кэша:', error);
            this.showNotification('❌ Ошибка очистки кэша: ' + error.message, 'error');
        }
    }

    // Настройка событий
    setupEvents() {
        console.log('🎯 Настройка событий...');
        
        // Кнопка сохранения настроек
        const saveSettingsBtn = document.getElementById('saveSettings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
            console.log('✅ Кнопка сохранения настроек настроена');
        } else {
            console.error('❌ Кнопка сохранения настроек не найдена');
        }
        
        // Кнопка очистки кэша
        const clearCacheBtn = document.getElementById('clearCache');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => this.clearCache());
            console.log('✅ Кнопка очистки кэша настроена');
        } else {
            console.error('❌ Кнопка очистки кэша не найдена');
        }
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        console.log(`🔔 Уведомление [${type}]:`, message);
        
        if (typeof Utils !== 'undefined') {
            Utils.showNotification(message, type);
        } else {
            // Fallback уведомление
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }
}

// Инициализация приложения
let mobileApp;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 DOM загружен, создаем мобильное приложение...');
    mobileApp = new WPAMobileApp();
    
    // Делаем mobileApp доступным глобально
    window.mobileApp = mobileApp;
    window.wpaMobileApp = mobileApp; // Альтернативное имя для совместимости
    
    console.log('✅ mobileApp добавлен в window:', !!window.mobileApp);
});




