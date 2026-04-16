<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

try {
    $conn = getConnection();
    $stmt = $conn->query("SELECT * FROM productos ORDER BY id DESC");
    $productos = $stmt->fetchAll();
    echo json_encode($productos);
} catch (PDOException $e) {
    echo json_encode(["error" => "Error al obtener productos"]);
}
?>
