-- Creation de la base de donnees StockFlow
CREATE DATABASE IF NOT EXISTS stockflow
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE stockflow;

-- Table des boutiques
CREATE TABLE IF NOT EXISTS boutiques (
    idBoutique INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nomBoutique VARCHAR(100) NOT NULL,
    emailBoutique VARCHAR(150) NOT NULL,
    motDePasse VARCHAR(255) NOT NULL,
    dateCreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_boutique_email (emailBoutique, nomBoutique)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table des produits
CREATE TABLE IF NOT EXISTS produits (
    idProduit INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    codeProduit VARCHAR(20) NOT NULL UNIQUE,
    nomProduit VARCHAR(150) NOT NULL,
    prixAchat DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    prixVente DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    quantite INT UNSIGNED NOT NULL DEFAULT 0,
    dateExpiration DATE NULL,
    idBoutique INT UNSIGNED NOT NULL,
    dateCreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idBoutique) REFERENCES boutiques(idBoutique) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table des ventes
CREATE TABLE IF NOT EXISTS ventes (
    idVente INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    idProduit INT UNSIGNED NOT NULL,
    idBoutique INT UNSIGNED NOT NULL,
    quantite INT UNSIGNED NOT NULL,
    prixUnitaire DECIMAL(10,2) NOT NULL,
    montantTotal DECIMAL(12,2) NOT NULL,
    dateVente DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idProduit) REFERENCES produits(idProduit) ON DELETE CASCADE,
    FOREIGN KEY (idBoutique) REFERENCES boutiques(idBoutique) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exemple de boutique de test
INSERT IGNORE INTO boutiques (nomBoutique, emailBoutique, motDePasse)
VALUES ('Etoile', 'esthercivava05@gmail.com', '123456');
