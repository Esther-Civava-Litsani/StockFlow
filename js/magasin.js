document.addEventListener('DOMContentLoaded', () => {
    if (!redirectToConnexionIfNeeded()) return;

    const compte = getCurrentAccount();
    document.getElementById('nomBoutique').textContent = compte.nomBoutique;

    const nomMagasinElement = document.getElementById('nomMagasin');
    if (nomMagasinElement) {
        nomMagasinElement.textContent = compte.nomBoutique;
    }

    const emailElement = document.getElementById('emailBoutique');
    if (emailElement) {
        emailElement.textContent = compte.email;
    }

    const resumeElement = document.getElementById('magasinResume');
    if (resumeElement) {
        const produits = compte.produits || [];
        const historique = compte.historique || [];
        resumeElement.textContent = `${produits.length} produit(s) en stock · ${historique.length} vente(s) enregistrée(s)`;
    }
});
