// Attendre que le DOM soit chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le nom de la boutique depuis le localStorage
    const nomBoutique = localStorage.getItem('boutique');
    // Si aucun nom de boutique n'est trouvé, ajouter une classe 'empty' au body et arrêter
    if (!nomBoutique) {
        document.body.classList.add('empty');
        return;
    }

    // Sélectionner les éléments HTML par leur ID
    const elementNomBoutique = document.getElementById('nomBoutique');
    const elementProduits = document.getElementById('produits');
    const elementVentes = document.getElementById('ventes');
    const elementRecette = document.getElementById('recette');
    const elementRuptures = document.getElementById('ruptures');
    const elementExpires = document.getElementById('expires');

    // Afficher le nom de la boutique dans l'élément correspondant
    elementNomBoutique.textContent = nomBoutique;

    // Initialiser les statistiques avec des valeurs par défaut
    const statistiques = {
        produits: 0,
        ventes: 0,
        recette: '0€'
    };

    // Afficher les statistiques dans les éléments HTML
    elementProduits.textContent = statistiques.produits;
    elementVentes.textContent = statistiques.ventes;
    elementRecette.textContent = statistiques.recette;

    // Initialiser les tableaux pour les ruptures et les expirations
    const ruptures = [];
    const expires = [];

    // Afficher les ruptures de stock ou un message par défaut
    elementRuptures.innerHTML = ruptures.length ? ruptures.map(item => `<div class="item">${item}</div>`).join('') : '<div class="item">Aucune rupture de stock</div>';
    // Afficher les produits expirés ou un message par défaut
    elementExpires.innerHTML = expires.length ? expires.map(item => `<div class="item">${item}</div>`).join('') : '<div class="item">Aucun produit expiré</div>';
});
