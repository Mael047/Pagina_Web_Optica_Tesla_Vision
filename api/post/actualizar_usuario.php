<?php
header("Content-Type: application/json");
include_once "../conexion.php";

$data = json_decode(file_get_contents("php://input"));
// Leer datos
$id = $data["id"] ?? "";
$nombre = $data["nombre"] ?? "";
$rol = $data["rol"] ?? "";
$correo = $data["correo"] ?? "";
$password = $data["password"] ?? "";
$hash = password_hash($password, PASSWORD_DEFAULT);
// Verificar si el usuario existe


$sql = "UPDATE usuario SET
    id = $id,
    nombre = '$nombre',
    rol = '$rol',
    correo = '$correo',
    password = '$hash'
    WHERE id = $id";

if($conn->query($sql) === TRUE) {
    echo json_encode([
        "mensaje" => "Usuario actualizado con exito",
    ]);
} else {
    echo json_encode([
        "mensaje" => "Error al actualizar el usuario " . $conn->error,
    ]);
}