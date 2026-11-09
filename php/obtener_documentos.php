<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

try {
    $sql = "SELECT d.id_documento, d.titulo, d.tipo_documento, d.descripcion,
                   d.ruta_archivo, d.fecha_actualizacion,
                   CONCAT(u.nombre, ' ', u.apellido) AS usuario
            FROM documentos d
            LEFT JOIN usuario u ON u.id_usuario = d.id_usuario
            ORDER BY d.fecha_actualizacion DESC
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
