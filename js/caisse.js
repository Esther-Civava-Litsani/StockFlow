document.addEventListener('DOMContentLoaded', () => {
    if (!redirectToConnexionIfNeeded()) return;

    const compte = getCurrentAccount();
    const champCode = document.getElementById('code');
    const champQuantite = document.getElementById('quantite');
    const divPanier = document.getElementById('panier');
    const divTotal = document.getElementById('total');
    const divHistorique = document.getElementById('historique');
    const boutonAjouter = document.getElementById('ajouter-btn');
    const boutonFinJournee = document.getElementById('fin-journee-btn');

    let panier = [];
    let total = 0;
    const historique = compte.historique || [];

    function afficherPanier() {
        divPanier.innerHTML = '';
        total = 0;

        panier.forEach(item => {
            const ligne = document.createElement('div');
            ligne.className = 'elementPanier';
            ligne.innerHTML = `${item.code} x${item.quantite} <span>${item.prix * item.quantite}€</span>`;
            divPanier.appendChild(ligne);
            total += item.prix * item.quantite;
        });

        divTotal.textContent = total + '€';
    }

    function afficherHistorique() {
        divHistorique.innerHTML = '';
        historique.forEach(entry => {
            const element = document.createElement('div');
            element.className = 'elementPanier';
            element.textContent = `${entry.date} — ${entry.total}€ (${entry.items.length} article(s))`;
            divHistorique.appendChild(element);
        });
    }

    function enregistrerHistorique() {
        compte.historique = historique;
        saveCurrentAccount(compte);
    }

    function ajouter() {
        const code = champCode.value.trim();
        const quantite = parseInt(champQuantite.value, 10) || 1;
        if (!code) return;

        const prix = 100;
        panier.push({ code, quantite, prix });
        afficherPanier();

        champCode.value = '';
        champQuantite.value = 1;
    }

    function finJournee() {
        if (panier.length === 0) return;

        historique.push({
            date: new Date().toLocaleString('fr-FR'),
            total,
            items: [...panier]
        });

        afficherHistorique();
        enregistrerHistorique();
        panier = [];
        afficherPanier();
    }

    afficherPanier();
    afficherHistorique();

    boutonAjouter.addEventListener('click', ajouter);
    boutonFinJournee.addEventListener('click', finJournee);
    champCode.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            ajouter();
        }
    });
});
