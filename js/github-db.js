// GitHub Issues как база данных для WPA каталога
class GitHubDB {
    constructor(config = {}) {
        this.owner = config.owner || 'your-username';
        this.repo = config.repo || 'WPACat';
        this.token = config.token || ''; // GitHub Personal Access Token
        this.baseUrl = 'https://api.github.com';
        this.issueLabels = {
            approved: 'approved',
            pending: 'pending',
            rejected: 'rejected'
        };
        
        this.init();
    }

    init() {
        // Проверяем наличие токена
        if (!this.token) {
            console.warn('GitHub токен не настроен. Некоторые функции могут быть недоступны.');
        }
        
        // Инициализируем кэш
        this.cache = {
            apps: new Map(),
            categories: new Map(),
            lastUpdate: null
        };
    }

    // Получить все приложения
    async getAllApps() {
        try {
            const issues = await this.getIssuesByLabel('wpa-app');
            return issues.map(issue => this.parseIssueToApp(issue));
        } catch (error) {
            console.error('Ошибка получения приложений:', error);
            return [];
        }
    }

    // Получить приложения по статусу
    async getAppsByStatus(status) {
        try {
            const label = this.issueLabels[status] || status;
            const issues = await this.getIssuesByLabel(`wpa-app,${label}`);
            return issues.map(issue => this.parseIssueToApp(issue));
        } catch (error) {
            console.error(`Ошибка получения приложений со статусом ${status}:`, error);
            return [];
        }
    }

    // Получить приложения по категории
    async getAppsByCategory(category) {
        try {
            const allApps = await this.getAllApps();
            return allApps.filter(app => app.category === category);
        } catch (error) {
            console.error(`Ошибка получения приложений категории ${category}:`, error);
            return [];
        }
    }

    // Поиск приложений
    async searchApps(query) {
        try {
            const allApps = await this.getAllApps();
            const searchTerm = query.toLowerCase();
            
            return allApps.filter(app => 
                app.name.toLowerCase().includes(searchTerm) ||
                app.description.toLowerCase().includes(searchTerm) ||
                app.developer.toLowerCase().includes(searchTerm)
            );
        } catch (error) {
            console.error('Ошибка поиска приложений:', error);
            return [];
        }
    }

    // Добавить новое приложение
    async addApp(appData) {
        try {
            const issueBody = this.createIssueBody(appData);
            const labels = ['wpa-app', 'pending'];
            
            const response = await this.createIssue({
                title: appData.name,
                body: issueBody,
                labels: labels
            });
            
            if (response.id) {
                Utils.showNotification('Приложение успешно добавлено!', 'success');
                return this.parseIssueToApp(response);
            }
        } catch (error) {
            console.error('Ошибка добавления приложения:', error);
            Utils.showNotification('Ошибка при добавлении приложения', 'error');
            throw error;
        }
    }

    // Одобрить приложение
    async approveApp(issueNumber) {
        try {
            const issue = await this.getIssue(issueNumber);
            if (!issue) throw new Error('Приложение не найдено');
            
            // Обновляем метки
            const newLabels = issue.labels
                .map(label => label.name)
                .filter(label => label !== 'pending' && label !== 'rejected');
            newLabels.push('approved');
            
            await this.updateIssue(issueNumber, {
                labels: newLabels
            });
            
            Utils.showNotification('Приложение одобрено!', 'success');
            return true;
        } catch (error) {
            console.error('Ошибка одобрения приложения:', error);
            Utils.showNotification('Ошибка при одобрении приложения', 'error');
            return false;
        }
    }

    // Отклонить приложение
    async rejectApp(issueNumber) {
        try {
            const issue = await this.getIssue(issueNumber);
            if (!issue) throw new Error('Приложение не найдено');
            
            // Обновляем метки
            const newLabels = issue.labels
                .map(label => label.name)
                .filter(label => label !== 'pending' && label !== 'approved');
            newLabels.push('rejected');
            
            await this.updateIssue(issueNumber, {
                labels: newLabels
            });
            
            Utils.showNotification('Приложение отклонено', 'info');
            return true;
        } catch (error) {
            console.error('Ошибка отклонения приложения:', error);
            Utils.showNotification('Ошибка при отклонении приложения', 'error');
            return false;
        }
    }

    // Получить Issue по номеру
    async getIssue(issueNumber) {
        try {
            const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues/${issueNumber}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка получения Issue:', error);
            return null;
        }
    }

