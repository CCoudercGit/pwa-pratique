	
// 8.5 Envoyer une notification push depuis Node
	
 
	
// Import des objets et librairies nécessaires
	
const webPush = require('web-push');
	
const pushServerKeys = require('./pushServerKeys.json');
	
const pushClientSubscription = require('./pushClientSubscription.json');
	
 
	
// Test de récupération des données
	
console.log(pushServerKeys, pushClientSubscription);