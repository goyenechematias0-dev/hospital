<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $origen = $_POST['origen'] ?? '';
    $destino = $_POST['destino'] ?? '';
    $acompanante = $_POST['acompanante'] ?? '';
    $id_ambulancia = $_POST['ambulancia'] ?? '';

    if (!empty($origen) && !empty($destino) && !empty($id_ambulancia)) {
        try {
            $sql = "INSERT INTO traslado (origen, destino, acompaniante, id_ambulancia) VALUES (:origen, :destino, :acompanante, :id_ambulancia)";
            $stmt = $conexion->prepare($sql);
            $stmt->execute([
                ':origen' => $origen,
                ':destino' => $destino,
                ':acompanante' => $acompanante,
                ':id_ambulancia' => $id_ambulancia
            ]);
        } catch (Exception $e) {
            // Manejo opcional de errores
        }
    }
}

// Redirige de vuelta a la página de traslados
header('Location: ../pages/traslados.html');
exit;