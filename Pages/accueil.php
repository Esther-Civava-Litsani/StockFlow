<?php
require_once '../Backend/connexion.php';
verifierConnexion();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StockFlow - Accueil</title>
    <link rel="stylesheet" href="../css/styles.css">
    <!-- Lien vers Font Awesome pour les icônes -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"> 
</head>
<body>
    <!-- Barre latérale de navigation -->
    <div class="barre"> 
        <!-- Logo -->
        <div class="logo">
            <img src="../Logo/logo.png" alt="Logo StockFlow">
            <span>StockFlow</span> 
        </div>
        <!-- Éléments du menu -->
        <a href="accueil.php" class="Menu active"><i class="fas fa-home"></i> Accueil</a>
        <a href="caisse.php" class="Menu"><i class="fas fa-cash-register"></i> Caisse</a>
        <a href="stock.php" class="Menu"><i class="fas fa-boxes"></i> Stock</a>
        <br><br>
        <!-- Bouton de déconnexion -->
        <a href="#" class="Menu" id="logout-link"><i class="fas fa-sign-out-alt"></i> Déconnexion</a>
    </div>
    <div class="principal">
        <small>Accueil <i class="fas fa-home"></i></small>
        <h1 id="nomBoutique">Bienvenue à <?= htmlspecialchars($_SESSION['nomBoutique']) ?></h1>
        <p>Voici un aperçu de votre boutique et de vos performances récentes.</p>
        <div class="Statistiques">
            <h2>Tableau de bord</h2>
            <div class="carte">
                <h2>PRODUITS</h2>
                <h3 id="produits">0</h3>
            </div>
            <div class="carte">
                <h2>VENTES AUJOURD'HUI</h2>
                <h3 id="ventes">0</h3>
            </div>
            <div class="carte">
                <h2>RECETTE DU JOUR</h2>
                <h3 id="recette">0</h3>
            </div>
        </div>
        <div class="Statistiques">
            <h2>Alertes</h2>
            <div class="carte">
                <h2><i class="fas fa-exclamation-triangle"></i> Produits en rupture</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Reste</th>
                        </tr>
                    </thead>
                    <tbody id="ruptures"></tbody>
                </table>
            </div>
            <div class="carte">
                <h2><i class="fas fa-exclamation-triangle"></i> Produits bientôt ou expirés</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Jours</th>
                        </tr>
                    </thead>
                    <tbody id="expires"></tbody>
                </table>
            </div>
        </div>
        <div class="Statistiques">
            <h2>Historique des ventes</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Montant total</th>
                    </tr>
                </thead>
                <tbody id="historiqueVentes"></tbody>
            </table>
        </div>
    </div>
    <script src="../js/accueil.js"></script>
</body>
</html>