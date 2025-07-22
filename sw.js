const CACHE_NAME = 'school-day-countdown-v9'; // Versão incrementada para uma estratégia de cache mais robusta

// Apenas os recursos essenciais do 'app shell' são pré-cacheados.
// Dependências externas serão cacheadas dinamicamente no evento 'fetch'.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/index.tsx',
  '/App.tsx',
  '/constants/schoolDays.ts',
  '/hooks/useSchoolDayCounter.ts',
  '/components/CountdownDisplay.tsx',
  '/components/icons/CalendarIcon.tsx',
];

// Evento de instalação: guarda em cache os recursos essenciais do app shell.
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aberta. A guardar recursos essenciais do app shell.');
      return cache.addAll(urlsToCache);
    }).catch(err => {
      console.error('Falha ao guardar em cache durante a instalação:', err);
    })
  );
});

// Evento de ativação: limpa caches antigas.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('A apagar cache antiga:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento de fetch: serve recursos da cache primeiro (cache-first), com fallback para a rede.
// Guarda em cache novos pedidos dinamicamente para um suporte offline completo.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Se o recurso estiver na cache, retorna-o.
      if (cachedResponse) {
        return cachedResponse;
      }

      // Se não estiver, busca na rede.
      return fetch(event.request).then(networkResponse => {
        // Só guardamos em cache respostas válidas.
        if (!networkResponse || networkResponse.status !== 200 && networkResponse.type !== 'opaque') {
            return networkResponse;
        }

        // Clona a resposta para poder ser guardada em cache e retornada ao navegador.
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
          // Se a busca na rede falhar (ex: offline) e for um pedido de navegação,
          // serve a página principal como fallback para manter a app a funcionar.
          if (event.request.mode === 'navigate') {
              return caches.match('/');
          }
      });
    })
  );
});