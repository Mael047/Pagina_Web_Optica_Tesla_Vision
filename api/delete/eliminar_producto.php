<?php
header("Content-Type: application/json");
include_once("../conexion.php");

$data = json_decode(file_get_contents("php://input"), true);
$referencia = $data["referencia"] ?? "";

if (!$referencia) {
    echo json_encode([
        "mensaje" => "Referencia de producto no válida"
    ]);
    exit;
}

// 1) Buscar la imagen asociada para borrarla del disco
$sqlImg = "SELECT imagen FROM productos WHERE referencia = '$referencia'";
$resImg = $conn->query($sqlImg);

if ($resImg && $resImg->num_rows > 0) {
    $row = $resImg->fetch_assoc();
    $fileName = $row["imagen"];

    $filePath = __DIR__ . '/../../imagenes/' . $fileName;

    if (is_file($filePath)) {
        @unlink($filePath);
    }
}

// 2) Borrar el registro de la BD
$sql = "DELETE FROM productos WHERE referencia = '$referencia'";

if ($conn->query($sql) === TRUE) {
    echo json_encode([
        "mensaje" => "Producto eliminado correctamente"
    ]);
} else {
    echo json_encode([
        "mensaje" => "Error al eliminar: " . $conn->error
    ]);
}
