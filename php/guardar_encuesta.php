<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

$data = request_data();

$titulo       = campo($data, 'titulo');
$calificacion = campo($data, 'calificacion');
$comentarios  = campo($data, 'comentarios');
$descripcion  = campo($data, 'descripcion');
$id_usuario   = id_opcional($data, 'id_usuario');

if ($titulo === '' || $calificacion === '') {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'El título y la calificación son obligatorios.',
        'mensaje' => 'El título y la calificación son obligatorios.',
    ], 422);
}

if ($descripcion === '') {
    $descripcion = mb_substr($comentarios, 0, 250);
}

try {
    $stmt = $conn->prepare(
        'INSERT INTO encuesta (id_usuario, titulo, descripcion, calificacion, comentarios, activo)
         VALUES (?, ?, ?, ?, ?, 1)'
    );
    $stmt->bind_param('issss', $id_usuario, $titulo, $descripcion, $calificacion, $comentarios);
    $stmt->execute();
    $id = $stmt->insert_id;
    $stmt->close();

    json_response([
        'success'     => true,
        'exito'       => true,
        'message'     => 'Encuesta guardada con éxito.',
        'mensaje'     => 'Encuesta guardada con éxito.',
        'id_encuesta' => $id,
    ], 201);
} catch (Throwable $e) {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'Error al guardar la encuesta: ' . $e->getMessage(),
        'mensaje' => 'Error al guardar la encuesta: ' . $e->getMessage(),
    ], 500);
}
