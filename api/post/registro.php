<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

$data = json_decode(file_get_contents("php://input"), true);

$producto = $data["producto"] ?? "";
$material = $data["material"] ?? "";
$valor = isset($data["valor"]) && $data["valor"] !== "" ? (float)$data["valor"] : 0;
$descuento = isset($data["descuento"]) && $data["descuento"] !== "" ? (float)$data["descuento"] : 0;
$marca = $data["marca"] ?? "";
$referencia = $data["referencia"] ?? "";
$descripcion = $data["descripcion"] ?? "";
$imagenBase64 = $data["imagen"] ?? "";
$imagenBase64_2 = $data["imagen2"] ?? "";
$imagenBase64_3 = $data["imagen3"] ?? "";
$categoria = $data["categoria"] ?? "";
$ancho = $data["ancho"] ?? "";
$puente = $data["puente"] ?? "";
$brazo = $data["brazo"] ?? "";

$imagen = guardarImagen($imagenBase64);
$imagen2 = guardarImagen($imagenBase64_2);
$imagen3 = guardarImagen($imagenBase64_3);

try {
    $conn = getConnection();
    
    $stmt = $conn->prepare("SELECT COUNT(*) FROM productos WHERE referencia = :ref");
    $stmt->execute(['ref' => $referencia]);
    $existe = (int)$stmt->fetchColumn();
    
    if ($existe > 0) {
        echo json_encode(["status" => "error", "mensaje" => "Error: El producto con la referencia $referencia ya existe."]);
        exit;
    }
    
    $stmt = $conn->prepare("
        INSERT INTO productos (nombre, material, ancho, puente, brazo, valor, descuento, referencia, descripcion, imagen, imagen2, imagen3, categoria, marca) 
        VALUES (:nombre, :material, :ancho, :puente, :brazo, :valor, :descuento, :referencia, :descripcion, :imagen, :imagen2, :imagen3, :categoria, :marca)
    ");
    
    $stmt->execute([
        'nombre' => $producto,
        'material' => $material,
        'ancho' => $ancho,
        'puente' => $puente,
        'brazo' => $brazo,
        'valor' => $valor,
        'descuento' => $descuento,
        'referencia' => $referencia,
        'descripcion' => $descripcion,
        'imagen' => $imagen,
        'imagen2' => $imagen2,
        'imagen3' => $imagen3,
        'categoria' => $categoria,
        'marca' => $marca
    ]);
    
    echo json_encode(["status" => "success", "mensaje" => "Producto agregado con exito"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al registrar el producto"]);
}

function guardarImagen($imagenBase64) {
    if (!$imagenBase64) return null;
    
    if (preg_match('/^data:image\/(\w+);base64,/', $imagenBase64, $type)) {
        $imageType = strtolower($type[1]);
        $imagenBase64 = substr($imagenBase64, strpos($imagenBase64, ',') + 1);
        $imagenBase64 = str_replace(' ', '+', $imagenBase64);
        $imageData = base64_decode($imagenBase64);
        
        if ($imageData === false) return null;
        
        $fileName = uniqid("img_") . "." . $imageType;
        $filePath = __DIR__ . "/../../imagenes/" . $fileName;
        
        if (file_put_contents($filePath, $imageData)) {
            return $fileName;
        }
    }
    return null;
}
?>
