<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

$data = json_decode(file_get_contents("php://input"), true);

$nombre = trim($data["nombre"] ?? "");
$correo = trim($data["correo"] ?? "");
$password = $data["password"] ?? "";
$rol = $data["rol"] ?? "user";

if (empty($nombre) || empty($correo) || empty($password)) {
    echo json_encode(["mensaje" => "Todos los campos son requeridos."]);
    exit;
}

try {
    $conn = getConnection();
    
    $stmt = $conn->prepare("SELECT COUNT(*) FROM usuarios WHERE nombre = :nombre OR correo = :correo");
    $stmt->execute(['nombre' => $nombre, 'correo' => $correo]);
    $existe = (int)$stmt->fetchColumn();
    
    if ($existe > 0) {
        echo json_encode(["mensaje" => "Error: El usuario o correo ya existe."]);
        exit;
    }
    
    $hash = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, correo, password, rol) VALUES (:nombre, :correo, :password, :rol)");
    $stmt->execute([
        'nombre' => $nombre,
        'correo' => $correo,
        'password' => $hash,
        'rol' => $rol
    ]);
    
    echo json_encode(["mensaje" => "Usuario registrado con exito"]);
} catch (PDOException $e) {
    echo json_encode(["mensaje" => "Error al registrar el usuario"]);
}
?>
