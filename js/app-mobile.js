// WPA.STORE Mobile App с Framework7
class WPAMobileApp {
    constructor() {
        this.app = null;
        this.mainView = null;
        this.currentPage = 'home';
        this.init();
    }

    init() {
        // Инициализация Framework7
        this.app = new Framework7({
            name: 'WPA.STORE',
            theme: 'ios',
            routes: [
                {
                    path: '/',
                    url: './index-mobile.html',
                }
            ],
            view: {
                stackPages: true,
                iosDynamicNavbar: false,
                androidDynamicNavbar: false
            },
            tabbar: {
                swipeable: true
            }
        });

        // Инициализация главного view
        this.mainView = this.app.views.create('.view-main', {
            url: '/'
        });

        // Инициализация PWA
        this.initPWA();
        
        // Загрузка данных
        this.loadData();
        
        // Настройка событий
        this.setupEvents();
        
        // Настройка навигации
        this.setupNavigation();
    }

    // Инициализация PWA
    initPWA() {
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

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (installContainer) {
                installContainer.style.display = 'block';
            }
        });

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
        }

        // Скрыть кнопку если уже установлено
        if (window.matchMedia('(display-mode: standalone)').matches) {
            if (installContainer) {
                installContainer.style.display = 'none';
            }
        }
    }

    // Загрузка данных
    async loadData() {
        try {
            // Загружаем главную страницу
            await this.loadHomePage();
            
            // Загружаем категории
            await this.loadCategories();
            
            // Загружаем ожидающие приложения
            await this.loadPendingApps();
            
            // Загружаем настройки
            this.loadSettings();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }

    // Загрузка главной страницы
    async loadHomePage() {
        try {
            const useGitHub = ConfigManager.get('github.useIssuesAsDB', false);
            
            if (useGitHub && window.GitHubDB) {
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
                const featuredApps = DataManager.getFeaturedApps();
                const recentApps = DataManager.getRecentApps();
                
                this.renderApps(featuredApps, 'featuredApps');
                this.renderApps(recentApps, 'recentApps');
            }
        } catch (error) {
            console.error('Ошибка загрузки главной страницы:', error);
            // Fallback на локальные данные
            const featuredApps = DataManager.getFeaturedApps();
            const recentApps = DataManager.getRecentApps();
            
            this.renderApps(featuredApps, 'featuredApps');
            this.renderApps(recentApps, 'recentApps');
        }
    }

    // Загрузка категорий
    async loadCategories() {
        try {
            const categories = DataManager.getCategories();
            this.renderCategories(categories);
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        }
    }

    // Загрузка ожидающих приложений
    async loadPendingApps() {
        try {
            const useGitHub = ConfigManager.get('github.useIssuesAsDB', false);
            
            if (useGitHub && window.GitHubDB) {
                const githubDB = new GitHubDB({
                    owner: ConfigManager.get('github.owner'),
                    repo: ConfigManager.get('github.repo'),
                    token: ConfigManager.get('github.token')
                });
                
                const pendingApps = await githubDB.getPendingApps();
                this.renderPendingApps(pendingApps);
            } else {
                const pendingApps = DataManager.getPendingApps();
                this.renderPendingApps(pendingApps);
            }
        } catch (error) {
            console.error('Ошибка загрузки ожидающих приложений:', error);
        }
    }

    // Рендеринг приложений
    renderApps(apps, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            if (apps.length > 0) {
                apps.forEach(app => {
                    container.appendChild(this.createAppCard(app));
                });
            } else {
                container.innerHTML = `
                    <div class="no-apps">
                        <i class="fas fa-box-open"></i>
                        <p>Приложений пока нет</p>
                    </div>
                `;
            }
        }
    }

    // Рендеринг категорий
    renderCategories(categories) {
        const container = document.getElementById('categoriesGrid');
        if (container) {
            container.innerHTML = '';
            categories.forEach(category => {
                container.appendChild(this.createCategoryCard(category));
            });
        }
    }

    // Рендеринг ожидающих приложений
    renderPendingApps(pendingApps) {
        const container = document.getElementById('pendingApps');
        if (container) {
            container.innerHTML = '';
            if (pendingApps.length > 0) {
                pendingApps.forEach(app => {
                    container.appendChild(this.createPendingAppCard(app));
                });
            } else {
                container.innerHTML = `
                    <div class="no-apps">
                        <i class="fas fa-clock"></i>
                        <p>Нет приложений на рассмотрении</p>
                    </div>
                `;
            }
        }
    }

    // Создание карточки приложения
    createAppCard(app) {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <div class="app-card-header">
                <div class="app-icon">
                    ${app.icon ? `<img src="${app.icon}" alt="${app.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">` : app.name.charAt(0).toUpperCase()}
                </div>
                <div class="app-info">
                    <h3>${app.name}</h3>
                    <p>${app.description}</p>
                </div>
            </div>
            <div class="app-meta">
                <span class="app-category">${this.getCategoryName(app.category)}</span>
                <div class="app-rating">
                    <span class="stars">★★★★☆</span>
                    <span>4.5</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => this.showAppDetails(app));
        return card;
    }

    // Создание карточки категории
    createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-icon">
                <i class="fas ${this.getCategoryIcon(category.id)}"></i>
            </div>
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <div class="category-count">${category.appCount || 0} приложений</div>
        `;
        
        card.addEventListener('click', () => this.showCategoryApps(category));
        return card;
    }

    // Создание карточки ожидающего приложения
    createPendingAppCard(app) {
        const card = document.createElement('div');
        card.className = 'pending-app';
        card.innerHTML = `
            <div class="pending-app-header">
                <div class="pending-app-icon">
                    ${app.icon ? `<img src="${app.icon}" alt="${app.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` : app.name.charAt(0).toUpperCase()}
                </div>
                <div class="pending-app-info">
                    <h3>${app.name}</h3>
                    <p>${app.description}</p>
                </div>
            </div>
            <div class="pending-app-meta">
                <span>Категория: ${this.getCategoryName(app.category)}</span><br>
                <span>Разработчик: ${app.developer}</span>
            </div>
            <div class="pending-actions">
                <button class="button button-fill button-success" onclick="mobileApp.approveApp('${app.id}')">
                    <i class="fas fa-check"></i> Одобрить
                </button>
                <button class="button button-fill button-danger" onclick="mobileApp.rejectApp('${app.id}')">
                    <i class="fas fa-times"></i> Отклонить
                </button>
            </div>
        `;
        
        return card;
    }

    // Показать детали приложения
    showAppDetails(app) {
        const modal = this.app.modal.create({
            title: app.name,
            text: `
                <div class="app-details">
                    <div class="app-details-icon">
                        ${app.icon ? `<img src="${app.icon}" alt="${app.name}">` : `<div class="app-icon">${app.name.charAt(0).toUpperCase()}</div>`}
                    </div>
                    <div class="app-details-info">
                        <p><strong>Описание:</strong> ${app.description}</p>
                        <p><strong>Категория:</strong> ${this.getCategoryName(app.category)}</p>
                        <p><strong>Разработчик:</strong> ${app.developer}</p>
                        <p><strong>Версия:</strong> ${app.version || '1.0.0'}</p>
                        ${app.website ? `<p><strong>Веб-сайт:</strong> <a href="${app.website}" target="_blank">${app.website}</a></p>` : ''}
                    </div>
                    ${app.screenshots && app.screenshots.length > 0 ? `
                        <div class="app-screenshots">
                            <h4>Скриншоты:</h4>
                            <div class="screenshots-grid">
                                ${app.screenshots.map(screenshot => `<img src="${screenshot}" alt="Скриншот">`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `,
            buttons: [
                {
                    text: 'Закрыть',
                    close: true
                }
            ]
        });
        modal.open();
    }

    // Показать приложения категории
    showCategoryApps(category) {
        // Переход на страницу с приложениями категории
        this.app.tab.show('#home');
        // Здесь можно добавить фильтрацию по категории
    }

    // Одобрить приложение
    async approveApp(appId) {
        try {
            const useGitHub = ConfigManager.get('github.useIssuesAsDB', false);
            
            if (useGitHub && window.GitHubDB) {
                const githubDB = new GitHubDB({
                    owner: ConfigManager.get('github.owner'),
                    repo: ConfigManager.get('github.repo'),
                    token: ConfigManager.get('github.token')
                });
                
                await githubDB.approveApp(appId);
                this.showNotification('Приложение одобрено!', 'success');
            } else {
                DataManager.approveApp(appId);
                this.showNotification('Приложение одобрено!', 'success');
            }
            
            // Перезагружаем данные
            await this.loadPendingApps();
            await this.loadHomePage();
        } catch (error) {
            this.showNotification('Ошибка при одобрении приложения', 'error');
            console.error('Ошибка одобрения:', error);
        }
    }

    // Отклонить приложение
    async rejectApp(appId) {
        try {
            const useGitHub = ConfigManager.get('github.useIssuesAsDB', false);
            
            if (useGitHub && window.GitHubDB) {
                const githubDB = new GitHubDB({
                    owner: ConfigManager.get('github.owner'),
                    repo: ConfigManager.get('github.repo'),
                    token: ConfigManager.get('github.token')
                });
                
                await githubDB.rejectApp(appId);
                this.showNotification('Приложение отклонено', 'success');
            } else {
                DataManager.rejectApp(appId);
                this.showNotification('Приложение отклонено', 'success');
            }
            
            // Перезагружаем данные
            await this.loadPendingApps();
        } catch (error) {
            this.showNotification('Ошибка при отклонении приложения', 'error');
            console.error('Ошибка отклонения:', error);
        }
    }

    // Загрузка настроек
    loadSettings() {
        const owner = ConfigManager.get('github.owner', '');
        const repo = ConfigManager.get('github.repo', 'wpastore');
        const token = ConfigManager.get('github.token', '');
        const useIssues = ConfigManager.get('github.useIssuesAsDB', false);

        document.getElementById('githubOwner').value = owner;
        document.getElementById('githubRepo').value = repo;
        document.getElementById('githubToken').value = token;
        document.getElementById('useIssuesAsDB').value = useIssues.toString();
    }

    // Сохранение настроек
    saveSettings() {
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
    }

    // Настройка событий
    setupEvents() {
        // Форма отправки приложения
        const submitForm = document.getElementById('submitAppForm');
        if (submitForm) {
            submitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAppSubmission();
            });
        }

        // Кнопка сохранения настроек
        const saveSettingsBtn = document.getElementById('saveSettings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }

        // Поиск
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
    }

    // Настройка навигации
    setupNavigation() {
        // Обработка переключения вкладок
        this.app.on('tabShow', (tab) => {
            this.currentPage = tab.el.getAttribute('href').substring(1);
            this.updateActiveTab();
        });
    }

    // Обновление активной вкладки
    updateActiveTab() {
        const tabLinks = document.querySelectorAll('.tab-link');
        tabLinks.forEach(link => {
            link.classList.remove('tab-link-active');
            if (link.getAttribute('href') === `#${this.currentPage}`) {
                link.classList.add('tab-link-active');
            }
        });
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
            this.showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }

        try {
            const useGitHub = ConfigManager.get('github.useIssuesAsDB', false);
            
            if (useGitHub && window.GitHubDB) {
                const githubDB = new GitHubDB({
                    owner: ConfigManager.get('github.owner'),
                    repo: ConfigManager.get('github.repo'),
                    token: ConfigManager.get('github.token')
                });
                
                await githubDB.addApp(formData);
                this.showNotification('Приложение успешно отправлено в GitHub!', 'success');
            } else {
                DataManager.addApp(formData);
                this.showNotification('Приложение успешно отправлено на рассмотрение!', 'success');
            }
            
            // Очищаем форму
            document.getElementById('submitAppForm').reset();
            
            // Переходим на главную страницу
            this.app.tab.show('#home');
        } catch (error) {
            this.showNotification('Ошибка при отправке приложения: ' + error.message, 'error');
            console.error('Ошибка отправки:', error);
        }
    }

    // Обработка поиска
    handleSearch(query) {
        // Здесь можно добавить логику поиска
        console.log('Поиск:', query);
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        this.app.toast.create({
            text: message,
            position: 'top',
            closeTimeout: 3000,
            cssClass: type === 'error' ? 'toast-error' : type === 'success' ? 'toast-success' : 'toast-info'
        }).open();
    }

    // Утилиты
    getCategoryName(categoryId) {
        const categories = DataManager.getCategories();
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    }

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
        return iconMap[categoryId] || 'fa-th-large';
    }
}

// Инициализация приложения
let mobileApp;
document.addEventListener('DOMContentLoaded', () => {
    mobileApp = new WPAMobileApp();
});
