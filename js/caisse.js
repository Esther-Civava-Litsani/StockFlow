document.addEventListener('DOMContentLoaded', () => {
    if (!redirectToConnexionIfNeeded()) return; /* Rediriger si non connecté */

    const compte = getCurrentAccount(); /* Récupérer le compte */
    const champCode = document.getElementById('code'); /* Champ code produit */
    const champQuantite = document.getElementById('quantite'); /* Champ quantité */
    const champMontantRecu = document.getElementById('montant-recu'); /* Champ montant reçu */
    const infoNom = document.getElementById('info-nom'); /* Affichage nom */
    const infoPrix = document.getElementById('info-prix'); /* Affichage prix */
    const infoStock = document.getElementById('info-stock'); /* Affichage stock */
    const panierBody = document.getElementById('panier-body'); /* Corps du panier */
    const resumeCount = document.getElementById('resume-count'); /* Nombre produits */
    const resumeTotal = document.getElementById('resume-total'); /* Montant total */
    const rendu = document.getElementById('rendu'); /* Monnaie à rendre */
    const messagePaiement = document.getElementById('message-paiement'); /* Message paiement */
    const historiqueContainer = document.getElementById('historique'); /* Conteneur historique */
    const rechercherBtn = document.getElementById('rechercher-btn'); /* Bouton rechercher */
    const ajouterPanierBtn = document.getElementById('ajouter-panier-btn'); /* Bouton ajouter panier */
    const annulerProduitBtn = document.getElementById('annuler-produit-btn'); /* Bouton annuler produit */
    const validerBtn = document.getElementById('valider-btn'); /* Bouton valider vente */
    const annulerBtn = document.getElementById('annuler-btn'); /* Bouton annuler vente */
    const imprimerBtn = document.getElementById('imprimer-btn'); /* Bouton imprimer facture */

    const produits = compte.produits || []; /* Produits en stock */
    const historique = compte.historique || []; /* Historique des ventes */
    let panier = []; /* Panier en cours */
    let produitSelectionne = null; /* Produit sélectionné */

    function formaterPrix(valeur) {
        const nombre = Number(valeur) || 0; /* Convertir en nombre */
        return nombre.toFixed(0).replace('.', ',') + ' FC'; /* Format FC */
    }

    function genererCode(index) {
        return `P${String(index + 1).padStart(3, '0')}`; /* Code produit P### */
    }

    function initialiserCodes() {
        produits.forEach((produit, index) => {
            if (!produit.code) {
                produit.code = genererCode(index); /* Assigner un code manquant */
            }
        });
        compte.produits = produits; /* Sauvegarder les codes éventuels */
        saveCurrentAccount(compte); /* Enregistrer le compte */
    }

    function trouverProduit(code) {
        const saisie = String(code || '').trim().toUpperCase(); /* Normaliser le code */
        if (!saisie) return null; /* Aucun code saisi */
        return produits.find(produit => produit.code && produit.code.toUpperCase() === saisie) || null; /* Retourner le produit */
    }

    function afficherProduit(produit) {
        if (!produit) {
            infoNom.textContent = '—'; /* Réinitialiser nom */
            infoPrix.textContent = '—'; /* Réinitialiser prix */
            infoStock.textContent = '—'; /* Réinitialiser stock */
            produitSelectionne = null; /* Aucune sélection */
            return;
        }
        infoNom.textContent = produit.nom || '—'; /* Nom du produit */
        infoPrix.textContent = formaterPrix(produit.vente); /* Prix du produit */
        infoStock.textContent = produit.quantite != null ? produit.quantite : '—'; /* Stock disponible */
        produitSelectionne = produit; /* Stocker la sélection */
    }

    function calculerTotaux() {
        const total = panier.reduce((somme, item) => somme + item.prix * item.quantite, 0); /* Total du panier */
        const recu = Number(champMontantRecu.value) || 0; /* Montant reçu */

        resumeCount.textContent = panier.reduce((sum, item) => sum + item.quantite, 0); /* Nombre total de produits */
        resumeTotal.textContent = formaterPrix(total); /* Afficher total */

        if (recu < total) {
            messagePaiement.textContent = `Montant insuffisant — Reste à payer : ${formaterPrix(total - recu)}`; /* Message d'erreur */
            rendu.textContent = '0 FC'; /* Pas de monnaie rendu */
        } else {
            messagePaiement.textContent = ''; /* Aucun message d'erreur */
            rendu.textContent = formaterPrix(recu - total); /* Calcul monnaie à rendre */
        }
        return total; /* Retourner le total */
    }

    function afficherPanier() {
        panierBody.innerHTML = ''; /* Vider le tableau */
        panier.forEach((item, index) => {
            const ligne = document.createElement('tr'); /* Nouvelle ligne */
            ligne.innerHTML = `
                <td>${item.nom}</td>
                <td>${item.quantite}</td>
                <td>${formaterPrix(item.prix)}</td>
                <td>${formaterPrix(item.prix * item.quantite)}</td>
                <td class="action-cell">
                    <button class="modifier-btn" data-index="${index}" title="Modifier">✏️</button>
                    <button class="supprimer-btn" data-index="${index}" title="Supprimer">🗑️</button>
                </td>
            `; /* Contenu de la ligne */
            panierBody.appendChild(ligne); /* Ajouter la ligne */
        });
        calculerTotaux(); /* Mettre à jour les totaux */

        panierBody.querySelectorAll('.modifier-btn').forEach(btn => {
            btn.addEventListener('click', () => modifierQuantite(Number(btn.dataset.index))); /* Modifier quantité */
        });
        panierBody.querySelectorAll('.supprimer-btn').forEach(btn => {
            btn.addEventListener('click', () => supprimerProduit(Number(btn.dataset.index))); /* Supprimer ligne */
        });
    }

    function modifierQuantite(index) {
        const ligne = panier[index]; /* Ligne sélectionnée */
        if (!ligne) return; /* Si introuvable */
        const nouveau = parseInt(window.prompt(`Nouvelle quantité pour ${ligne.nom} :`, ligne.quantite), 10); /* Demander quantité */
        if (Number.isNaN(nouveau) || nouveau < 1) return; /* Quantité invalide */
        const produitStock = trouverProduit(ligne.code); /* Produit stock */
        if (!produitStock) return; /* Produit introuvable */
        if (nouveau > produitStock.quantite) {
            window.alert('Quantité supérieure au stock disponible.'); /* Alerte stock */
            return;
        }
        ligne.quantite = nouveau; /* Mettre à jour */
        afficherPanier(); /* Rafraîchir panier */
    }

    function supprimerProduit(index) {
        panier.splice(index, 1); /* Supprimer l'article */
        afficherPanier(); /* Rafraîchir panier */
    }

    function ajouterAuPanier() {
        if (!produitSelectionne) {
            window.alert('Veuillez rechercher un produit valide.'); /* Aucun produit sélectionné */
            return;
        }
        const quantite = parseInt(champQuantite.value, 10) || 1; /* Lire quantité */
        if (quantite < 1) {
            window.alert('Quantité invalide.'); /* Alerte quantité */
            return;
        }
        if (quantite > produitSelectionne.quantite) {
            window.alert('Quantité demandée supérieure au stock disponible.'); /* Alerte stock */
            return;
        }

        const ligneExistant = panier.find(item => item.code === produitSelectionne.code); /* Chercher article existant */
        if (ligneExistant) {
            if (ligneExistant.quantite + quantite > produitSelectionne.quantite) {
                window.alert('Le total dépasse le stock disponible.'); /* Alerte si dépasse stock */
                return;
            }
            ligneExistant.quantite += quantite; /* Ajouter quantité */
        } else {
            panier.push({ /* Ajouter nouvel article */
                code: produitSelectionne.code,
                nom: produitSelectionne.nom,
                prix: produitSelectionne.vente,
                quantite
            });
        }

        champCode.value = ''; /* Réinitialiser le champ code */
        champQuantite.value = 1; /* Réinitialiser la quantité */
        afficherPanier(); /* Rafraîchir panier */
    }

    function annulerSelectionProduit() {
        champCode.value = ''; /* Effacer le code */
        champQuantite.value = 1; /* Réinitialiser quantité */
        afficherProduit(null); /* Réinitialiser affichage produit */
    }

    function annulerVente() {
        panier = []; /* Vider le panier */
        champMontantRecu.value = 0; /* Réinitialiser montant reçu */
        messagePaiement.textContent = ' '; /* Réinitialiser message */
        rendu.textContent = '0 FC'; /* Réinitialiser rendu */
        afficherPanier(); /* Rafraîchir panier */
        annulerSelectionProduit(); /* Réinitialiser produit */
    }

    function afficherHistorique() {
        historiqueContainer.innerHTML = ''; /* Vider l'historique */
        if (historique.length === 0) {
            historiqueContainer.textContent = 'Aucune vente enregistrée.'; /* Message vide */
            return;
        }
        historique.slice().reverse().forEach(vente => {
            const item = document.createElement('div'); /* Entrée historique */
            item.className = 'historique-item'; /* Classe CSS */
            item.innerHTML = `
                <strong>Vente n°${vente.numero}</strong><br>
                <span>${vente.date}</span><br>
                <span>${vente.items.length} produit(s) — ${formaterPrix(vente.total)}</span>
            `; /* Contenu de l'historique */
            historiqueContainer.appendChild(item); /* Ajouter l'entrée */
        });
    }

    function validerVente() {
        if (panier.length === 0) {
            window.alert('Le panier est vide.'); /* Aucun article */
            return;
        }
        const total = calculerTotaux(); /* Calculer total */
        const recu = Number(champMontantRecu.value) || 0; /* Montant reçu */
        if (recu < total) {
            window.alert('Le montant reçu est insuffisant.'); /* Paiement insuffisant */
            return;
        }
        for (const item of panier) {
            const produitStock = trouverProduit(item.code); /* Produit stock */
            if (!produitStock) {
                window.alert(`Produit introuvable : ${item.nom}`); /* Erreur produit */
                return;
            }
            if (item.quantite > produitStock.quantite) {
                window.alert(`Stock insuffisant pour ${item.nom}.`); /* Erreur stock */
                return;
            }
            produitStock.quantite -= item.quantite; /* Décrémenter le stock */
        }

        const vente = {
            numero: historique.length + 1, /* Numéro de vente */
            date: new Date().toLocaleString('fr-FR'), /* Date de la vente */
            items: panier.map(item => ({ ...item })), /* Articles vendus */
            total, /* Montant total */
            montantRecu: recu, /* Argent reçu */
            rendu: recu - total /* Monnaie à rendre */
        };
        historique.push(vente); /* Ajouter à l'historique */
        compte.produits = produits; /* Mettre à jour le stock */
        compte.historique = historique; /* Mettre à jour l'historique */
        saveCurrentAccount(compte); /* Sauvegarder le compte */

        afficherHistorique(); /* Rafraîchir l'historique */
        window.alert('Vente validée avec succès.'); /* Confirmer la vente */
        annulerVente(); /* Réinitialiser la caisse */
    }

    function imprimerFacture() {
        if (panier.length === 0) {
            window.alert('Le panier est vide.'); /* Aucun article */
            return;
        }
        const total = calculerTotaux(); /* Calculer le total */
        const recu = Number(champMontantRecu.value) || 0; /* Montant reçu */
        const renduValeur = Math.max(recu - total, 0); /* Calcul rendu */
        const facture = window.open('', '_blank'); /* Nouvelle fenêtre */
        if (!facture) return; /* Vérifier l'ouverture */
        facture.document.write(`
            <html><head><title>Facture</title><style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 10px; border: 1px solid #ccc; }
                th { background: #f7f9ff; }
            </style></head><body>
                <h1>Facture StockFlow</h1>
                <p>Date : ${new Date().toLocaleString('fr-FR')}</p>
                <table>
                    <thead><tr><th>Produit</th><th>Quantité</th><th>Prix</th><th>Total ligne</th></tr></thead>
                    <tbody>
                        ${panier.map(item => `
                            <tr>
                                <td>${item.nom}</td>
                                <td>${item.quantite}</td>
                                <td>${formaterPrix(item.prix)}</td>
                                <td>${formaterPrix(item.prix * item.quantite)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p><strong>Total :</strong> ${formaterPrix(total)}</p>
                <p><strong>Reçu :</strong> ${formaterPrix(recu)}</p>
                <p><strong>Rendu :</strong> ${formaterPrix(renduValeur)}</p>
            </body></html>
        `); /* Contenu facture */
        facture.document.close(); /* Fermer le document */
        facture.print(); /* Lancer l'impression */
    }

    function initialiserInterface() {
        initialiserCodes(); /* Assigner les codes manquants */
        afficherProduit(null); /* Réinitialiser affichage produit */
        afficherPanier(); /* Afficher panier initial */
        afficherHistorique(); /* Afficher historique */
    }

    rechercherBtn.addEventListener('click', () => {
        const produit = trouverProduit(champCode.value); /* Chercher produit */
        if (!produit) {
            window.alert('Produit introuvable.'); /* Alerte produit introuvable */
            afficherProduit(null); /* Réinitialiser affichage */
            return;
        }
        afficherProduit(produit); /* Afficher le produit trouvé */
    });
    ajouterPanierBtn.addEventListener('click', ajouterAuPanier); /* Ajouter au panier */
    annulerProduitBtn.addEventListener('click', annulerSelectionProduit); /* Annuler sélection de produit */
    validerBtn.addEventListener('click', validerVente); /* Valider la vente */
    annulerBtn.addEventListener('click', annulerVente); /* Annuler la vente */
    imprimerBtn.addEventListener('click', imprimerFacture); /* Imprimer la facture */
    champCode.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault(); /* Empêcher saut de ligne */
            rechercherBtn.click(); /* Rechercher sur Entrée */
        }
    });
    champMontantRecu.addEventListener('input', calculerTotaux); /* Recalculer montant rendu */

    initialiserInterface(); /* Initialiser l'écran caisse */
});
