-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: srca
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores` (
  `usuario` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  PRIMARY KEY (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores`
--

LOCK TABLES `administradores` WRITE;
/*!40000 ALTER TABLE `administradores` DISABLE KEYS */;
/*!40000 ALTER TABLE `administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_de_control` varchar(8) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `curso` varchar(255) NOT NULL,
  `poblacion` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefonos` varchar(20) NOT NULL,
  `curp` varchar(18) NOT NULL,
  `estatus` varchar(20) NOT NULL,
  `alergico` varchar(255) DEFAULT NULL,
  `contacto_accidente` varchar(255) DEFAULT NULL,
  `telefonos_contacto` varchar(255) DEFAULT NULL,
  `nombre_autorizado` varchar(255) DEFAULT NULL,
  `curp_autorizado` varchar(18) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_de_control` (`numero_de_control`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos`
--

LOCK TABLES `alumnos` WRITE;
/*!40000 ALTER TABLE `alumnos` DISABLE KEYS */;
INSERT INTO `alumnos` VALUES (1,'20240632','martina','2025-04-04','topicos','leon','renacimiento 131','emailejemplo@gmail.com','4771428882','VIRC021222MGTZML','activo','flor de muerto','angelica','4773966144','claudia','VIRC021222MGTZMLA3'),(3,'20240634','jesus','2025-04-03','topicos','leon','renacimiento 131','emailejemplo@gmail.com','4771428882','VIRC021222MGTZML','activo','flor de muerto','angelica','4775401498','juan','VIRC021222MGTZML'),(4,'20240635','cristo','2025-04-14','topicos','leon','renacimiento 131','emailejemplo@gmail.com','4771428882','VIRC021222MGTZML','activo','flor de muerto','angelica','4771428882','juan','VIRC021222MGTZML'),(7,'20240639','martines','2025-04-10','topicos','leon','renacimiento 131','emailejemplo@gmail.com','4771428882','VIRC021222MGTZML','activo','flor de muerto','angelica','4771428880','juan','VIRC021222MGTZML'),(8,'20240640','andrea','2025-04-05','ingenieria en sistemas computacionales','leon','renacimiento 131','emailejemplo@gmail.com','4771428882','VIRC021222MGTZML','activo','flor de muerto','angelica','4771428880','juan','VIRC021222MGTZML');
/*!40000 ALTER TABLE `alumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alumnos_eliminados`
--

DROP TABLE IF EXISTS `alumnos_eliminados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnos_eliminados` (
  `id` int NOT NULL,
  `numero_de_control` varchar(8) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `curso` varchar(255) NOT NULL,
  `poblacion` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefonos` varchar(20) NOT NULL,
  `curp` varchar(18) NOT NULL,
  `estatus` varchar(20) NOT NULL,
  `alergico` varchar(255) DEFAULT NULL,
  `contacto_accidente` varchar(255) DEFAULT NULL,
  `telefonos_contacto` varchar(255) DEFAULT NULL,
  `nombre_autorizado` varchar(255) DEFAULT NULL,
  `curp_autorizado` varchar(18) DEFAULT NULL,
  `fecha_eliminacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos_eliminados`
--

LOCK TABLES `alumnos_eliminados` WRITE;
/*!40000 ALTER TABLE `alumnos_eliminados` DISABLE KEYS */;
INSERT INTO `alumnos_eliminados` VALUES (2,'20240633','martines','2025-04-01','topicos','leon','renacimiento 131','emailejemplo@gmail.com','4771428882','VIRC021222MGTZML','activo','flor de muerto','angelica','4771428880','juan','VIRC021222MGTZML','2025-04-28 05:05:18'),(5,'20240636','pepe','2025-04-08','topicos','leon','renacimiento 131','emailejemplo@gmail.com','4771428882','VIRC021222MGTZML','activo','flor de muerto','claudia','4771428880','claudia','VIRC021222MGTZML','2025-04-29 05:22:03'),(6,'20240637','ingenieria de sofware','2025-04-04','ingenieria de software ','leon','renacimiento 131','emailejemplo@gmail.com','4771428882','VIRC021222MGTZML','activo','flor de muerto','angelica','4775401498','juan','VIRC021222MGTZML','2025-04-29 18:50:13');
/*!40000 ALTER TABLE `alumnos_eliminados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calificaciones`
--

DROP TABLE IF EXISTS `calificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alumno_nombre` varchar(255) NOT NULL,
  `numero_de_control` varchar(8) NOT NULL,
  `materia_id` int NOT NULL,
  `calificacion` float NOT NULL,
  `profesor_id` varchar(8) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `materia_id` (`materia_id`),
  KEY `numero_de_control` (`numero_de_control`),
  KEY `profesor_id` (`profesor_id`),
  CONSTRAINT `calificaciones_ibfk_1` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`),
  CONSTRAINT `calificaciones_ibfk_2` FOREIGN KEY (`numero_de_control`) REFERENCES `alumnos` (`numero_de_control`),
  CONSTRAINT `calificaciones_ibfk_3` FOREIGN KEY (`profesor_id`) REFERENCES `profesores` (`numero_de_control`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calificaciones`
--

LOCK TABLES `calificaciones` WRITE;
/*!40000 ALTER TABLE `calificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `calificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materias`
--

DROP TABLE IF EXISTS `materias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materias`
--

LOCK TABLES `materias` WRITE;
/*!40000 ALTER TABLE `materias` DISABLE KEYS */;
/*!40000 ALTER TABLE `materias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesores`
--

DROP TABLE IF EXISTS `profesores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesores` (
  `numero_de_control` varchar(8) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `especialidad` varchar(255) NOT NULL,
  PRIMARY KEY (`numero_de_control`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesores`
--

LOCK TABLES `profesores` WRITE;
/*!40000 ALTER TABLE `profesores` DISABLE KEYS */;
/*!40000 ALTER TABLE `profesores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesores_eliminados`
--

DROP TABLE IF EXISTS `profesores_eliminados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesores_eliminados` (
  `numero_de_control` varchar(8) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `especialidad` varchar(255) NOT NULL,
  `fecha_eliminacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesores_eliminados`
--

LOCK TABLES `profesores_eliminados` WRITE;
/*!40000 ALTER TABLE `profesores_eliminados` DISABLE KEYS */;
/*!40000 ALTER TABLE `profesores_eliminados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salones`
--

DROP TABLE IF EXISTS `salones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `capacidad` int NOT NULL,
  `profesor_id` varchar(8) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `profesor_id` (`profesor_id`),
  CONSTRAINT `salones_ibfk_1` FOREIGN KEY (`profesor_id`) REFERENCES `profesores` (`numero_de_control`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salones`
--

LOCK TABLES `salones` WRITE;
/*!40000 ALTER TABLE `salones` DISABLE KEYS */;
/*!40000 ALTER TABLE `salones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-29 14:40:09
