<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

$data = request_data();

// Permite iniciar sesión con correo o con cédula.
$identificador = campo($data, 'email');
if ($identificador === '') {
    $identificador = campo($data, 'cedula');
}
$password = (string) ($data['password'] ?? '');

if ($identificador === '' || $password === '') {
    json_response(['exito' => false, 'mensaje' => 'Por favor, complete todos los campos.'], 422);
}

try {
    $sql = 'SELECT id_usuario, cedula, nombre, apellido, email, password, rol, telefono
            FROM usuario
            WHERE email = ? OR cedula = ?
            LIMIT 1';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ss', $identificador, $identificador);
    $stmt->execute();
    $usuario = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$usuario) {
        json_response(['exito' => false, 'mensaje' => 'El usuario no está registrado.'], 401);
    }

    if (!password_verify($password, $usuario['password'])) {
        json_response(['exito' => false, 'mensaje' => 'Contraseña incorrecta.'], 401);
    }

    $upd = $conn->prepare('UPDATE usuario SET ultimo_acceso = NOW() WHERE id_usuario = ?');
    $upd->bind_param('i', $usuario['id_usuario']);
    $upd->execute();
    $upd->close();

    unset($usuario['password']);

    json_response([
        'exito'   => true,
        'mensaje' => 'Inicio de sesión exitoso.',
        'usuario' => $usuario,
    ]);
} catch (Throwable $e) {
    json_response(['exito' => false, 'mensaje' => 'Error del servidor: ' . $e->getMessage()], 500);
}
