<?php
header("Content-Type: application/json");
include_once "../conexion.php";

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

// Asegurar columna pedidos
$col = $conn->query("SHOW COLUMNS FROM usuario LIKE 'pedidos'");
if ($col && $col->num_rows === 0) {
    $conn->query("ALTER TABLE usuario ADD pedidos LONGTEXT NULL");
}

// Buscar usuario
$usuario = null;
if ($userId > 0) {
    $res = $conn->query("SELECT id, pedidos FROM usuario WHERE id = $userId");
    if ($res && $res->num_rows > 0) {
        $usuario = $res->fetch_assoc();
    }
}
if (!$usuario && $correoCookie !== "") {
    $correoEsc = $conn->real_escape_string($correoCookie);
    $res = $conn->query("SELECT id, pedidos FROM usuario WHERE correo = '$correoEsc'");
    if ($res && $res->num_rows > 0) {
        $usuario = $res->fetch_assoc();
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

$nuevaOrden = [
    "order_id" => $orderId,
    "fecha" => date("Y-m-d H:i:s"),
    "total" => $total,
    "envio" => $envio,
    "contacto" => $contacto,
    "pago" => [
        "metodo" => $pago["metodo"] ?? "",
        "tarjeta" => $pago["tarjeta"] ?? "",
        "notas" => $pago["notas"] ?? "",
    ],
    "items" => $items,
    "estado" => "pagado"
];

$historial = [];
if (!empty($usuario["pedidos"])) {
    $dec = json_decode($usuario["pedidos"], true);
    if (is_array($dec)) {
        $historial = $dec;
    }
}

$historial[] = $nuevaOrden;
$jsonHistorial = $conn->real_escape_string(json_encode($historial));

if ($conn->query("UPDATE usuario SET pedidos = '$jsonHistorial' WHERE id = $userId") === TRUE) {
    echo json_encode(["status" => "success", "order_id" => $orderId]);
} else {
    echo json_encode([
        "status" => "error",
        "mensaje" => "No se pudo guardar la orden: " . $conn->error
    ]);
}
?>
