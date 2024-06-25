-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: localhost    Database: Car_Info
-- ------------------------------------------------------
-- Server version	8.0.37-0ubuntu0.22.04.3

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
-- Table structure for table `Brand`
--

DROP TABLE IF EXISTS `Brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Brand` (
  `brandId` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `countryOfOrigin` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`brandId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Brand`
--

LOCK TABLES `Brand` WRITE;
/*!40000 ALTER TABLE `Brand` DISABLE KEYS */;
INSERT INTO `Brand` VALUES (8,'Honda','Japan','honda.jpg'),(9,'Toyota','Japan','toyota.jpeg'),(10,'Suzuki','Japan','Suzuki.jpg'),(14,'Mazda','Japan','mazda.png'),(15,'Chevrolet','USA','cheverlot.jpg'),(16,'Hyundai','Korea','hyundai.gif');
/*!40000 ALTER TABLE `Brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Car`
--

DROP TABLE IF EXISTS `Car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Car` (
  `Carid` int NOT NULL AUTO_INCREMENT,
  `modelid` int DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `transmission` varchar(50) DEFAULT NULL,
  `engine_size` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Carid`),
  KEY `modelid` (`modelid`),
  CONSTRAINT `Car_ibfk_1` FOREIGN KEY (`modelid`) REFERENCES `Model` (`modelId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Car`
--

LOCK TABLES `Car` WRITE;
/*!40000 ALTER TABLE `Car` DISABLE KEYS */;
INSERT INTO `Car` VALUES (5,10,'Very Nice Car',4000000.00,'Manual','1500'),(6,11,'Very Nice Car',4500000.00,'Automatic','1500'),(7,12,'Very Nice Car',8000000.00,'Automatic','1800'),(8,13,'Better comfort than civic',6500000.00,'Automatic','1800'),(9,14,'The 2nd Generation of Toyota Mark X was released in October 2009. Toyota Mark X 2nd Generation featured a redesigned exterior that featured a much more aggressive design language compared to the 1st Generation Mark X. It is one of the few sedans from Toyota that features rear wheel drive as the car is based on the same platform as the Lexus GS. Toyota Mark X is generally seen as a car for people who want the practicality and size of a Camry but want to enjoy the advantages that come with RWD or AWD.\r\nExterior\r\n\r\nToyota Mark X 2nd Generation features a much sleeker and angular exterior compared to the 1st Generation Toyota Mark X. The front fascia features sleek angular upswept headlights that are incorporated into the design of the chrome grille which houses the X logo in the center. The Bumper has a wide trapezium shaped opening that is flanked by standard circular fog lights. The rear end of the car borrows certain design cues from its high-end Lexus counterparts such as the sideswept aggressively styled taillights connected by a chrome bar running across the trunk, dual exhaust tips and a lip spoiler. All these aspects combine together to the give the 2nd Generation Mark X a very muscular and sporty vibe.\r\nInterior\r\n\r\nThe interior of the 2009 Mark X features the use of plastic trim pieces that is complemented by silver polished metal trim pieces. The seats are covered in a choice of sand beige or black Alcantara. Standard features on the car include a multifunction steering wheel that houses media and cruise controls, dual zone automatic climate control, a touch screen infotainment system with satellite navigation, a six speaker stereo system with CD, radio, aux and USB inputs. On the higher end models you get features such as wood grain trim, millimetre-wave radar system for the cruise control and \"pre-crash safety system\" with brake activation, Plated decorative mat on the front guards and front lower grille area, leather covered seats, Super UV cut glass and nanoE air ventilation system, retractable rear sunshade, fully automatic self-parking, Driver\'s power 8-way adjustable seat + passenger 4-way power seat with inbuilt heating and cooling.',3099997.00,'Automatic','2500');
/*!40000 ALTER TABLE `Car` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Feedback`
--

DROP TABLE IF EXISTS `Feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Feedback` (
  `feedbackId` int NOT NULL AUTO_INCREMENT,
  `brandId` int DEFAULT NULL,
  `modelId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`feedbackId`),
  KEY `brandId` (`brandId`),
  KEY `modelId` (`modelId`),
  KEY `fk_user` (`userId`),
  CONSTRAINT `Feedback_ibfk_1` FOREIGN KEY (`brandId`) REFERENCES `Brand` (`brandId`),
  CONSTRAINT `Feedback_ibfk_2` FOREIGN KEY (`modelId`) REFERENCES `Model` (`modelId`),
  CONSTRAINT `fk_user` FOREIGN KEY (`userId`) REFERENCES `users` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Feedback`
--

LOCK TABLES `Feedback` WRITE;
/*!40000 ALTER TABLE `Feedback` DISABLE KEYS */;
INSERT INTO `Feedback` VALUES (7,8,NULL,'Haroon Tahir','Honda used to be sporty but is now lame.',7),(8,8,NULL,'Shajee','Pathetic Brand',12),(9,NULL,12,'Haroon Tahir','Honda civic now worth the price it is set on now',7),(10,NULL,13,'Shajee','Never using this trash again.',12),(11,NULL,12,'Shajee','Very nice Car',12),(12,NULL,12,'hafiz','I like corolla better.',8),(13,8,NULL,'Asad Shakeel','Toyota Better',14),(14,NULL,10,'Asad Shakeel','lame car',14),(15,9,NULL,'Asad Shakeel','cool brand',14),(16,NULL,13,'Asad Shakeel','nice car',14),(17,9,NULL,'Haroon Tahir','cool brand',7),(18,10,NULL,'Haroon Tahir','lame',7),(19,14,NULL,'Haroon Tahir','cool',7),(20,NULL,14,'hafiz','People who own this car in 2024 are dumb.',8);
/*!40000 ALTER TABLE `Feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Model`
--

DROP TABLE IF EXISTS `Model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Model` (
  `modelId` int NOT NULL AUTO_INCREMENT,
  `brandId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `model` varchar(255) DEFAULT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`modelId`),
  KEY `brandId` (`brandId`),
  CONSTRAINT `Model_ibfk_1` FOREIGN KEY (`brandId`) REFERENCES `Brand` (`brandId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Model`
--

LOCK TABLES `Model` WRITE;
/*!40000 ALTER TABLE `Model` DISABLE KEYS */;
INSERT INTO `Model` VALUES (10,8,'Honda City','2016','GLX','honda-city.jpg'),(11,8,'Honda City','2016','GLX','honda-city.jpg'),(12,8,'Honda Civic','2024','Turbo','Honda_Civic.jpg'),(13,9,'Corolla','2024','XE','corolla.jpeg'),(14,9,'Mark X','2009','250G','MarkX.jpg');
/*!40000 ALTER TABLE `Model` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Mods`
--

DROP TABLE IF EXISTS `Mods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Mods` (
  `modId` int NOT NULL AUTO_INCREMENT,
  `CarId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`modId`),
  KEY `CarId` (`CarId`),
  CONSTRAINT `Mods_ibfk_1` FOREIGN KEY (`CarId`) REFERENCES `Car` (`Carid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Mods`
--

LOCK TABLES `Mods` WRITE;
/*!40000 ALTER TABLE `Mods` DISABLE KEYS */;
INSERT INTO `Mods` VALUES (1,7,'Spoiler',20000.00),(2,7,'Rims',50000.00),(3,7,'FogLamps',5000.00),(4,5,'Rimms',100000.00);
/*!40000 ALTER TABLE `Mods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserId` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `EmailAddress` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `EmailAddress` (`EmailAddress`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'Shajee','shajee@mail.com','$2b$12$LGJqZPsb7CJvrLtu9INO/eUMyPnvPjq1CYgldqOmM//kumPkxQ04e',0),(7,'Haroon Tahir','Haroon152018@gmail.com','$2b$12$R1FDOjIpTU9bWfsvYBqV/.z.57vUBfBs570pggR81sewgRH0BRq/e',1),(8,'hafiz','hafiz@mail.com','$2b$12$SnInuGxtMrT.foYdInGT9./hGMidU9jgfpE4Z1IWmSYsfi4Xx63.e',0),(9,'DROP TABLE','googo@mail.com','$2b$12$ntnF3L2K6fvMsgQeT8Lp6eZria82M7vjqew.htavcKCKB6OWUKFhm',0),(10,'Haroon Tahir','Haroon152018@hotmail.com','$2b$12$tH/wJWHwJFsx.oIhxbcCleB1dbUFprFTkfqCNr4MhKVOPX3YAAtG6',0),(11,'Haroon Tahir','Haroon152018@mail.com','$2b$12$tCDFKyVr0nyvJ.ekYZGpyOYdoZ1fgsIR5X2eYdwZBWv5.Mboq7pm2',0),(12,'Shajee','shajee@gmail.com','$2b$12$1lhdNAUdDKs1IMMHGgfs/OdS0zpAQ9MGvDXBIdtWQpBhRK7nAal8S',0),(13,'l,l,l','Haroo152018@gmail.com','$2b$12$CX8HAoXZRe0Qh70EFMGcGOFT6Op2Jb/RqQhNxxgoosFtgKH0sDwwW',0),(14,'Asad Shakeel','asad.shakeel@getnada.com','$2b$12$Cb.7s7kx6B.fTn5AvuE3qOMTsIwqr/8BMi.Tp.PjEBXRkKkV76lGm',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-24 23:27:54
