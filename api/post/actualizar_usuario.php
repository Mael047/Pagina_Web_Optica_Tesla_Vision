<?php
header("Content-Type: application/json");
include_once "../conexion.php";

// Decodificar JSON como ARRAY asociativo
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "mensaje" => "No se recibieron datos válidos"
    ]);
    exit;
}

// Leer datos
$id        = isset($data["id"]) ? (int)$data["id"] : 0;
$nombre    = $conn->real_escape_string($data["nombre"] ?? "");
$correo    = $conn->real_escape_string($data["correo"] ?? "");
$telefono  = $conn->real_escape_string($data["telefono"] ?? "");
$direccion = $conn->real_escape_string($data["direccion"] ?? "");
$password  = $data["password"] ?? "";

// Validación básica
if ($id <= 0) {
    echo json_encode([
        "mensaje" => "ID de usuario inválido"
    ]);
    exit;
}

// Armar SQL: si la contraseña viene vacía, NO la tocamos
if ($password !== "") {
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $sql = "
        UPDATE usuario SET
            nombre    = '$nombre',
            correo    = '$correo',
            telefono  = '$telefono',
            direccion = '$direccion',
            password  = '$hash'
        WHERE id = $id
    ";
} else {
    $sql = "
        UPDATE usuario SET
            nombre    = '$nombre',
            correo    = '$correo',
            telefono  = '$telefono',
            direccion = '$direccion'
        WHERE id = $id
    ";
}

if ($conn->query($sql) === TRUE) {
    echo json_encode([
        "mensaje" => "Usuario actualizado con éxito"
    ]);
} else {
    echo json_encode([
        "mensaje" => "Error al actualizar el usuario: " . $conn->error
    ]);
}
