-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: alhisan
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Admin`
--

DROP TABLE IF EXISTS `Admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(150) NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `updateat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `Admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Systemsetting`
--

DROP TABLE IF EXISTS `Systemsetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Systemsetting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolname` varchar(150) NOT NULL,
  `schoolphone` varchar(20) DEFAULT NULL,
  `adminphone` varchar(20) DEFAULT NULL,
  `schoollatitude` decimal(10,8) DEFAULT NULL,
  `schoollongitude` decimal(11,8) DEFAULT NULL,
  `adminid` int DEFAULT NULL,
  `workstarttime` time DEFAULT NULL,
  `workendtime` time DEFAULT NULL,
  `updatedat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `adminid` (`adminid`),
  CONSTRAINT `Systemsetting_ibfk_1` FOREIGN KEY (`adminid`) REFERENCES `Admin` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Systemsetting`
--

LOCK TABLES `Systemsetting` WRITE;
/*!40000 ALTER TABLE `Systemsetting` DISABLE KEYS */;
INSERT INTO `Systemsetting` VALUES (1,'Alihsan Girls Secondary School','0712345678','0712345678',-6.79240000,39.20830000,NULL,'08:00:00','17:00:00','2026-09-15 11:40:31');
/*!40000 ALTER TABLE `Systemsetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendanceid` int NOT NULL AUTO_INCREMENT,
  `employeeid` int NOT NULL,
  `checkin` datetime DEFAULT NULL,
  `checkout` datetime DEFAULT NULL,
  `checkout_latitude` decimal(10,8) DEFAULT NULL,
  `checkout_longitude` decimal(11,8) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'PRESENT',
  PRIMARY KEY (`attendanceid`),
  KEY `employeeid` (`employeeid`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employeeid`) REFERENCES `employee` (`employeeid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,1,'2026-09-15 08:00:00','2026-09-15 17:00:00',-6.79240000,39.20830000,'PRESENT'),(3,2,'2026-09-15 14:00:00','2026-09-15 17:00:00',-6.79240000,39.20830000,'PRESENT'),(4,1,'2026-09-16 09:21:31','2026-09-16 09:22:09',-6.19931710,39.30781000,'PRESENT'),(5,2,'2026-09-16 10:13:58','2026-09-16 10:22:42',-6.19931730,39.30780710,'PRESENT'),(6,3,'2026-09-16 13:37:56','2026-09-16 14:11:05',-6.19931050,39.30781350,'PRESENT');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biometric`
--

DROP TABLE IF EXISTS `biometric`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biometric` (
  `biometricid` int NOT NULL AUTO_INCREMENT,
  `employeeid` int NOT NULL,
  `fingerprintid` varchar(100) NOT NULL,
  `fingername` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE',
  `registeredat` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`biometricid`),
  KEY `employeeid` (`employeeid`),
  CONSTRAINT `biometric_ibfk_1` FOREIGN KEY (`employeeid`) REFERENCES `employee` (`employeeid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biometric`
--

LOCK TABLES `biometric` WRITE;
/*!40000 ALTER TABLE `biometric` DISABLE KEYS */;
INSERT INTO `biometric` VALUES (1,1,'FP001-MUSA','Right Thumb','ACTIVE','2026-09-15 11:39:33');
/*!40000 ALTER TABLE `biometric` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employeeid` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `hiredate` date DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE',
  `createdat` date DEFAULT NULL,
  `updateat` date DEFAULT NULL,
  PRIMARY KEY (`employeeid`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'Musa','Mussa','musa@example.com','0712345678','IT','Software Developer','2026-09-15','musa123','123456','ACTIVE',NULL,NULL),(2,'John','Peter','john@example.com','0712345678','HR','HR Officer','2026-09-15','john123','123456','ACTIVE',NULL,NULL),(3,'texas','matupa','texas@email.com','0612260041','Teaching','developer officer','2019-07-09','texasmatupa123','123456','ACTIVE',NULL,NULL);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-16 14:20:34
