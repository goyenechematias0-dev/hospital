<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

$data = request_data();

$id_ambulancia  = id_opcional($data, 'id_ambulancia');
$disponibilidad = campo($data, 'disponibilidad');

$disponibilidades = ['Disponible', 'En traslado', 'Mantenimiento'];

if ($id_ambulancia === null) {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'La ambulancia indicada no es válida.',
        'mensaje' => 'La ambulancia indicada no es válida.',
    ], 422);
}

if (!in_array($disponibilidad, $disponibilidades, true)) {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'El estado indicado no es válido.',
        'mensaje' => 'El estado indicado no es válido.',
    ], 422);
}

try {
    // Verifica que la ambulancia exista antes de actualizar.
    $stmt = $conn->prepare('SELECT id_ambulancia FROM ambulancia WHERE id_ambulancia = ? LIMIT 1');
    $stmt->bind_param('i', $id_ambulancia);
    $stmt->execute();
    $existe = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$existe) {
        json_response([
            'success' => false,
            'exito'   => false,
            'message' => 'La ambulancia no existe.',
            'mensaje' => 'La ambulancia no existe.',
        ], 404);
    }

    $upd = $conn->prepare('UPDATE ambulancia SET disponibilidad = ? WHERE id_ambulancia = ?');
    $upd->bind_param('si', $disponibilidad, $id_ambulancia);
    $upd->execute();
    $upd->close();

    json_response([
        'success'        => true,
        'exito'          => true,
        'message'        => 'Estado de la ambulancia actualizado con éxito.',
        'mensaje'        => 'Estado de la ambulancia actualizado con éxito.',
        'id_ambulancia'  => $id_ambulancia,
        'disponibilidad' => $disponibilidad,
    ]);
} catch (Throwable $e) {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'Error al actualizar la ambulancia: ' . $e->getMessage(),
        'mensaje' => 'Error al actualizar la ambulancia: ' . $e->getMessage(),
    ], 500);
}
