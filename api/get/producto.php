<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

$ref = $_GET['ref'] ?? $_GET['referencia'] ?? '';

if (empty($ref)) {
    echo json_encode(["error" => "Referencia no válida"]);
    exit;
}

try {
    $conn = getConnection();
    $stmt = $conn->prepare("
        SELECT nombre, marca, material, ancho, puente, brazo, valor, descuento, 
               referencia, descripcion, imagen, imagen2, imagen3, categoria
        FROM productos 
        WHERE referencia = :ref
        LIMIT 1
    ");
    $stmt->execute(['ref' => $ref]);
    $producto = $stmt->fetch();
    
    if ($producto) {
        echo json_encode($producto);
    } else {
        echo json_encode(["error" => "Producto no encontrado"]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Error del servidor"]);
}
?>
