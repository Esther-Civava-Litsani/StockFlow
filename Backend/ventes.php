<?php
require_once 'connexion.php';
header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$idBoutique = $_SESSION['idBoutique'] ?? 0;

if ($idBoutique <= 0) {
    echo json_encode([]);
    exit;
}

if ($action === 'historique') {
    $stmt = $pdo->prepare(
        'SELECT idVente AS numeroVente, dateVente, montantTotal
         FROM ventes
         WHERE idBoutique = ?
         ORDER BY dateVente DESC
         LIMIT 10'
    );
    $stmt->execute([$idBoutique]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($action === 'historique_journalier') {
    $stmt = $pdo->prepare(
        'SELECT DATE(dateVente) AS dateVente, SUM(montantTotal) AS montantTotal
         FROM ventes
         WHERE idBoutique = ?
         GROUP BY DATE(dateVente)
         ORDER BY DATE(dateVente) DESC'
    );
    $stmt->execute([$idBoutique]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($action === 'stats') {
    $stmtProduits = $pdo->prepare('SELECT COUNT(*) FROM produits WHERE idBoutique = ?');
    $stmtProduits->execute([$idBoutique]);

    $stmtVentes = $pdo->prepare(
        'SELECT COUNT(*) FROM ventes WHERE idBoutique = ? AND DATE(dateVente) = CURRENT_DATE'
    );
    $stmtVentes->execute([$idBoutique]);

    $stmtRecette = $pdo->prepare(
        'SELECT COALESCE(SUM(montantTotal), 0) FROM ventes WHERE idBoutique = ? AND DATE(dateVente) = CURRENT_DATE'
    );
    $stmtRecette->execute([$idBoutique]);

    echo json_encode([
        'totalProduits' => (int)$stmtProduits->fetchColumn(),
        'ventesDuJour' => (int)$stmtVentes->fetchColumn(),
        'recetteDuJour' => (float)$stmtRecette->fetchColumn()
    ]);
    exit;
}

if ($action === 'alertes') {
    $stmtRupture = $pdo->prepare(
        'SELECT idProduit, nomProduit, quantite FROM produits WHERE idBoutique = ? AND quantite <= 5 ORDER BY quantite ASC'
    );
    $stmtRupture->execute([$idBoutique]);
    $ruptures = $stmtRupture->fetchAll();

    $today = date('Y-m-d');
    $stmtExpires = $pdo->prepare(
        'SELECT idProduit, nomProduit, quantite, dateExpiration
         FROM produits
         WHERE idBoutique = ? AND dateExpiration IS NOT NULL
         ORDER BY dateExpiration ASC'
    );
    $stmtExpires->execute([$idBoutique]);
    $expires = [];
    foreach ($stmtExpires->fetchAll() as $row) {
        $date = new DateTime($row['dateExpiration']);
        $todayDate = new DateTime($today);
        $diff = (int)$todayDate->diff($date)->format('%r%a');
        // afficher si expiré ou dans les 5 prochains jours
        if ($diff <= 5) {
            $row['joursRestant'] = $diff;
            $expires[] = $row;
        }
    }

    echo json_encode([
        'ruptures' => $ruptures,
        'expires' => $expires
    ]);
    exit;
}

if ($action === 'valider') {
    $panier = json_decode($_POST['panier'] ?? '[]', true);
    $montantRecu = floatval($_POST['montantRecu'] ?? 0);

    if (!is_array($panier) || count($panier) === 0) {
        echo json_encode(['succes' => false, 'message' => 'Panier vide']);
        exit;
    }

    $total = 0.0;
    foreach ($panier as $item) {
        $total += (float)$item['prixUnitaire'] * (int)$item['quantite'];
    }

    if ($montantRecu < $total) {
        echo json_encode(['succes' => false, 'message' => 'Montant insuffisant']);
        exit;
    }

    try {
        $pdo->beginTransaction();

        foreach ($panier as $item) {
            $quantite = max(1, intval($item['quantite']));
            $idProduit = intval($item['idProduit']);
            $prix = floatval($item['prixUnitaire']);
            $montantLigne = $prix * $quantite;

            if ($idProduit <= 0) {
                throw new Exception('Produit invalide');
            }

            $check = $pdo->prepare('SELECT quantite FROM produits WHERE idProduit = ? AND idBoutique = ? LIMIT 1');
            $check->execute([$idProduit, $idBoutique]);
            $stock = $check->fetch();

            if (!$stock || (int)$stock['quantite'] < $quantite) {
                throw new Exception('Stock insuffisant pour un produit');
            }

            $insert = $pdo->prepare(
                'INSERT INTO ventes (idProduit, idBoutique, quantite, prixUnitaire, montantTotal)
                 VALUES (?, ?, ?, ?, ?)'
            );
            $insert->execute([$idProduit, $idBoutique, $quantite, $prix, $montantLigne]);

            $update = $pdo->prepare(
                'UPDATE produits
                 SET quantite = GREATEST(quantite - ?, 0)
                 WHERE idProduit = ? AND idBoutique = ?'
            );
            $update->execute([$quantite, $idProduit, $idBoutique]);
        }

        $pdo->commit();
        echo json_encode([
            'succes' => true,
            'numeroVente' => date('YmdHis')
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['succes' => false, 'message' => 'Erreur lors de la validation de la vente.']);
    }

    exit;
}

echo json_encode(['succes' => false, 'message' => 'Action invalide']);
exit;
