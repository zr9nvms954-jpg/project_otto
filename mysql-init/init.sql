CREATE DATABASE IF NOT EXISTS `car_showroom` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `car_showroom`;
-- MySQL dump 10.13  Distrib 8.0.44, for macos15 (arm64)
--
-- Host: localhost    Database: car_showroom
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!50503 SET NAMES utf8 */
;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;
/*!40103 SET TIME_ZONE='+00:00' */
;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;

SET @@SESSION.SQL_LOG_BIN = 0;

--
-- GTID state at the beginning of the backup
--

SET
    @@GLOBAL.GTID_PURGED = /*!80000 '+'*/ 'ed58cdd6-f2e9-11f0-86b3-f253cbfe9a09:1-177';

--
-- Table structure for table `cars_audi`
--

DROP TABLE IF EXISTS `cars_audi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `cars_audi` (
    `car_id` int NOT NULL AUTO_INCREMENT,
    `car_name` varchar(150) NOT NULL,
    `price` decimal(15, 2) NOT NULL,
    `image_url` varchar(255) DEFAULT NULL,
    `description` text,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`car_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 15 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `cars_audi`
--

LOCK TABLES `cars_audi` WRITE;
/*!40000 ALTER TABLE `cars_audi` DISABLE KEYS */
;
INSERT INTO
    `cars_audi`
VALUES (
        1,
        'Audi A8 L',
        6000000000.00,
        '/images/audi/a8-l.jpg',
        'Sedan hạng sang cao cấp',
        '2026-09-22 14:32:30'
    ),
    (
        2,
        'Audi R8 V10 Performance',
        12000000000.00,
        '/images/audi/r8-v10.jpg',
        'Siêu xe thể thao V10',
        '2026-09-22 14:32:30'
    ),
    (
        3,
        'Audi RS7 Sportback',
        10500000000.00,
        '/images/audi/rs7-sportback.jpg',
        'Sportback hiệu năng cao',
        '2026-09-22 14:32:30'
    ),
    (
        4,
        'Audi TT 20th Anniversary Edition',
        4500000000.00,
        '/images/audi/tt-20th.jpg',
        'Phiên bản kỷ niệm 20 năm',
        '2026-09-22 14:32:30'
    ),
    (
        5,
        'Audi A4 Sedan',
        1800000000.00,
        '/images/audi/a4-sedan.jpg',
        'Sedan hạng sang cỡ nhỏ',
        '2026-09-22 14:32:30'
    ),
    (
        6,
        'Audi RS5 Coupe',
        4650000000.00,
        '/images/audi/rs5-coupe.jpg',
        'Coupe thể thao hiệu năng cao',
        '2026-09-22 14:32:30'
    ),
    (
        7,
        'Audi A3 Sportback',
        1550000000.00,
        '/images/audi/a3-sportback.jpg',
        'Hatchback hạng sang',
        '2026-09-22 14:32:30'
    ),
    (
        8,
        'Audi A5 Sportback',
        2500000000.00,
        '/images/audi/a5-sportback.jpg',
        'Sportback kiểu dáng thể thao',
        '2026-09-22 14:32:30'
    ),
    (
        9,
        'Audi A6 Sedan',
        2800000000.00,
        '/images/audi/a6-sedan.jpg',
        'Sedan hạng sang cỡ trung',
        '2026-09-22 14:32:30'
    ),
    (
        10,
        'Audi A7 Sportback',
        3900000000.00,
        '/images/audi/a7-sportback.jpg',
        'Sportback hạng sang',
        '2026-09-22 14:32:30'
    ),
    (
        11,
        'Audi Q3 SUV',
        1950000000.00,
        '/images/audi/q3-suv.jpg',
        'SUV đô thị nhỏ gọn',
        '2026-09-22 14:32:30'
    ),
    (
        12,
        'Audi Q5 SUV',
        2780000000.00,
        '/images/audi/q5-suv.jpg',
        'SUV hạng sang cỡ trung',
        '2026-09-22 14:32:30'
    ),
    (
        13,
        'Audi Q7 SUV',
        3800000000.00,
        '/images/audi/q7-suv.jpg',
        'SUV 7 chỗ hạng sang',
        '2026-09-22 14:32:30'
    ),
    (
        14,
        'Audi Q8 Coupe SUV',
        4700000000.00,
        '/images/audi/q8-coupe-suv.jpg',
        'SUV Coupe hạng sang đỉnh cao',
        '2026-09-22 14:32:30'
    );
