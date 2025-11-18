<?php
header("Content-Type: application/json");
include_once("../conexion.php");

$data = json_decode(file_get_contents("php://input"), true);

$producto = $data["producto"] ?? "";
$material = $data["material"] ?? "";
$valor = $data["valor"] ?? 0;
$descuento = $data["descuento"] ?? 0;
$marca = $data["marca"] ?? "";
$referencia = $data["referencia"] ?? "";
$descripcion = $data["descripcion"] ?? "";
$imagenBase64 = $data["imagen"] ?? "";
$imagenBase64_2 = $data["imagen2"] ?? "";
$imagenBase64_3 = $data["imagen3"] ?? "";
$categoria = $data["categoria"] ?? "";
$imagen = guardarImagen($imagenBase64);
$imagen2 = guardarImagen($imagenBase64_2);
$imagen3 = guardarImagen($imagenBase64_3);


$sqlCheck = "SELECT COUNT(*) FROM `productos` WHERE `referencia` = '$referencia'";

$result = $conn->query($sqlCheck);
$row = $result->fetch_row();

if ($row[0] > 0) {
    echo json_encode([
        "mensaje" => "Error: El producto con la referencia $referencia ya existe."
    ]);
} else {
    $sql = "INSERT INTO `productos` (`nombre`, `material`, `valor`, `descuento`, `referencia`, `descripcion`, `imagen`, `imagen2`, `imagen3`, `categoria` , `marca`) VALUES ('$producto', '$material', '$valor', '$descuento', '$referencia', '$descripcion', '$imagen', '$imagen2', '$imagen3', '$categoria', '$marca');";

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

function guardarImagen($imagenBase64) {
    // This function is not used in the current code but can be implemented if needed
    if ($imagenBase64) {
        // Extract base64 data from the "data:image/...;base64," prefix
        if (preg_match('/^data:image\/(\w+);base64,/', $imagenBase64, $type)) {
            $imageType = strtolower($type[1]); // jpg, png, gif, etc.
            $imagenBase64 = substr($imagenBase64, strpos($imagenBase64, ',') + 1);
            $imagenBase64 = str_replace(' ', '+', $imagenBase64);
            $imageData = base64_decode($imagenBase64);

            if ($imageData === false) {
                return [false, "Error al decodificar la imagen"];
            }

            // Save image with unique name
            $fileName = uniqid("img_") . "." . $imageType;
            $filePath = "../../imagenes/" . $fileName;

            if (file_put_contents($filePath, $imageData)) {
                return $fileName;
            } else {
                return "Error al guardar la imagen";
            }
        } else {
            return "Formato de imagen inválido";
        }
    } else {
        return "No se recibió ninguna imagen";
    }
}



?>