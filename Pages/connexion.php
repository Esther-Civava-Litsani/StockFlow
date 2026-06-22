<?php
session_start();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StockFlow - Connexion</title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body class="connexion">
    <div class="carte-connexion">
        <div class="logo">
            <img src="../Logo/logo.png" alt="logo StockFlow">
            <h1>StockFlow</h1>
        </div>
        <p>Gérez votre boutique, votre stock et votre caisse en toute simplicité.</p>
        <?php if (isset($_GET['erreur'])): ?>
        <div class="message-erreur">
            <?php
            $erreurs = [
                'identifiants' => 'Email, nom de boutique ou mot de passe incorrect.',
                'champs_invalides' => 'Veuillez remplir tous les champs correctement.',
                'existe_deja' => 'Cette combinaison email + boutique existe déjà.',
                'email_inconnu' => 'Email incorrect.'
            ];
            echo htmlspecialchars($erreurs[$_GET['erreur']] ?? 'Erreur.');
            ?>
        </div>
        <?php endif; ?>
        <div class="emplacement">
            <button type="button" class="bouton-connexion" onclick="changerOnglet('connexion')">Connexion</button>
            <button type="button" class="bouton-creation active" onclick="changerOnglet('creation')">Créer ma boutique</button>
        </div>
        <!--pour la connexion-->
        <form id="connexion-form" method="POST" action="../Backend/auth.php">
            <input type="hidden" name="action" value="connexion">
            <input type="email" name="emailBoutique" placeholder="Email" required>
            <input type="text" name="nomBoutique" placeholder="Nom de la boutique" required>
            <input type="password" name="motDePasse" placeholder="Mot de passe" required>
            <button type="submit">Se connecter</button>
            <a href="#" class="forgot-password-link" onclick="changerOnglet('recuperation'); return false;">Mot de passe oublié ?</a>
        </form>
        <!--pour la récupération du mot de passe-->
        <form id="recuperation-form" method="POST" action="../Backend/auth.php">
            <input type="hidden" name="action" value="mot_de_passe_oublie">
            <input type="email" name="emailBoutique" placeholder="Email" required>
            <button type="submit">Récupérer mon mot de passe</button>
            <a href="#" class="back-link" onclick="changerOnglet('connexion'); return false;">Retour à la connexion</a>
        </form>
        <!--pour la création de la boutique-->
        <form id="creation-form" method="POST" action="../Backend/auth.php">
            <input type="hidden" name="action" value="inscription">
            <input type="text" name="nomBoutique" placeholder="Nom de la boutique" required>
            <input type="email" name="emailBoutique" placeholder="Email" required>
            <input type="password" name="motDePasse" placeholder="Mot de passe" minlength="6" required>
            <input type="password" name="confirmationMotDePasse" id="confirmationMotDePasse" placeholder="Confirmer le mot de passe" required>
            <small>6 caractères minimum</small>
            <button type="submit">Créer ma boutique</button>
        </form>
    </div>
    <script src="../js/connexion.js"></script>
</body>
</html>