/*!40000 ALTER TABLE `cars_audi` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `cars_bmw`
--

DROP TABLE IF EXISTS `cars_bmw`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `cars_bmw` (
    `car_id` int NOT NULL AUTO_INCREMENT,
    `car_name` varchar(150) NOT NULL,
    `price` decimal(15, 2) NOT NULL,
    `image_url` varchar(255) DEFAULT NULL,
    `description` text,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`car_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 11 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `cars_bmw`
--

LOCK TABLES `cars_bmw` WRITE;
/*!40000 ALTER TABLE `cars_bmw` DISABLE KEYS */
;
INSERT INTO
    `cars_bmw`
VALUES (
        1,
        'BMW i9 (Concept)',
        1500000000.00,
        '/images/bmw/i9.jpg',
        'Mẫu xe Ý tưởng (Concept)',
        '2026-09-22 14:30:43'
    ),
    (
        2,
        'BMW M4 Coupe',
        5600000000.00,
        '/images/bmw/m4-coupe.jpg',
        'Dòng xe thể thao Coupe đỉnh cao',
        '2026-09-22 14:30:43'
    ),
    (
        3,
        'BMW Z4 M40i Roadster',
        3500000000.00,
        '/images/bmw/z4-m40i.jpg',
        'Dòng mui trần thể thao Roadster',
        '2026-09-22 14:30:43'
    ),
    (
        4,
        'BMW i4 M50',
        3759000000.00,
        '/images/bmw/i4-m50.jpg',
        'Dòng xe điện thể thao M Performance',
        '2026-09-22 14:30:43'
    ),
    (
        5,
        'BMW i8 Coupe',
        7800000000.00,
        '/images/bmw/i8-coupe.jpg',
        'Siêu xe Hybrid thể thao',
        '2026-09-22 14:30:43'
    ),
    (
        6,
        'BMW M2 Coupe',
        3999000000.00,
        '/images/bmw/m2-coupe.jpg',
        'Xe thể thao nhỏ gọn hiệu năng cao',
        '2026-09-22 14:30:43'
    ),
    (
        7,
        'BMW M3 Sedan',
        4800000000.00,
        '/images/bmw/m3-sedan.jpg',
        'Sedan thể thao hiệu năng cao',
        '2026-09-22 14:30:43'
    ),
    (
        8,
        'BMW M5 Sedan',
        6200000000.00,
        '/images/bmw/m5-sedan.jpg',
        'Sedan hạng sang hiệu năng cao',
        '2026-09-22 14:30:43'
    ),
    (
        9,
        'BMW M8 Competition Coupe',
        12999000000.00,
        '/images/bmw/m8-competition.jpg',
        'Siêu Coupe thể thao cao cấp nhất',
        '2026-09-22 14:30:43'
    ),
    (
        10,
        'BMW X5 M Competition',
        6900000000.00,
        '/images/bmw/x5-m.jpg',
        'SUV thể thao hiệu năng cao',
        '2026-09-22 14:30:43'
    );
/*!40000 ALTER TABLE `cars_bmw` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `cars_bugatti`
--

DROP TABLE IF EXISTS `cars_bugatti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `cars_bugatti` (
    `car_id` int NOT NULL AUTO_INCREMENT,
    `car_name` varchar(150) NOT NULL,
    `price` decimal(15, 2) NOT NULL,
    `image_url` varchar(255) DEFAULT NULL,
    `description` text,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`car_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 12 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `cars_bugatti`
--

LOCK TABLES `cars_bugatti` WRITE;
/*!40000 ALTER TABLE `cars_bugatti` DISABLE KEYS */
;
INSERT INTO
    `cars_bugatti`
