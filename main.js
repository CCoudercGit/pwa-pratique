	
const technosDiv = document.querySelector('#technos');
	
 
	
function loadTechnologies(technos) {
	
    fetch('http://localhost:3001/technos')
	
        .then(response => {
	
            response.json()
	
                .then(technos => {
	
                    const allTechnos = technos.map(t => `
	
                    <div class="card">
	
                        <div class="card-body">
	
                        <h5 class="card-title">${t.name}</h5>
	
                        <p class="card-text">${t.description}</p>
	
                        <a href="${t.url}" class="card-link">site de ${t.name}</a>
	
                        </div>
	
                    </div>`)
	
                            .join('');
	
            
	
                    technosDiv.innerHTML = allTechnos; 
	
                });
	
        })
	
        .catch(console.error);
	
}

	
loadTechnologies(technos);
	
	
if(navigator.serviceWorker) {
	
    navigator.serviceWorker
	
        .register('sw.js')
	
        .catch(err => console.error('service worker NON enregistré', err));
	
}

if(window.caches) {
    caches.open('veille-techno-1.0').then(cache => {
        cache.addAll([
            'index.html',
            'main.js',
            'vendors/bootstrap4.min.css'
        ]);
    });
} 