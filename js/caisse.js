// Attendre que le DOM soit chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le nom de la boutique depuis le localStorage
    const nomBoutique = localStorage.getItem('boutique');
    // Si aucun nom de boutique n'est trouvé, rediriger vers la page de connexion
    if (!nomBoutique) {
        window.location.href = 'connexion.html';
        return;
    }

    // Initialiser le panier et le total
    let panier = []; // Tableau pour stocker les articles du panier
    let total = 0; // Total de la vente en cours

    // Sélectionner les éléments HTML
    const champCode = document.getElementById('code'); // Champ de saisie du code
    const champQuantite = document.getElementById('quantite'); // Champ de saisie de la quantité
    const divPanier = document.getElementById('panier'); // Div pour afficher le panier
    const divTotal = document.getElementById('total'); // Div pour afficher le total
    const divHistorique = document.getElementById('historique'); // Div pour l'historique

    // Fonction pour ajouter un produit au panier
    function ajouter() {
        // Récupérer le code et la quantité
        const code = champCode.value.trim(); // Code du produit
        const quantite = parseInt(champQuantite.value) || 1; // Quantité, défaut 1

        // Si pas de code, sortir
        if (!code) return;

        // Prix temporaire (à remplacer par une vraie logique)
        const prix = 100; // Prix unitaire

        // Ajouter au panier
        panier.push({ code, quantite, prix }); // Ajouter l'objet au tableau
        afficherPanier(); // Mettre à jour l'affichage du panier
        champCode.value = ''; // Vider le champ code
        champQuantite.value = 1; // Remettre quantité à 1
    }

    // Fonction pour afficher le panier
    function afficherPanier() {
        divPanier.innerHTML = ''; // Vider la div
        total = 0; // Réinitialiser le total

        // Pour chaque article dans le panier
        panier.forEach(p => {
            // Créer une ligne pour l'article
            const ligne = document.createElement('div'); // Créer un div
            ligne.className = 'elementPanier'; // Ajouter la classe CSS
            ligne.innerHTML = `${p.code} x${p.quantite} <span>${p.prix * p.quantite}€</span>`; // Contenu HTML
            divPanier.appendChild(ligne); // Ajouter à la div panier
            total += p.prix * p.quantite; // Ajouter au total
        });

        // Afficher le total
        divTotal.textContent = total + '€'; // Mettre à jour le texte
    }

    // Fonction pour finir la journée
    function finJournee() {
        // Si panier vide, sortir
        if (panier.length === 0) return;

        // Créer un élément pour l'historique
        const element = document.createElement('div'); // Créer un div
        element.className = 'elementPanier'; // Ajouter la classe CSS
        element.textContent = `Vente : ${total}€`; // Texte de la vente
        divHistorique.appendChild(element); // Ajouter à l'historique

        // Vider le panier
        panier = []; // Réinitialiser le tableau
        afficherPanier(); // Mettre à jour l'affichage
    }

    // Ajouter les écouteurs d'événements
    document.getElementById('ajouter-btn').addEventListener('click', ajouter); // Bouton ajouter
    document.getElementById('fin-journee-btn').addEventListener('click', finJournee); // Bouton fin journée

    // Écouteur pour la touche Entrée dans le champ code
    champCode.addEventListener('keypress', (e) => {
        // Si touche Entrée, ajouter
        if (e.key === 'Enter') ajouter(); // Appeler la fonction ajouter
    });
});