VALUES (
        1,
        'Bugatti Bolide',
        115000000000.00,
        '/images/bugatti/bolide.jpg',
        'Hypercar dành riêng cho đường đua',
        '2026-09-22 14:37:21'
    ),
    (
        2,
        'Bugatti Chiron Super Sport',
        98000000000.00,
        '/images/bugatti/chiron-super-sport.jpg',
        'Siêu xe kỷ lục tốc độ thế giới',
        '2026-09-22 14:37:21'
    ),
    (
        3,
        'Bugatti Mistral',
        130000000000.00,
        '/images/bugatti/mistral.jpg',
        'Siêu xe Mui trần cuối cùng động cơ W16',
        '2026-09-22 14:37:21'
    ),
    (
        4,
        'Bugatti Tourbillon',
        105000000000.00,
        '/images/bugatti/tourbillon.jpg',
        'Hypercar Hybrid thế hệ mới',
        '2026-09-22 14:37:21'
    ),
    (
        5,
        'Bugatti Centodieci',
        210000000000.00,
        '/images/bugatti/centodieci.jpg',
        'Phiên bản giới hạn kỷ niệm EB110',
        '2026-09-22 14:37:21'
    ),
    (
        6,
        'Bugatti Chiron Standard',
        70000000000.00,
        '/images/bugatti/chiron-standard.jpg',
        'Phiên bản Chiron tiêu chuẩn',
        '2026-09-22 14:37:21'
    ),
    (
        7,
        'Bugatti Chiron Pur Sport',
        88000000000.00,
        '/images/bugatti/chiron-pur-sport.jpg',
        'Phiên bản tối ưu khả năng ôm cua',
        '2026-09-22 14:37:21'
    ),
    (
        8,
        'Bugatti Divo',
        135000000000.00,
        '/images/bugatti/divo.jpg',
        'Siêu xe tối ưu lực ép xuống đường',
        '2026-09-22 14:37:21'
    ),
    (
        9,
        'Bugatti EB110 Super Sport',
        75000000000.00,
        '/images/bugatti/eb110-super-sport.jpg',
        'Siêu xe cổ điển biểu tượng thập niên 90',
        '2026-09-22 14:37:21'
    ),
    (
        10,
        'Bugatti La Voiture Noire',
        440000000000.00,
        '/images/bugatti/la-voiture-noire.jpg',
        'Siêu xe độc bản đắt nhất thế giới',
        '2026-09-22 14:37:21'
    ),
    (
        11,
        'Bugatti Veyron 16.4',
        50000000000.00,
        '/images/bugatti/veyron-164.jpg',
        'Huyền thoại mở đầu kỷ nguyên Hypercar',
        '2026-09-22 14:37:21'
    );
/*!40000 ALTER TABLE `cars_bugatti` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `cars_ferrari`
--

DROP TABLE IF EXISTS `cars_ferrari`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `cars_ferrari` (
    `car_id` int NOT NULL AUTO_INCREMENT,
    `car_name` varchar(150) NOT NULL,
    `price` decimal(15, 2) NOT NULL,
    `image_url` varchar(255) DEFAULT NULL,
    `description` text,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`car_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `cars_ferrari`
--

LOCK TABLES `cars_ferrari` WRITE;
/*!40000 ALTER TABLE `cars_ferrari` DISABLE KEYS */
;
INSERT INTO
    `cars_ferrari`
