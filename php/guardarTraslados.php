<?php
include 'conexion.php';

// Asegurar que recibimos la petición por POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recogemos los datos enviados desde JavaScript o formularios
    $origen = isset($_POST['origen']) ? $conexion->real_escape_string($_POST['origen']) : 'Hospital de Clínicas';
    $destino = isset($_POST['destino']) ? $conexion->real_escape_string($_POST['destino']) : '';
    $acompanante = isset($_POST['acompanante']) ? $conexion->real_escape_string($_POST['acompanante']) : 'Sin acompañante';
    $id_usuario = isset($_POST['id_usuario']) ? intval($_POST['id_usuario']) : 1; // Usuario por defecto si no está logueado

    if (!empty($destino)) {
        $sql = "INSERT INTO TRASLADOS (id_usuario, origen, destino, acompanante) VALUES ($id_usuario, '$origen', '$destino', '$acompanante')";

        if ($conexion->query($sql) === TRUE) {
            echo json_encode(["success" => true, "mensaje" => "Traslado guardado correctamente en la base de datos."]);
        } else {
            echo json_encode(["success" => false, "mensaje" => "Error al guardar en la BD: " . $conexion->error]);
        }
    } else {
        echo json_encode(["success" => false, "mensaje" => "El campo destino es obligatorio."]);
    }
} else {
    echo json_encode(["success" => false, "mensaje" => "Método no permitido."]);
}

$conexion->close();
?>