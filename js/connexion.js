// Fonction principale pour changer d'onglet
function changerOnglet(tab) {
    // Tous les formulaires
    const connexionForm = document.getElementById("connexion-form");
    const creationForm = document.getElementById("creation-form");
    const recuperationForm = document.getElementById("recuperation-form");

    // Boutons
    const btnConnexion = document.querySelector(".bouton-connexion");
    const btnCreation = document.querySelector(".bouton-creation");

    // Cacher tout
    connexionForm.style.display = "none";
    creationForm.style.display = "none";
    recuperationForm.style.display = "none";

    // Retirer active
    btnConnexion.classList.remove("active");
    btnCreation.classList.remove("active");

    // Afficher selon le tab
    if (tab === "connexion") {
        connexionForm.style.display = "block";
        btnConnexion.classList.add("active");
    }

    if (tab === "creation") {
        creationForm.style.display = "block";
        btnCreation.classList.add("active");
    }

    if (tab === "recuperation") {
        recuperationForm.style.display = "block";
    }
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    changerOnglet("connexion"); // onglet par défaut
});