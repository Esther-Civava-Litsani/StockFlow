<?php
require_once 'connexion.php';
header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? $_POST['action'] ?? '';

if ($action === 'rechercher') {
    $code = trim($_GET['code'] ?? '');
    if ($code === '') {
        echo json_encode(null);
        exit;
    }

    $req = $pdo->prepare('SELECT * FROM produits WHERE codeProduit = ? LIMIT 1');
    $req->execute([$code]);
    $produit = $req->fetch();
    echo json_encode($produit ?: null);
    exit;
}

if ($action === 'ajouter') {
    $nom = trim($_POST['nomProduit'] ?? '');
    $prixAchat = floatval($_POST['prixAchat'] ?? 0);
    $prixVente = floatval($_POST['prixVente'] ?? 0);
    $quantite = intval($_POST['quantite'] ?? 0);
    $expiration = $_POST['expiration'] ?? null;
    $idBoutique = $_SESSION['idBoutique'] ?? 0;

    if ($nom === '' || $prixAchat < 0 || $prixVente < 0 || $quantite < 0 || $idBoutique <= 0) {
        echo json_encode(['succes' => false, 'message' => 'Données de produit invalides.']);
        exit;
    }

    $prefixe = strtoupper(substr($nom, 0, 3));
    $prefixe = str_pad($prefixe, 3, 'X');

    $req = $pdo->prepare('SELECT COUNT(*) FROM produits WHERE idBoutique = ?');
    $req->execute([$idBoutique]);
    $numero = intval($req->fetchColumn()) + 1;
    $codeProduit = $prefixe . str_pad($numero, 4, '0', STR_PAD_LEFT);

    $insert = $pdo->prepare(
        'INSERT INTO produits (codeProduit, nomProduit, prixAchat, prixVente, quantite, dateExpiration, idBoutique)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    $insert->execute([
        $codeProduit,
        $nom,
        $prixAchat,
        $prixVente,
        $quantite,
        $expiration ?: null,
        $idBoutique,
    ]);

    echo json_encode(['succes' => true, 'codeProduit' => $codeProduit]);
    exit;
}

echo json_encode(['succes' => false, 'message' => 'Action invalide']);
exit;
