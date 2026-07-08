<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

try {
    $conn = getConnection();
    $stmt = $conn->query("SELECT id, nombre, comentario, imagen, created_at FROM testimonios ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    echo json_encode([]);
}
