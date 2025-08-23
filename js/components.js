// Компоненты для WPA каталога
const Components = {
    // Создание карточки приложения
    createAppCard(app) {
        const category = DataManager.getCategoryById(app.category);
        const card = document.createElement('div');
        card.className = 'app-card';
        card.dataset.appId = app.id;
        
        card.innerHTML = `
            <div class="app-icon">
                ${app.icon ? `<img src="${app.icon}" alt="${app.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <span style="display: none;">${app.name.charAt(0)}</span>` : 
                `<span>${app.name.charAt(0)}</span>`}
            </div>
            <div class="app-info">
                <h3>${app.name}</h3>
                <p>${app.description.length > 100 ? app.description.substring(0, 100) + '...' : app.description}</p>
                <div class="app-meta">
                    <span class="app-category">${category ? category.name : 'Без категории'}</span>
                    <span class="app-rating">${Utils.createRatingStars(app.rating)} ${Utils.formatRating(app.rating)}</span>
                </div>
                <div class="app-meta">
                    <span class="app-developer">${app.developer}</span>
                    <span class="app-downloads">${Utils.formatDownloads(app.downloads)} загрузок</span>
                </div>
            </div>
        `;
        
        // Обработчик клика для открытия модала
        card.addEventListener('click', () => {
            if (window.mobileApp && typeof window.mobileApp.showAppDetails === 'function') {
                window.mobileApp.showAppDetails(app);
            } else {
                console.warn('mobileApp.showAppDetails не доступен');
                // Fallback: открываем в новом окне
                if (app.website) {
                    window.open(app.website, '_blank');
                }
            }
        });
        
        return card;
    },

    // Создание карточки категории
    createCategoryCard(category) {
        const appsCount = DataManager.getAppsByCategory(category.id).length;
        const card = document.createElement('div');
        card.className = 'category-card';
        card.dataset.categoryId = category.id;
        
        card.innerHTML = `
            <div class="category-icon">
                <i class="${category.icon}" style="color: ${category.color}"></i>
            </div>
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <div class="category-count">${appsCount} приложений</div>
        `;
        
        // Обработчик клика для показа приложений категории
        card.addEventListener('click', () => {
            if (window.mobileApp && typeof window.mobileApp.showCategoryApps === 'function') {
                window.mobileApp.showCategoryApps(category);
            } else {
                console.warn('mobileApp.showCategoryApps не доступен');
                // Fallback: показываем все приложения
                if (window.location.hash !== '#home') {
                    window.location.hash = '#home';
                }
            }
        });
        
        return card;
    },

    // Создание карточки ожидающего приложения
    createPendingAppCard(app) {
        const category = DataManager.getCategoryById(app.category);
        const card = document.createElement('div');
        card.className = 'pending-app';
        
        card.innerHTML = `
            <h4>${app.name}</h4>
            <p><strong>Разработчик:</strong> ${app.developer}</p>
            <p><strong>Категория:</strong> ${category ? category.name : 'Без категории'}</p>
            <p><strong>Описание:</strong> ${app.description}</p>
            <p><strong>Версия:</strong> ${app.version}</p>
            <p><strong>Веб-сайт:</strong> <a href="${app.website}" target="_blank">${app.website}</a></p>
            <p><strong>Дата добавления:</strong> ${Utils.formatDate(app.dateAdded)}</p>
            <div class="pending-actions">
                <button class="btn btn-success approve-btn" data-app-id="${app.id}">
                    <i class="fas fa-check"></i> Одобрить
                </button>
                <button class="btn btn-danger reject-btn" data-app-id="${app.id}">
                    <i class="fas fa-times"></i> Отклонить
                </button>
            </div>
        `;
        
        // Обработчики для кнопок
        const approveBtn = card.querySelector('.approve-btn');
        const rejectBtn = card.querySelector('.reject-btn');
        
        approveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.mobileApp && typeof window.mobileApp.approveApp === 'function') {
                window.mobileApp.approveApp(app.id);
            } else {
                console.warn('mobileApp.approveApp не доступен');
            }
        });
        
        rejectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.mobileApp && typeof window.mobileApp.rejectApp === 'function') {
                window.mobileApp.rejectApp(app.id);
            } else {
                console.warn('mobileApp.rejectApp не доступен');
            }
        });
        
        return card;
    },

    // Показать модал с подробностями приложения
    showAppModal(appId) {
        const app = DataManager.getAppById(appId);
        if (!app) return;
        
        const modal = document.getElementById('appModal');
        const content = document.getElementById('appModalContent');
        
        const category = DataManager.getCategoryById(app.category);
        
        content.innerHTML = `
            <div class="app-modal-header">
                <div class="app-modal-icon">
                    ${app.icon ? `<img src="${app.icon}" alt="${app.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <span style="display: none;">${app.name.charAt(0)}</span>` : 
                    `<span>${app.name.charAt(0)}</span>`}
                </div>
                <div class="app-modal-info">
                    <h2>${app.name}</h2>
                    <p class="app-modal-developer">${app.developer}</p>
                    <div class="app-modal-rating">
                        ${Utils.createRatingStars(app.rating)} ${Utils.formatRating(app.rating)}
                    </div>
                    <div class="app-modal-meta">
                        <span><i class="fas fa-download"></i> ${Utils.formatDownloads(app.downloads)} загрузок</span>
                        <span><i class="fas fa-calendar"></i> ${Utils.formatDate(app.dateAdded)}</span>
                        <span><i class="fas fa-code-branch"></i> v${app.version}</span>
                    </div>
                </div>
            </div>
            
            <div class="app-modal-description">
                <h3>Описание</h3>
                <p>${app.description}</p>
            </div>
            
            <div class="app-modal-category">
                <h3>Категория</h3>
                <div class="category-badge" style="background: ${category ? category.color : '#ccc'}">
                    <i class="${category ? category.icon : 'fas fa-tag'}"></i>
                    ${category ? category.name : 'Без категории'}
                </div>
            </div>
            
            ${app.features && app.features.length > 0 ? `
            <div class="app-modal-features">
                <h3>Возможности</h3>
                <ul>
                    ${app.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${app.screenshots && app.screenshots.length > 0 ? `
            <div class="app-modal-screenshots">
                <h3>Скриншоты</h3>
                <div class="screenshots-grid">
                    ${app.screenshots.map(screenshot => `
                        <img src="${screenshot}" alt="Скриншот" onclick="this.classList.toggle('expanded')">
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="app-modal-actions">
                ${app.website ? `<a href="${app.website}" target="_blank" class="btn btn-primary">
                    <i class="fas fa-external-link-alt"></i> Открыть сайт
                </a>` : ''}
                <button class="btn btn-secondary" onclick="Utils.copyToClipboard('${app.name} - ${app.website || 'Нет сайта'}')">
                    <i class="fas fa-copy"></i> Копировать ссылку
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Закрытие модала
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
        
        // Закрытие по клику вне модала
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    },

    // Показать приложения категории
    showCategoryApps(categoryId) {
        const category = DataManager.getCategoryById(categoryId);
        const apps = DataManager.getAppsByCategory(categoryId);
        
        // Создаем временную страницу для категории
        const tempPage = document.createElement('section');
        tempPage.className = 'page category-apps-page';
        tempPage.innerHTML = `
            <div class="container">
                <div class="category-header">
                    <button class="btn btn-secondary back-btn">
                        <i class="fas fa-arrow-left"></i> Назад к категориям
                    </button>
                    <h2>${category ? category.name : 'Категория'}</h2>
                    <p>${category ? category.description : ''}</p>
                </div>
                <div class="apps-grid" id="categoryAppsGrid"></div>
            </div>
        `;
        
        // Показываем страницу
        document.querySelector('.main-content').appendChild(tempPage);
        
        // Скрываем все остальные страницы
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        tempPage.classList.add('active');
        
        // Обновляем навигацию
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        
        // Заполняем сетку приложений
        const appsGrid = tempPage.querySelector('#categoryAppsGrid');
        if (apps.length > 0) {
            apps.forEach(app => {
                appsGrid.appendChild(this.createAppCard(app));
            });
        } else {
            appsGrid.innerHTML = '<p class="no-apps">В этой категории пока нет приложений</p>';
        }
        
        // Обработчик кнопки "Назад"
        const backBtn = tempPage.querySelector('.back-btn');
        backBtn.addEventListener('click', () => {
            tempPage.remove();
            document.getElementById('categories').classList.add('active');
            document.querySelector('[data-page="categories"]').classList.add('active');
        });
    },

    // Одобрить приложение
    approveApp(appId) {
        Utils.showConfirmDialog(
            'Вы уверены, что хотите одобрить это приложение?',
            () => {
                if (DataManager.approveApp(appId)) {
                    Utils.showNotification('Приложение одобрено!', 'success');
                    this.refreshAdminPanel();
                } else {
                    Utils.showNotification('Ошибка при одобрении приложения', 'error');
                }
            }
        );
    },

    // Отклонить приложение
    rejectApp(appId) {
        Utils.showConfirmDialog(
            'Вы уверены, что хотите отклонить это приложение?',
            () => {
                if (DataManager.rejectApp(appId)) {
                    Utils.showNotification('Приложение отклонено', 'info');
                    this.refreshAdminPanel();
                } else {
                    Utils.showNotification('Ошибка при отклонении приложения', 'error');
                }
            }
        );
    },

    // Обновить админ панель
    refreshAdminPanel() {
        const pendingAppsContainer = document.getElementById('pendingApps');
        if (!pendingAppsContainer) return;
        
        const pendingApps = DataManager.getPendingApps();
        
        if (pendingApps.length === 0) {
            pendingAppsContainer.innerHTML = '<p class="no-pending">Нет приложений на рассмотрении</p>';
        } else {
            pendingAppsContainer.innerHTML = '';
            pendingApps.forEach(app => {
                pendingAppsContainer.appendChild(this.createPendingAppCard(app));
            });
        }
    },

    // Инициализация компонентов
    init() {
        // Добавляем стили для модала приложения
        const appModalStyles = document.createElement('style');
        appModalStyles.textContent = `
            .app-modal-header {
                display: flex;
                gap: 2rem;
                margin-bottom: 2rem;
                align-items: flex-start;
            }
            
            .app-modal-icon {
                width: 120px;
                height: 120px;
                border-radius: 20px;
                overflow: hidden;
                flex-shrink: 0;
                background: linear-gradient(135deg, #667eea, #764ba2);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 3rem;
            }
            
            .app-modal-icon img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .app-modal-info h2 {
                margin-bottom: 0.5rem;
                color: #333;
            }
            
            .app-modal-developer {
                color: #666;
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            .app-modal-rating {
                margin-bottom: 1rem;
                font-size: 1.2rem;
            }
            
            .app-modal-meta {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
                font-size: 0.9rem;
                color: #888;
            }
            
            .app-modal-meta span {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .app-modal-description,
            .app-modal-category,
            .app-modal-features,
            .app-modal-screenshots {
                margin-bottom: 2rem;
            }
            
            .app-modal-description h3,
            .app-modal-category h3,
            .app-modal-features h3,
            .app-modal-screenshots h3 {
                margin-bottom: 1rem;
                color: #333;
                border-bottom: 2px solid #f0f0f0;
                padding-bottom: 0.5rem;
            }
            
            .category-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border-radius: 25px;
                color: white;
                font-weight: 600;
            }
            
            .app-modal-features ul {
                list-style: none;
                padding: 0;
            }
            
            .app-modal-features li {
                padding: 0.5rem 0;
                border-bottom: 1px solid #f0f0f0;
                position: relative;
                padding-left: 1.5rem;
            }
            
            .app-modal-features li:before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #28a745;
                font-weight: bold;
            }
            
            .screenshots-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .screenshots-grid img {
                width: 100%;
                height: 150px;
                object-fit: cover;
                border-radius: 8px;
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            
            .screenshots-grid img:hover {
                transform: scale(1.05);
            }
            
            .screenshots-grid img.expanded {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80vw;
                height: 80vh;
                object-fit: contain;
                z-index: 3000;
                background: rgba(0,0,0,0.9);
                border-radius: 0;
            }
            
            .app-modal-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
                justify-content: center;
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 2px solid #f0f0f0;
            }
            
            .category-header {
                text-align: center;
                margin-bottom: 3rem;
                position: relative;
            }
            
            .back-btn {
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
            }
            
            .no-apps,
            .no-pending {
                text-align: center;
                color: #666;
                font-size: 1.2rem;
                padding: 3rem;
                background: white;
                border-radius: 15px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
        `;
        
        document.head.appendChild(appModalStyles);
    }
};
