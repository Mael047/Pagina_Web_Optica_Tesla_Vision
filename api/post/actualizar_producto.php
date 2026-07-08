<?php
header("Content-Type: application/json");
include_once "../conexion_pg.php";

$data = json_decode(file_get_contents("php://input"), true);

$producto = $data["producto"] ?? "";
$material = $data["material"] ?? "";
$marca = $data["marca"] ?? "";
$valor = isset($data["valor"]) && $data["valor"] !== "" ? (float)$data["valor"] : 0;
$descuento = isset($data["descuento"]) && $data["descuento"] !== "" ? (float)$data["descuento"] : 0;
$referencia = $data["referencia"] ?? "";
$descripcion = $data["descripcion"] ?? "";
$categoria = $data["categoria"] ?? "";
$ancho = $data["ancho"] ?? "";
$puente = $data["puente"] ?? "";
$brazo = $data["brazo"] ?? "";
$imagenBase64_1 = $data["imagen"] ?? "";
$imagenBase64_2 = $data["imagen2"] ?? "";
$imagenBase64_3 = $data["imagen3"] ?? "";
$refOriginal = $data["referencia_original"] ?? "";

if (!$refOriginal) {
    echo json_encode(["status" => "error", "mensaje" => "No se recibió la referencia original del producto."]);
    exit;
}

$imagen = guardarImagen($imagenBase64_1);
$imagen2 = guardarImagen($imagenBase64_2);
$imagen3 = guardarImagen($imagenBase64_3);

try {
    $conn = getConnection();
    
    $sql = "UPDATE productos SET 
            nombre = :nombre, 
            material = :material, 
            ancho = :ancho,
            puente = :puente,
            brazo = :brazo,
            valor = :valor, 
            descuento = :descuento, 
            referencia = :referencia, 
            descripcion = :descripcion, 
            categoria = :categoria, 
            marca = :marca";
    
    $params = [
        'nombre' => $producto,
        'material' => $material,
        'ancho' => $ancho,
        'puente' => $puente,
        'brazo' => $brazo,
        'valor' => $valor,
        'descuento' => $descuento,
        'referencia' => $referencia,
        'descripcion' => $descripcion,
        'categoria' => $categoria,
        'marca' => $marca,
        'refOriginal' => $refOriginal
    ];
    
    if ($imagen) {
        $sql .= ", imagen = :imagen";
        $params['imagen'] = $imagen;
    }
    if ($imagen2) {
        $sql .= ", imagen2 = :imagen2";
        $params['imagen2'] = $imagen2;
    }
    if ($imagen3) {
        $sql .= ", imagen3 = :imagen3";
        $params['imagen3'] = $imagen3;
    }
    
    $sql .= " WHERE referencia = :refOriginal";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode(["status" => "success", "mensaje" => "Producto actualizado correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al actualizar el producto"]);
}

function guardarImagen($imagenBase64) {
    if (!$imagenBase64) return null;
    
    if (!preg_match('/^data:image\/(\w+);base64,/', $imagenBase64, $type)) {
        return null;
    }
    
    $imageType = strtolower($type[1]);
    $imagenBase64 = substr($imagenBase64, strpos($imagenBase64, ',') + 1);
    $imagenBase64 = str_replace(' ', '+', $imagenBase64);
    $imageData = base64_decode($imagenBase64);
    
    if ($imageData === false) return null;
    
    $fileName = uniqid("img_") . '.' . $imageType;
    $filePath = __DIR__ . '/../../imagenes/' . $fileName;
    
    if (file_put_contents($filePath, $imageData)) {
        return $fileName;
    }
    
    return null;
}
?>
