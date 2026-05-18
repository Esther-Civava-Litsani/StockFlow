// Sélectionner tous les boutons d'onglets
const onglets = document.querySelectorAll('.bouton');
// Sélectionner tous les formulaires
const formulaires = document.querySelectorAll('form');
// Sélectionner la boîte de message
const boiteMessage = document.getElementById('message');
// Sélectionner le champ pour afficher le mot de passe
const champAfficherMotDePasse = document.getElementById('show-password');

// Fonction pour changer d'onglet
function changerOnglet(onglet) {
    // Pour chaque bouton, activer si correspond à l'onglet
    onglets.forEach(bouton => bouton.classList.toggle('active', bouton.dataset.tab === onglet));
    // Pour chaque formulaire, activer si correspond à l'onglet
    formulaires.forEach(formulaire => formulaire.classList.toggle('active', formulaire.id === onglet + '-form'));
    // Effacer le message
    effacerMessage();
}

// Fonction pour effacer le message
function effacerMessage() {
    // Masquer la boîte de message
    boiteMessage.style.display = 'none';
    // Vider le texte
    boiteMessage.textContent = '';
    // Retirer la classe d'erreur
    boiteMessage.classList.remove('error');
}

// Fonction pour afficher un message
function afficherMessage(texte, estErreur = false) {
    // Définir le texte du message
    boiteMessage.textContent = texte;
    // Ajouter/retirer la classe d'erreur
    boiteMessage.classList.toggle('error', estErreur);
    // Afficher la boîte
    boiteMessage.style.display = 'block';
}

// Fonction pour récupérer un compte stocké
function recupererCompteStocke(nomBoutique) {
    // Si pas de nom, retourner null
    if (!nomBoutique) return null;
    // Récupérer depuis localStorage
    const stocke = localStorage.getItem(`stockflow_account_${nomBoutique}`);
    // Retourner parsé ou null
    return stocke ? JSON.parse(stocke) : null;
}

// Fonction pour créer un compte
function creerCompte(evenement) {
    // Empêcher le comportement par défaut
    evenement.preventDefault();
    // Effacer le message
    effacerMessage();

    // Récupérer les valeurs des champs
    const nomBoutique = document.getElementById('creation-shop').value.trim();
    const email = document.getElementById('creation-email').value.trim();
    const motDePasse = document.getElementById('creation-password').value;

    // Validation du nom de boutique
    if (nomBoutique.length < 2) {
        afficherMessage('Le nom de la boutique doit contenir au moins 2 caractères.', true);
        return;
    }

    // Validation de l'email
    if (!email.includes('@')) {
        afficherMessage('Veuillez saisir une adresse e-mail valide.', true);
        return;
    }

    // Validation du mot de passe
    if (motDePasse.length < 6) {
        afficherMessage('Le mot de passe doit contenir au moins 6 caractères.', true);
        return;
    }

    // Vérifier si le compte existe déjà
    if (recupererCompteStocke(nomBoutique)) {
        afficherMessage('Cette boutique existe déjà. Essayez de vous connecter.', true);
        changerOnglet('connexion');
        return;
    }

    // Créer l'objet compte
    const compte = {
        nomBoutique,
        email,
        motDePasse
    };

    // Stocker dans localStorage
    localStorage.setItem(`stockflow_account_${nomBoutique}`, JSON.stringify(compte));
    // Définir la boutique actuelle
    localStorage.setItem('boutique', nomBoutique);
    // Réinitialiser le formulaire
    document.getElementById('creation-form').reset();
    // Rediriger vers l'accueil
    window.location.href = 'accueil.html';
}

// Fonction pour se connecter
function seConnecter(evenement) {
    // Empêcher le comportement par défaut
    evenement.preventDefault();
    // Effacer le message
    effacerMessage();

    // Récupérer les valeurs
    const nomBoutique = document.getElementById('connexion-shop').value.trim();
    const motDePasse = document.getElementById('connexion-password').value;

    // Récupérer le compte
    const compte = recupererCompteStocke(nomBoutique);
    // Si pas de compte
    if (!compte) {
        afficherMessage('Boutique introuvable. Créez d’abord votre boutique.', true);
        changerOnglet('creation');
        return;
    }

    // Vérifier le mot de passe
    if (compte.motDePasse !== motDePasse) {
        afficherMessage('Mot de passe incorrect. Réessayez.', true);
        return;
    }

    // Définir la boutique actuelle
    localStorage.setItem('boutique', compte.nomBoutique);
    // Réinitialiser le formulaire
    document.getElementById('connexion-form').reset();
    // Rediriger vers l'accueil
    window.location.href = 'accueil.html';
}

// Fonction pour basculer l'affichage du mot de passe
function basculerMotDePasse(evenement) {
    // Sélectionner tous les champs password
    const champs = document.querySelectorAll('input[type="password"]');
    // Pour chaque champ, changer le type
    champs.forEach(champ => {
        champ.type = evenement.target.checked ? 'text' : 'password';
    });
}

// Changer vers l'onglet création par défaut
changerOnglet('creation');

// Ajouter les écouteurs d'événements
document.getElementById('creation-form').addEventListener('submit', creerCompte);
document.getElementById('connexion-form').addEventListener('submit', seConnecter);
document.getElementById('show-password').addEventListener('change', basculerMotDePasse);
