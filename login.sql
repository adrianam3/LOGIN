-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-08-2025 a las 06:26:17
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `login`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `idPersona` int(11) NOT NULL,
  `cedula` varchar(150) NOT NULL,
  `nombres` varchar(150) NOT NULL,
  `apellidos` varchar(150) NOT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(150) DEFAULT NULL,
  `extension` varchar(15) DEFAULT NULL,
  `celular` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `fechaCreacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fechaModificacion` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`idPersona`, `cedula`, `nombres`, `apellidos`, `direccion`, `telefono`, `extension`, `celular`, `email`, `estado`, `fechaCreacion`, `fechaModificacion`) VALUES
(1, 'piZM+zV2s8zHdrVALR9Cng==', 'Adrian Adolfo', 'Merlo Arcos', 'Ibarra', 'kbNaV1TGC4xBsj8qy6fXcQ==', '', 'zZf9GZD5XI8b+Kfr+wNecg==', 'adrian.merlo.am3+1@gmail.com', 1, '2023-08-15 15:00:00', '2025-04-11 09:32:33'),
(2, 'N298fbvL1eB4n0lowVKaDA==', 'Sebastian Cedillo', 'Coordinador', 'Calle Falsa 456', 'iOytMg/W5JL0xXnGmgMFag==', '102', 'DNj8N2svSorXhyesYTJnfA==', 'adrian.merlo.am3+2@gmail.com', 1, '2023-08-16 15:00:00', '2023-09-01 15:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `idPersona` int(11) NOT NULL,
  `idAreaU` int(11) NOT NULL,
  `idRol` int(11) NOT NULL,
  `idCargoU` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `fechaCreacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fechaModificacion` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `usuario`, `password`, `descripcion`, `idPersona`, `idAreaU`, `idRol`, `idCargoU`, `estado`, `fechaCreacion`, `fechaModificacion`) VALUES
(1, 'USER1Administrador', '$2y$10$LT8GqMrlopkbQQLpfzC6RurM7/hNbFIFjzWj8WfxBfseWBGlnbw4K', '', 1, 3, 1, 1, 1, '2024-09-05 06:25:49', '2024-09-21 07:08:38'),
(2, 'USER1Coordinador', '$2y$10$22I82Rd1DbMSn1b5X9cLd.VRbH.btc1DhksBce6BxQDL2VPOP5ipO', '', 2, 3, 4, 1, 1, '2024-09-05 06:27:35', '2024-09-09 13:52:59');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