VALUES (
        1,
        'Ferrari 12Cilindri',
        11500000000.00,
        '/images/ferrari/12cilindri.jpg',
        'Siêu xe trang bị động cơ V12 hút khí tự nhiên',
        '2026-09-22 14:34:16'
    ),
    (
        2,
        'Ferrari 296 GTB',
        21000000000.00,
        '/images/ferrari/296-gtb.jpg',
        'Siêu xe Plug-in Hybrid động cơ V6',
        '2026-09-22 14:34:16'
    ),
    (
        3,
        'Ferrari SF90 Stradale',
        34000000000.00,
        '/images/ferrari/sf90-stradale.jpg',
        'Siêu xe PHEV mạnh mẽ hàng đầu',
        '2026-09-22 14:34:16'
    ),
    (
        4,
        'Ferrari 488 Pista',
        30000000000.00,
        '/images/ferrari/488-pista.jpg',
        'Phiên bản hiệu năng cao phát triển từ 488 GTB',
        '2026-09-22 14:34:16'
    ),
    (
        5,
        'Ferrari 812 Superfast',
        26900000000.00,
        '/images/ferrari/812-superfast.jpg',
        'Siêu xe Grand Tourer động cơ V12',
        '2026-09-22 14:34:16'
    ),
    (
        6,
        'Ferrari Daytona SP3',
        55000000000.00,
        '/images/ferrari/daytona-sp3.jpg',
        'Siêu xe sản xuất giới hạn dòng Icona',
        '2026-09-22 14:34:16'
    ),
    (
        7,
        'Ferrari F8 Tributo',
        19200000000.00,
        '/images/ferrari/f8-tributo.jpg',
        'Siêu xe động cơ V8 đặt giữa',
        '2026-09-22 14:34:16'
    ),
    (
        8,
        'LaFerrari',
        85000000000.00,
        '/images/ferrari/laferrari.jpg',
        'Hypercar Hybrid biểu tượng đỉnh cao',
        '2026-09-22 14:34:16'
    ),
    (
        9,
        'Ferrari Monza SP2',
        42000000000.00,
        '/images/ferrari/monza-sp2.jpg',
        'Siêu xe thiết kế Speedster hai chỗ ngồi',
        '2026-09-22 14:34:16'
    ),
    (
        10,
        'Ferrari Portofino M',
        16500000000.00,
        '/images/ferrari/portofino-m.jpg',
        'Siêu xe mui xếp GT thể thao',
        '2026-09-22 14:34:16'
    ),
    (
        11,
        'Ferrari Purosangue',
        39000000000.00,
        '/images/ferrari/purosangue.jpg',
        'Siêu xe gầm cao 4 cửa đầu tiên của Ferrari',
        '2026-09-22 14:34:16'
    ),
    (
        12,
        'Ferrari Roma',
        15700000000.00,
        '/images/ferrari/roma.jpg',
        'Coupe phong cách cổ điển sang trọng',
        '2026-09-22 14:34:16'
    );
/*!40000 ALTER TABLE `cars_ferrari` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `cars_lamborghini`
--

DROP TABLE IF EXISTS `cars_lamborghini`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `cars_lamborghini` (
    `car_id` int NOT NULL AUTO_INCREMENT,
    `car_name` varchar(150) NOT NULL,
    `price` decimal(15, 2) NOT NULL,
    `image_url` varchar(255) DEFAULT NULL,
    `description` text,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`car_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `cars_lamborghini`
--

LOCK TABLES `cars_lamborghini` WRITE;
/*!40000 ALTER TABLE `cars_lamborghini` DISABLE KEYS */
;
INSERT INTO
    `cars_lamborghini`
