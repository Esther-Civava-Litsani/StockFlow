<?php
session_start();
// Suppression de toutes les variables de session
$_SESSION = [];

// Destruction de la session
session_destroy();

// Redirection vers la page de connexion
header('Location: ../pages/connexion.php');
exit;