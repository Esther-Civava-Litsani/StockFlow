document.addEventListener('DOMContentLoaded', () => {
    const boutiqueName = localStorage.getItem('boutique');
    if (!boutiqueName) {
        document.body.classList.add('empty');
        return;
    }

    const shopNameElement = document.getElementById('nomBoutique');
    const productsElement = document.getElementById('produits');
    const salesElement = document.getElementById('ventes');
    const revenueElement = document.getElementById('recette');
    const rupturesElement = document.getElementById('ruptures');
    const expiredElement = document.getElementById('expires');

    shopNameElement.textContent = boutiqueName;

    const stats = {
        produits: 0,
        ventes: 0,
        recette: '0€'
    };

    productsElement.textContent = stats.produits;
    salesElement.textContent = stats.ventes;
    revenueElement.textContent = stats.recette;

    const ruptures = [];
    const expires = [];

    rupturesElement.innerHTML = ruptures.length ? ruptures.map(item => `<div class="item">${item}</div>`).join('') : '<div class="item">Aucune rupture de stock</div>';
    expiredElement.innerHTML = expires.length ? expires.map(item => `<div class="item">${item}</div>`).join('') : '<div class="item">Aucun produit expiré</div>';
});
