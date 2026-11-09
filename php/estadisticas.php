<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

try {
    $res = $conn->query(
        "SELECT
            (SELECT COUNT(*) FROM usuario)     AS usuarios,
            (SELECT COUNT(*) FROM ambulancia)  AS ambulancias,
            (SELECT COUNT(*) FROM traslado)    AS traslados,
            (SELECT COUNT(*) FROM documentos)  AS documentos,
            (SELECT COUNT(*) FROM encuesta)    AS encuestas,
            (SELECT COUNT(*) FROM traslado WHERE estado = 'En curso') AS en_curso,
            (SELECT COUNT(*) FROM ambulancia WHERE disponibilidad = 'Disponible') AS disponibles"
    );

    $stats = $res->fetch_assoc();
    json_response(['success' => true, 'data' => $stats]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 500);
}
