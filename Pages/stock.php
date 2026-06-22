<?php
require_once '../Backend/connexion.php';
verifierConnexion();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StockFlow - Stock</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="barre">
        <div class="logo">
            <img src="../Logo/logo.png" alt="Logo StockFlow">
            <span>StockFlow</span>
        </div>
        <a href="accueil.php" class="Menu"><i class="fas fa-home"></i> Accueil</a>
        <a href="caisse.php" class="Menu"><i class="fas fa-cash-register"></i> Caisse</a>
        <a href="stock.php" class="Menu active"><i class="fas fa-boxes"></i> Stock</a>
        <br><br>
        <a href="#" class="Menu" id="logout-link"><i class="fas fa-sign-out-alt"></i> Déconnexion</a>
    </div>
    <div class="principal">
        <small>Stock <i class="fas fa-boxes"></i></small>
        <div class="ajouter-produit">
            <h2>Ajouter un produit</h2>
            <div class="grilleFormulaire">
                <input type="text" id="nom" placeholder="Nom du produit">
                <input type="number" id="achat" placeholder="Prix achat">
                <input type="number" id="vente" placeholder="Prix vente">
                <input type="number" id="quantite" placeholder="Quantité">
                <input type="date" id="expiration">
            </div>
            <button id="ajouter-btn">Ajouter le produit</button>
            <p>Code produit généré automatiquement</p>
        </div>
        <div class="liste">
            <div class="recherche">
                <h2>Liste des produits</h2>
                <input type="text" id="recherche-produit" placeholder="Rechercher un produit...">
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Code produit</th>
                        <th>Produit</th>
                        <th>Prix achat</th>
                        <th>Prix vente</th>
                        <th>Bénéfice</th>
                        <th>Quantité</th>
                        <th>Expiration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="tableProduits"></tbody>
            </table>
        </div>
    </div>
    <script src="../js/stock.js"></script>
    <script src="../js/accueil.js"></script>
</body>
</html>