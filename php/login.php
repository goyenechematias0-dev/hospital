<?php
header('Content-Type: application/json');
include 'conexion.php';

// Leer el JSON recibido desde el fetch del login
$input = file_get_contents('php://input');
$datos = json_decode($input, true);

if (!$datos) {
    echo json_encode(['exito' => false, 'mensaje' => 'Datos no válidos.']);
    exit;
}

$email = trim($datos['email'] ?? '');
$password = trim($datos['password'] ?? '');

if (empty($email) || empty($password)) {
    echo json_encode(['exito' => false, 'mensaje' => 'Por favor, complete todos los campos.']);
    exit;
}

// Buscar el usuario en la base de datos
$sql = "SELECT id, nombre, password, rol FROM usuarios WHERE email = ?";
$stmt = mysqli_prepare($conexion, $sql);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $resultado = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($resultado)) {
        // Verificar la contraseña ingresada con el hash guardado
        if (password_verify($password, $row['password'])) {
            // Contraseña correcta: iniciamos sesión con datos básicos
            echo json_encode([
                'exito' => true, 
                'mensaje' => 'Inicio de sesión exitoso.',
                'usuario' => [
                    'id' => $row['id'],
                    'nombre' => $row['nombre'],
                    'rol' => $row['rol']
                ]
            ]);
        } else {
            echo json_encode(['exito' => false, 'mensaje' => 'Contraseña incorrecta.']);
        }
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'El correo electrónico no está registrado.']);
    }

    mysqli_stmt_close($stmt);
} else {
    echo json_encode(['exito' => false, 'mensaje' => 'Error al preparar la consulta.']);
}

mysqli_close($conexion);
?>