document.addEventListener('DOMContentLoaded', () => {
    const boutiqueName = localStorage.getItem('boutique');
    if (!boutiqueName) {
        window.location.href = 'connexion.html';
        return;
    }

    let panier = [];
    let total = 0;

    const codeInput = document.getElementById('code');
    const quantiteInput = document.getElementById('quantite');
    const panierDiv = document.getElementById('panier');
    const totalDiv = document.getElementById('total');
    const historiqueDiv = document.getElementById('historique');

    function ajouter() {
        const code = codeInput.value.trim();
        const qte = parseInt(quantiteInput.value) || 1;

        if (!code) return;

        const prix = 100; // temporaire

        panier.push({ code, qte, prix });
        afficherPanier();
        codeInput.value = '';
        quantiteInput.value = 1;
    }

    function afficherPanier() {
        panierDiv.innerHTML = '';
        total = 0;

        panier.forEach(p => {
            const ligne = document.createElement('div');
            ligne.className = 'panier-item';
            ligne.innerHTML = `${p.code} x${p.qte} <span>${p.prix * p.qte}€</span>`;
            panierDiv.appendChild(ligne);
            total += p.prix * p.qte;
        });

        totalDiv.textContent = total + '€';
    }

    function finJournee() {
        if (panier.length === 0) return;

        const item = document.createElement('div');
        item.className = 'panier-item';
        item.textContent = `Vente : ${total}€`;
        historiqueDiv.appendChild(item);

        panier = [];
        afficherPanier();
    }

    document.getElementById('ajouter-btn').addEventListener('click', ajouter);
    document.getElementById('fin-journee-btn').addEventListener('click', finJournee);

    codeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') ajouter();
    });
});