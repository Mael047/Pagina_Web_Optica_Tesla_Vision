<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["mensaje" => "No se recibieron datos válidos"]);
    exit;
}

$id = isset($data["id"]) ? (int)$data["id"] : 0;
$nombre = trim($data["nombre"] ?? "");
$correo = trim($data["correo"] ?? "");
$telefono = trim($data["telefono"] ?? "");
$direccion = trim($data["direccion"] ?? "");
$password = $data["password"] ?? "";

if ($id <= 0) {
    echo json_encode(["mensaje" => "ID de usuario inválido"]);
    exit;
}

try {
    $conn = getConnection();
    
    if ($password !== "") {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("
            UPDATE usuarios SET 
                nombre = :nombre, 
                correo = :correo, 
                telefono = :telefono, 
                direccion = :direccion, 
                password = :password 
            WHERE id = :id
        ");
        $stmt->execute([
            'nombre' => $nombre,
            'correo' => $correo,
            'telefono' => $telefono,
            'direccion' => $direccion,
            'password' => $hash,
            'id' => $id
        ]);
    } else {
        $stmt = $conn->prepare("
            UPDATE usuarios SET 
                nombre = :nombre, 
                correo = :correo, 
                telefono = :telefono, 
                direccion = :direccion 
            WHERE id = :id
        ");
        $stmt->execute([
            'nombre' => $nombre,
            'correo' => $correo,
            'telefono' => $telefono,
            'direccion' => $direccion,
            'id' => $id
        ]);
    }
    
    echo json_encode(["mensaje" => "Usuario actualizado con exito"]);
} catch (PDOException $e) {
    echo json_encode(["mensaje" => "Error al actualizar el usuario"]);
}
?>
