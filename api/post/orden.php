<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

$body = json_decode(file_get_contents("php://input"), true);
if (!$body) {
    echo json_encode(["status" => "error", "mensaje" => "Datos incompletos"]);
    exit;
}

$userId = isset($_COOKIE["id"]) ? (int)$_COOKIE["id"] : 0;
$correoCookie = $_COOKIE["user_correo"] ?? "";

if ($userId <= 0 && $correoCookie === "") {
    echo json_encode(["status" => "error", "mensaje" => "Debes iniciar sesión antes de pagar."]);
    exit;
}

try {
    $conn = getConnection();
    
    $usuario = null;
    if ($userId > 0) {
        $stmt = $conn->prepare("SELECT id FROM usuarios WHERE id = :id");
        $stmt->execute(['id' => $userId]);
        $usuario = $stmt->fetch();
    }
    
    if (!$usuario && $correoCookie !== "") {
        $stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = :correo");
        $stmt->execute(['correo' => $correoCookie]);
        $usuario = $stmt->fetch();
        if ($usuario) {
            $userId = (int)$usuario["id"];
        }
    }
    
    if (!$usuario) {
        echo json_encode(["status" => "error", "mensaje" => "Usuario no encontrado."]);
        exit;
    }
    
    $items = $body["items"] ?? [];
    $total = isset($body["total"]) ? (float)$body["total"] : 0;
    $envio = $body["envio"] ?? "";
    $contacto = $body["contacto"] ?? [];
    $pago = $body["pago"] ?? [];
    
    $orderId = "ORD-" . date("YmdHis") . "-" . rand(1000, 9999);
    
    $stmt = $conn->prepare("
        INSERT INTO pedidos (usuario_id, order_id, total, estado, datos_envio, datos_pago) 
        VALUES (:usuario_id, :order_id, :total, 'pagado', :datos_envio, :datos_pago)
        RETURNING id
    ");
    
    $stmt->execute([
        'usuario_id' => $userId,
        'order_id' => $orderId,
        'total' => $total,
        'datos_envio' => json_encode($envio),
        'datos_pago' => json_encode([
            'metodo' => $pago["metodo"] ?? '',
            'tarjeta' => $pago["tarjeta"] ?? '',
            'notas' => $pago["notas"] ?? ''
        ])
    ]);
    
    $pedidoId = $stmt->fetchColumn();
    
    $stmtItem = $conn->prepare("
        INSERT INTO pedido_items (pedido_id, producto_referencia, nombre, cantidad, precio) 
        VALUES (:pedido_id, :ref, :nombre, :cantidad, :precio)
    ");
    
    foreach ($items as $item) {
        $stmtItem->execute([
            'pedido_id' => $pedidoId,
            'ref' => $item['referencia'] ?? '',
            'nombre' => $item['nombre'] ?? '',
            'cantidad' => $item['cantidad'] ?? 1,
            'precio' => $item['precio'] ?? 0
        ]);
    }
    
    echo json_encode(["status" => "success", "order_id" => $orderId]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "No se pudo guardar la orden"]);
}
?>
