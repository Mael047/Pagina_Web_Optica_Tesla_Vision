<?php
header("Content-Type: application/json");
include_once("../conexion.php");

$data = json_decode(file_get_contents("php://input"), true);

$producto = $data["producto"] ?? "";
$material = $data["material"] ?? "";
$valor = $data["valor"] ?? 0;
$descuento = $data["descuento"] ?? 0;
$referencia = $data["referencia"] ?? "";
$descripcion = $data["descripcion"] ?? "";
$imagenBase64 = $data["imagen"] ?? "";
$categoria = $data["categoria"] ?? "";
$imagen = guardarImagen($imagenBase64);


$sqlCheck = "SELECT COUNT(*) FROM `productos` WHERE `referencia` = '$referencia'";

$result = $conn->query($sqlCheck);
$row = $result->fetch_row();

if ($row[0] > 0) {
    echo json_encode([
        "mensaje" => "Error: El producto con la referencia $referencia ya existe."
    ]);
} else {
    $sql = "INSERT INTO `productos` (`nombre`, `material`, `valor`, `descuento`, `referencia`, `descripcion`, `imagen`, `categoria`) VALUES ('$producto', '$material', '$valor', '$descuento', '$referencia', '$descripcion', '$imagen', '$categoria');";

    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            "mensaje" => "Producto Agregado con exito",
        ]);
    } else {
        echo json_encode([
            "mensaje" => "Error al registrar el producto " . $conn->error,
        ]);
    }
}

/*
echo json_encode([
    "status" => "success",
    "message" => "Datos recibidos correctamente",
    "producto" => $producto,
    "material"=> $material,
    "valor" => $valor,
    "descuento"=> $descuento,
    "referencia" => $referencia,
    "descripcion" => $descripcion,
    "imagen" => $imagen,
    "categoria" => $categoria
]);*/

function guardarImagen($imagenBase64)
{
    if ($imagenBase64) {
        if (preg_match('/^data:image\/(\w+);base64,/', $imagenBase64, $type)) {
            $imageType = strtolower($type[1]);
            $imagenBase64 = substr($imagenBase64, strpos($imagenBase64, ',') + 1);
            $imagenBase64 = str_replace(' ', '+', $imagenBase64);
            $imageData = base64_decode($imagenBase64);

            if ($imageData === false) {
                echo json_encode(["status" => "error al decodificar la imagen"]);
                exit;
            }

            $fileName = uniqid("img_") . '.' . $imageType;
            $filePath = '../../imagenes/' . $fileName;

            if (file_put_contents($filePath, $imageData)) {
                return "imagen guardada con exito";
            } else {
                return "error al guardar la imagen";
            }
        } else {
            return "Formato no valido ";
        }
    } else {
        return "No se recibio Imagen";
    }
}



?>