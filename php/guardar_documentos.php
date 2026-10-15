<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titulo    = $_POST['titulo'] ?? '';
    $categoria = $_POST['categoria'] ?? '';
    
    // Validar que se hayan llenado los campos y que venga un archivo
    if (!empty($titulo) && !empty($categoria) && isset($_FILES['archivo'])) {
        $archivo = $_FILES['archivo'];
        $nombreArchivo = time() . '_' . basename($archivo['name']);
        $rutaDestino = '../uploads/' . $nombreArchivo;

        // Mover el archivo subido a la carpeta uploads
        if (move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
            try {
                $sql = "INSERT INTO documentos (titulo, categoria, archivo, fecha_subida) 
                        VALUES (:titulo, :categoria, :archivo, NOW())";
                
                $stmt = $conexion->prepare($sql);
                $stmt->bindParam(':titulo', $titulo);
                $stmt->bindParam(':categoria', $categoria);
                $stmt->bindParam(':archivo', $nombreArchivo);
                $stmt->execute();

                // Redirigir de vuelta con éxito
                header('Location: ../pages/documentos.html?status=success');
                exit;
            } catch (PDOException $e) {
                header('Location: ../pages/documentos.html?status=db_error');
                exit;
            }
        } else {
            header('Location: ../pages/documentos.html?status=upload_error');
            exit;
        }
    }
}

header('Location: ../pages/documentos.html');
exit;