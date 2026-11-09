<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

try {
    $res = $conn->query(
        'SELECT id_ambulancia, matricula, modelo, disponibilidad, ultimo_mantenimiento
         FROM ambulancia
         ORDER BY matricula ASC'
    );

    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $rows[] = $row;
    }

    json_response(['success' => true, 'data' => $rows]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 500);
}
