function changerOnglet(tab) {
    const connexionForm = document.getElementById("connexion-form");
    const creationForm = document.getElementById("creation-form");
    const recuperationForm = document.getElementById("recuperation-form");
    const btnConnexion = document.querySelector(".bouton-connexion");
    const btnCreation = document.querySelector(".bouton-creation");

    connexionForm.style.display = "none";
    creationForm.style.display = "none";
    recuperationForm.style.display = "none";

    btnConnexion.classList.remove("active");
    btnCreation.classList.remove("active");

    if (tab === "connexion") {
        connexionForm.style.display = "block";
        btnConnexion.classList.add("active");
    } else if (tab === "creation") {
        creationForm.style.display = "block";
        btnCreation.classList.add("active");
    } else if (tab === "recuperation") {
        recuperationForm.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    changerOnglet("connexion");

    const creationForm = document.getElementById("creation-form");
    if (creationForm) {
        creationForm.addEventListener("submit", (e) => {
            const pwd = creationForm.elements.namedItem("motDePasse")?.value || "";
            const confirm = creationForm.elements.namedItem("confirmationMotDePasse")?.value || "";
            if (pwd !== confirm) {
                e.preventDefault();
                alert("Les mots de passe ne correspondent pas.");
            }
        });
    }
});