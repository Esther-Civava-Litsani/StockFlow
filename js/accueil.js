document.getElementById('logout-link')?.addEventListener('click', function (e) {
    e.preventDefault();
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        window.location.href = '../Backend/deconnexion.php';
    }
});

function formatMontant(valeur) {
    return Number(valeur || 0).toFixed(2) + ' FC';
}

function chargerStats() {
    const produitsEl = document.getElementById('produits');
    const ventesEl = document.getElementById('ventes');
    const recetteEl = document.getElementById('recette');
    if (!produitsEl || !ventesEl || !recetteEl) return;

    fetch('../Backend/ventes.php?action=stats')
        .then(r => r.json())
        .then(data => {
            produitsEl.textContent = data.totalProduits || 0;
            ventesEl.textContent = data.ventesDuJour || 0;
            recetteEl.textContent = formatMontant(data.recetteDuJour);
        });
}

function chargerAlertes() {
    const ruptures = document.getElementById('ruptures');
    const expires = document.getElementById('expires');
    if (!ruptures || !expires) return;

    fetch('../Backend/ventes.php?action=alertes')
        .then(r => r.json())
        .then(data => {
            ruptures.innerHTML = '';
            expires.innerHTML = '';

            if (data.ruptures && data.ruptures.length) {
                data.ruptures.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${item.nomProduit}</td><td>${item.quantite}</td>`;
                    ruptures.appendChild(row);
                });
            } else {
                ruptures.innerHTML = '<tr><td colspan="2">Aucun produit en rupture</td></tr>';
            }

            if (data.expires && data.expires.length) {
                data.expires.forEach(item => {
                    const jours = Number(item.joursRestant || 0);
                    const label = jours < 0
                        ? `expiré depuis ${Math.abs(jours)} jour(s)`
                        : `expire dans ${jours} jour(s)`;
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${item.nomProduit}</td><td>${label}</td>`;
                    expires.appendChild(row);
                });
            } else {
                expires.innerHTML = '<tr><td colspan="2">Aucun produit proche de l\'expiration</td></tr>';
            }
        });
}

function chargerHistoriqueJournalier() {
    const tbody = document.getElementById('historiqueVentes');
    if (!tbody) return;

    fetch('../Backend/ventes.php?action=historique_journalier')
        .then(r => r.json())
        .then(data => {
            tbody.innerHTML = '';
            data.forEach(item => {
                const row = document.createElement('tr');
                const date = item.dateVente ? item.dateVente.split('-').reverse().join('/') : '';
                row.innerHTML = `<td>${date}</td><td>${formatMontant(item.montantTotal)}</td>`;
                tbody.appendChild(row);
            });
        });
}

chargerStats();
chargerAlertes();
chargerHistoriqueJournalier();
