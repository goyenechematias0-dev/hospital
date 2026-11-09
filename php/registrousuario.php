<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

$data = request_data();

$nombre   = campo($data, 'nombre');
$apellido = campo($data, 'apellido');
$cedula   = campo($data, 'cedula');
$email    = campo($data, 'email');
$password = (string) ($data['password'] ?? '');
$rol      = campo($data, 'rol', 'paciente');
$telefono = campo($data, 'telefono');

$rolesValidos = ['administrador', 'medico', 'chofer', 'copiloto', 'paciente'];
if (!in_array($rol, $rolesValidos, true)) {
    $rol = 'paciente';
}

if ($nombre === '' || $apellido === '' || $cedula === '' || $email === '' || $password === '') {
    json_response(['exito' => false, 'mensaje' => 'Complete todos los campos obligatorios.'], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['exito' => false, 'mensaje' => 'El correo electrónico no es válido.'], 422);
}

if (strlen($password) < 6) {
    json_response(['exito' => false, 'mensaje' => 'La contraseña debe tener al menos 6 caracteres.'], 422);
}

try {
    $check = $conn->prepare('SELECT id_usuario FROM usuario WHERE email = ? OR cedula = ? LIMIT 1');
    $check->bind_param('ss', $email, $cedula);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $check->close();
        json_response(['exito' => false, 'mensaje' => 'El correo o la cédula ya están registrados.'], 409);
    }
    $check->close();

    $hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare(
        'INSERT INTO usuario (cedula, nombre, apellido, email, password, rol, telefono)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->bind_param('sssssss', $cedula, $nombre, $apellido, $email, $hash, $rol, $telefono);
    $stmt->execute();
    $nuevoId = $stmt->insert_id;
    $stmt->close();

    json_response([
        'exito'      => true,
        'mensaje'    => 'Usuario registrado con éxito.',
        'id_usuario' => $nuevoId,
    ], 201);
} catch (Throwable $e) {
    json_response(['exito' => false, 'mensaje' => 'Error al registrar: ' . $e->getMessage()], 500);
}
