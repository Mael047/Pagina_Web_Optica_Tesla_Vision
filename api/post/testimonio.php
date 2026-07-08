<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

function guardarImagenTestimonio($base64) {
    if (!$base64) return null;
    if (preg_match('/^data:image\/(\w+);base64,/', $base64, $type)) {
        $imageType = strtolower($type[1]);
        $base64 = substr($base64, strpos($base64, ',') + 1);
        $base64 = str_replace(' ', '+', $base64);
        $data = base64_decode($base64);
        if ($data === false) return null;
        $name = uniqid("test_") . "." . $imageType;
        $path = __DIR__ . "/../../imagenes/" . $name;
        return file_put_contents($path, $data) ? $name : null;
    }
    return null;
}

$data = json_decode(file_get_contents("php://input"), true);
$nombre = $data["nombre"] ?? "";
$comentario = $data["comentario"] ?? "";
$imagenBase64 = $data["imagen"] ?? "";
$id = $data["id"] ?? "";

$imagen = guardarImagenTestimonio($imagenBase64);

try {
    $conn = getConnection();

    if ($id) {
        $sql = "UPDATE testimonios SET nombre = :nombre, comentario = :comentario";
        $params = ['nombre' => $nombre, 'comentario' => $comentario, 'id' => $id];
        if ($imagen) {
            $sql .= ", imagen = :imagen";
            $params['imagen'] = $imagen;
        }
        $sql .= " WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["status" => "success", "mensaje" => "Testimonio actualizado"]);
    } else {
        $stmt = $conn->prepare("INSERT INTO testimonios (nombre, comentario, imagen) VALUES (:nombre, :comentario, :imagen)");
        $stmt->execute(['nombre' => $nombre, 'comentario' => $comentario, 'imagen' => $imagen]);
        echo json_encode(["status" => "success", "mensaje" => "Testimonio agregado"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al guardar testimonio"]);
}
