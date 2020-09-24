const cacheName = 'veille-techno' + '1.1';

self.addEventListener('install', (evt) => {
    console.log(`sw installé à ${new Date().toLocaleTimeString()}`);

    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
            'index.html',
            'main.js',
            'style.css',
            'vendors/bootstrap4.min.css',
            'add_techno.html',
            'add_techno.js',
            'contact.html',
            'contact.js',
        ])
        .then(console.log('cache initialisé'))
        .catch(console.err);
    });

    evt.waitUntil(cachePromise);

});

self.addEventListener('fetch', (evt) => {
    // 3.4
    if(!navigator.onLine) {
        const headers = { headers: { 'Content-Type': 'text/html;charset=utf-8'} };
        evt.respondWith(new Response('<h1>Pas de connexion internet</h1><div>Application en mode dégradé. Veuillez vous connecter</div>', headers));
    }

    console.log('sw intercepte la requête suivante via fetch', evt);
    console.log('url interceptée', evt.request.url);

    self.addEventListener('fetch', (evt) => {
        if(!navigator.onLine) {
            const headers = { headers: { 'Content-Type': 'text/html;charset=utf-8'} };
            evt.respondWith(new Response('<h1>Pas de connexion internet</h1><div>Application en mode dégradé. Veuillez vous connecter</div>', headers));
        }
    
        // console.log('sw intercepte la requête suivante via fetch', evt);
        console.log('url interceptée', evt.request.url);
    
    
        // 5.1 Stratégie : cache only with network callback
        evt.respondWith(
        
            caches.match(evt.request)
                .then(cachedResponse => {   
                    if (cachedResponse) {
                           // identification de la requête trouvée dans le cache
                        console.log("url depuis le cache", evt.request.url);
                        return cachedResponse;
                    }
    
                    // 5.1 Stratégie de cache
                    return fetch(evt.request).then(
                        // On récupère la requête
                        function(newResponse) {
                            // identification de la requête ajoutée au cache
                            console.log("url depuis le réseau et mise en cache", evt.request.url);
                            
                            // Accès au cache
                            caches.open(cacheName).then(
                                function(cache){
                                    // ajout du résultat de la requête au cache
                                    cache.put(evt.request, newResponse);
                                }
                            );
                            // Utilisation de clone car on ne peut utiliser qu'une fois la réponse
                            return newResponse.clone();
                        }
                    )
                }
            )
        );
    });
});