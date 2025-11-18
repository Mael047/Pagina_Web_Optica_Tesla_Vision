<?php
header("Content-Type: application/json");
include_once("../conexion.php");

// Leer JSON
$data = json_decode(file_get_contents("php://input"), true);

$producto = $data["producto"] ?? "";
$material = $data["material"] ?? "";
$marca = $data["marca"] ?? "";
$valor = $data["valor"] ?? 0;
$descuento = $data["descuento"] ?? 0;
$referencia = $data["referencia"] ?? "";
$descripcion = $data["descripcion"] ?? "";
$categoria = $data["categoria"] ?? "";
$imagenBase64 = $data["imagen"] ?? "";
$imagenBase64_2 = $data["imagen2"] ?? "";
$imagenBase64_3 = $data["imagen3"] ?? "";
$refOriginal = $data["referencia_original"] ?? ""; // la referencia vieja

if (!$refOriginal) {
    echo json_encode(["mensaje" => "No se recibió la referencia original del producto."]);
    exit;
}

$imagenClause = "";

if ($imagenBase64_1) {
    $nueva = guardarImagen($imagenBase64_1);
    if ($nueva) {
        $imagenClause .= ", imagen = '$nueva'";
    }
}
if ($imagenBase64_2) {
    $nueva2 = guardarImagen($imagenBase64_2);
    if ($nueva2) {
        $imagenClause .= ", imagen2 = '$nueva2'";
    }
}
if ($imagenBase64_3) {
    $nueva3 = guardarImagen($imagenBase64_3);
    if ($nueva3) {
        $imagenClause .= ", imagen3 = '$nueva3'";
    }
}

// Actualizar datos
$sql = "UPDATE productos SET
            nombre     = '$producto',
            material   = '$material',
            valor      = '$valor',
            descuento  = '$descuento',
            referencia = '$referencia',
            descripcion= '$descripcion',
            categoria  = '$categoria',
            marca     = '$marca'
            $imagenClause
        WHERE referencia = '$refOriginal'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["mensaje" => "Producto actualizado correctamente"]);
} else {
    echo json_encode(["mensaje" => "Error al actualizar: " . $conn->error]);
}

function guardarImagen($imagenBase64)
{
    if (!$imagenBase64)
        return null;

    if (!preg_match('/^data:image\/(\w+);base64,/', $imagenBase64, $type)) {
        return null;
    }

    $imageType = strtolower($type[1]);
    $imagenBase64 = substr($imagenBase64, strpos($imagenBase64, ',') + 1);
    $imagenBase64 = str_replace(' ', '+', $imagenBase64);
    $imageData = base64_decode($imagenBase64);

    if ($imageData === false) {
        return null;
    }

    $fileName = uniqid("img_") . '.' . $imageType;
    $filePath = __DIR__ . '/../../imagenes/' . $fileName;

    if (file_put_contents($filePath, $imageData)) {
        return $fileName;
    }

    return null;
}
