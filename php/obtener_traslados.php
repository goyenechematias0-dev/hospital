<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

try {
    $sql = "SELECT t.id_traslado, t.origen, t.destino, t.acompanante, t.estado,
                   t.hora_salida, t.hora_llegada, t.fecha_solicitud,
                   CONCAT(u.nombre, ' ', u.apellido) AS solicitante,
                   a.matricula AS ambulancia
            FROM traslado t
            LEFT JOIN usuario u ON u.id_usuario = t.id_usuario
            LEFT JOIN ambulancia a ON a.id_ambulancia = t.id_ambulancia
            ORDER BY t.fecha_solicitud DESC
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
