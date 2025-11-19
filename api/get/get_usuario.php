<?php
header("Content-Type: application/json");
include_once("../conexion.php");

$correo = $_GET['correo'] ?? null;

if ($correo) {
    $correo = $conn->real_escape_string($correo);
    $sql = "SELECT * FROM usuario WHERE correo = '$correo'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $usuario = $result->fetch_assoc();
        echo json_encode($usuario);
    } else {
        echo json_encode(null);
    }
} else {
    $sql = "SELECT * FROM usuario";
    $result = $conn->query($sql);

    $usuarios = [];
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }

    echo json_encode($usuarios);
}
?>