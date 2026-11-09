<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

$data = request_data();

$titulo       = campo($data, 'titulo');
$tipo         = campo($data, 'tipo_documento');
$descripcion  = campo($data, 'descripcion');
$ruta         = campo($data, 'ruta_archivo');
$id_usuario   = id_opcional($data, 'id_usuario');

if ($titulo === '') {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'El título del documento es obligatorio.',
        'mensaje' => 'El título del documento es obligatorio.',
    ], 422);
}

try {
    if ($id_usuario === null) {
        $id_usuario = 2;
    }

    // Subida opcional de archivo real.
    if (!empty($_FILES['archivo']) && (int) $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
        $dir = __DIR__ . '/../uploads';
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
        $nombreOriginal = basename($_FILES['archivo']['name']);
        $nombreSeguro = time() . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $nombreOriginal);
        if (move_uploaded_file($_FILES['archivo']['tmp_name'], $dir . '/' . $nombreSeguro)) {
            $ruta = 'uploads/' . $nombreSeguro;
        }
    }

    $stmt = $conn->prepare(
        'INSERT INTO documentos (id_usuario, titulo, tipo_documento, descripcion, ruta_archivo)
         VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->bind_param('issss', $id_usuario, $titulo, $tipo, $descripcion, $ruta);
    $stmt->execute();
    $id = $stmt->insert_id;
    $stmt->close();

    json_response([
        'success'       => true,
        'exito'         => true,
        'message'       => 'Documento registrado con éxito.',
        'mensaje'       => 'Documento registrado con éxito.',
        'id_documento'  => $id,
        'ruta_archivo'  => $ruta,
    ], 201);
} catch (Throwable $e) {
    json_response([
        'success' => false,
        'exito'   => false,
        'message' => 'Error al guardar el documento: ' . $e->getMessage(),
        'mensaje' => 'Error al guardar el documento: ' . $e->getMessage(),
    ], 500);
}
