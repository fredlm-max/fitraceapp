const CACHE_NAME = "fitrace-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
];

// ── Install : cache les assets statiques
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate : nettoie les anciens caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch : network-first pour l'API, cache-first pour les assets
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // API Claude → toujours network, jamais cache
  if (url.pathname.startsWith("/api/")) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Assets JS/CSS → network-first avec fallback cache
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// ── Push notifications
self.addEventListener("push", (e) => {
  const data = e.data?.json() ?? {};
  const title = data.title || "FitRace";
  const options = {
    body: data.body || "Ton coach t'attend !",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-72.png",
    vibrate: [200, 100, 200],
    data: { url: data.url || "/" },
    actions: data.actions || [],
    tag: data.tag || "fitrace-notif",
    renotify: true,
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// ── Click sur une notification
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const targetUrl = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url === targetUrl && "focus" in client) return client.focus();
      }
      return clients.openWindow(targetUrl);
    })
  );
});

// ── Message depuis l'app (schedule local notifications)
self.addEventListener("message", (e) => {
  if (e.data?.type === "SCHEDULE_NOTIF") {
    const { delay, title, body, url } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-72.png",
        vibrate: [200, 100, 200],
        data: { url: url || "/" },
        tag: "fitrace-scheduled",
      });
    }, delay);
  }
});
