const CACHE_NAME = 'wpa-store-v2.0.0';
const STATIC_CACHE = 'wpa-store-static-v2.0.0';
const DYNAMIC_CACHE = 'wpa-store-dynamic-v2.0.0';

// Файлы для кэширования
const STATIC_FILES = [
  '/',
  '/index.html',
  '/settings.html',
  '/start.html',
  '/manifest.json',
  '/styles/main.css',
  '/js/app.js',
  '/js/config.js',
  '/js/data.js',
  '/js/utils.js',
  '/js/components.js',
  '/js/github-db.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Стратегия кэширования: Cache First для статических файлов
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static files:', error);
      })
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated and old caches cleaned');
        return self.clients.claim();
      })
  );
});

// Перехват запросов
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Пропускаем неподдерживаемые запросы
  if (request.method !== 'GET') {
    return;
  }
  
  // Пропускаем запросы к GitHub API
  if (url.hostname === 'api.github.com') {
    return;
  }
  
  // Стратегия для статических файлов
  if (STATIC_FILES.includes(request.url) || STATIC_FILES.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then(fetchResponse => {
              // Кэшируем новый ответ
              if (fetchResponse && fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(STATIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }
              return fetchResponse;
            });
        })
    );
    return;
  }
  
  // Стратегия для динамических запросов (Network First)
  if (request.destination === 'image' || request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      fetch(request)
        .then(fetchResponse => {
          // Кэшируем успешные ответы
          if (fetchResponse && fetchResponse.status === 200) {
            const responseClone = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }
          return fetchResponse;
        })
        .catch(() => {
          // Если сеть недоступна, возвращаем из кэша
          return caches.match(request);
        })
    );
    return;
  }
  
  // Для остальных запросов: Network First с fallback на кэш
  event.respondWith(
    fetch(request)
      .then(fetchResponse => {
        // Кэшируем успешные ответы
        if (fetchResponse && fetchResponse.status === 200) {
          const responseClone = fetchResponse.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
        }
        return fetchResponse;
      })
      .catch(() => {
        // Fallback на кэш
        return caches.match(request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Fallback страница для навигации
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            return new Response('Сеть недоступна', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Обработка push уведомлений
self.addEventListener('push', event => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление от WPA.STORE',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Открыть',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('WPA.STORE', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Обработка синхронизации в фоне
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Здесь можно добавить логику синхронизации данных
      console.log('Background sync completed')
    );
  }
});

// Обработка сообщений от основного потока
self.addEventListener('message', event => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Периодическая очистка кэша
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cleanup-cache') {
    event.waitUntil(cleanupCache());
  }
});

async function cleanupCache() {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name !== STATIC_CACHE && name !== DYNAMIC_CACHE
    );
    
    await Promise.all(
      oldCaches.map(name => caches.delete(name))
    );
    
    console.log('Service Worker: Old caches cleaned up');
  } catch (error) {
    console.error('Service Worker: Error cleaning up caches:', error);
  }
}
