// Главное приложение WPA каталога
class WPACatalogApp {
    constructor() {
        this.currentPage = 'home';
        this.searchQuery = '';
        this.init();
    }

    init() {
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
        }
    }

    // Инициализация страниц
    initPages() {
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
        }
    }

    // Инициализация навигации
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Обработка хэша в URL
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1) || 'home';
            this.navigateToPage(hash);
        });

        // Обработка начального хэша
        const initialHash = window.location.hash.slice(1) || 'home';
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
        }

        // Загружаем контент страницы
        this.loadPage(pageName);
        }
    }

    // Загрузка контента страницы
    loadPage(pageName) {
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
        }
    }

    // Загрузка главной страницы
    async loadHomePage() {
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
        }
    }
    
    // Загрузка категорий (для совместимости)
    loadCategories() {
        this.loadCategoriesPage();
    }

    // Загрузка страницы добавления приложения
    loadSubmitPage() {
        // Форма уже инициализирована в initPages()
        // Здесь можно добавить дополнительную логику
        console.log('Страница добавления приложения загружена');
    }

    // Загрузка админ страницы
    loadAdminPage() {
        this.loadPendingApps();
    }
    
    // Загрузка ожидающих приложений
    loadPendingApps() {
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
        }
    }

    // Инициализация поиска
    initSearch() {
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

            // Поиск в реальном времени с дебаунсом
            const debouncedSearch = Utils.debounce((query) => {
                this.performSearch(query);
            }, 300);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }
    }

    // Выполнение поиска
    performSearch(query) {
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
        document.querySelector('.main-content .container').appendChild(searchPage);
        
        // Скрываем все остальные страницы
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });
        searchPage.classList.add('active');
        searchPage.style.display = 'block';

        // Заполняем результаты
        const resultsGrid = searchPage.querySelector('#searchResultsGrid');
        if (searchResults.length > 0) {
            searchResults.forEach(app => {
                resultsGrid.appendChild(Components.createAppCard(app));
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

        // Обработчик кнопки "Назад"
        const backBtn = searchPage.querySelector('.back-btn');
        backBtn.addEventListener('click', () => {
            searchPage.remove();
            this.navigateToPage('home');
        });
    }

    // Инициализация форм
    initForms() {
        const submitForm = document.getElementById('submitAppForm');
        if (submitForm) {
            submitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAppSubmission();
            });
        }
    }

    // Обработка отправки приложения
    async handleAppSubmission() {
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
        // Кнопки массовых действий будут добавлены динамически
        // в функции loadPendingApps
    }

    // Инициализация PWA функциональности
    initPWA() {
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
        }
    }

    // Настройка PWA установки
    setupPWAInstall() {
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
    window.wpaCatalogApp = new WPACatalogApp();
});

// Глобальные функции для использования в HTML
window.showAppModal = (appId) => {
    Components.showAppModal(appId);
};

window.copyToClipboard = (text) => {
    Utils.copyToClipboard(text);
};
