<?php
require_once 'connexion.php';
header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$idBoutique = $_SESSION['idBoutique'] ?? 0;

if ($idBoutique <= 0) {
    echo json_encode(['succes' => false, 'message' => 'Non autorisé']);
    exit;
}

if ($action === 'liste') {
    $stmt = $pdo->prepare(
        'SELECT idProduit, codeProduit, nomProduit, prixAchat, prixVente, quantite, dateExpiration
         FROM produits
         WHERE idBoutique = ?
         ORDER BY idProduit DESC'
    );
    $stmt->execute([$idBoutique]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($action === 'rechercher') {
    $code = trim($_GET['code'] ?? '');
    if ($code === '') {
        echo json_encode(null);
        exit;
    }

    $stmt = $pdo->prepare(
        'SELECT * FROM produits WHERE idBoutique = ? AND codeProduit = ? LIMIT 1'
    );
    $stmt->execute([$idBoutique, $code]);
    echo json_encode($stmt->fetch() ?: null);
    exit;
}

if ($action === 'suggestions') {
    $q = trim($_GET['q'] ?? '');
    if ($q === '') {
        echo json_encode([]);
        exit;
    }

    $search = '%' . $q . '%';
    $stmt = $pdo->prepare(
        'SELECT idProduit, codeProduit, nomProduit, prixVente, quantite
         FROM produits
         WHERE idBoutique = ? AND (codeProduit LIKE ? OR nomProduit LIKE ?)
         ORDER BY codeProduit ASC
         LIMIT 10'
    );
    $stmt->execute([$idBoutique, $search, $search]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($action === 'ajouter') {
    $nom = trim($_POST['nomProduit'] ?? '');
    $prixAchat = floatval($_POST['prixAchat'] ?? 0);
    $prixVente = floatval($_POST['prixVente'] ?? 0);
    $quantite = intval($_POST['quantite'] ?? 0);
    $expiration = $_POST['expiration'] ?? null;

    if ($nom === '' || $prixAchat < 0 || $prixVente < 0 || $quantite < 0) {
        echo json_encode(['succes' => false, 'message' => 'Données de produit invalides.']);
        exit;
    }

    $prefixe = strtoupper(substr($nom, 0, 3));
    $prefixe = str_pad($prefixe, 3, 'X');

    // Numéro séquentiel par boutique (ordre d'ajout)
    $countStmt = $pdo->prepare('SELECT COUNT(*) FROM produits WHERE idBoutique = ?');
    $countStmt->execute([$idBoutique]);
    $numero = (int)$countStmt->fetchColumn() + 1;
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

if ($action === 'modifier') {
    $idProduit = intval($_POST['idProduit'] ?? 0);
    $nom = trim($_POST['nomProduit'] ?? '');
    $prixAchat = floatval($_POST['prixAchat'] ?? 0);
    $prixVente = floatval($_POST['prixVente'] ?? 0);
    $quantite = intval($_POST['quantite'] ?? 0);
    $expiration = $_POST['expiration'] ?? null;

    if ($idProduit <= 0 || $nom === '' || $prixAchat < 0 || $prixVente < 0 || $quantite < 0) {
        echo json_encode(['succes' => false, 'message' => 'Données de produit invalides.']);
        exit;
    }

    $stmt = $pdo->prepare(
        'UPDATE produits
         SET nomProduit = ?, prixAchat = ?, prixVente = ?, quantite = ?, dateExpiration = ?
         WHERE idProduit = ? AND idBoutique = ?'
    );
    $stmt->execute([$nom, $prixAchat, $prixVente, $quantite, $expiration ?: null, $idProduit, $idBoutique]);

    echo json_encode(['succes' => true]);
    exit;
}

if ($action === 'supprimer') {
    $idProduit = intval($_POST['idProduit'] ?? 0);
    if ($idProduit <= 0) {
        echo json_encode(['succes' => false, 'message' => 'Produit invalide']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM produits WHERE idProduit = ? AND idBoutique = ?');
    $stmt->execute([$idProduit, $idBoutique]);
    echo json_encode(['succes' => true]);
    exit;
}

echo json_encode(['succes' => false, 'message' => 'Action invalide']);
exit;