VALUES (
        1,
        'Lamborghini Asterion LPI 910-4',
        45000000000.00,
        '/images/lamborghini/asterion.jpg',
        'Siêu xe Concept Plug-in Hybrid',
        '2026-09-22 14:36:02'
    ),
    (
        2,
        'Lamborghini Aventador LP 780-4 Ultimae',
        50000000000.00,
        '/images/lamborghini/aventador-ultimae.jpg',
        'Phiên bản Aventador cuối cùng',
        '2026-09-22 14:36:02'
    ),
    (
        3,
        'Lamborghini Centenario LP 770-4',
        65000000000.00,
        '/images/lamborghini/centenario.jpg',
        'Siêu xe phiên bản giới hạn đặc biệt',
        '2026-09-22 14:36:02'
    ),
    (
        4,
        'Lamborghini Countach LPI 800-4',
        75000000000.00,
        '/images/lamborghini/countach.jpg',
        'Siêu xe tái hiện lại biểu tượng Countach',
        '2026-09-22 14:36:02'
    ),
    (
        5,
        'Lamborghini Huracán Sterrato',
        28000000000.00,
        '/images/lamborghini/huracan-sterrato.jpg',
        'Siêu xe địa hình Off-road',
        '2026-09-22 14:36:02'
    ),
    (
        6,
        'Lamborghini Huracán Tecnica',
        19000000000.00,
        '/images/lamborghini/huracan-tecnica.jpg',
        'Siêu xe hiệu năng cao đa dụng',
        '2026-09-22 14:36:02'
    ),
    (
        7,
        'Lamborghini Sesto Elemento',
        80000000000.00,
        '/images/lamborghini/sesto-elemento.jpg',
        'Siêu xe siêu nhẹ sợi carbon',
        '2026-09-22 14:36:02'
    ),
    (
        8,
        'Lamborghini Sián FKP 37',
        85000000000.00,
        '/images/lamborghini/sian-fkp37.jpg',
        'Siêu xe Hybrid sử dụng tụ điện siêu cấp',
        '2026-09-22 14:36:02'
    ),
    (
        9,
        'Lamborghini Veneno Roadster',
        110000000000.00,
        '/images/lamborghini/veneno-roadster.jpg',
        'Siêu xe độc bản mui trần đỉnh cao',
        '2026-09-22 14:36:02'
    ),
    (
        10,
        'Lamborghini Aventador SVJ',
        60000000000.00,
        '/images/lamborghini/aventador-svj.jpg',
        'Siêu xe lập kỷ lục đường đua',
        '2026-09-22 14:36:02'
    ),
    (
        11,
        'Lamborghini Huracán STO',
        32000000000.00,
        '/images/lamborghini/huracan-sto.jpg',
        'Siêu xe thương mại chuẩn đường đua',
        '2026-09-22 14:36:02'
    ),
    (
        12,
        'Lamborghini Revuelto',
        44000000000.00,
        '/images/lamborghini/revuelto.jpg',
        'Siêu xe HPEV động cơ V12 thế hệ mới',
        '2026-09-22 14:36:02'
    ),
    (
        13,
        'Lamborghini Urus SE',
        14500000000.00,
        '/images/lamborghini/urus-se.jpg',
        'Super SUV Plug-in Hybrid',
        '2026-09-22 14:36:02'
    );
/*!40000 ALTER TABLE `cars_lamborghini` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `cars_mec`
--

DROP TABLE IF EXISTS `cars_mec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `cars_mec` (
    `car_id` int NOT NULL AUTO_INCREMENT,
    `car_name` varchar(150) NOT NULL,
    `price` decimal(15, 2) NOT NULL,
    `image_url` varchar(255) DEFAULT NULL,
    `description` text,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`car_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `cars_mec`
--

LOCK TABLES `cars_mec` WRITE;
/*!40000 ALTER TABLE `cars_mec` DISABLE KEYS */
;
INSERT INTO
    `cars_mec`
VALUES (
        1,
        'Mercedes-AMG G63',
        11750000000.00,
        '/images/mercedes/g63.jpg',
        'Mẫu SUV địa hình hiệu năng cao biểu tượng',
        '2026-09-22 15:02:00'
    ),
    (
        2,
        'Mercedes-AMG GT 63 S 4MATIC+',
        15500000000.00,
        '/images/mercedes/gt63s.jpg',
        'Coupe 4 cửa thể thao hiệu năng vượt trội',
        '2026-09-22 15:02:00'
    ),
    (
        3,
        'Mercedes-AMG SL 63 4MATIC+',
        12290000000.00,
        '/images/mercedes/sl63.jpg',
        'Mẫu mui trần thể thao huyền thoại',
        '2026-09-22 15:02:00'
    ),
    (
        4,
        'Mercedes-Benz C300 AMG',
        2099000000.00,
        '/images/mercedes/c300-amg.jpg',
        'Sedan hạng sang thể thao phân khúc C',
        '2026-09-22 15:02:00'
    ),
    (
        5,
        'Mercedes-Benz E300 AMG',
        3209000000.00,
        '/images/mercedes/e300-amg.jpg',
        'Sedan hạng sang tầm trung phong cách AMG',
        '2026-09-22 15:02:00'
    ),
    (
        6,
        'Mercedes-Benz EQS 580 4MATIC',
        5959000000.00,
        '/images/mercedes/eqs580.jpg',
        'Sedan điện hạng sang tiên phong',
        '2026-09-22 15:02:00'
    ),
    (
        7,
        'Mercedes-Maybach EQS 680 SUV',
        7610000000.00,
        '/images/mercedes/maybach-eqs680-suv.jpg',
        'SUV điện siêu sang đầu tiên của Maybach',
        '2026-09-22 15:02:00'
    ),
    (
        8,
        'Mercedes-Maybach Haute Voiture',
        22000000000.00,
        '/images/mercedes/maybach-haute-voiture.jpg',
        'Phiên bản giới hạn thiết kế thời trang cao cấp',
        '2026-09-22 15:02:00'
    ),
    (
        9,
        'Mercedes-Maybach S580',
        11599000000.00,
        '/images/mercedes/maybach-s580.jpg',
        'Sedan siêu sang trang bị động cơ V8',
        '2026-09-22 15:02:00'
    ),
    (
        10,
        'Mercedes-Maybach S680',
        15990000000.00,
        '/images/mercedes/maybach-s680.jpg',
        'Sedan siêu sang đỉnh cao động cơ V12',
        '2026-09-22 15:02:00'
    ),
    (
        11,
        'Mercedes-Maybach SL680 Monogram Series',
        18500000000.00,
        '/images/mercedes/maybach-sl680-monogram.jpg',
        'Mui trần siêu sang phiên bản Monogram',
        '2026-09-22 15:02:00'
    ),
    (
        12,
        'Mercedes-Maybach GLS 600',
        12119000000.00,
        '/images/mercedes/maybach-gls600.jpg',
        'SUV siêu sang đẳng cấp thương gia',
        '2026-09-22 15:02:00'
    );
