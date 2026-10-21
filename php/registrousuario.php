<?php
header('Content-Type: application/json');
include 'conexion.php';

// Leer el JSON recibido desde el fetch
$input = file_get_contents('php://input');
$datos = json_decode($input, true);

if (!$datos) {
    echo json_encode(['exito' => false, 'mensaje' => 'Datos no válidos.']);
    exit;
}

$nombre = trim($datos['nombre'] ?? '');
$email = trim($datos['email'] ?? '');
$password = trim($datos['password'] ?? '');
$rol = trim($datos['rol'] ?? '');

if (empty($nombre) || empty($email) || empty($password) || empty($rol)) {
    echo json_encode(['exito' => false, 'mensaje' => 'Todos los campos son obligatorios.']);
    exit;
}

// Encriptar la contraseña de forma segura
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

// Verificar si el correo ya existe
$sqlCheck = "SELECT id FROM usuarios WHERE email = ?";
$stmtCheck = mysqli_prepare($conexion, $sqlCheck);
mysqli_stmt_bind_param($stmtCheck, "s", $email);
mysqli_stmt_execute($stmtCheck);
mysqli_stmt_store_result($stmtCheck);

if (mysqli_stmt_num_rows($stmtCheck) > 0) {
    echo json_encode(['exito' => false, 'mensaje' => 'El correo electrónico ya está registrado.']);
    mysqli_stmt_close($stmtCheck);
    mysqli_close($conexion);
    exit;
}
mysqli_stmt_close($stmtCheck);

// Insertar el nuevo usuario
$sql = "INSERT INTO usuarios (nombre, email, password, rol, fecha_registro) VALUES (?, ?, ?, ?, NOW())";
$stmt = mysqli_prepare($conexion, $sql);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "ssss", $nombre, $email, $passwordHash, $rol);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['exito' => true, 'mensaje' => 'Usuario registrado con éxito.']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error en la base de datos: ' . mysqli_error($conexion)]);
    }
    
    mysqli_stmt_close($stmt);
} else {
    echo json_encode(['exito' => false, 'mensaje' => 'Error al preparar la consulta.']);
}

mysqli_close($conexion);
?>