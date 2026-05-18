const onglets = document.querySelectorAll('.bouton');
const formulaires = document.querySelectorAll('form');
const boiteMessage = document.getElementById('message');
const champAfficherMotDePasse = document.getElementById('show-password');

function changerOnglet(onglet) {
    onglets.forEach(bouton => bouton.classList.toggle('active', bouton.dataset.tab === onglet));
    formulaires.forEach(formulaire => formulaire.classList.toggle('active', formulaire.id === onglet + '-form'));
    effacerMessage();
}

function effacerMessage() {
    boiteMessage.style.display = 'none';
    boiteMessage.textContent = '';
    boiteMessage.classList.remove('error');
}

function afficherMessage(texte, estErreur = false) {
    boiteMessage.textContent = texte;
    boiteMessage.classList.toggle('error', estErreur);
    boiteMessage.style.display = 'block';
}

function recupererCompteStocke(nomBoutique) {
    if (!nomBoutique) return null;
    const stocke = localStorage.getItem(`stockflow_account_${nomBoutique}`);
    return stocke ? JSON.parse(stocke) : null;
}

function creerCompte(evenement) {
    evenement.preventDefault();
    effacerMessage();

    const nomBoutique = document.getElementById('creation-shop').value.trim();
    const email = document.getElementById('creation-email').value.trim();
    const motDePasse = document.getElementById('creation-password').value;

    if (nomBoutique.length < 2) {
        afficherMessage('Le nom de la boutique doit contenir au moins 2 caractères.', true);
        return;
    }

    if (!email.includes('@')) {
        afficherMessage('Veuillez saisir une adresse e-mail valide.', true);
        return;
    }

    if (motDePasse.length < 6) {
        afficherMessage('Le mot de passe doit contenir au moins 6 caractères.', true);
        return;
    }

    if (recupererCompteStocke(nomBoutique)) {
        afficherMessage('Cette boutique existe déjà. Essayez de vous connecter.', true);
        changerOnglet('connexion');
        return;
    }

    const compte = {
        nomBoutique,
        email,
        motDePasse,
        produits: [],
        historique: []
    };

    localStorage.setItem(`stockflow_account_${nomBoutique}`, JSON.stringify(compte));
    localStorage.setItem('boutique', nomBoutique);
    document.getElementById('creation-form').reset();
    window.location.href = 'accueil.html';
}

function seConnecter(evenement) {
    evenement.preventDefault();
    effacerMessage();

    const nomBoutique = document.getElementById('connexion-shop').value.trim();
    const motDePasse = document.getElementById('connexion-password').value;

    const compte = recupererCompteStocke(nomBoutique);
    if (!compte) {
        afficherMessage('Boutique introuvable. Créez d’abord votre boutique.', true);
        changerOnglet('creation');
        return;
    }

    if (compte.motDePasse !== motDePasse) {
        afficherMessage('Mot de passe incorrect. Réessayez.', true);
        return;
    }

    localStorage.setItem('boutique', compte.nomBoutique);
    document.getElementById('connexion-form').reset();
    window.location.href = 'accueil.html';
}

function basculerMotDePasse(evenement) {
    const champs = document.querySelectorAll('input[type="password"]');
    champs.forEach(champ => {
        champ.type = evenement.target.checked ? 'text' : 'password';
    });
}

changerOnglet('creation');
document.getElementById('creation-form').addEventListener('submit', creerCompte);
document.getElementById('connexion-form').addEventListener('submit', seConnecter);
document.getElementById('show-password').addEventListener('change', basculerMotDePasse);
