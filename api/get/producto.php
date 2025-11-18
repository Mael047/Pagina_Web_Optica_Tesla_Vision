<?php
header("Content-Type: application/json");
include_once("../conexion.php");

// Leer referencia desde GET: ?ref=... o ?referencia=...
$ref = isset($_GET['ref']) ? $_GET['ref'] : (isset($_GET['referencia']) ? $_GET['referencia'] : '');

if (!$ref) {
    echo json_encode(["error" => "Referencia no válida"]);
    exit;
}

// Escapar por seguridad básica
$refEscapada = $conn->real_escape_string($ref);

$sql = "SELECT 
            nombre,
            marca,
            material,
            valor,
            descuento,
            referencia,
            descripcion,
            imagen,
            imagen2,
            imagen3,
            categoria
        FROM productos
        WHERE referencia = '$refEscapada'
        LIMIT 1";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $producto = $result->fetch_assoc();
    echo json_encode($producto);
} else {
    echo json_encode(["error" => "Producto no encontrado"]);
}
