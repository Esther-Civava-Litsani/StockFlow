document.addEventListener('DOMContentLoaded', () => {
    if (!redirectToConnexionIfNeeded()) return;

    const compte = getCurrentAccount();
    document.getElementById('nomBoutique').textContent = compte.nomBoutique;

    const elementProduits = document.getElementById('produits');
    const elementVentes = document.getElementById('ventes');
    const elementRecette = document.getElementById('recette');
    const elementRuptures = document.getElementById('ruptures');
    const elementExpires = document.getElementById('expires');

    const produits = compte.produits || [];
    const historique = compte.historique || [];

    elementProduits.textContent = produits.length;
    elementVentes.textContent = historique.length;
    elementRecette.textContent = '0€';

    const ruptures = produits.filter(produit => produit.quantite <= 0)
        .map(produit => `${produit.nom} est en rupture de stock`);
    const expirations = produits.filter(produit => {
        if (!produit.expiration) return false;
        const dateExpiration = new Date(produit.expiration);
        return dateExpiration < new Date();
    }).map(produit => `${produit.nom} expiré le ${produit.expiration}`);

    elementRuptures.innerHTML = ruptures.length
        ? ruptures.map(item => `<div class="item">${item}</div>`).join('')
        : '<div class="item">Aucune rupture de stock</div>';

    elementExpires.innerHTML = expirations.length
        ? expirations.map(item => `<div class="item">${item}</div>`).join('')
        : '<div class="item">Aucun produit expiré</div>';
});
