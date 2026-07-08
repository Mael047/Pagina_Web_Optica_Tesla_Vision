<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? "";

if (!$id) {
    echo json_encode(["status" => "error", "mensaje" => "ID no válido"]);
    exit;
}

try {
    $conn = getConnection();
    $stmt = $conn->prepare("SELECT imagen FROM galeria WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    if ($row && !empty($row['imagen'])) {
        $fp = __DIR__ . '/../../imagenes/' . $row['imagen'];
        if (is_file($fp)) @unlink($fp);
    }
    $stmt = $conn->prepare("DELETE FROM galeria WHERE id = :id");
    $stmt->execute(['id' => $id]);
    echo json_encode(["status" => "success", "mensaje" => "Imagen eliminada de la galería"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al eliminar"]);
}
