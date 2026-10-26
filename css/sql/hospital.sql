-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-09-2026 a las 17:19:44
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hospital`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acceso_documento`
--

CREATE TABLE `acceso_documento` (
  `id_acceso` int(11) NOT NULL,
  `fecha_acceso` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `dispositivo` varchar(255) DEFAULT NULL,
  `id_documento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ambulancia`
--

CREATE TABLE `ambulancia` (
  `id_ambulancia` int(11) NOT NULL,
  `matricula` varchar(255) DEFAULT NULL,
  `disponibilidad` varchar(255) DEFAULT NULL,
  `ulitimo_mantenimiento` datetime DEFAULT NULL,
  `id_traslado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_documento`
--

CREATE TABLE `categoria_documento` (
  `id_categoria` int(11) NOT NULL,
  `nombre_catgoria` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `id_documento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chofer`
--

CREATE TABLE `chofer` (
  `id_chofer` int(11) NOT NULL,
  `disponibilidad` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `id_traslado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
--

CREATE TABLE `documentos` (
  `id_documento` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `tipo_documento` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `qr_codigo` blob DEFAULT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `elemento`
--

CREATE TABLE `elemento` (
  `ci_paciente` int(11) NOT NULL,
  `imfo_clinica` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `id_traslado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encuesta`
--

CREATE TABLE `encuesta` (
  `id_encuesta` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `fecha_cierre` datetime DEFAULT NULL,
  `activo` varchar(255) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas_encuesta`
--

CREATE TABLE `preguntas_encuesta` (
  `id_pregunta` int(11) NOT NULL,
  `tipo_respuesta` varchar(255) DEFAULT NULL,
  `descripción` varchar(255) DEFAULT NULL,
  `id_encuesta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `traslado`
--

CREATE TABLE `traslado` (
  `id_traslado` int(11) NOT NULL,
  `hora_salida` datetime DEFAULT NULL,
  `hora_llegada` datetime DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `acompañante` varchar(255) DEFAULT NULL,
  `origen` varchar(255) DEFAULT NULL,
  `destino` varchar(255) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` char(50) DEFAULT NULL,
  `apellido` char(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `rol` varchar(255) DEFAULT NULL,
  `ultimo_acceso` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `acceso_documento`
--
ALTER TABLE `acceso_documento`
  ADD PRIMARY KEY (`id_acceso`),
  ADD KEY `id_documento` (`id_documento`);

--
-- Indices de la tabla `ambulancia`
--
ALTER TABLE `ambulancia`
  ADD PRIMARY KEY (`id_ambulancia`),
  ADD KEY `id_traslado` (`id_traslado`);

--
-- Indices de la tabla `categoria_documento`
--
ALTER TABLE `categoria_documento`
  ADD PRIMARY KEY (`id_categoria`),
  ADD KEY `id_documento` (`id_documento`);

--
-- Indices de la tabla `chofer`
--
ALTER TABLE `chofer`
  ADD PRIMARY KEY (`id_chofer`);

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id_documento`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `elemento`
--
ALTER TABLE `elemento`
  ADD PRIMARY KEY (`ci_paciente`),
  ADD KEY `id_traslado` (`id_traslado`);

--
-- Indices de la tabla `encuesta`
--
ALTER TABLE `encuesta`
  ADD PRIMARY KEY (`id_encuesta`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `preguntas_encuesta`
--
ALTER TABLE `preguntas_encuesta`
  ADD PRIMARY KEY (`id_pregunta`),
  ADD KEY `id_encuesta` (`id_encuesta`);

--
-- Indices de la tabla `traslado`
--
ALTER TABLE `traslado`
  ADD PRIMARY KEY (`id_traslado`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `acceso_documento`
--
ALTER TABLE `acceso_documento`
  ADD CONSTRAINT `acceso_documento_ibfk_1` FOREIGN KEY (`id_documento`) REFERENCES `documentos` (`id_documento`);

--
-- Filtros para la tabla `ambulancia`
--
ALTER TABLE `ambulancia`
  ADD CONSTRAINT `ambulancia_ibfk_1` FOREIGN KEY (`id_traslado`) REFERENCES `traslado` (`id_traslado`);

--
-- Filtros para la tabla `categoria_documento`
--
ALTER TABLE `categoria_documento`
  ADD CONSTRAINT `categoria_documento_ibfk_1` FOREIGN KEY (`id_documento`) REFERENCES `documentos` (`id_documento`);

--
-- Filtros para la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `elemento`
--
ALTER TABLE `elemento`
  ADD CONSTRAINT `elemento_ibfk_1` FOREIGN KEY (`id_traslado`) REFERENCES `traslado` (`id_traslado`);

--
-- Filtros para la tabla `encuesta`
--
ALTER TABLE `encuesta`
  ADD CONSTRAINT `encuesta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `preguntas_encuesta`
--
ALTER TABLE `preguntas_encuesta`
  ADD CONSTRAINT `preguntas_encuesta_ibfk_1` FOREIGN KEY (`id_encuesta`) REFERENCES `encuesta` (`id_encuesta`);

--
-- Filtros para la tabla `traslado`
--
ALTER TABLE `traslado`
  ADD CONSTRAINT `traslado_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `traslado_ibfk_2` FOREIGN KEY (`id_traslado`) REFERENCES `chofer` (`id_chofer`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
