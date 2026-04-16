<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

$data = json_decode(file_get_contents("php://input"));
$correo = trim($data->correo ?? '');
$password = $data->password ?? '';

if (empty($correo) || empty($password)) {
    echo json_encode(["status" => "error", "mensaje" => "Correo y contraseña son requeridos."]);
    exit;
}

try {
    $conn = getConnection();
    
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE correo = :correo");
    $stmt->execute(['correo' => $correo]);
    $usuario = $stmt->fetch();
    
    if (!$usuario) {
        echo json_encode(["status" => "error", "mensaje" => "Usuario no encontrado."]);
        exit;
    }
    
    if (password_verify($password, $usuario["password"])) {
        echo json_encode([
            "status" => "success",
            "mensaje" => "Login correcto",
            "rol" => $usuario['rol'],
            "nombre" => $usuario['nombre'],
            "correo" => $usuario['correo'],
            "id" => $usuario['id']
        ]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Contraseña incorrecta."]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error del servidor."]);
}
?>
