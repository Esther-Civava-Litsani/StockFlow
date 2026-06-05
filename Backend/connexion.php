<?php
session_start();

// Informations de connexion MySQL
$hote = "localhost";
$base = "stockflow";
$utilisateur = "root";
$motDePasse = "";

try {
    $pdo = new PDO(
        "mysql:host=$hote;dbname=$base;charset=utf8mb4",
        $utilisateur,
        $motDePasse,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    die("Erreur de connexion à la base de données : " . $e->getMessage());
}

function verifierConnexion()
{
    if (empty($_SESSION['idBoutique'])) {
        header('Location: ../pages/connexion.php');
        exit;
    }
}
