<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

$data = request_data();

$id_traslado = id_opcional($data, 'id_traslado');
$estado      = campo($data, 'estado');
$rol         = strtolower(campo($data, 'rol'));

$estadosValidos  = ['Pendiente', 'En curso', 'Completado', 'Cancelado'];
$rolesPermitidos = ['administrador', 'chofer', 'copiloto'];

if ($id_traslado === null) {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'El traslado indicado no es válido.',
        'mensaje' => 'El traslado indicado no es válido.',
    ], 422);
}

if (!in_array($estado, $estadosValidos, true)) {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'El estado indicado no es válido.',
        'mensaje' => 'El estado indicado no es válido.',
    ], 422);
}

if (!in_array($rol, $rolesPermitidos, true)) {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'Solo un chofer, copiloto o administrador puede cambiar el estado del traslado.',
        'mensaje' => 'Solo un chofer, copiloto o administrador puede cambiar el estado del traslado.',
    ], 403);
}

try {
    $stmt = $conn->prepare(
        'SELECT id_traslado, id_ambulancia, estado, hora_salida, hora_llegada
         FROM traslado
         WHERE id_traslado = ?
         LIMIT 1'
    );
    $stmt->bind_param('i', $id_traslado);
    $stmt->execute();
    $traslado = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$traslado) {
        json_response([
            'success' => false,
            'exito'   => false,
            'message' => 'El traslado no existe.',
            'mensaje' => 'El traslado no existe.',
        ], 404);
    }

    $ahora       = date('Y-m-d H:i:s');
    $horaSalida  = $traslado['hora_salida'];
    $horaLlegada = $traslado['hora_llegada'];

    if ($estado === 'Pendiente') {
        $horaSalida  = null;
        $horaLlegada = null;
    } elseif ($estado === 'En curso') {
        $horaSalida  = $horaSalida ?: $ahora;
        $horaLlegada = null;
    } elseif ($estado === 'Completado') {
        $horaSalida  = $horaSalida ?: $ahora;
        $horaLlegada = $ahora;
    }
    // Cancelado: conserva las horas que ya tenía registradas.

    $upd = $conn->prepare(
        'UPDATE traslado
         SET estado = ?, hora_salida = ?, hora_llegada = ?
         WHERE id_traslado = ?'
    );
    $upd->bind_param('sssi', $estado, $horaSalida, $horaLlegada, $id_traslado);
    $upd->execute();
    $upd->close();

    // Actualiza la disponibilidad de la ambulancia según el nuevo estado.
    if ($traslado['id_ambulancia'] !== null) {
        $disponibilidad = null;

        if ($estado === 'En curso') {
            $disponibilidad = 'En traslado';
        } elseif ($estado === 'Completado' || $estado === 'Cancelado') {
            $disponibilidad = 'Disponible';
        }

        if ($disponibilidad !== null) {
            $updAmb = $conn->prepare('UPDATE ambulancia SET disponibilidad = ? WHERE id_ambulancia = ?');
            $updAmb->bind_param('si', $disponibilidad, $traslado['id_ambulancia']);
            $updAmb->execute();
            $updAmb->close();
        }
    }

    json_response([
        'success'     => true,
        'exito'       => true,
        'message'     => 'Estado del traslado actualizado con éxito.',
        'mensaje'     => 'Estado del traslado actualizado con éxito.',
        'id_traslado' => $id_traslado,
        'estado'      => $estado,
        'hora_salida' => $horaSalida,
        'hora_llegada' => $horaLlegada,
    ]);
} catch (Throwable $e) {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'Error al actualizar el traslado: ' . $e->getMessage(),
        'mensaje' => 'Error al actualizar el traslado: ' . $e->getMessage(),
    ], 500);
}