/*!40000 ALTER TABLE `cars_mec` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `order_items` (
    `order_item_id` int NOT NULL AUTO_INCREMENT,
    `order_id` int NOT NULL,
    `car_brand` enum(
        'BMW',
        'AUDI',
        'FERRARI',
        'LAMBORGHINI',
        'BUGATTI',
        'MEC'
    ) NOT NULL,
    `car_id` int NOT NULL,
    `quantity` int NOT NULL DEFAULT '1',
    `price_at_purchase` decimal(15, 2) NOT NULL,
    PRIMARY KEY (`order_item_id`),
    KEY `fk_orderitems_orders` (`order_id`),
    CONSTRAINT `fk_orderitems_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */
;
INSERT INTO
    `order_items`
VALUES (
        1,
        1,
        'AUDI',
        2,
        1,
        12000000000.00
    ),
    (
        2,
        2,
        'AUDI',
        1,
        1,
        6000000000.00
    ),
    (
        3,
        3,
        'AUDI',
        6,
        1,
        4650000000.00
    ),
    (
        4,
        4,
        'AUDI',
        8,
        1,
        2500000000.00
    ),
    (
        5,
        5,
        'AUDI',
        4,
        1,
        4500000000.00
    ),
    (
        6,
        6,
        'BMW',
        2,
        1,
        5600000000.00
    ),
    (
        7,
        7,
        'MEC',
        2,
        1,
        15500000000.00
    ),
    (
        8,
        8,
        'MEC',
        1,
        1,
        11750000000.00
    ),
    (
        9,
        9,
        'LAMBORGHINI',
        2,
        1,
        50000000000.00
    );
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `orders` (
    `order_id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `fullname` varchar(255) DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `address` text,
    `total_amount` decimal(15, 2) NOT NULL,
    `status` enum(
        'pending',
        'completed',
        'cancelled'
    ) DEFAULT 'pending',
    `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`order_id`),
    KEY `fk_orders_users` (`user_id`),
    CONSTRAINT `fk_orders_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */
;
INSERT INTO
    `orders`
VALUES (
        1,
        6,
        NULL,
        NULL,
        NULL,
        12000000000.00,
        'completed',
        '2026-09-22 17:36:49'
    ),
    (
        2,
        6,
        NULL,
        NULL,
        NULL,
        6000000000.00,
        'completed',
        '2026-09-22 17:41:33'
    ),
    (
        3,
        5,
        'hellotest23864',
        '0367823165',
        'Hà Nội',
        4650000000.00,
        'completed',
        '2026-09-22 17:44:17'
    ),
    (
        4,
        7,
        'checkmuasam12',
        '0399217441',
        'Xuân Phương, Hà Nội',
        2500000000.00,
        'completed',
        '2026-09-22 17:47:23'
    ),
    (
        5,
        2,
        'Test123467890',
        '1234567890',
        'Tp.HCM',
        4500000000.00,
        'completed',
        '2026-09-22 17:52:31'
    ),
    (
        6,
        5,
        'hellotest23864',
        '0399217661',
        'Nghệ An',
        5600000000.00,
        'completed',
        '2026-09-22 18:42:30'
    ),
    (
        7,
        1,
        'Test12346',
        '0766127324',
        'Xuân Phương, Hà Nội',
        15500000000.00,
        'completed',
        '2026-09-23 00:24:48'
    ),
    (
        8,
        8,
        'Testtaikhoan234',
        '12345678910',
        'test địa chỉ',
        11750000000.00,
        'completed',
        '2026-09-23 00:29:07'
    ),
    (
        9,
        6,
        'accclone5568',
        '0399216345',
        'địa chỉ new',
        50000000000.00,
        'completed',
        '2026-09-23 00:41:57'
    );
/*!40000 ALTER TABLE `orders` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `users` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL,
    `email` varchar(100) NOT NULL,
    `password` varchar(255) NOT NULL,
    `full_name` varchar(100) DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `address` text,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `username` (`username`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */
;
INSERT INTO
    `users`
VALUES (
        1,
        'Test12346',
        'Test12346@gmail.com',
        '$2a$10$87L3v.4SXNKLU.glNrxrVOw4/UppUSPuCH1J1VR0RoPlSv8xEOM1a',
        NULL,
        NULL,
        NULL,
        '2026-09-22 16:11:13'
    ),
    (
        2,
        'Test123467890',
        'Test123467890@gmail.com',
        '$2a$10$7dsMaLszfm4XpmKML1FOFuxrYi17IWm7jSXkUsJu14bzI.0wyjhtm',
        NULL,
        NULL,
        NULL,
        '2026-09-22 16:13:03'
    ),
    (
        3,
        'checktk1234',
        'checktk1234@gmail.com',
        '$2a$10$kbFyTUVGikGmXCu6d.J9NO1uhTDDiTQAtAtnnMMA75znDDbGQcTfK',
        NULL,
        NULL,
        NULL,
        '2026-09-22 16:31:53'
    ),
    (
        4,
        'test123333p',
        'test123333p@gmail.com',
        '$2a$10$GBf4ZJvZ2mq94d0wJI6QleYjHzuGbiiJli/24qv7W9bm37Znjd10K',
        NULL,
        NULL,
        NULL,
        '2026-09-22 16:35:10'
    ),
    (
        5,
        'hellotest23864',
        'hellotest23864@gmail.com',
        '$2a$10$o1/FAy4K4eYJLvlJUS685eFU5eVS6o5490eVP1tgBzHjf1JicLXgW',
        NULL,
        NULL,
        NULL,
        '2026-09-22 17:26:04'
    ),
    (
        6,
        'accclone5568',
        'accclone5568@gmail.com',
        '$2a$10$uwCYTigANpdnlrOfeeqbfOBOfCxLHnnI4LOvc3kh2FvaemkRN3/r.',
        NULL,
        NULL,
        NULL,
        '2026-09-22 17:34:05'
    ),
    (
        7,
        'checkmuasam12',
        'checkmuasam12@gmail.com',
        '$2a$10$IzA.IGLE3.Y.UCWErtLvwOleTnD1mDqhRBPumIUS1i4yVfxhcWsHa',
        NULL,
        NULL,
        NULL,
        '2026-09-22 17:47:01'
    ),
    (
        8,
        'Testtaikhoan234',
        'Testtaikhoan234@gmail.com',
        '$2a$10$yhJ/qaSRBj4U171x56.nKu6SRAzCUz90WBmHzJapYAfNiL5KO0DY6',
        NULL,
        NULL,
        NULL,
        '2026-09-23 00:28:26'
    );
/*!40000 ALTER TABLE `users` ENABLE KEYS */
;
UNLOCK TABLES;

SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */
;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;

-- Dump completed on 2026-09-23  7:56:57