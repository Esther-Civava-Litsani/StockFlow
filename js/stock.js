// ========================================
// FICHIER : stock.js
// Gestion du stock StockFlow
// ========================================

// Tableau des produits
let produits = [];

// Récupération des éléments
const nom = document.getElementById("nom");
const achat = document.getElementById("achat");
const vente = document.getElementById("vente");
const quantite = document.getElementById("quantite");
const expiration = document.getElementById("expiration");
const boutonAjouter = document.getElementById("ajouter-btn");
const tableProduits = document.getElementById("tableProduits");
const champRecherche = document.querySelector(".recherche input");

// ========================================
// Génération du code produit
// Exemple : CHO0001
// ========================================
function genererCodeProduit(nomProduit, numero) {

    let prefixe = nomProduit
        .substring(0, 3)
        .toUpperCase()
        .padEnd(3, "X");

    let numeroFormatte = String(numero).padStart(4, "0");

    return prefixe + numeroFormatte;
}

// ========================================
// Affichage des produits
// ========================================
function afficherProduits(liste = produits) {

    tableProduits.innerHTML = "";

    liste.forEach((produit, index) => {

        let ligne = `
            <tr>
                <td>${index + 1}</td>
                <td>${produit.code}</td>
                <td>${produit.nom}</td>
                <td>${produit.prixAchat}</td>
                <td>${produit.prixVente}</td>
                <td>${produit.benefice}</td>
                <td>${produit.quantite}</td>
                <td>${produit.expiration || "-"}</td>
            </tr>
        `;

        tableProduits.innerHTML += ligne;
    });

    if (liste.length === 0) {
        tableProduits.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    Aucun produit trouvé
                </td>
            </tr>
        `;
    }
}

// ========================================
// Ajout produit
// ========================================
boutonAjouter.addEventListener("click", () => {

    if (
        nom.value.trim() === "" ||
        achat.value === "" ||
        vente.value === "" ||
        quantite.value === ""
    ) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    let numeroProduit = produits.length + 1;

    let produit = {

        id: numeroProduit,

        code: genererCodeProduit(
            nom.value,
            numeroProduit
        ),

        nom: nom.value,

        prixAchat: Number(achat.value),

        prixVente: Number(vente.value),

        benefice:
            Number(vente.value) -
            Number(achat.value),

        quantite: Number(quantite.value),

        expiration: expiration.value
    };

    produits.push(produit);

    afficherProduits();

    // Réinitialisation
    nom.value = "";
    achat.value = "";
    vente.value = "";
    quantite.value = "";
    expiration.value = "";
});

// ========================================
// Recherche produit
// ========================================
champRecherche.addEventListener("keyup", () => {

    let texte = champRecherche.value.toLowerCase();

    let resultat = produits.filter(produit =>
        produit.nom.toLowerCase().includes(texte) ||
        produit.code.toLowerCase().includes(texte)
    );

    afficherProduits(resultat);
});

// ========================================
// Premier affichage
// ========================================
afficherProduits();