    // Получить Issues по метке
    async getIssuesByLabel(label) {
        try {
            const response = await fetch(
                `${this.baseUrl}/repos/${this.owner}/${this.repo}/issues?labels=${label}&state=all&per_page=100`
            );
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка получения Issues по метке:', error);
            return [];
        }
    }

    // Создать новое Issue
    async createIssue(issueData) {
        if (!this.token) {
            throw new Error('GitHub токен не настроен');
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(issueData)
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка создания Issue:', error);
            throw error;
        }
    }

    // Обновить Issue
    async updateIssue(issueNumber, updateData) {
        if (!this.token) {
            throw new Error('GitHub токен не настроен');
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues/${issueNumber}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(updateData)
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка обновления Issue:', error);
            throw error;
        }
    }

    // Создать тело Issue из данных приложения
    createIssueBody(appData) {
        return `## Описание
${appData.description}

## Разработчик
${appData.developer}

## Категория
${appData.category}

## Версия
${appData.version || '1.0.0'}

## Веб-сайт
${appData.website || 'Не указан'}

## Иконка
${appData.icon || 'Не указана'}

## Скриншоты
${appData.screenshots && appData.screenshots.length > 0 ? appData.screenshots.join('\n') : 'Не указаны'}

## Возможности
${appData.features && appData.features.length > 0 ? appData.features.join('\n') : 'Не указаны'}

---
*Создано через WPA Каталог*`;
    }

    // Парсинг Issue в объект приложения
    parseIssueToApp(issue) {
        const body = issue.body || '';
        const lines = body.split('\n');
        
        // Извлекаем данные из тела Issue
        const app = {
            id: issue.number,
            name: issue.title,
            description: this.extractField(body, 'Описание'),
            developer: this.extractField(body, 'Разработчик'),
            category: this.extractField(body, 'Категория'),
            version: this.extractField(body, 'Версия') || '1.0.0',
            website: this.extractField(body, 'Веб-сайт'),
            icon: this.extractField(body, 'Иконка'),
            screenshots: this.extractField(body, 'Скриншоты').split('\n').filter(url => url.trim()),
            features: this.extractField(body, 'Возможности').split('\n').filter(feature => feature.trim()),
            status: this.getStatusFromLabels(issue.labels),
            dateAdded: issue.created_at,
            lastUpdated: issue.updated_at,
            issueUrl: issue.html_url
        };
        
        // Очищаем пустые значения
        Object.keys(app).forEach(key => {
            if (app[key] === 'Не указан' || app[key] === 'Не указана' || app[key] === 'Не указаны') {
                app[key] = '';
            }
        });
        
        return app;
    }

    // Извлечение поля из тела Issue
    extractField(body, fieldName) {
        const regex = new RegExp(`## ${fieldName}\\n([\\s\\S]*?)(?=\\n## |$)`);
        const match = body.match(regex);
        return match ? match[1].trim() : '';
    }

    // Получение статуса из меток
    getStatusFromLabels(labels) {
        const labelNames = labels.map(label => label.name);
        
        if (labelNames.includes('approved')) return 'approved';
        if (labelNames.includes('rejected')) return 'rejected';
        if (labelNames.includes('pending')) return 'pending';
        
        return 'pending';
    }

    // Синхронизация с локальным кэшем
    async syncWithCache() {
        try {
            const apps = await this.getAllApps();
            this.cache.apps.clear();
            apps.forEach(app => this.cache.apps.set(app.id, app));
            this.cache.lastUpdate = new Date();
            return apps;
        } catch (error) {
            console.error('Ошибка синхронизации кэша:', error);
            return [];
        }
    }

    // Получить статистику
    async getStats() {
        try {
            const allApps = await this.getAllApps();
            const stats = {
                total: allApps.length,
                approved: allApps.filter(app => app.status === 'approved').length,
                pending: allApps.filter(app => app.status === 'pending').length,
                rejected: allApps.filter(app => app.status === 'rejected').length,
                byCategory: {}
            };
            
            // Статистика по категориям
            allApps.forEach(app => {
                if (app.category) {
                    stats.byCategory[app.category] = (stats.byCategory[app.category] || 0) + 1;
                }
            });
            
            return stats;
        } catch (error) {
            console.error('Ошибка получения статистики:', error);
            return null;
        }
    }
}

// Глобальный экземпляр GitHub БД
window.GitHubDB = GitHubDB;
