let produits = [];
let produitEnEdition = null;

const nom = document.getElementById("nom");
const achat = document.getElementById("achat");
const vente = document.getElementById("vente");
const quantite = document.getElementById("quantite");
const expiration = document.getElementById("expiration");
const boutonAjouter = document.getElementById("ajouter-btn");
const tableProduits = document.getElementById("tableProduits");
const champRecherche = document.getElementById("recherche-produit");

function resetForm() {
    produitEnEdition = null;
    boutonAjouter.textContent = "Ajouter le produit";
    nom.value = "";
    achat.value = "";
    vente.value = "";
    quantite.value = "";
    expiration.value = "";
}

function afficherProduits(liste = produits) {
    tableProduits.innerHTML = "";

    if (liste.length === 0) {
        tableProduits.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;">Aucun produit trouvé</td>
            </tr>
        `;
        return;
    }

    liste.forEach((produit) => {
        const benefice = (Number(produit.prixVente) - Number(produit.prixAchat)).toFixed(2);
        const ligne = `
            <tr>
                <td>${produit.idProduit}</td>
                <td>${produit.codeProduit}</td>
                <td>${produit.nomProduit}</td>
                <td>${Number(produit.prixAchat).toFixed(2)}</td>
                <td>${Number(produit.prixVente).toFixed(2)}</td>
                <td>${benefice}</td>
                <td>${produit.quantite}</td>
                <td>${produit.dateExpiration || "-"}</td>
                <td>
                    <button onclick="editerProduit(${produit.idProduit})">Modifier</button>
                    <button onclick="supprimerProduit(${produit.idProduit})">Supprimer</button>
                </td>
            </tr>
        `;
        tableProduits.innerHTML += ligne;
    });
}

function chargerProduits() {
    fetch('../Backend/produits.php?action=liste')
        .then(r => r.json())
        .then(data => {
            produits = data;
            afficherProduits();
        });
}

function editerProduit(idProduit) {
    const produit = produits.find(p => p.idProduit === idProduit);
    if (!produit) return;
    produitEnEdition = produit;
    boutonAjouter.textContent = "Enregistrer les modifications";
    nom.value = produit.nomProduit;
    achat.value = produit.prixAchat;
    vente.value = produit.prixVente;
    quantite.value = produit.quantite;
    expiration.value = produit.dateExpiration || "";
}

function supprimerProduit(idProduit) {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    const fd = new FormData();
    fd.append('action', 'supprimer');
    fd.append('idProduit', idProduit);
    fetch('../Backend/produits.php', {
        method: 'POST',
        body: fd
    })
    .then(r => r.json())
    .then(rep => {
        if (rep.succes) {
            chargerProduits();
        } else {
            alert(rep.message || 'Erreur lors de la suppression');
        }
    });
}

boutonAjouter.addEventListener('click', () => {
    if (!nom.value.trim() || achat.value === '' || vente.value === '' || quantite.value === '') {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    const fd = new FormData();
    fd.append('nomProduit', nom.value.trim());
    fd.append('prixAchat', achat.value);
    fd.append('prixVente', vente.value);
    fd.append('quantite', quantite.value);
    fd.append('expiration', expiration.value);

    if (produitEnEdition) {
        fd.append('action', 'modifier');
        fd.append('idProduit', produitEnEdition.idProduit);
    } else {
        fd.append('action', 'ajouter');
    }

    fetch('../Backend/produits.php', {
        method: 'POST',
        body: fd
    })
    .then(r => r.json())
    .then(rep => {
        if (rep.succes) {
            resetForm();
            chargerProduits();
        } else {
            alert(rep.message || 'Erreur');
        }
    });
});

champRecherche.addEventListener('input', () => {
    const texte = champRecherche.value.toLowerCase();
    const resultat = produits.filter(produit =>
        produit.nomProduit.toLowerCase().includes(texte) ||
        produit.codeProduit.toLowerCase().includes(texte)
    );
    afficherProduits(resultat);
});

chargerProduits();
resetForm();