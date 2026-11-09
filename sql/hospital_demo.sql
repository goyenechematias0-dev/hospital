-- ============================================================
--  S.I.G.S.M. - Hospital de Clínicas
--  Esquema limpio + datos de demostración
--  Base de datos: hospital  (MariaDB 10.4 / MySQL 5.7+)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

CREATE DATABASE IF NOT EXISTS `hospital`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
USE `hospital`;

DROP TABLE IF EXISTS `elemento`;
DROP TABLE IF EXISTS `preguntas_encuesta`;
DROP TABLE IF EXISTS `encuesta`;
DROP TABLE IF EXISTS `acceso_documento`;
DROP TABLE IF EXISTS `categoria_documento`;
DROP TABLE IF EXISTS `documentos`;
DROP TABLE IF EXISTS `traslado`;
DROP TABLE IF EXISTS `chofer`;
DROP TABLE IF EXISTS `ambulancia`;
DROP TABLE IF EXISTS `usuario`;

-- ------------------------------------------------------------
-- USUARIOS
-- ------------------------------------------------------------
CREATE TABLE `usuario` (
  `id_usuario`      INT(11) NOT NULL AUTO_INCREMENT,
  `cedula`          VARCHAR(20) NOT NULL,
  `nombre`          VARCHAR(100) NOT NULL,
  `apellido`        VARCHAR(100) NOT NULL,
  `email`           VARCHAR(150) NOT NULL,
  `password`        VARCHAR(255) NOT NULL,
  `rol`             ENUM('administrador','medico','chofer','copiloto','paciente') NOT NULL DEFAULT 'paciente',
  `telefono`        VARCHAR(30) DEFAULT NULL,
  `fecha_registro`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultimo_acceso`   TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uq_usuario_cedula` (`cedula`),
  UNIQUE KEY `uq_usuario_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- AMBULANCIAS
-- ------------------------------------------------------------
CREATE TABLE `ambulancia` (
  `id_ambulancia`        INT(11) NOT NULL AUTO_INCREMENT,
  `matricula`            VARCHAR(20) NOT NULL,
  `modelo`               VARCHAR(100) DEFAULT NULL,
  `disponibilidad`       ENUM('Disponible','En traslado','Mantenimiento') NOT NULL DEFAULT 'Disponible',
  `ultimo_mantenimiento` DATETIME DEFAULT NULL,
  `fecha_alta`           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_ambulancia`),
  UNIQUE KEY `uq_ambulancia_matricula` (`matricula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- CHOFERES
-- ------------------------------------------------------------
CREATE TABLE `chofer` (
  `id_chofer`      INT(11) NOT NULL AUTO_INCREMENT,
  `id_usuario`     INT(11) DEFAULT NULL,
  `telefono`       VARCHAR(30) DEFAULT NULL,
  `disponibilidad` ENUM('Disponible','Ocupado','Inactivo') NOT NULL DEFAULT 'Disponible',
  PRIMARY KEY (`id_chofer`),
  KEY `fk_chofer_usuario` (`id_usuario`),
  CONSTRAINT `fk_chofer_usuario` FOREIGN KEY (`id_usuario`)
    REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- TRASLADOS
-- ------------------------------------------------------------
CREATE TABLE `traslado` (
  `id_traslado`     INT(11) NOT NULL AUTO_INCREMENT,
  `id_usuario`      INT(11) NOT NULL,
  `id_ambulancia`   INT(11) DEFAULT NULL,
  `id_chofer`       INT(11) DEFAULT NULL,
  `origen`          VARCHAR(150) NOT NULL,
  `destino`         VARCHAR(150) NOT NULL,
  `acompanante`     VARCHAR(100) DEFAULT NULL,
  `hora_salida`     DATETIME DEFAULT NULL,
  `hora_llegada`    DATETIME DEFAULT NULL,
  `estado`          ENUM('Pendiente','En curso','Completado','Cancelado') NOT NULL DEFAULT 'Pendiente',
  `fecha_solicitud` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_traslado`),
  KEY `fk_traslado_usuario` (`id_usuario`),
  KEY `fk_traslado_ambulancia` (`id_ambulancia`),
  KEY `fk_traslado_chofer` (`id_chofer`),
  CONSTRAINT `fk_traslado_usuario` FOREIGN KEY (`id_usuario`)
    REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_traslado_ambulancia` FOREIGN KEY (`id_ambulancia`)
    REFERENCES `ambulancia` (`id_ambulancia`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_traslado_chofer` FOREIGN KEY (`id_chofer`)
    REFERENCES `chofer` (`id_chofer`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- DOCUMENTOS
-- ------------------------------------------------------------
CREATE TABLE `documentos` (
  `id_documento`       INT(11) NOT NULL AUTO_INCREMENT,
  `id_usuario`         INT(11) DEFAULT NULL,
  `titulo`             VARCHAR(150) NOT NULL,
  `tipo_documento`     VARCHAR(80) DEFAULT NULL,
  `descripcion`        TEXT DEFAULT NULL,
  `ruta_archivo`       VARCHAR(255) DEFAULT NULL,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_documento`),
  KEY `fk_documentos_usuario` (`id_usuario`),
  CONSTRAINT `fk_documentos_usuario` FOREIGN KEY (`id_usuario`)
    REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- CATEGORIAS DE DOCUMENTO
-- ------------------------------------------------------------
CREATE TABLE `categoria_documento` (
  `id_categoria`      INT(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria`  VARCHAR(100) NOT NULL,
  `descripcion`       VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- ACCESOS A DOCUMENTOS (trazabilidad)
-- ------------------------------------------------------------
CREATE TABLE `acceso_documento` (
  `id_acceso`     INT(11) NOT NULL AUTO_INCREMENT,
  `id_documento`  INT(11) NOT NULL,
  `fecha_acceso`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dispositivo`   VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id_acceso`),
  KEY `fk_acceso_documento` (`id_documento`),
  CONSTRAINT `fk_acceso_documento` FOREIGN KEY (`id_documento`)
    REFERENCES `documentos` (`id_documento`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- ENCUESTAS
-- ------------------------------------------------------------
CREATE TABLE `encuesta` (
  `id_encuesta`    INT(11) NOT NULL AUTO_INCREMENT,
  `id_usuario`     INT(11) DEFAULT NULL,
  `titulo`         VARCHAR(150) NOT NULL,
  `descripcion`    VARCHAR(255) DEFAULT NULL,
  `calificacion`   VARCHAR(50) DEFAULT NULL,
  `comentarios`    TEXT DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_cierre`   DATETIME DEFAULT NULL,
  `activo`         TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_encuesta`),
  KEY `fk_encuesta_usuario` (`id_usuario`),
  CONSTRAINT `fk_encuesta_usuario` FOREIGN KEY (`id_usuario`)
    REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- PREGUNTAS DE ENCUESTA
-- ------------------------------------------------------------
CREATE TABLE `preguntas_encuesta` (
  `id_pregunta`    INT(11) NOT NULL AUTO_INCREMENT,
  `id_encuesta`    INT(11) NOT NULL,
  `descripcion`    VARCHAR(255) DEFAULT NULL,
  `tipo_respuesta` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id_pregunta`),
  KEY `fk_pregunta_encuesta` (`id_encuesta`),
  CONSTRAINT `fk_pregunta_encuesta` FOREIGN KEY (`id_encuesta`)
    REFERENCES `encuesta` (`id_encuesta`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- ELEMENTOS / DATOS CLINICOS DEL TRASLADO
-- ------------------------------------------------------------
CREATE TABLE `elemento` (
  `ci_paciente`   INT(11) NOT NULL,
  `id_traslado`   INT(11) DEFAULT NULL,
  `info_clinica`  VARCHAR(255) DEFAULT NULL,
  `descripcion`   VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`ci_paciente`),
  KEY `fk_elemento_traslado` (`id_traslado`),
  CONSTRAINT `fk_elemento_traslado` FOREIGN KEY (`id_traslado`)
    REFERENCES `traslado` (`id_traslado`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
--  DATOS DE DEMOSTRACIÓN
-- ============================================================

-- Usuarios (contraseñas con password_hash / bcrypt)
INSERT INTO `usuario` (`cedula`,`nombre`,`apellido`,`email`,`password`,`rol`,`telefono`,`ultimo_acceso`) VALUES
('12345678','Matias','Lobrego','matias@hospital.com','$2y$10$XvSF/qWn9OfdXBCloE1rie2ZoBFbldPpwsGC3aSlioqwGBhLGcdFy','chofer','099 111 222','2026-11-09 12:00:24'),
('11111111','Admin','Sistema','admin@hospital.com','$2y$10$l392g.eO89s8IhS3JbCa3udvT40M6MzVb68qwrektKX9BfVrOjF32','administrador','099 000 111',NULL),
('22222222','Laura','Méndez','medico@hospital.com','$2y$10$iUoNfOwvStCtDmOacBvMBegYwVhrrefP1G8g/Ie.kbOjRvD9xK68m','medico','099 333 444',NULL),
('33333333','Carlos','Rodríguez','chofer@hospital.com','$2y$10$tilw5Kgy9ybbGfpZA.QH7ewRVpqzVxltfLyyx9nurKmtvSeNfZcw2','chofer','099 555 666',NULL),
('44444444','Ana','Torres','ana@hospital.com','$2y$10$m72pBy0.B8on9pS4pqx56Oqzc02HxIA3JYlDDR4BOXaWV0B5edhS.','paciente','099 777 888',NULL);

-- Ambulancias
INSERT INTO `ambulancia` (`matricula`,`modelo`,`disponibilidad`,`ultimo_mantenimiento`) VALUES
('SAB-1234','Mercedes-Benz Sprinter','Disponible','2026-09-01 08:00:00'),
('SAB-5678','Renault Master','En traslado','2026-08-15 09:30:00'),
('SAB-9012','Ford Transit','Mantenimiento','2026-07-20 10:00:00'),
('SAB-4321','Peugeot Boxer','Disponible','2026-10-05 11:15:00');

-- Choferes
INSERT INTO `chofer` (`id_usuario`,`telefono`,`disponibilidad`) VALUES
(4,'099 555 666','Disponible'),
(1,'099 111 222','Disponible'),
(NULL,'097 222 333','Ocupado');

-- Traslados
INSERT INTO `traslado` (`id_usuario`,`id_ambulancia`,`id_chofer`,`origen`,`destino`,`acompanante`,`hora_salida`,`hora_llegada`,`estado`) VALUES
(5,2,1,'Hospital de Clínicas','Sanatorio Americano','Jorge Pérez',DATE_SUB(NOW(), INTERVAL 2 HOUR),NULL,'En curso'),
(5,1,2,'Hospital de Clínicas','Policlínica Municipal','Sin acompañante',DATE_SUB(NOW(), INTERVAL 1 DAY),DATE_SUB(NOW(), INTERVAL 23 HOUR),'Completado'),
(3,4,1,'Clínica del Este','Hospital de Clínicas','María Gómez',DATE_SUB(NOW(), INTERVAL 3 HOUR),DATE_SUB(NOW(), INTERVAL 2 HOUR),'Completado'),
(2,3,NULL,'Hospital de Clínicas','Centro de Rehabilitación','',NULL,NULL,'Pendiente'),
(5,1,2,'Hospital de Clínicas','Aeropuerto de Carrasco','Luis Silva',DATE_SUB(NOW(), INTERVAL 5 HOUR),DATE_SUB(NOW(), INTERVAL 4 HOUR),'Completado');

-- Categorías de documento
INSERT INTO `categoria_documento` (`nombre_categoria`,`descripcion`) VALUES
('Historia Clínica','Registros clínicos de pacientes'),
('Informe Médico','Informes y estudios médicos'),
('Mantenimiento','Documentación de la flota de ambulancias'),
('Certificado','Certificados y constancias');

-- Documentos
INSERT INTO `documentos` (`id_usuario`,`titulo`,`tipo_documento`,`descripcion`,`ruta_archivo`) VALUES
(3,'Historia Clínica - Ana Torres','historia_clinica','Antecedentes y evolución de la paciente.','documentos/hc_ana_torres.pdf'),
(3,'Informe de Traslado #2','informe_traslado','Informe del traslado a Policlínica Municipal.','documentos/informe_traslado_2.pdf'),
(3,'Certificado Médico - Ana Torres','certificado','Certificado de aptitud física.','documentos/certificado_ana.pdf'),
(2,'Mantenimiento Ambulancia SAB-9012','mantenimiento','Service preventivo de la unidad Ford Transit.','documentos/mantenimiento_sab9012.pdf');

-- Accesos a documentos
INSERT INTO `acceso_documento` (`id_documento`,`dispositivo`) VALUES
(1,'PC Recepción'),
(2,'Móvil Android'),
(3,'Tablet Enfermería'),
(1,'PC Recepción');

-- Encuestas
INSERT INTO `encuesta` (`id_usuario`,`titulo`,`descripcion`,`calificacion`,`comentarios`,`activo`) VALUES
(5,'Atención en traslado','Atención recibida durante el traslado','Excelente','Muy buena atención y puntualidad.','1'),
(5,'Tiempo de espera','Tiempo de espera para el traslado','Buena','Esperé un poco, pero el servicio fue correcto.','1'),
(3,'Trato del personal','Trato del personal de la ambulancia','Excelente','Excelente trato y profesionalismo.','1'),
(2,'Limpieza de la unidad','Estado de limpieza de la ambulancia','Regular','La unidad podría estar más limpia.','1');

-- Preguntas de encuesta
INSERT INTO `preguntas_encuesta` (`id_encuesta`,`descripcion`,`tipo_respuesta`) VALUES
(1,'¿Cómo califica la puntualidad del servicio?','escala'),
(1,'¿Recomendaría el servicio?','si_no'),
(2,'¿Cuánto tiempo esperó?','texto'),
(4,'¿La unidad estaba limpia?','si_no');

-- Elementos clínicos
INSERT INTO `elemento` (`ci_paciente`,`id_traslado`,`info_clinica`,`descripcion`) VALUES
(45678901,1,'Paciente estable, monitoreo cardíaco','Oxígeno suplementario'),
(45678902,2,'Fractura de cadera','Inmovilización y analgesia');
