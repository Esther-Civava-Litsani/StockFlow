<?php
require_once 'connexion.php';

$action = $_POST['action'] ?? '';

if ($action === 'inscription') {
    $nomBoutique = trim($_POST['nomBoutique'] ?? '');
    $emailBoutique = trim($_POST['emailBoutique'] ?? '');
    $motDePasse = $_POST['motDePasse'] ?? '';
    $confirmationMotDePasse = $_POST['confirmationMotDePasse'] ?? '';

    if (
        empty($nomBoutique) ||
        empty($emailBoutique) ||
        strlen($motDePasse) < 6 ||
        $motDePasse !== $confirmationMotDePasse
    ) {
        header('Location: ../pages/connexion.php?erreur=champs_invalides');
        exit;
    }

    try {
        $req = $pdo->prepare(
            'SELECT idBoutique FROM boutiques WHERE emailBoutique = ? AND nomBoutique = ? LIMIT 1'
        );
        $req->execute([$emailBoutique, $nomBoutique]);

        if ($req->fetch()) {
            header('Location: ../pages/connexion.php?erreur=existe_deja');
            exit;
        }

        $hash = password_hash($motDePasse, PASSWORD_DEFAULT);

        $insert = $pdo->prepare(
            'INSERT INTO boutiques (nomBoutique, emailBoutique, motDePasse) VALUES (?, ?, ?)'
        );
        $insert->execute([$nomBoutique, $emailBoutique, $hash]);

        $_SESSION['idBoutique'] = (int)$pdo->lastInsertId();
        $_SESSION['nomBoutique'] = $nomBoutique;
        $_SESSION['emailBoutique'] = $emailBoutique;

        header('Location: ../pages/accueil.php');
        exit;
    } catch (PDOException $e) {
        header('Location: ../pages/connexion.php?erreur=existe_deja');
        exit;
    }
}

if ($action === 'connexion') {
    $nomBoutique = trim($_POST['nomBoutique'] ?? '');
    $emailBoutique = trim($_POST['emailBoutique'] ?? '');
    $motDePasse = $_POST['motDePasse'] ?? '';

    $req = $pdo->prepare(
        'SELECT * FROM boutiques WHERE emailBoutique = ? AND nomBoutique = ? LIMIT 1'
    );
    $req->execute([$emailBoutique, $nomBoutique]);
    $boutique = $req->fetch();

    if (
        $boutique &&
        password_verify($motDePasse, $boutique['motDePasse'])
    ) {
        $_SESSION['idBoutique'] = (int)$boutique['idBoutique'];
        $_SESSION['nomBoutique'] = $boutique['nomBoutique'];
        $_SESSION['emailBoutique'] = $boutique['emailBoutique'];

        header('Location: ../pages/accueil.php');
        exit;
    }

    header('Location: ../pages/connexion.php?erreur=identifiants');
    exit;
}

if ($action === 'deconnexion') {
    session_destroy();
    header('Location: ../pages/connexion.php');
    exit;
}

if ($action === 'mot_de_passe_oublie') {
    $emailBoutique = trim($_POST['emailBoutique'] ?? '');

    $req = $pdo->prepare(
        'SELECT idBoutique FROM boutiques WHERE emailBoutique = ?'
    );
    $req->execute([$emailBoutique]);

    if ($req->fetch()) {
        header('Location: ../pages/connexion.php?info=email_envoye');
    } else {
        header('Location: ../pages/connexion.php?erreur=email_inconnu');
    }

    exit;
}

header('Location: ../pages/connexion.php');
exit;