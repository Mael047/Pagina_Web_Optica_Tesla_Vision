<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

function guardarImagenGaleria($base64) {
    if (!$base64) return null;
    if (preg_match('/^data:image\/(\w+);base64,/', $base64, $type)) {
        $imageType = strtolower($type[1]);
        $base64 = substr($base64, strpos($base64, ',') + 1);
        $base64 = str_replace(' ', '+', $base64);
        $data = base64_decode($base64);
        if ($data === false) return null;
        $name = uniqid("gal_") . "." . $imageType;
        $path = __DIR__ . "/../../imagenes/" . $name;
        return file_put_contents($path, $data) ? $name : null;
    }
    return null;
}

$data = json_decode(file_get_contents("php://input"), true);
$imagenBase64 = $data["imagen"] ?? "";

if (!$imagenBase64) {
    echo json_encode(["status" => "error", "mensaje" => "No se recibió imagen"]);
    exit;
}

$imagen = guardarImagenGaleria($imagenBase64);
if (!$imagen) {
    echo json_encode(["status" => "error", "mensaje" => "Error al procesar imagen"]);
    exit;
}

try {
    $conn = getConnection();
    $stmt = $conn->prepare("INSERT INTO galeria (imagen) VALUES (:imagen)");
    $stmt->execute(['imagen' => $imagen]);
    echo json_encode(["status" => "success", "mensaje" => "Imagen agregada a la galería"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al guardar"]);
}
