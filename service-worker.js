self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("attendance")
      .then(cache => cache.addAll(["./","./index.html"]))
  );
});
