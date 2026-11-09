<?php
/**
 * Conexión única a la base de datos del sistema.
 * XAMPP activo: MySQL 3306 / base "hospital".
 */
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'hospital';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli($host, $user, $password, $database);
    $conn->set_charset('utf8mb4');
    // Alias para archivos antiguos que usaban $conexion
    $conexion = $conn;
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'exito'   => false,
        'message' => 'Error de conexión a la base de datos: ' . $e->getMessage(),
        'mensaje' => 'Error de conexión a la base de datos: ' . $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
