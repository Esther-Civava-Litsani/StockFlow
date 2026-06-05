<?php
require_once 'connexion.php';

$action = $_POST['action'] ?? '';
// INSCRIPTION
if ($action === 'inscription') {

    $nomBoutique = trim($_POST['nomBoutique'] ?? '');
    $emailBoutique = trim($_POST['emailBoutique'] ?? '');
    $motDePasse = $_POST['motDePasse'] ?? '';

    if (
        empty($nomBoutique) ||
        empty($emailBoutique) ||
        strlen($motDePasse) < 6
    ) {
        header('Location: ../pages/connexion.php?erreur=champs_invalides');
        exit;
    }

    try {

        $hash = password_hash(
            $motDePasse,
            PASSWORD_DEFAULT
        );

        $req = $pdo->prepare(
            "INSERT INTO boutiques
            (nomBoutique, emailBoutique, motDePasse)
            VALUES (?, ?, ?)"
        );

        $req->execute([
            $nomBoutique,
            $emailBoutique,
            $hash
        ]);

        $_SESSION['idBoutique'] = (int)$pdo->lastInsertId();
        $_SESSION['nomBoutique'] = $nomBoutique;

        header('Location: ../pages/dashboard.php');
        exit;

    } catch (PDOException $e) {

        header('Location: ../pages/connexion.php?erreur=existe_deja');
        exit;
    }
}
// CONNEXION
if ($action === 'connexion') {

    $nomBoutique = trim($_POST['nomBoutique'] ?? '');
    $motDePasse = $_POST['motDePasse'] ?? '';

    $req = $pdo->prepare(
        "SELECT * FROM boutiques
         WHERE nomBoutique = ?"
    );

    $req->execute([$nomBoutique]);

    $boutique = $req->fetch();

    if (
        $boutique &&
        password_verify(
            $motDePasse,
            $boutique['motDePasse']
        )
    ) {

        $_SESSION['idBoutique'] =
            (int)$boutique['idBoutique'];

        $_SESSION['nomBoutique'] =
            $boutique['nomBoutique'];

        header('Location: ../pages/dashboard.php');
        exit;
    }

    header('Location: ../pages/connexion.php?erreur=identifiants');
    exit;
}
// DECONNEXION
if ($action === 'deconnexion') {

    session_destroy();

    header('Location: ../pages/connexion.php');
    exit;
}
// MOT DE PASSE OUBLIE
if ($action === 'mot_de_passe_oublie') {

    $emailBoutique = trim(
        $_POST['emailBoutique'] ?? ''
    );

    $req = $pdo->prepare(
        "SELECT idBoutique
         FROM boutiques
         WHERE emailBoutique = ?"
    );

    $req->execute([$emailBoutique]);

    if ($req->fetch()) {

        header(
            'Location: ../pages/connexion.php?info=email_envoye'
        );

    } else {

        header(
            'Location: ../pages/connexion.php?erreur=email_inconnu'
        );
    }

    exit;
}
// ACTION INCONNUE
header('Location: ../pages/connexion.php');
exit;