CREATE TABLE DOCUMENTOS (
  id_documento INT PRIMARY KEY,
  id_usuario INT REFERENCES USUARIOS(id_USUARIO),
  titulo VARCHAR(100),
  categoria VARCHAR(50),
  fecha_subida DATE,
  ruta_archivo VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS ENCUESTAS (
    id_encuesta INT AUTO_INCREMENT PRIMARY KEY,
    calificacion VARCHAR(50) NOT NULL,
    comentarios TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);