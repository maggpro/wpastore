// Главное приложение WPA каталога
class WPACatalogApp {
    constructor() {
        this.currentPage = 'home';
        this.searchQuery = '';
        console.log('WPA.STORE приложение создано, ожидает инициализации...');
        // this.init(); // Инициализация будет вызвана позже
    }

    init() {
        console.log('Инициализация WPA.STORE приложения...');
        
        // Инициализация компонентов
        Components.init();
        
        // Инициализация страниц
        this.initPages();
        
        // Инициализация навигации
        this.initNavigation();
        
        // Инициализация поиска
        this.initSearch();
        
        // Инициализация форм
        this.initForms();
        
        // Инициализация админ панели
        this.initAdminPanel();
        
        // Инициализация PWA функциональности
        this.initPWA();
        
        // Загрузка начальной страницы
        this.loadPage('home');
        
        // Показываем главную страницу по умолчанию
        const homePage = document.getElementById('homePage');
        if (homePage) {
            homePage.style.display = 'block';
            homePage.classList.add('active');
            console.log('Главная страница показана');
        }
        
        console.log('Инициализация завершена');
    }

    // Инициализация страниц
    initPages() {
        console.log('Инициализация страниц...');
        
        // Заполняем категории в форме добавления приложения
        const categorySelect = document.getElementById('appCategory');
        if (categorySelect) {
            // Очищаем существующие опции
            categorySelect.innerHTML = '<option value="">Выберите категорию</option>';
            
            WPA_DATA.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
            
            console.log('Категории добавлены в форму:', WPA_DATA.categories.length);
        } else {
            console.error('Селект категорий не найден');
        }
    }

