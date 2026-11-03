<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "hospital_clinicas"; // Ajusta esto a "hospital" o "hospital_clinicas" según cómo la hayas creado

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]));
}
?>

