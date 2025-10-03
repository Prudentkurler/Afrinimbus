const CACHE_NAME = 'nasa-weather-companion-v1'
const urlsToCache = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        
        // Check if online and handle API calls
        if (!navigator.onLine && event.request.url.includes('/api/')) {
          return caches.match('/offline')
        }
        
        return fetch(event.request).catch(function() {
          // If fetch fails and it's a page request, show offline page
          if (event.request.destination === 'document') {
            return caches.match('/offline')
          }
        })
      })
  )
})