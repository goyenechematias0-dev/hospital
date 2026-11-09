<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

try {
    $sql = "SELECT e.id_encuesta, e.titulo, e.descripcion, e.calificacion,
                   e.comentarios, e.fecha_creacion,
                   CONCAT(u.nombre, ' ', u.apellido) AS usuario
            FROM encuesta e
            LEFT JOIN usuario u ON u.id_usuario = e.id_usuario
            ORDER BY e.fecha_creacion DESC
            LIMIT 50";
    $res = $conn->query($sql);

    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $rows[] = $row;
    }

    json_response(['success' => true, 'data' => $rows]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 500);
}
