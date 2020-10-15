	
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
	
	
// 3.2
	
if(navigator.serviceWorker) {
	
	// Enregistrement du service worker
	
    navigator.serviceWorker
	
        .register('sw.js')
	
        
	
        // 8.4 Récupération ou création d'une souscription auprès d'un push service
	
        .then(registration =>{
	
        
	
        	// tentative d'obtention d'une souscription
	
            // public vapid key générée par web-push, en prod appel d'api via fetch plutôt que static
	
            const publicKey = "BPopamekbdWvdVOYX-K67rsGIk5ALKKvt8mkg-l8axTWzemn_sU2Fq5Gx3BxwDeIAQkhFvQ3HF6Et6iixRr5BWw";
	
            registration.pushManager.getSubscription().then(subscription => {
	
            
	
            	// Déjà une souscription, on l'affiche
	
                if(subscription){
	
                    console.log("subscription", subscription);
	
                    // Extraction des données permettant ensuite l'envoi de notification
	
                    extractKeysFromArrayBuffer(subscription);
	
                    return subscription;
	
                }
	
                
	
                // Pas de souscription
	
                else{
	
                    // demande de souscription (clef convertie en buffer pour faire la demande)
	
                    const convertedKey = urlBase64ToUint8Array(publicKey);
	
                    return registration.pushManager.subscribe({
	
                        userVisibleOnly: true, // accord de confiance
	
                        applicationServerKey: convertedKey
	
                    })
	
                    .then(newSubscription => {
	
                    	// Affiche le résultat pour vérifier
	
                        console.log('newSubscription', newSubscription);
	
                        extractKeysFromArrayBuffer(newSubscription);
	
                        return newSubscription;
	
                    })
	
 
	
                }
	
            })
	
        })
	
        .catch(err => console.error('service worker NON enregistré', err));
	
}

/*	
if(window.Notification && window.Notification !== "denied"){
	
    // demande une permission
	
    Notification.requestPermission(perm => {
	
        // vérifie si la permission est acceptée par l'utilisateur
	
        // 3 valeurs possibles : default | granted | denied
	
        if(perm === "granted"){
	
          	console.log("Notification acceptée");
	
            // On crée une nouvelle notification
	
            const notif = new Notification("Hello notification");
	
        }
	
        else{
	
            // Notification refusée
	
            console.log("Notification refusée");
	
        }
	
    })
	
}
*/


//8.4 Récupération ou création d'une souscription FCM

	
// 8.4 Récupération ou création d'une souscription auprès d'un push service
	
// Fonction pour convertir string en array buffer pour envoie au push service
	
function urlBase64ToUint8Array(base64String) {
	
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
	
  const base64 = (base64String + padding)
	
    .replace(/-/g, '+')
	
    .replace(/_/g, '/');
	
 
	
  const rawData = window.atob(base64);
	
  const outputArray = new Uint8Array(rawData.length);
	
 
	
  for (let i = 0; i < rawData.length; ++i) {
	
    outputArray[i] = rawData.charCodeAt(i);
	
  }
	
  return outputArray;
	
}
	
 	
// 8.4 Récupération ou création d'une souscription auprès d'un push service
	
// Fonction pour récupérer les clés de la souscription afin de les utiliser pour notification
	
function extractKeysFromArrayBuffer(subscription){
	
    // no more keys proprety directly visible on the subscription objet. So you have to use getKey()
	
    const keyArrayBuffer = subscription.getKey('p256dh');
	
    const authArrayBuffer = subscription.getKey('auth');
	
    const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(keyArrayBuffer)));
	
    const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(authArrayBuffer)));
	
    console.log('p256dh key', keyArrayBuffer, p256dh);
	
    console.log('auth key', authArrayBuffer, auth);
	
    
	
    // Paramètres nécessaires à l'objet de notification pushSubscription
	
    console.log('endpoint :');
	
    console.dir(subscription.endpoint);
	
    console.log('p256dh key :', p256dh);
	
    console.log('auth key :', auth);
	
}