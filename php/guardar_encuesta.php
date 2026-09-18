<?php
header("Content-Type: application/json");
include "conexion.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $calificacion = $_POST['calificacion'] ?? '';
    $comentarios = $_POST['comentarios'] ?? '';

    if (empty($calificacion) || empty($comentarios)) {
        echo json_encode(["success" => false, "message" => "Por favor completa todos los campos."]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO encuestas (calificacion, comentarios) VALUES (?, ?)");
    $stmt->bind_param("ss", $calificacion, $comentarios);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Encuesta guardada con éxito."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar en la base de datos."]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
?>