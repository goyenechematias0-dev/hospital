<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

$data = request_data();

$matricula      = campo($data, 'matricula');
$modelo         = campo($data, 'modelo');
$disponibilidad = campo($data, 'disponibilidad', 'Disponible');
$mantenimiento  = campo($data, 'ultimo_mantenimiento');

$disponibilidades = ['Disponible', 'En traslado', 'Mantenimiento'];
if (!in_array($disponibilidad, $disponibilidades, true)) {
    $disponibilidad = 'Disponible';
}

if ($matricula === '') {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'La matrícula es obligatoria.',
        'mensaje' => 'La matrícula es obligatoria.',
    ], 422);
}

try {
    $mant = ($mantenimiento !== '') ? $mantenimiento : null;

    $stmt = $conn->prepare(
        'INSERT INTO ambulancia (matricula, modelo, disponibilidad, ultimo_mantenimiento)
         VALUES (?, ?, ?, ?)'
    );
    $stmt->bind_param('ssss', $matricula, $modelo, $disponibilidad, $mant);
    $stmt->execute();
    $id = $stmt->insert_id;
    $stmt->close();

    json_response([
        'success'        => true,
        'exito'          => true,
        'message'        => 'Ambulancia registrada con éxito.',
        'mensaje'        => 'Ambulancia registrada con éxito.',
        'id_ambulancia'  => $id,
    ], 201);
} catch (mysqli_sql_exception $e) {
    if ((int) $e->getCode() === 1062) {
        json_response([
            'success' => false,
            'exito'   => false,
            'message' => 'Ya existe una ambulancia con esa matrícula.',
            'mensaje' => 'Ya existe una ambulancia con esa matrícula.',
        ], 409);
    }
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'Error al registrar la ambulancia: ' . $e->getMessage(),
        'mensaje' => 'Error al registrar la ambulancia: ' . $e->getMessage(),
    ], 500);
} catch (Throwable $e) {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'Error inesperado al registrar la ambulancia: ' . $e->getMessage(),
        'mensaje' => 'Error inesperado al registrar la ambulancia: ' . $e->getMessage(),
    ], 500);
}
