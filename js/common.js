function getCurrentBoutiqueName() {
    return localStorage.getItem('boutique');
}

function getCurrentAccount() {
    const nomBoutique = getCurrentBoutiqueName();
    if (!nomBoutique) return null;
    const compteJson = localStorage.getItem(`stockflow_account_${nomBoutique}`);
    return compteJson ? JSON.parse(compteJson) : null;
}

function saveCurrentAccount(compte) {
    if (!compte || !compte.nomBoutique) return;
    localStorage.setItem(`stockflow_account_${compte.nomBoutique}`, JSON.stringify(compte));
}

function redirectToConnexionIfNeeded() {
    const compte = getCurrentAccount();
    if (!compte) {
        window.location.href = 'connexion.html';
        return false;
    }
    return true;
}

function confirmerDeconnexion(event) {
    if (event) event.preventDefault();
    const confirmation = window.confirm('Voulez-vous vraiment vous déconnecter ?');
    if (!confirmation) return;
    localStorage.removeItem('boutique');
    window.location.href = 'connexion.html';
}
