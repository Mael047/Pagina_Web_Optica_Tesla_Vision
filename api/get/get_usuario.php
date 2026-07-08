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

        $pedidos = [];
        if ($usuario) {
            $stmtPed = $conn->prepare("
                SELECT p.id, p.order_id, p.total, p.estado, p.datos_envio, p.created_at as fecha
                FROM pedidos p
                WHERE p.usuario_id = :uid
                ORDER BY p.created_at DESC
            ");
            $stmtPed->execute(['uid' => $usuario['id']]);
            $pedidos = $stmtPed->fetchAll();

            $stmtItems = $conn->prepare("
                SELECT producto_referencia as ref, nombre, cantidad, precio
                FROM pedido_items
                WHERE pedido_id = :pid
            ");

            foreach ($pedidos as &$ped) {
                $envio = json_decode($ped['datos_envio'], true);
                $ped['envio'] = is_string($envio) ? $envio : ($envio['metodo'] ?? '');
                unset($ped['datos_envio']);

                $stmtItems->execute(['pid' => $ped['id']]);
                $ped['items'] = $stmtItems->fetchAll();
            }
            unset($ped);

            $usuario['pedidos'] = $pedidos;
        }

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
