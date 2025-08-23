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
        
        // Настройка событий
        this.setupEvents();
        
        // Показываем домашнюю страницу
        this.showPage('home');
        
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
        if (categoriesContainer && typeof WPA_DATA !== 'undefined') {
            categoriesContainer.innerHTML = '';
            WPA_DATA.categories.forEach(category => {
                const card = this.createCategoryCard(category);
                if (card) {
                    categoriesContainer.appendChild(card);
                }
            });
            console.log('✅ Загружено категорий:', WPA_DATA.categories.length);
        } else {
            console.error('❌ Контейнер категорий не найден');
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
            <div class="app-icon">
                <i class="fas fa-mobile-alt"></i>
            </div>
            <div class="app-info">
                <h3>${app.name}</h3>
                <p>${app.description}</p>
                <div class="app-meta">
                    <span class="developer">${app.developer}</span>
                    <span class="category">${this.getCategoryName(app.category)}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            this.showAppDetails(app);
        });
        
        return card;
    }

    // Создание карточки категории
    createCategoryCard(category) {
        if (typeof Components !== 'undefined') {
            return Components.createCategoryCard(category);
        }
        
        // Fallback создание карточки категории
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-icon">
                <i class="fas fa-folder"></i>
            </div>
            <h3>${category.name}</h3>
            <p>${category.description || 'Описание категории'}</p>
        `;
        
        card.addEventListener('click', () => {
            this.showCategoryApps(category);
        });
        
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

    // Показать детали приложения
    showAppDetails(app) {
        console.log('📱 Показать детали приложения:', app.name);
        
        // Создаем модальное окно с деталями
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${app.name}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${app.description}</p>
                    <div class="app-details">
                        <p><strong>Разработчик:</strong> ${app.developer}</p>
                        <p><strong>Категория:</strong> ${this.getCategoryName(app.category)}</p>
                        ${app.version ? `<p><strong>Версия:</strong> ${app.version}</p>` : ''}
                        ${app.website ? `<p><strong>Сайт:</strong> <a href="${app.website}" target="_blank">${app.website}</a></p>` : ''}
                    </div>
                    ${app.website ? `<a href="${app.website}" target="_blank" class="button button-fill button-large">Открыть приложение</a>` : ''}
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
        
        // Переходим на главную страницу и показываем приложения категории
        this.showPage('home');
        
        // Фильтруем приложения по категории
        if (typeof WPA_DATA !== 'undefined') {
            const categoryApps = WPA_DATA.apps.filter(app => app.category === category.id);
            this.renderApps(categoryApps, 'featuredApps');
            
            // Обновляем заголовок
            const title = document.querySelector('.section-title');
            if (title) {
                title.textContent = `Приложения: ${category.name}`;
            }
        }
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
            // Всегда пытаемся отправить в GitHub для публичного каталога
            if (typeof ConfigManager !== 'undefined' && window.GitHubDB) {
                const useGitHub = ConfigManager.get('github.useIssuesAsDB', true);
                
                if (useGitHub) {
                    console.log('📤 Отправка в публичный каталог GitHub...');
                    const githubDB = new GitHubDB({
                        owner: ConfigManager.get('github.owner', 'maggpro'),
                        repo: ConfigManager.get('github.repo', 'wpastore'),
                        token: ConfigManager.get('github.token', '') // Токен нужен только для создания
                    });
                    
                    // Проверяем есть ли токен для создания Issues
                    const token = ConfigManager.get('github.token', '');
                    if (!token) {
                        this.showNotification('⚠️ Нужен GitHub токен для отправки приложений. Настройте его в разделе "Настройки"', 'error');
                        this.showPage('settings');
                        return;
                    }
                    
                    await githubDB.addApp(formData);
                    this.showNotification('🎉 Приложение отправлено на модерацию в публичный каталог!', 'success');
                    console.log('✅ Приложение отправлено в GitHub');
                } else {
                    // Fallback на локальное хранилище
                    if (typeof DataManager !== 'undefined') {
                        const newApp = DataManager.addApp(formData);
                        this.showNotification('Приложение сохранено локально (не в публичном каталоге)', 'warning');
                        console.log('⚠️ Добавлено локально:', newApp);
                    } else {
                        this.showNotification('Ошибка: DataManager не доступен', 'error');
                        return;
                    }
                }
            } else {
                // Последний fallback
                if (typeof DataManager !== 'undefined') {
                    const newApp = DataManager.addApp(formData);
                    this.showNotification('Приложение сохранено локально (не в публичном каталоге)', 'warning');
                    console.log('⚠️ Добавлено локально:', newApp);
                } else {
                    this.showNotification('Ошибка: система недоступна', 'error');
                    return;
                }
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
});




