<?php
require_once 'connexion.php';
header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$idBoutique = $_SESSION['idBoutique'] ?? 0;

if ($action === 'historique') {
    if ($idBoutique <= 0) {
        echo json_encode([]);
        exit;
    }

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

            $insert = $pdo->prepare(
                'INSERT INTO ventes (idProduit, idBoutique, quantite, prixUnitaire, montantTotal)
                 VALUES (?, ?, ?, ?, ?)'
            );
            $insert->execute([$idProduit, $idBoutique, $quantite, $prix, $montantLigne]);

            $update = $pdo->prepare(
                'UPDATE produits
                 SET quantite = GREATEST(quantite - ?, 0)
                 WHERE idProduit = ?'
            );
            $update->execute([$quantite, $idProduit]);
        }

        $pdo->commit();

        echo json_encode([
            'succes' => true,
            'numeroVente' => date('YmdHis'),
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['succes' => false, 'message' => 'Erreur lors de la validation de la vente.']);
    }

    exit;
}

echo json_encode(['succes' => false, 'message' => 'Action invalide']);
exit;
