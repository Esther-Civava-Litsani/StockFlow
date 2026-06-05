<?php
session_start();
// Vérifier si l'utilisateur est connecté
if (isset($_SESSION['idBoutique'])) {
    header('Location: pages/accueil.php');
} else {
    header('Location: pages/connexion.php');
}
?>