<?php

include_once "../conexion.php";

$data = json_decode(file_get_contents("php://input"));
$correo = $data->correo;
$password = $data->password;

$query = "SELECT * FROM usuario WHERE correo = '$correo' ";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    if ($data && password_verify($password, $data["password"])) {
        echo json_encode([
            "status" => "success",
            "mensaje" => "Login correcto",
            "rol" => $data['rol'], 
            "nombre" => $data['nombre'],
            "correo" => $data['correo'],
            "id" => $data['id']
        ]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Contraseña incorrecta."]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "Usuario no encontrado."]);
}

?>