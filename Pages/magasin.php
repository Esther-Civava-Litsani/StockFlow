<?php
require_once '../Backend/connexion.php';
verifierConnexion();
// On récupère les boutiques liées à l'utilisateur connecté (par email)
$email = $_SESSION['emailBoutique'] ?? '';

$req = $pdo->prepare("SELECT * FROM boutiques WHERE emailBoutique = ?");
$req->execute([$email]);
$boutiques = $req->fetchAll();
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
        <a href="caisse.html" class="Menu"><i class="fas fa-cash-register"></i> Caisse</a>
        <a href="stock.html" class="Menu"><i class="fas fa-boxes"></i> Stock</a>
        <a href="magasin.html" class="Menu active"><i class="fas fa-store"></i> Magasin</a>
        <br><br>
        <!-- Bouton de déconnexion -->
        <a href="deconnexion.html" class="Menu" onclick="confirmerDeconnexion(event)"><i class="fas fa-sign-out-alt"></i> Déconnexion</a>
    </div>
    <!-- Contenu principal de la page -->
    <div class="principal">
        <small>Magasin <i class="fas fa-store"></i></small>
        <div class="cartes">
            <!-- Si aucune boutique n'est trouvée -->
            <?php if (count($boutiques) === 0): ?>
            <p>Aucun autre magasin trouvé pour cet email.</p>
            <?php endif; ?>
            <!-- Boucle sur chaque boutique -->
            <?php foreach ($boutiques as $b): ?>
            <div class="carte-magasin">
                <!-- Nom du magasin -->
                <h3><i class="fas fa-store"></i> <?= htmlspecialchars($b['nomBoutique']) ?></h3>
                <!-- Email du magasin -->
                <p><i class="fas fa-envelope"></i> <?= htmlspecialchars($b['emailBoutique']) ?></p>
                <!-- Date de création -->
                <p><i class="fas fa-calendar"></i> Créé le <?= date('d/m/Y', strtotime($b['dateCreation'])) ?></p>
                <!-- Bouton pour entrer dans le magasin -->
                <button class="btn-entrer" onclick="window.location.href='set_session_boutique.php?id=<?= $b['idBoutique'] ?>'">
                    Entrer dans ce magasin
                </button>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</body>
</html> 