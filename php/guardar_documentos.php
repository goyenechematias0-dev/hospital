<?php
header('Content-Type: application/json');
require_once 'conexion.php'; // Utiliza tu conexión PDO existente

// Recibir los datos JSON enviados por POST desde el JS
$inputData = json_decode(file_get_contents('php://input'), true);

if ($inputData && !empty($inputData['unidad']) && !empty($inputData['tipo_documento'])) {
    try {
        $sql = "INSERT INTO documentos_ambulancia (unidad, tipo_documento, detalles, fecha) VALUES (:unidad, :tipo_documento, :detalles, NOW())";
        $stmt = $pdo->prepare($sql);
        
        $stmt->execute([
            ':unidad' => $inputData['unidad'],
            ':tipo_documento' => $inputData['tipo_documento'],
            ':detalles' => $inputData['detalles'] ?? ''
        ]);

        echo json_encode(['success' => true, 'message' => 'Documento registrado correctamente']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error en base de datos: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
}
?>