    // Инициализация навигации
    initNavigation() {
        console.log('Инициализация навигации...');
        
        const navLinks = document.querySelectorAll('.nav-link');
        console.log('Найдено ссылок навигации:', navLinks.length);
        
        navLinks.forEach((link, index) => {
            console.log(`Настройка ссылки ${index + 1}:`, link.dataset.page);
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                console.log('Клик по ссылке:', page);
                this.navigateToPage(page);
            });
        });

        // Обработка хэша в URL
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1) || 'home';
            console.log('Изменение хэша:', hash);
            this.navigateToPage(hash);
        });

        // Обработка начального хэша
        const initialHash = window.location.hash.slice(1) || 'home';
        console.log('Начальный хэш:', initialHash);
        this.navigateToPage(initialHash);
    }

    // Навигация по страницам
    navigateToPage(pageName) {
        console.log('Переход на страницу:', pageName);
        
        // Скрываем все страницы
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        // Убираем активный класс со всех ссылок
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Показываем нужную страницу
        const targetPage = document.getElementById(pageName + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
            this.currentPage = pageName;
            console.log('Страница показана:', targetPage.id);
        } else {
            console.error('Страница не найдена:', pageName + 'Page');
        }
        
        // Обновляем URL
        window.location.hash = pageName;
        
        // Активируем соответствующую ссылку
        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            console.log('Активная ссылка обновлена:', pageName);
        } else {
            console.warn('Ссылка для страницы не найдена:', pageName);
        }

        // Загружаем контент страницы
        this.loadPage(pageName);
    }

    // Загрузка контента страницы
    loadPage(pageName) {
        console.log('Загрузка контента для страницы:', pageName);
        
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
            default:
                console.warn('Неизвестная страница:', pageName);
        }
    }

    // Загрузка главной страницы
    async loadHomePage() {
        console.log('Загрузка главной страницы...');
        
        try {
            // Проверяем, настроен ли GitHub
            const useGitHub = ConfigManager.get('github.useIssuesAsDB', false);
            
            if (useGitHub && window.GitHubDB) {
                // Загружаем из GitHub
                const githubDB = new GitHubDB({
                    owner: ConfigManager.get('github.owner'),
                    repo: ConfigManager.get('github.repo'),
                    token: ConfigManager.get('github.token')
                });
                
                const allApps = await githubDB.getAllApps();
                const featuredApps = allApps.filter(app => app.status === 'approved').slice(0, 6);
                const recentApps = allApps.filter(app => app.status === 'approved').slice(0, 6);
                
                this.renderApps(featuredApps, 'featuredApps');
                this.renderApps(recentApps, 'recentApps');
            } else {
                // Загружаем из локального хранилища
                const featuredApps = DataManager.getFeaturedApps();
                const recentApps = DataManager.getRecentApps();
                
                console.log('Загружено приложений:', { featured: featuredApps.length, recent: recentApps.length });
                
                this.renderApps(featuredApps, 'featuredApps');
                this.renderApps(recentApps, 'recentApps');
            }
        } catch (error) {
            console.error('Ошибка загрузки приложений:', error);
            // Fallback на локальные данные
            const featuredApps = DataManager.getFeaturedApps();
            const recentApps = DataManager.getRecentApps();
            
            this.renderApps(featuredApps, 'featuredApps');
            this.renderApps(recentApps, 'recentApps');
        }
    }

    // Рендеринг приложений
    renderApps(apps, containerId) {
        console.log(`Рендеринг приложений в контейнер: ${containerId}`);
        
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            if (apps.length > 0) {
                apps.forEach(app => {
                    const card = Components.createAppCard(app);
                    if (card) {
                        container.appendChild(card);
                    }
                });
                console.log(`Рендерено ${apps.length} приложений в ${containerId}`);
            } else {
                container.innerHTML = '<p class="no-apps">Приложений пока нет</p>';
                console.log(`Контейнер ${containerId} пуст`);
            }
        } else {
            console.error(`Контейнер ${containerId} не найден`);
        }
    }

    // Загрузка страницы категорий
    loadCategoriesPage() {
        console.log('Загрузка страницы категорий...');
        
        const categoriesContainer = document.getElementById('categoriesGrid');
        if (categoriesContainer) {
            categoriesContainer.innerHTML = '';
            WPA_DATA.categories.forEach(category => {
                const card = Components.createCategoryCard(category);
                if (card) {
                    categoriesContainer.appendChild(card);
                }
            });
            console.log('Загружено категорий:', WPA_DATA.categories.length);
        } else {
            console.error('Контейнер категорий не найден');
        }
    }
    
    // Загрузка категорий (для совместимости)
    loadCategories() {
        this.loadCategoriesPage();
    }

    // Загрузка страницы добавления приложения
    loadSubmitPage() {
        console.log('Загрузка страницы добавления приложения...');
        // Форма уже инициализирована в initPages()
        // Здесь можно добавить дополнительную логику
        console.log('Страница добавления приложения загружена');
    }

    // Загрузка админ страницы
    loadAdminPage() {
        console.log('Загрузка админ страницы...');
        this.loadPendingApps();
    }
    
    // Загрузка ожидающих приложений
    loadPendingApps() {
        console.log('Загрузка ожидающих приложений...');
        
        const pendingContainer = document.getElementById('pendingApps');
        if (pendingContainer) {
            pendingContainer.innerHTML = '';
            const pendingApps = DataManager.getPendingApps();
            
            console.log('Загружено ожидающих приложений:', pendingApps.length);
            
            if (pendingApps.length > 0) {
                pendingApps.forEach(app => {
                    const card = Components.createPendingAppCard(app);
                    if (card) {
                        pendingContainer.appendChild(card);
                    }
                });
            } else {
                pendingContainer.innerHTML = '<p class="no-apps">Нет приложений на рассмотрении</p>';
            }
        } else {
            console.error('Контейнер ожидающих приложений не найден');
        }
    }

    // Инициализация поиска
    initSearch() {
        console.log('Инициализация поиска...');
        
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-button');

        if (searchInput && searchBtn) {
            console.log('Поиск инициализирован');
            
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

            // Поиск в реальном времени с дебаунсом
            const debouncedSearch = Utils.debounce((query) => {
                this.performSearch(query);
            }, 300);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        } else {
            console.error('Элементы поиска не найдены');
        }
    }

    // Выполнение поиска
    performSearch(query) {
        console.log('Выполнение поиска:', query);
        
        this.searchQuery = query.trim();
        
        if (!this.searchQuery) {
            // Если поиск пустой, возвращаемся на главную
            this.navigateToPage('home');
            return;
        }

        // Создаем временную страницу результатов поиска
        const searchResults = DataManager.searchApps(this.searchQuery);
        console.log('Результаты поиска:', searchResults.length);
        
        // Удаляем существующую страницу поиска
        const existingSearchPage = document.querySelector('.search-results-page');
        if (existingSearchPage) {
            existingSearchPage.remove();
        }

        const searchPage = document.createElement('div');
        searchPage.className = 'page-content search-results-page';
        searchPage.innerHTML = `
            <div class="container">
                <div class="search-header">
                    <button class="btn btn-secondary back-btn">
                        <i class="fas fa-arrow-left"></i> Назад
                    </button>
                    <h2>Результаты поиска</h2>
                    <p>Найдено ${searchResults.length} приложений по запросу "${this.searchQuery}"</p>
                </div>
                <div class="apps-grid" id="searchResultsGrid"></div>
            </div>
        `;

        // Показываем страницу результатов
        const mainContainer = document.querySelector('.main-content .container');
        if (mainContainer) {
            mainContainer.appendChild(searchPage);
        } else {
            console.error('Основной контейнер не найден');
            return;
        }
        
        // Скрываем все остальные страницы
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });
        searchPage.classList.add('active');
        searchPage.style.display = 'block';

        // Заполняем результаты
        const resultsGrid = searchPage.querySelector('#searchResultsGrid');
        if (resultsGrid) {
            if (searchResults.length > 0) {
                searchResults.forEach(app => {
                    const card = Components.createAppCard(app);
                    if (card) {
                        resultsGrid.appendChild(card);
                    }
                });
            } else {
                resultsGrid.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                        <h3>Ничего не найдено</h3>
                        <p>Попробуйте изменить поисковый запрос</p>
                    </div>
                `;
            }
        } else {
            console.error('Сетка результатов поиска не найдена');
        }

        // Обработчик кнопки "Назад"
        const backBtn = searchPage.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                searchPage.remove();
                this.navigateToPage('home');
            });
        } else {
            console.error('Кнопка "Назад" не найдена');
        }
    }

    // Инициализация форм
    initForms() {
        console.log('Инициализация форм...');
        
        const submitForm = document.getElementById('submitAppForm');
        if (submitForm) {
            submitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAppSubmission();
            });
            console.log('Форма отправки инициализирована');
        } else {
            console.error('Форма отправки не найдена');
        }
    }

    // Обработка отправки приложения
    async handleAppSubmission() {
        console.log('Отправка приложения...');
        
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
                .filter(url => url && Utils.isValidUrl(url)),
            features: []
        };

        console.log('Данные формы:', formData);

        // Валидация
        if (!formData.name || !formData.description || !formData.category || !formData.developer) {
            Utils.showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }

        if (formData.website && !Utils.isValidUrl(formData.website)) {
            Utils.showNotification('Пожалуйста, введите корректный URL веб-сайта', 'error');
            return;
        }

        if (formData.icon && !Utils.isValidUrl(formData.icon)) {
            Utils.showNotification('Пожалуйста, введите корректный URL иконки', 'error');
            return;
        }

        try {
            // Проверяем, настроен ли GitHub
            const useGitHub = ConfigManager.get('github.useIssuesAsDB', false);
            
            if (useGitHub && window.GitHubDB) {
                // Добавляем в GitHub Issues
                const githubDB = new GitHubDB({
                    owner: ConfigManager.get('github.owner'),
                    repo: ConfigManager.get('github.repo'),
                    token: ConfigManager.get('github.token')
                });
                
                await githubDB.addApp(formData);
                Utils.showNotification('Приложение успешно отправлено в GitHub!', 'success');
            } else {
                // Добавляем в локальное хранилище
                const newApp = DataManager.addApp(formData);
                Utils.showNotification('Приложение успешно отправлено на рассмотрение!', 'success');
                console.log('Добавлено новое приложение:', newApp);
            }
            
            // Очищаем форму
            document.getElementById('submitAppForm').reset();
            
            // Переходим на главную страницу
            this.navigateToPage('home');
        } catch (error) {
            Utils.showNotification('Ошибка при отправке приложения: ' + error.message, 'error');
            console.error('Ошибка отправки:', error);
        }
    }

    // Инициализация админ панели
    initAdminPanel() {
        console.log('Инициализация админ панели...');
        // Кнопки массовых действий будут добавлены динамически
        // в функции loadPendingApps
        console.log('Админ панель инициализирована');
    }

    // Инициализация PWA функциональности
    initPWA() {
        console.log('Инициализация PWA...');
        
        // Регистрируем Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker зарегистрирован:', registration);
                    this.setupPWAInstall();
                })
                .catch(error => {
                    console.log('Ошибка регистрации ServiceWorker:', error);
                });
        } else {
            console.log('Service Worker не поддерживается');
        }
    }

    // Настройка PWA установки
    setupPWAInstall() {
        console.log('Настройка PWA установки...');
        
        let deferredPrompt;
        const installContainer = document.getElementById('pwaInstallContainer');
        const installBtn = document.getElementById('pwaInstallBtn');

        // Слушаем событие beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Показываем кнопку установки
            if (installContainer) {
                installContainer.style.display = 'block';
                console.log('Кнопка PWA установки показана');
            }
        });

        // Обработчик клика по кнопке установки
        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    
                    if (outcome === 'accepted') {
                        Utils.showNotification('Приложение установлено!', 'success');
                        if (installContainer) {
                            installContainer.style.display = 'none';
                        }
                    }
                    
                    deferredPrompt = null;
                }
            });
            console.log('Кнопка PWA установки настроена');
        } else {
            console.error('Кнопка PWA установки не найдена');
        }

        // Проверяем, установлено ли уже приложение
        if (window.matchMedia('(display-mode: standalone)').matches) {
            if (installContainer) {
                installContainer.style.display = 'none';
            }
        }
    }

    // Обработка массовых действий
    handleBulkAction(action) {
        console.log('Массовое действие:', action);
        
        const pendingApps = DataManager.getPendingApps();
        
        if (pendingApps.length === 0) {
            Utils.showNotification('Нет приложений для обработки', 'info');
            return;
        }

        const actionText = action === 'approve' ? 'одобрить' : 'отклонить';
        const actionTextPast = action === 'approve' ? 'одобрены' : 'отклонены';

        Utils.showConfirmDialog(
            `Вы уверены, что хотите ${actionText} все ${pendingApps.length} приложений?`,
            () => {
                let successCount = 0;
                
                pendingApps.forEach(app => {
                    if (action === 'approve') {
                        if (DataManager.approveApp(app.id)) {
                            successCount++;
                        }
                    } else {
                        if (DataManager.rejectApp(app.id)) {
                            successCount++;
                        }
                    }
                });

                Utils.showNotification(
                    `${successCount} приложений ${actionTextPast}`, 
                    action === 'approve' ? 'success' : 'info'
                );

                // Обновляем админ панель и главную страницу
                this.loadPendingApps();
                this.loadHomePage();
            }
        );
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, создаем приложение...');
    window.wpaCatalogApp = new WPACatalogApp();
    // НЕ инициализируем автоматически - это сделает device-detector
});

// Глобальные функции для использования в HTML
window.showAppModal = (appId) => {
    Components.showAppModal(appId);
};

window.copyToClipboard = (text) => {
    Utils.copyToClipboard(text);
};
