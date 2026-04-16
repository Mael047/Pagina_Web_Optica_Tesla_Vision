<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

$correo = $_GET['correo'] ?? null;

try {
    $conn = getConnection();
    
    if ($correo) {
        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE correo = :correo");
        $stmt->execute(['correo' => $correo]);
        $usuario = $stmt->fetch();
        echo json_encode($usuario ?: null);
    } else {
        $stmt = $conn->query("SELECT id, nombre, correo, rol, telefono, direccion, created_at FROM usuarios ORDER BY id");
        $usuarios = $stmt->fetchAll();
        echo json_encode($usuarios);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Error del servidor"]);
}
?>
