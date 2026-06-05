<?php
require_once '../Backend/connexion.php';
verifierConnexion();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StockFlow - Caisse</title>
    <link rel="stylesheet" href="../css/caisse.css">
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
        <a href="accueil.html" class="Menu "><i class="fas fa-home"></i> Accueil</a>
        <a href="caisse.html" class="Menu active"><i class="fas fa-cash-register"></i> Caisse</a>
        <a href="stock.html" class="Menu"><i class="fas fa-boxes"></i> Stock</a>
        <a href="magasin.html" class="Menu"><i class="fas fa-store"></i> Magasin</a>
        <br><br>
        <!-- Bouton de déconnexion -->
        <a href="deconnexion.html" class="Menu" onclick="confirmerDeconnexion(event)"><i class="fas fa-sign-out-alt"></i> Déconnexion</a>
    </div>
    <!-- Contenu principal de la page -->
    <div class="principal">
        <small>Caisse <i class="fas fa-cash-register"></i></small>
        <div class="cartes">
            <!-- Partie gauche -->
            <div class="gauche">
                <!-- Zone Code produit -->
                <div class="codes">
                    <h2>Code produit</h2>
                    <div class="code">
                        <input type="text" id="code" placeholder="Entrer le code du produit">
                        <button id="rechercher-btn">Rechercher</button>
                    </div>
                </div>
                <!-- Panier -->
                <div class="panier">
                    <h2>Panier</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Qté</th> 
                                <th>P.U</th> 
                                <th>P.T</th>
                                <th>Action</th>
                            </tr> 
                        </thead> 
                        <tbody id="panier-body"></tbody>
                    </table>
            </div>
        </div>
        <!-- Partie droite -->
        <div class="droite">
            <!-- Résumé paiement -->
            <div class="carte">
                <h2>Résumé paiement</h2>
                <div class="resume"><span>Nombre produits</span><span id="resume-count">0</span></div>
                <div class="resume"><span>Montant total</span><span id="resume-total">0</span></div>
                <div class="resume"><span>Argent reçu</span><input type="number" id="montant-recu" value="0" min="0"></div>
                <div class="resume"><span>Monnaie à rendre</span><span id="rendu">0</span></div>
                <div class="message" id="message-paiement">&nbsp;</div>
                <!-- Boutons -->
                <div class="actions">
                    <button id="valider-btn">Valider</button>
                    <button id="annuler-btn" class="secondaire">Annuler</button>
                </div>
            </div>
            <!-- Historique -->
            <div class="historique">
                <h2>Historique</h2>
                <table>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Heure</th>
                            <th>Montant</th>
                        </tr>
                    </thead>
                    <tbody id="historique-body"></tbody>
                </table>
            </div> 
        </div>
    </div>
    <script src="../js/common.js"></script>
    <script src="../js/caisse.js"></script>
</body>
</html>