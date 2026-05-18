// Attendre que le DOM soit chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le nom de la boutique depuis le localStorage
    const nomBoutique = localStorage.getItem('boutique');
    // Si aucun nom de boutique n'est trouvé, rediriger vers la page de connexion
    if (!nomBoutique) {
        window.location.href = 'connexion.html';
        return;
    }

    // Afficher le nom de la boutique dans l'élément HTML
    document.getElementById('nomBoutique').textContent = nomBoutique;
});
