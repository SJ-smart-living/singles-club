
const CACHE_NAME="singles-club-v1.0.0-seeded-final-20260805";
const APP_SHELL=[
  "./","./index.html","./styles.css","./app.js","./config.js",
  "./manifest.webmanifest","./icon.svg","./privacy.html","./terms.html","./safety.html",
  "./assets/hero-gathering.jpg","./assets/coffee-gathering.jpg",
  "./assets/dinner-gathering.jpg","./assets/city-walk.jpg","./assets/music-night.jpg"
];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)));
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("message",event=>{
  if(event.data?.type==="SKIP_WAITING")self.skipWaiting();
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const url=new URL(request.url);

  if(url.pathname.startsWith("/api/")||url.hostname.includes("onrender.com")){
    event.respondWith(fetch(request));
    return;
  }

  if(request.mode==="navigate"){
    event.respondWith(
      fetch(request)
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put("./index.html",copy));
          return response;
        })
        .catch(()=>caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached=>{
      const network=fetch(request).then(response=>{
        if(response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(request,response.clone()));
        return response;
      }).catch(()=>cached);
      return cached||network;
    })
  );
});
