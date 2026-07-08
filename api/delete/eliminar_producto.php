<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

$data = json_decode(file_get_contents("php://input"), true);
$referencia = $data["referencia"] ?? "";

if (!$referencia) {
    echo json_encode(["status" => "error", "mensaje" => "Referencia de producto no válida"]);
    exit;
}

try {
    $conn = getConnection();
    
    $stmt = $conn->prepare("SELECT imagen, imagen2, imagen3 FROM productos WHERE referencia = :ref");
    $stmt->execute(['ref' => $referencia]);
    $producto = $stmt->fetch();
    
    if ($producto) {
        foreach (['imagen', 'imagen2', 'imagen3'] as $imgField) {
            if (!empty($producto[$imgField])) {
                $filePath = __DIR__ . '/../../imagenes/' . $producto[$imgField];
                if (is_file($filePath)) {
                    @unlink($filePath);
                }
            }
        }
    }
    
    $stmt = $conn->prepare("DELETE FROM productos WHERE referencia = :ref");
    $stmt->execute(['ref' => $referencia]);
    
    echo json_encode(["status" => "success", "mensaje" => "Producto eliminado correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al eliminar el producto"]);
}
?>
