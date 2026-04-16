<?php

function getConnection() {
    $host = "localhost";
    $port = "5432";
    $dbname = "opticateslavision";
    $user = "opticauser";
    $password = "optica2024";
    
    try {
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
        $conn = new PDO($dsn, $user, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        return $conn;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Conexión fallida", "detalle" => $e->getMessage()]);
        exit;
    }
}

?>
