let panier = [];
let produitCourant = null;
// RECHERCHE PRODUIT
document.getElementById('rechercher-btn').addEventListener('click', rechercherProduit);
document.getElementById('code').addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        e.preventDefault();
        rechercherProduit();
    }
});
function rechercherProduit(){
    const code = document.getElementById('code').value.trim();
    if(code === ''){
        alert('Entrez un code produit');
        return;
    }
    fetch('../backend/produits.php?action=rechercher&code=' + encodeURIComponent(code))
    .then(r => r.json())
    .then(produit => {
        if(!produit){
            alert('Produit introuvable');
            return;
        }
        produitCourant = produit;
        ajouterAuPanier();
    });
}
// Ajouter au panier
function ajouterAuPanier(){
    if(!produitCourant) return;
    const existe = panier.find(
        p => p.idProduit == produitCourant.idProduit
    );
    if(existe){
        existe.quantite++;
    }else{
        panier.push({
            idProduit: produitCourant.idProduit,
            nomProduit: produitCourant.nomProduit,
            prixUnitaire: Number(produitCourant.prixVente),
            quantite: 1
        });
    }
    afficherPanier();
    document.getElementById('code').value = '';
}
// AFFICHER PANIER
function afficherPanier(){
    const corps = document.getElementById('panier-body');
    let total = 0;
    let quantite = 0;
    corps.innerHTML = '';
    panier.forEach((ligne,index)=>{
        const totalLigne =
            ligne.quantite * ligne.prixUnitaire;
        total += totalLigne;
        quantite += ligne.quantite;
        corps.innerHTML += `
        <tr>
            <td>${ligne.nomProduit}</td>
            <td>
                <input
                type="number"
                min="1"
                value="${ligne.quantite}"
                onchange="modifierQte(${index},this.value)"
                style="width:60px">
            </td>
            <td>${ligne.prixUnitaire.toFixed(2)}</td>
            <td>${totalLigne.toFixed(2)}</td>
            <td>
                <button onclick="supprimerProduit(${index})">
                    X
                </button>
            </td>
        </tr>
        `;
    });
    document.getElementById('resume-count').textContent = quantite;
    document.getElementById('resume-total').textContent =
        total.toFixed(2);
    calculerMonnaie();
}
// Modifier quantité
function modifierQte(index,valeur){
    valeur = parseInt(valeur);
    if(valeur < 1) valeur = 1;
    panier[index].quantite = valeur;
    afficherPanier();
}
// SUPPRIMER PRODUIT
function supprimerProduit(index){
    panier.splice(index,1);
    afficherPanier();
}
// CALCUL MONNAIE
document.getElementById('montant-recu')
.addEventListener('input', calculerMonnaie);
function calculerMonnaie(){
    const total =
    parseFloat(
        document.getElementById('resume-total').textContent
    ) || 0;
    const recu =
    parseFloat(
        document.getElementById('montant-recu').value
    ) || 0;
    const rendu = document.getElementById('rendu');
    const message =
    document.getElementById('message-paiement');
    if(recu < total){
        rendu.textContent = '0';
        message.textContent =
        'Montant insuffisant';
        message.style.color = 'red';
    }else{
        rendu.textContent =
        (recu-total).toFixed(2);
        message.textContent =
        'Paiement valide';
        message.style.color = 'green';
    }
}
// VALIDER VENTE
document.getElementById('valider-btn')
.addEventListener('click', validerVente);
function validerVente(){
    if(panier.length === 0){
        alert('Panier vide');
        return;
    }
    const total =
    parseFloat(
        document.getElementById('resume-total').textContent
    );
    const recu =
    parseFloat(
        document.getElementById('montant-recu').value
    ) || 0;
    if(recu < total){
        alert('Montant insuffisant');
        return;
    }
    const fd = new FormData();
    fd.append('action','valider');
    fd.append(
        'panier',
        JSON.stringify(panier)
    );
    fd.append(
        'montantRecu',
        recu
    );
    fetch('../backend/ventes.php',{
        method:'POST',
        body:fd
    })
    .then(r=>r.json())
    .then(rep=>{
        if(rep.succes){
            alert(
                'Vente validée : ' +
                rep.numeroVente
            );
            annulerVente();

            chargerHistorique();
        }else{
            alert(rep.message);
        }
    });
}
// Annuler vente
document.getElementById('annuler-btn')
.addEventListener('click', annulerVente);
function annulerVente(){
    panier = [];
    document.getElementById('montant-recu').value = 0;
    afficherPanier();
}
// HISTORIQUE
function chargerHistorique(){
    fetch('../backend/ventes.php?action=historique')
    .then(r=>r.json())
    .then(liste=>{
        const corps =
        document.getElementById('historique-body');
        corps.innerHTML = '';
        liste.forEach(v=>{
            const heure =
            v.dateVente.split(' ')[1].substring(0,5);
            corps.innerHTML += `
            <tr>
                <td>${v.numeroVente}</td>
                <td>${heure}</td>
                <td>
                    ${Number(v.montantTotal).toFixed(2)}
                </td>
            </tr>
            `;
        });
    });
}
// CHARGEMENT INITIAL
afficherPanier();
chargerHistorique();