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
    <link rel="stylesheet" href="../css/accueil.css">

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
        <a href="accueil.html" class="Menu active"><i class="fas fa-home"></i> Accueil</a>
        <a href="caisse.html" class="Menu"><i class="fas fa-cash-register"></i> Caisse</a>
        <a href="stock.html" class="Menu"><i class="fas fa-boxes"></i> Stock</a>
        <a href="magasin.html" class="Menu"><i class="fas fa-store"></i> Magasin</a>
        <br><br>
        <!-- Bouton de déconnexion -->
        <a href="deconnexion.html" class="deconnexion" onclick="confirmerDeconnexion(event)"><i class="fas fa-sign-out-alt"></i> Déconnexion</a>
    </div>

    <!-- Contenu principal de la page -->
    <div class="principal">
        <!-- En-tête de la page -->
        <div class="entete">
            <small>Bonjour <i class="fas fa-hand-paper"></i></small>
            <h1 id="nomBoutique">Nom de la boutique</h1>
        </div>
        <br><br>
        <!-- Statistiques -->
        <div class="Statistiques">
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
        <!-- Informations -->
        <div class="Informations">
            <!-- Ruptures de stock -->
            <div class="carte">
                <h2><i class="fas fa-exclamation-triangle"></i> Ruptures de stock</h2>
                <div id="ruptures"></div>
            </div>
            <!-- Produits bientôt expirés -->
            <div class="carte">
                <h2><i class="fas fa-clock"></i> Bientôt expirés</h2>
                <div id="expires"></div>
            </div>
        </div>
    </div> 
</div>
<script src="../js/accueil.js"></script>
</body>
</html>