<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

$data = request_data();

$origen       = campo($data, 'origen');
$destino      = campo($data, 'destino');
$acompanante  = campo($data, 'acompanante');
$estado       = campo($data, 'estado', 'Pendiente');
$id_usuario   = id_opcional($data, 'id_usuario');
$id_ambulancia = id_opcional($data, 'id_ambulancia');

$estadosValidos = ['Pendiente', 'En curso', 'Completado', 'Cancelado'];
if (!in_array($estado, $estadosValidos, true)) {
    $estado = 'Pendiente';
}

if ($origen === '' || $destino === '') {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'El origen y el destino son obligatorios.',
        'mensaje' => 'El origen y el destino son obligatorios.',
    ], 422);
}

try {
    // Si no llega un usuario válido, se usa el administrador demo (id 2).
    if ($id_usuario === null) {
        $id_usuario = 2;
    }

    $horaSalida = ($estado === 'Pendiente') ? null : date('Y-m-d H:i:s');

    $stmt = $conn->prepare(
        'INSERT INTO traslado (id_usuario, id_ambulancia, origen, destino, acompanante, estado, hora_salida)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->bind_param('iisssss', $id_usuario, $id_ambulancia, $origen, $destino, $acompanante, $estado, $horaSalida);
    $stmt->execute();
    $id = $stmt->insert_id;
    $stmt->close();

    if ($id_ambulancia !== null && $estado !== 'Pendiente') {
        $upd = $conn->prepare("UPDATE ambulancia SET disponibilidad = 'En traslado' WHERE id_ambulancia = ?");
        $upd->bind_param('i', $id_ambulancia);
        $upd->execute();
        $upd->close();
    }

    json_response([
        'success'      => true,
        'exito'        => true,
        'message'      => 'Traslado registrado con éxito.',
        'mensaje'      => 'Traslado registrado con éxito.',
        'id_traslado'  => $id,
    ], 201);
} catch (Throwable $e) {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'Error al registrar el traslado: ' . $e->getMessage(),
        'mensaje' => 'Error al registrar el traslado: ' . $e->getMessage(),
    ], 500);
}
