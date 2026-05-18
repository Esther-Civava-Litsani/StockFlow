document.addEventListener('DOMContentLoaded', () => {
    if (!redirectToConnexionIfNeeded()) return;

    const compte = getCurrentAccount();
    document.getElementById('nomBoutique').textContent = compte.nomBoutique;

    const champNom = document.getElementById('nom');
    const champAchat = document.getElementById('achat');
    const champVente = document.getElementById('vente');
    const champQuantite = document.getElementById('quantite');
    const champExpiration = document.getElementById('expiration');
    const tableauProduits = document.getElementById('tableProduits');
    const boutonAjouter = document.getElementById('ajouter-btn');

    let produits = compte.produits || [];

    function formaterPrix(valeur) {
        if (Number.isNaN(valeur)) return '0,00';
        return valeur.toFixed(2).replace('.', ',');
    }

    function afficherProduits() {
        tableauProduits.innerHTML = '';
        produits.forEach((produit, index) => {
            const ligne = document.createElement('tr');
            ligne.innerHTML = `
                <td>P${index + 1}</td>
                <td>${produit.nom}</td>
                <td>${formaterPrix(produit.achat)}€</td>
                <td>${formaterPrix(produit.vente)}€</td>
                <td><span class="badge">${formaterPrix(produit.vente - produit.achat)}€</span></td>
                <td>${produit.quantite}</td>
                <td>${produit.expiration || '—'}</td>
            `;
            tableauProduits.appendChild(ligne);
        });
    }

    function enregistrerProduits() {
        compte.produits = produits;
        saveCurrentAccount(compte);
    }

    function ajouterProduit() {
        const nom = champNom.value.trim();
        const achat = parseFloat(champAchat.value);
        const vente = parseFloat(champVente.value);
        const quantite = parseInt(champQuantite.value, 10);
        const expiration = champExpiration.value;

        if (!nom || Number.isNaN(achat) || Number.isNaN(vente) || Number.isNaN(quantite) || quantite <= 0) {
            return;
        }

        const produit = {
            nom,
            achat,
            vente,
            quantite,
            expiration
        };

        produits.push(produit);
        enregistrerProduits();
        afficherProduits();

        champNom.value = '';
        champAchat.value = '';
        champVente.value = '';
        champQuantite.value = '';
        champExpiration.value = '';
    }

    afficherProduits();
    boutonAjouter.addEventListener('click', ajouterProduit);
    [champNom, champAchat, champVente, champQuantite, champExpiration].forEach(champ => {
        champ.addEventListener('keypress', evenement => {
            if (evenement.key === 'Enter') {
                evenement.preventDefault();
                ajouterProduit();
            }
        });
    });
});
