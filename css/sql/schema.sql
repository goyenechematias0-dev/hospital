CREATE TABLE DOCUMENTOS (
  id_documento INT PRIMARY KEY,
  id_usuario INT REFERENCES USUARIOS(id_USUARIO),
  titulo VARCHAR(100),
  categoria VARCHAR(50),
  fecha_subida DATE,
  ruta_archivo VARCHAR(255)
);