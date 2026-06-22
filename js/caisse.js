let panier = [];
let produitCourant = null;
const codeInput = document.getElementById('code');
const suggestionsBox = document.getElementById('suggestions');

function afficherSuggestions(liste) {
    suggestionsBox.innerHTML = '';
    if (!liste.length) {
        suggestionsBox.style.display = 'none';
        return;
    }
    suggestionsBox.style.display = 'block';
    liste.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.codeProduit} - ${item.nomProduit}`;
        li.addEventListener('click', () => {
            codeInput.value = item.codeProduit;
            suggestionsBox.style.display = 'none';
            rechercherProduit();
        });
        suggestionsBox.appendChild(li);
    });
}

codeInput.addEventListener('input', () => {
    const terme = codeInput.value.trim();
    if (terme.length < 1) {
        suggestionsBox.style.display = 'none';
        return;
    }
    fetch('../Backend/produits.php?action=suggestions&q=' + encodeURIComponent(terme))
        .then(r => r.json())
        .then(data => afficherSuggestions(data));
});

codeInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        rechercherProduit();
    }
});

document.getElementById('rechercher-btn').addEventListener('click', rechercherProduit);

function rechercherProduit() {
    const code = codeInput.value.trim();
    if (code === '') {
        alert('Entrez un code produit');
        return;
    }
    fetch('../Backend/produits.php?action=rechercher&code=' + encodeURIComponent(code))
        .then(r => r.json())
        .then(produit => {
            if (!produit) {
                alert('Produit introuvable');
                return;
            }
            produitCourant = produit;
            ajouterAuPanier();
        });
}

function ajouterAuPanier() {
    if (!produitCourant) return;
    const existeIndex = panier.findIndex(p => p.idProduit == produitCourant.idProduit);
    if (existeIndex !== -1) {
        // increment and move to top
        panier[existeIndex].quantite++;
        const item = panier.splice(existeIndex, 1)[0];
        panier.unshift(item);
    } else {
        panier.unshift({
            idProduit: produitCourant.idProduit,
            nomProduit: produitCourant.nomProduit,
            prixUnitaire: Number(produitCourant.prixVente),
            quantite: 1
        });
    }
    afficherPanier();
    codeInput.value = '';
    suggestionsBox.style.display = 'none';
}

function afficherPanier() {
    const corps = document.getElementById('panier-body');
    let total = 0;
    let quantite = 0;
    corps.innerHTML = '';
    panier.forEach((ligne, index) => {
        const totalLigne = ligne.quantite * ligne.prixUnitaire;
        total += totalLigne;
        quantite += ligne.quantite;
        corps.innerHTML += `
        <tr>
            <td>${ligne.nomProduit}</td>
            <td>
                <input type="number" min="1" value="${ligne.quantite}" onchange="modifierQte(${index}, this.value)" style="width:60px">
            </td>
            <td>${ligne.prixUnitaire.toFixed(2)}</td>
            <td>${totalLigne.toFixed(2)}</td>
            <td><button onclick="supprimerProduit(${index})">X</button></td>
        </tr>
        `;
    });
    document.getElementById('resume-count').textContent = quantite;
    document.getElementById('resume-total').textContent = total.toFixed(2);
    calculerMonnaie();
}

function modifierQte(index, valeur) {
    valeur = parseInt(valeur);
    if (valeur < 1) valeur = 1;
    panier[index].quantite = valeur;
    afficherPanier();
}

function supprimerProduit(index) {
    panier.splice(index, 1);
    afficherPanier();
}

document.getElementById('montant-recu').addEventListener('input', calculerMonnaie);
function calculerMonnaie() {
    const total = parseFloat(document.getElementById('resume-total').textContent) || 0;
    const recu = parseFloat(document.getElementById('montant-recu').value) || 0;
    const rendu = document.getElementById('rendu');
    const message = document.getElementById('message-paiement');
    if (recu < total) {
        rendu.textContent = '0';
        message.textContent = 'Montant insuffisant';
        message.style.color = 'red';
    } else {
        rendu.textContent = (recu - total).toFixed(2);
        message.textContent = 'Paiement valide';
        message.style.color = 'green';
    }
}

document.getElementById('valider-btn').addEventListener('click', validerVente);
function validerVente() {
    if (panier.length === 0) {
        alert('Panier vide');
        return;
    }
    const total = parseFloat(document.getElementById('resume-total').textContent);
    const recu = parseFloat(document.getElementById('montant-recu').value) || 0;
    if (recu < total) {
        alert('Montant insuffisant');
        return;
    }
    const fd = new FormData();
    fd.append('action', 'valider');
    fd.append('panier', JSON.stringify(panier));
    fd.append('montantRecu', recu);
    fetch('../Backend/ventes.php', {
        method: 'POST',
        body: fd
    })
    .then(r => r.json())
    .then(rep => {
        if (rep.succes) {
            alert('Vente validée : ' + rep.numeroVente);
            annulerVente();
            chargerHistorique();
        } else {
            alert(rep.message);
        }
    });
}

document.getElementById('annuler-btn').addEventListener('click', annulerVente);
function annulerVente() {
    panier = [];
    document.getElementById('montant-recu').value = 0;
    afficherPanier();
}

function chargerHistorique() {
    fetch('../Backend/ventes.php?action=historique')
        .then(r => r.json())
        .then(liste => {
            const corps = document.getElementById('historique-body');
            corps.innerHTML = '';
            liste.forEach(v => {
                const heure = v.dateVente.split(' ')[1] ? v.dateVente.split(' ')[1].substring(0, 5) : '';
                corps.innerHTML += `
                <tr>
                    <td>${v.numeroVente}</td>
                    <td>${heure}</td>
                    <td>${Number(v.montantTotal).toFixed(2)}</td>
                </tr>
                `;
            });
        });
}

afficherPanier();
chargerHistorique();