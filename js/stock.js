// Attendre que le DOM soit chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le nom de la boutique depuis le localStorage
    const nomBoutique = localStorage.getItem('boutique');
    // Si aucun nom de boutique n'est trouvé, rediriger vers la page de connexion
    if (!nomBoutique) {
        window.location.href = 'connexion.html';
        return;
    }

    // Afficher le nom de la boutique dans l'élément HTML
    document.getElementById('nomBoutique').textContent = nomBoutique;

    // Sélectionner les éléments de formulaire
    const champNom = document.getElementById('nom'); // Champ nom du produit
    const champAchat = document.getElementById('achat'); // Champ prix achat
    const champVente = document.getElementById('vente'); // Champ prix vente
    const champQuantite = document.getElementById('quantite'); // Champ quantité
    const champExpiration = document.getElementById('expiration'); // Champ date expiration
    const tableauProduits = document.getElementById('tableProduits'); // Tableau des produits
    const boutonAjouter = document.getElementById('ajouter-btn'); // Bouton ajouter

    // Compteur pour les IDs des produits
    let compteur = 1;

    // Fonction pour formater les prix
    function formaterPrix(valeur) {
        // Si pas un nombre, retourner 0.00
        if (Number.isNaN(valeur)) return '0.00';
        // Formater avec 2 décimales et remplacer . par ,
        return valeur.toFixed(2).replace('.', ',');
    }

    // Fonction pour ajouter un produit
    function ajouterProduit() {
        // Récupérer les valeurs des champs
        const nom = champNom.value.trim(); // Nom du produit
        const achat = parseFloat(champAchat.value); // Prix achat
        const vente = parseFloat(champVente.value); // Prix vente
        const quantite = parseInt(champQuantite.value, 10); // Quantité
        const expiration = champExpiration.value; // Date expiration

        // Validation des champs
        if (!nom || Number.isNaN(achat) || Number.isNaN(vente) || Number.isNaN(quantite) || quantite <= 0) {
            return; // Sortir si invalide
        }

        // Calculer le bénéfice
        const benefice = vente - achat;

        // Créer une ligne de tableau
        const ligne = document.createElement('tr'); // Créer un tr
        ligne.innerHTML = ` // Définir le contenu HTML
            <td>P${compteur}</td> // Colonne ID
            <td>${nom}</td> // Colonne nom
            <td>${formaterPrix(achat)}€</td> // Colonne achat
            <td>${formaterPrix(vente)}€</td> // Colonne vente
            <td><span class="badge">${formaterPrix(benefice)}€</span></td> // Colonne bénéfice avec badge
            <td>${quantite}</td> // Colonne quantité
            <td>${expiration || '—'}</td> // Colonne expiration
        `;

        // Ajouter la ligne au tableau
        tableauProduits.appendChild(ligne);
        // Incrémenter le compteur
        compteur += 1;

        // Vider les champs
        champNom.value = '';
        champAchat.value = '';
        champVente.value = '';
        champQuantite.value = '';
        champExpiration.value = '';
    }

    // Ajouter l'écouteur pour le bouton ajouter
    boutonAjouter.addEventListener('click', ajouterProduit);

    // Pour chaque champ, ajouter l'écouteur pour Entrée
    [champNom, champAchat, champVente, champQuantite, champExpiration].forEach(champ => {
        champ.addEventListener('keypress', (evenement) => {
            // Si touche Entrée, empêcher défaut et ajouter produit
            if (evenement.key === 'Enter') {
                evenement.preventDefault();
                ajouterProduit();
            }
        });
    });
});
