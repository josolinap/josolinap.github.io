// Service Worker for Josolina Portfolio
// Provides offline functionality and performance optimizations

const CACHE_NAME = "josolina-portfolio-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/about/",
  "/contact/",
  "/assets/css/main.css",
  "/assets/terminal.svg",
  "/manifest.json",
  "/robots.txt",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error("Cache installation failed:", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log("Deleting old cache:", name);
              return caches.delete(name);
            }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip admin and API requests
  if (
    event.request.url.includes("/admin/") ||
    event.request.url.includes("api.github.com")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        // Update cache in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          })
          .catch(() => {
            // Network failed, but we have cached version
          });

        return response;
      }

      // Not in cache, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Don't cache non-successful responses
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // Clone the response
          const responseToCache = networkResponse.clone();

          // Add to cache
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch((error) => {
          console.error("Fetch failed:", error);
          // Return offline fallback if available
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
          throw error;
        });
    }),
  );
});

// Background sync for form submissions (if needed in future)
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-form") {
    event.waitUntil(syncContactForm());
  }
});

// Push notifications (if needed in future)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/assets/icons/icon-192x192.png",
        badge: "/assets/icons/icon-72x72.png",
        data: data.url,
      }),
    );
  }
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data || "/"));
});
