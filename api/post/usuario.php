<?php
header("Content-Type: application/json");
include_once("../conexion.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? "";
$nombre = $data["nombre"] ?? "";
$rol = $data["rol"] ?? "";
$correo = $data["correo"] ?? "";
$password = $data["password"] ?? "";

$sqlCheck = "SELECT COUNT(*) FROM `usuario` WHERE `nombre` = '$nombre' OR `correo` = '$correo'";
$result = $conn->query($sqlCheck);
$row = $result->fetch_row();

$hash = password_hash($password, PASSWORD_DEFAULT);

if ($row[0] > 0) {
    echo json_encode([
        "mensaje" => "Error: El usuario o correo ya existe."
    ]);
} else {
    $sql = "INSERT INTO `usuario` (`nombre`, `correo`, `password`, `rol`) VALUES ('$nombre', '$correo', '$hash', '$rol');";

    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            "mensaje" => "Usuario registrado con exito",
        ]);
    } else {
        echo json_encode([
            "mensaje" => "Error al registrar el usuario " . $conn->error,
        ]);
    }
}