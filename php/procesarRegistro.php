<?php
// Conexión a la base de datos (ajustá los datos según tu entorno XAMPP)
$servidor = "localhost";
$usuario = "root";
$clave = "";
$baseDatos = "hospital_clinicas"; // Nombre de tu base de datos del proyecto

$conexion = new mysqli($servidor, $usuario, $clave, $baseDatos);

// Verificar conexión
if ($conexion->connect_error) {
    die("Error de conexión a la base de datos: " . $conexion->connect_error);
}

// Recoger los datos enviados desde el formulario HTML
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $conexion->real_escape_string($_POST['nombre']);
    $cedula = $conexion->real_escape_string($_POST['cedula']);
    $email = $conexion->real_escape_string($_POST['email']);
    $passwordPlana = $_POST['password'];

    // Encriptar la contraseña por seguridad (recomendado para proyectos de IT)
    $passwordEncriptada = password_hash($passwordPlana, PASSWORD_DEFAULT);

    // Consulta SQL para insertar el nuevo funcionario (asumiendo que tu tabla se llama 'funcionarios')
    $sql = "INSERT INTO funcionarios (nombre, cedula, email, password) VALUES ('$nombre', '$cedula', '$email', '$passwordEncriptada')";

    if ($conexion->query($sql) === TRUE) {
        echo "<script>
                alert('¡Funcionario registrado con éxito!');
                window.location.href = 'login.html';
              </script>";
    } else {
        echo "Error al registrar: " . $sql . "<br>" . $conexion->error;
    }
}

$conexion->close();
?>