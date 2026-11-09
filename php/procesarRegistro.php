<?php
/**
 * Endpoint de compatibilidad para los formularios antiguos de registro.
 * Inserta en la tabla `usuario` y redirige al login.
 */
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/helpers.php';

$nombre   = campo($_POST, 'nombre');
$apellido = campo($_POST, 'apellido');
$cedula   = campo($_POST, 'cedula');
$email    = campo($_POST, 'email');
$password = (string) ($_POST['password'] ?? '');
$rol      = campo($_POST, 'rol', 'paciente');

$rolesValidos = ['administrador', 'medico', 'chofer', 'copiloto', 'paciente'];
if (!in_array($rol, $rolesValidos, true)) {
    $rol = 'paciente';
}

if ($nombre === '' || $apellido === '' || $cedula === '' || $email === '' || $password === '') {
    echo "<script>alert('Complete todos los campos.'); history.back();</script>";
    exit;
}

try {
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $conn->prepare(
        'INSERT INTO usuario (cedula, nombre, apellido, email, password, rol)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->bind_param('ssssss', $cedula, $nombre, $apellido, $email, $hash, $rol);
    $stmt->execute();
    $stmt->close();

    echo "<script>
            alert('¡Usuario registrado con éxito!');
            window.location.href = '../index.html';
          </script>";
} catch (Throwable $e) {
    echo "<script>alert('Error al registrar: " . addslashes($e->getMessage()) . "'); history.back();</script>";
}
