/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.20-12.3.3-MariaDB, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: school_quest
-- ------------------------------------------------------
-- Server version	12.3.3-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `achievements`
--

DROP TABLE IF EXISTS `achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `achievements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `requirement_type` varchar(255) NOT NULL,
  `requirement_value` int(11) NOT NULL,
  `exp_bonus` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `achievements`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `achievements` WRITE;
/*!40000 ALTER TABLE `achievements` DISABLE KEYS */;
INSERT INTO `achievements` VALUES
(1,'First Quest','Selesaikan 1 quest','🎯','total_quests',1,50,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(2,'Speed Runner','Selesaikan 5 quest dalam 1 hari','⚡','daily_quests',5,100,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(3,'On Fire','7 hari streak beruntun','🔥','streak',7,150,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(4,'Quest Master','Selesaikan total 50 quest','👑','total_quests',50,200,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(5,'Subject Expert','Selesaikan semua main quest dalam seminggu','🧠','subject_expert',1,250,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(6,'Cleaning Hero','Selesaikan 10 quest piket','✨','category_piket',10,100,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(7,'Social Butterfly','Selesaikan 5 quest sosial','🦋','category_social',5,100,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(8,'Legendary','Capai level 10','🌟','level',10,500,'2026-09-02 19:24:39','2026-09-02 19:24:39');
/*!40000 ALTER TABLE `achievements` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `forum_likes`
--

DROP TABLE IF EXISTS `forum_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_likes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `likeable_type` varchar(255) NOT NULL,
  `likeable_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `forum_likes_user_id_likeable_type_likeable_id_unique` (`user_id`,`likeable_type`,`likeable_id`),
  KEY `forum_likes_likeable_type_likeable_id_index` (`likeable_type`,`likeable_id`),
  CONSTRAINT `forum_likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_likes`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `forum_likes` WRITE;
/*!40000 ALTER TABLE `forum_likes` DISABLE KEYS */;
INSERT INTO `forum_likes` VALUES
(1,3,'App\\Models\\ForumThread',1,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(2,4,'App\\Models\\ForumThread',1,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(3,5,'App\\Models\\ForumThread',1,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(4,3,'App\\Models\\ForumThread',2,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(5,6,'App\\Models\\ForumThread',2,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(6,4,'App\\Models\\ForumReply',4,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(7,3,'App\\Models\\ForumThread',3,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(8,4,'App\\Models\\ForumThread',3,'2026-09-02 19:24:39','2026-09-02 19:24:39');
/*!40000 ALTER TABLE `forum_likes` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `forum_replies`
--

DROP TABLE IF EXISTS `forum_replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_replies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `forum_thread_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `body` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `forum_replies_user_id_foreign` (`user_id`),
  KEY `forum_replies_parent_id_foreign` (`parent_id`),
  KEY `forum_replies_forum_thread_id_created_at_index` (`forum_thread_id`,`created_at`),
  CONSTRAINT `forum_replies_forum_thread_id_foreign` FOREIGN KEY (`forum_thread_id`) REFERENCES `forum_threads` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_replies_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `forum_replies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_replies_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_replies`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `forum_replies` WRITE;
/*!40000 ALTER TABLE `forum_replies` DISABLE KEYS */;
INSERT INTO `forum_replies` VALUES
(1,1,3,NULL,'Siap min! Keren banget fiturnya, jadi gampang diskusi bareng temen sekelas 🚀','2026-09-02 14:24:39','2026-09-02 19:24:39'),
(2,1,4,NULL,'Mantap! Izin tanya min, apakah nanti ada fitur guild antar kelas?','2026-09-02 16:24:39','2026-09-02 19:24:39'),
(3,1,1,2,'Ide bagus! Fitur guild antar kelas saat ini sedang dalam pertimbangan pengembang.','2026-09-02 17:24:39','2026-09-02 19:24:39'),
(4,2,5,NULL,'Bisa tonton video rangkuman di YouTube channel Pak Guru atau baca modul bab 3 di perpustakaan sekolah, penjelasannya ringkas banget!','2026-09-02 18:24:39','2026-09-02 19:24:39'),
(5,3,6,NULL,'GG bro! Aku masih di Level 3 nih, lagi ngejar quest tambahan kejuruan.','2026-09-02 18:54:39','2026-09-02 19:24:39');
/*!40000 ALTER TABLE `forum_replies` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `forum_reports`
--

DROP TABLE IF EXISTS `forum_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `reportable_type` varchar(255) NOT NULL,
  `reportable_id` bigint(20) unsigned NOT NULL,
  `reason` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `status` enum('pending','resolved','dismissed') NOT NULL DEFAULT 'pending',
  `action_taken` varchar(255) DEFAULT NULL,
  `resolved_by` bigint(20) unsigned DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `forum_reports_user_id_foreign` (`user_id`),
  KEY `forum_reports_reportable_type_reportable_id_index` (`reportable_type`,`reportable_id`),
  KEY `forum_reports_resolved_by_foreign` (`resolved_by`),
  KEY `forum_reports_status_created_at_index` (`status`,`created_at`),
  CONSTRAINT `forum_reports_resolved_by_foreign` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `forum_reports_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_reports`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `forum_reports` WRITE;
/*!40000 ALTER TABLE `forum_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `forum_reports` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `forum_threads`
--

DROP TABLE IF EXISTS `forum_threads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_threads` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'umum',
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `is_pinned` tinyint(1) NOT NULL DEFAULT 0,
  `is_locked` tinyint(1) NOT NULL DEFAULT 0,
  `views_count` int(10) unsigned NOT NULL DEFAULT 0,
  `replies_count` int(10) unsigned NOT NULL DEFAULT 0,
  `last_reply_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `forum_threads_user_id_foreign` (`user_id`),
  KEY `forum_threads_category_created_at_index` (`category`,`created_at`),
  KEY `forum_threads_is_pinned_index` (`is_pinned`),
  CONSTRAINT `forum_threads_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_threads`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `forum_threads` WRITE;
/*!40000 ALTER TABLE `forum_threads` DISABLE KEYS */;
INSERT INTO `forum_threads` VALUES
(1,1,'umum','🏰 Selamat Datang di The Realm — Panduan Komunitas & Aturan Diskusi','Halo semua petualang SchoolQuest!\n\nThe Realm adalah ruang publik bagi kita semua untuk saling bertukar strategi, menanyakan kendala quest pelajaran, membagikan pencapaian badge langka, atau memberikan saran pengembangan web.\n\nBeberapa pedoman dasar:\n1. Gunakan bahasa yang sopan dan saling mendukung sesama siswa.\n2. Pilih kategori yang tepat untuk postinganmu.\n3. Jangan ragu memberikan respon atau bantuan bagi rekan yang bertanya.\n\nSelamat bertualang dan semoga sukses mencapai level Immortal! ⚔️🛡️',1,0,142,3,'2026-09-02 17:24:39','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(2,4,'quest','⚔️ Tips Cepat Selesaikan Quest Matematika & Dapatkan Bonus EXP!','Halo teman-teman, mau share trik nih buat quest harian Matematika yang materinya rumus turunan & integral.\n\nBiasakan kerjakan sebelum jam 12 siang agar tidak menumpuk dengan jadwal piket kelas sore hari. Jangan lupa upload bukti foto catatan yang jelas agar validasi admin cepat di-approve!\n\nAda yang punya referensi materi kalkulus yang gampang dipahami?',0,0,68,2,'2026-09-02 18:24:39','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(3,5,'showcase','🏆 Akhirnya Berhasil Capai Level 5 (Champion) & Buka Avatar Mythic!','Setelah streak harian 14 hari berturut-turut dan menyelesaikan 25 main quest, akhirnya karakterku berhasil naik ke Level 5! 🔥\n\nEXP bar sekarang butuh 3600 EXP buat ke Level 6. Siapa lagi di sini yang lagi push rank leaderboard kelas?',0,0,95,1,'2026-09-02 18:54:39','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(4,6,'saran','💡 Usulan: Tambahkan Mode Dark/Light Custom Palette & Sound Effects Game','Bagaimana kalau di update berikutnya ditambahkan efek suara 8-bit retro saat user menyelesaikan quest atau saat menaikkan level? Bakal berasa main RPG klasik banget!',0,0,45,0,NULL,'2026-09-02 19:24:39','2026-09-02 19:24:39');
/*!40000 ALTER TABLE `forum_threads` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'0001_01_01_000002_create_jobs_table',1),
(4,'2024_01_01_000002_create_subjects_table',1),
(5,'2024_01_01_000003_create_schedules_table',1),
(6,'2024_01_01_000004_create_piket_schedules_table',1),
(7,'2024_01_01_000005_create_piket_members_table',1),
(8,'2024_01_01_000006_create_quests_table',1),
(9,'2024_01_01_000007_create_quest_completions_table',1),
(10,'2024_01_01_000008_create_achievements_table',1),
(11,'2024_01_01_000009_create_user_achievements_table',1),
(12,'2024_01_01_000010_add_validation_to_quest_completions_table',1),
(13,'2026_08_19_073851_add_avatar_to_users_table',1),
(14,'2026_08_20_004457_add_gender_to_users_table',1),
(15,'2026_08_20_005500_add_teacher_to_schedules_and_class_to_quests',1),
(16,'2026_08_20_006000_add_has_completed_onboarding_to_users_table',1),
(17,'2026_08_24_002050_add_proof_image_to_quest_completions_table',1),
(18,'2026_08_24_060001_create_forum_threads_table',1),
(19,'2026_08_24_060002_create_forum_replies_table',1),
(20,'2026_08_24_060003_create_forum_likes_table',1),
(21,'2026_08_24_070002_add_sanction_fields_to_users_table',1),
(22,'2026_08_24_070003_create_forum_reports_table',1),
(23,'2026_08_24_070004_create_user_sanctions_table',1),
(24,'2026_08_26_011435_create_personal_access_tokens_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `piket_members`
--

DROP TABLE IF EXISTS `piket_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `piket_members` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `piket_schedule_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `piket_members_piket_schedule_id_foreign` (`piket_schedule_id`),
  KEY `piket_members_user_id_foreign` (`user_id`),
  CONSTRAINT `piket_members_piket_schedule_id_foreign` FOREIGN KEY (`piket_schedule_id`) REFERENCES `piket_schedules` (`id`) ON DELETE CASCADE,
  CONSTRAINT `piket_members_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `piket_members`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `piket_members` WRITE;
/*!40000 ALTER TABLE `piket_members` DISABLE KEYS */;
INSERT INTO `piket_members` VALUES
(1,1,11,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(2,1,25,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(3,1,26,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(4,2,16,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(5,2,17,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(6,2,38,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(7,3,7,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(8,3,14,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(9,3,33,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(10,4,39,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(11,4,42,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(12,4,43,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(13,5,6,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(14,5,13,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(15,5,19,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(16,6,64,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(17,6,84,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(18,6,88,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(19,7,48,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(20,7,51,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(21,7,81,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(22,8,62,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(23,8,71,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(24,8,89,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(25,9,60,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(26,9,67,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(27,9,80,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(28,10,58,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(29,10,60,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(30,10,79,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(31,11,95,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(32,11,106,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(33,11,122,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(34,12,101,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(35,12,114,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(36,12,115,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(37,13,95,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(38,13,130,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(39,13,134,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(40,14,116,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(41,14,118,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(42,14,131,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(43,15,103,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(44,15,109,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(45,15,114,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(46,16,150,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(47,16,152,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(48,16,161,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(49,17,157,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(50,17,171,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(51,17,174,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(52,18,137,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(53,18,145,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(54,18,164,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(55,19,135,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(56,19,155,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(57,19,168,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(58,20,150,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(59,20,152,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(60,20,162,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(61,21,196,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(62,21,199,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(63,21,210,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(64,22,184,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(65,22,204,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(66,22,222,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(67,23,191,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(68,23,209,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(69,23,210,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(70,24,195,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(71,24,208,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(72,24,215,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(73,25,180,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(74,25,195,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(75,25,221,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(76,26,224,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(77,26,253,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(78,26,255,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(79,27,223,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(80,27,225,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(81,27,244,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(82,28,229,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(83,28,234,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(84,28,240,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(85,29,241,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(86,29,253,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(87,29,254,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(88,30,223,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(89,30,225,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(90,30,244,'2026-09-02 19:24:39','2026-09-02 19:24:39');
/*!40000 ALTER TABLE `piket_members` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `piket_schedules`
--

DROP TABLE IF EXISTS `piket_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `piket_schedules` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `day_of_week` int(11) NOT NULL,
  `class` varchar(255) NOT NULL,
  `group_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `piket_schedules`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `piket_schedules` WRITE;
/*!40000 ALTER TABLE `piket_schedules` DISABLE KEYS */;
INSERT INTO `piket_schedules` VALUES
(1,1,'X-MPLB 1','Kelompok A','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(2,2,'X-MPLB 1','Kelompok B','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(3,3,'X-MPLB 1','Kelompok C','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(4,4,'X-MPLB 1','Kelompok D','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(5,5,'X-MPLB 1','Kelompok A','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(6,1,'X-MPLB 2','Kelompok A','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(7,2,'X-MPLB 2','Kelompok B','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(8,3,'X-MPLB 2','Kelompok C','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(9,4,'X-MPLB 2','Kelompok D','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(10,5,'X-MPLB 2','Kelompok A','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(11,1,'X-PM 1','Kelompok A','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(12,2,'X-PM 1','Kelompok B','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(13,3,'X-PM 1','Kelompok C','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(14,4,'X-PM 1','Kelompok D','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(15,5,'X-PM 1','Kelompok A','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(16,1,'X-PM 2','Kelompok A','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(17,2,'X-PM 2','Kelompok B','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(18,3,'X-PM 2','Kelompok C','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(19,4,'X-PM 2','Kelompok D','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(20,5,'X-PM 2','Kelompok A','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(21,1,'X-PM 3','Kelompok A','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(22,2,'X-PM 3','Kelompok B','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(23,3,'X-PM 3','Kelompok C','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(24,4,'X-PM 3','Kelompok D','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(25,5,'X-PM 3','Kelompok A','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(26,1,'XII RPL','Kelompok A','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(27,2,'XII RPL','Kelompok B','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(28,3,'XII RPL','Kelompok C','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(29,4,'XII RPL','Kelompok D','2026-09-02 19:24:39','2026-09-02 19:24:39'),
(30,5,'XII RPL','Kelompok A','2026-09-02 19:24:39','2026-09-02 19:24:39');
/*!40000 ALTER TABLE `piket_schedules` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `quest_completions`
--

DROP TABLE IF EXISTS `quest_completions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `quest_completions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `quest_id` bigint(20) unsigned NOT NULL,
  `completed_at` timestamp NOT NULL,
  `exp_earned` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `proof_text` text DEFAULT NULL,
  `proof_image` varchar(255) DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `validated_by` bigint(20) unsigned DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quest_completions_user_id_foreign` (`user_id`),
  KEY `quest_completions_quest_id_foreign` (`quest_id`),
  KEY `quest_completions_validated_by_foreign` (`validated_by`),
  CONSTRAINT `quest_completions_quest_id_foreign` FOREIGN KEY (`quest_id`) REFERENCES `quests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quest_completions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quest_completions_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quest_completions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `quest_completions` WRITE;
/*!40000 ALTER TABLE `quest_completions` DISABLE KEYS */;
/*!40000 ALTER TABLE `quest_completions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `quests`
--

DROP TABLE IF EXISTS `quests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `quests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `type` enum('main','additional') NOT NULL,
  `class` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `exp_reward` int(11) NOT NULL,
  `difficulty` enum('easy','medium','hard') NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_daily` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `available_date` date DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quests_created_by_foreign` (`created_by`),
  CONSTRAINT `quests_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quests`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `quests` WRITE;
/*!40000 ALTER TABLE `quests` DISABLE KEYS */;
INSERT INTO `quests` VALUES
(1,'Bersihkan Lapangan Sekolah','Deskripsi untuk quest Bersihkan Lapangan Sekolah','additional',NULL,'piket',80,'medium','🧹',1,0,NULL,NULL,NULL,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(2,'Bersosialisasi dengan 3 Orang Baru','Deskripsi untuk quest Bersosialisasi dengan 3 Orang Baru','additional',NULL,'social',40,'easy','👥',1,0,NULL,NULL,NULL,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(3,'Bantu Guru Membawa Buku ke Perpustakaan','Deskripsi untuk quest Bantu Guru Membawa Buku ke Perpustakaan','additional',NULL,'social',35,'easy','📚',1,0,NULL,NULL,NULL,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(4,'Ikut Kegiatan Ekstrakurikuler','Deskripsi untuk quest Ikut Kegiatan Ekstrakurikuler','additional',NULL,'activity',70,'medium','🏃',1,0,NULL,NULL,NULL,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(5,'Rapikan Rak Buku Perpustakaan','Deskripsi untuk quest Rapikan Rak Buku Perpustakaan','additional',NULL,'piket',45,'easy','📚',1,0,NULL,NULL,NULL,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(6,'Menjadi Mentor Teman Sebaya','Deskripsi untuk quest Menjadi Mentor Teman Sebaya','additional',NULL,'social',150,'hard','👨‍🏫',1,0,NULL,NULL,NULL,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(7,'Buat Poster Motivasi untuk Kelas','Deskripsi untuk quest Buat Poster Motivasi untuk Kelas','additional',NULL,'creative',60,'medium','🎨',1,0,NULL,NULL,NULL,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(8,'Organisir Kegiatan Kebersihan Lingkungan','Deskripsi untuk quest Organisir Kegiatan Kebersihan Lingkungan','additional',NULL,'piket',120,'hard','🌱',1,0,NULL,NULL,NULL,'2026-09-02 19:24:39','2026-09-02 19:24:39'),
(9,'Selesaikan Tugas Bahasa Inggris','Ikuti pelajaran Bahasa Inggris bersama Raden Roro Sri Kingkin Gunawi Ning, S.Pd. dan selesaikan tugas/praktikum yang diberikan.','main','XII RPL','subject',50,'easy','💬',1,1,NULL,'2026-09-03',NULL,'2026-09-02 19:25:15','2026-09-02 19:25:15'),
(10,'Selesaikan Tugas Konsentrasi Keahlian RPL','Ikuti pelajaran Konsentrasi Keahlian RPL bersama Cep Kusaeri, ST. dan selesaikan tugas/praktikum yang diberikan.','main','XII RPL','subject',65,'medium','💻',1,1,NULL,'2026-09-03',NULL,'2026-09-02 19:25:15','2026-09-02 19:25:15'),
(11,'Selesaikan Tugas PSE','Ikuti pelajaran PSE dan selesaikan tugas/praktikum yang diberikan.','main','XII RPL','subject',50,'easy','🌱',1,1,NULL,'2026-09-03',NULL,'2026-09-02 19:25:15','2026-09-02 19:25:15'),
(12,'Kegiatan Apel Sore','Ikuti kegiatan Apel Sore hari ini dengan tertib dan disiplin.','main','XII RPL','activity',40,'easy','🌇',1,1,NULL,'2026-09-03',NULL,'2026-09-02 19:25:15','2026-09-02 19:25:15'),
(13,'Kegiatan ESKUL','Ikuti kegiatan ESKUL hari ini dengan tertib dan disiplin.','main','XII RPL','activity',40,'easy','🏆',1,1,NULL,'2026-09-03',NULL,'2026-09-02 19:25:15','2026-09-02 19:25:15'),
(14,'Tugas Piket Kelas','Laksanakan tugas piket kebersihan kelas XII RPL hari ini.','main','XII RPL','piket',80,'medium','🧹',1,1,NULL,'2026-09-03',NULL,'2026-09-02 19:25:15','2026-09-02 19:25:15'),
(15,'Selesaikan Tugas Apel Sore','Ikuti pelajaran Apel Sore dan selesaikan tugas yang diberikan.','main',NULL,'subject',50,'easy','🌇',1,1,NULL,'2026-09-03',NULL,'2026-09-02 19:49:49','2026-09-02 19:49:49'),
(16,'Selesaikan Tugas ESKUL','Ikuti pelajaran ESKUL dan selesaikan tugas yang diberikan.','main',NULL,'subject',50,'easy','🏆',1,1,NULL,'2026-09-03',NULL,'2026-09-02 19:49:49','2026-09-02 19:49:49');
/*!40000 ALTER TABLE `quests` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `day_of_week` int(11) NOT NULL,
  `subject_id` bigint(20) unsigned NOT NULL,
  `class` varchar(255) NOT NULL,
  `teacher` varchar(255) DEFAULT NULL,
  `room` varchar(255) DEFAULT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `schedules_subject_id_foreign` (`subject_id`),
  CONSTRAINT `schedules_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES
(1,1,1,'X-MPLB 1',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(2,1,2,'X-MPLB 1',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(3,1,3,'X-MPLB 1',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(4,2,4,'X-MPLB 1',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(5,2,5,'X-MPLB 1',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(6,2,6,'X-MPLB 1',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(7,3,1,'X-MPLB 1',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(8,3,7,'X-MPLB 1',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(9,3,8,'X-MPLB 1',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(10,4,2,'X-MPLB 1',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(11,4,3,'X-MPLB 1',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(12,4,4,'X-MPLB 1',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(13,5,9,'X-MPLB 1',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(14,5,10,'X-MPLB 1',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(15,1,1,'X-MPLB 2',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(16,1,2,'X-MPLB 2',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(17,1,3,'X-MPLB 2',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(18,2,4,'X-MPLB 2',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(19,2,5,'X-MPLB 2',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(20,2,6,'X-MPLB 2',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(21,3,1,'X-MPLB 2',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(22,3,7,'X-MPLB 2',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(23,3,8,'X-MPLB 2',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(24,4,2,'X-MPLB 2',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(25,4,3,'X-MPLB 2',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(26,4,4,'X-MPLB 2',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(27,5,9,'X-MPLB 2',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(28,5,10,'X-MPLB 2',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(29,1,1,'X-PM 1',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(30,1,2,'X-PM 1',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(31,1,3,'X-PM 1',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(32,2,4,'X-PM 1',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(33,2,5,'X-PM 1',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(34,2,6,'X-PM 1',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(35,3,1,'X-PM 1',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(36,3,7,'X-PM 1',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(37,3,8,'X-PM 1',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(38,4,2,'X-PM 1',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(39,4,3,'X-PM 1',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(40,4,4,'X-PM 1',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(41,5,9,'X-PM 1',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(42,5,10,'X-PM 1',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(43,1,1,'X-PM 2',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(44,1,2,'X-PM 2',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(45,1,3,'X-PM 2',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(46,2,4,'X-PM 2',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(47,2,5,'X-PM 2',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(48,2,6,'X-PM 2',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(49,3,1,'X-PM 2',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(50,3,7,'X-PM 2',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(51,3,8,'X-PM 2',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(52,4,2,'X-PM 2',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(53,4,3,'X-PM 2',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(54,4,4,'X-PM 2',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(55,5,9,'X-PM 2',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(56,5,10,'X-PM 2',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(57,1,1,'X-PM 3',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(58,1,2,'X-PM 3',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(59,1,3,'X-PM 3',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(60,2,4,'X-PM 3',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(61,2,5,'X-PM 3',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(62,2,6,'X-PM 3',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(63,3,1,'X-PM 3',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(64,3,7,'X-PM 3',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(65,3,8,'X-PM 3',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(66,4,2,'X-PM 3',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(67,4,3,'X-PM 3',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(68,4,4,'X-PM 3',NULL,NULL,'11:00:00','12:30:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(69,5,9,'X-PM 3',NULL,NULL,'07:30:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(70,5,10,'X-PM 3',NULL,NULL,'09:15:00','10:45:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(71,1,21,'XII RPL',NULL,NULL,'06:30:00','07:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(72,1,11,'XII RPL','Cep Kusaeri, ST.',NULL,'07:00:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(73,1,11,'XII RPL','Cep Kusaeri, ST.',NULL,'09:10:00','11:10:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(74,1,11,'XII RPL','Cep Kusaeri, ST.',NULL,'12:10:00','12:50:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(75,1,13,'XII RPL','Cep Kusaeri, ST.',NULL,'12:50:00','14:50:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(76,1,23,'XII RPL',NULL,NULL,'14:50:00','15:20:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(77,1,25,'XII RPL',NULL,NULL,'15:20:00','16:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(78,2,22,'XII RPL',NULL,NULL,'06:30:00','07:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(79,2,11,'XII RPL','Cep Kusaeri, ST.',NULL,'07:00:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(80,2,14,'XII RPL','Euis Nengsih, S.Pd.',NULL,'09:10:00','11:10:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(81,2,15,'XII RPL','Chandra Widya Nugraha, S.Psi.,Gr.',NULL,'12:10:00','12:50:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(82,2,16,'XII RPL','Haryati Nopiantie, S.Ag.',NULL,'12:50:00','14:50:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(83,2,23,'XII RPL',NULL,NULL,'14:50:00','15:20:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(84,2,25,'XII RPL',NULL,NULL,'15:20:00','16:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(85,3,22,'XII RPL',NULL,NULL,'06:30:00','07:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(86,3,12,'XII RPL','Cep Kusaeri, ST.',NULL,'07:00:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(87,3,12,'XII RPL','Cep Kusaeri, ST.',NULL,'09:10:00','09:50:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(88,3,11,'XII RPL','Cep Kusaeri, ST.',NULL,'09:50:00','11:10:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(89,3,11,'XII RPL','Cep Kusaeri, ST.',NULL,'12:10:00','14:50:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(90,3,23,'XII RPL',NULL,NULL,'14:50:00','15:20:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(91,3,25,'XII RPL',NULL,NULL,'15:20:00','16:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(92,4,17,'XII RPL','Raden Roro Sri Kingkin Gunawi Ning, S.Pd.',NULL,'06:30:00','09:10:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(93,4,11,'XII RPL','Cep Kusaeri, ST.',NULL,'09:20:00','11:10:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(94,4,11,'XII RPL','Cep Kusaeri, ST.',NULL,'12:10:00','14:10:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(95,4,18,'XII RPL',NULL,NULL,'14:10:00','14:50:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(96,4,23,'XII RPL',NULL,NULL,'14:50:00','15:20:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(97,4,25,'XII RPL',NULL,NULL,'15:20:00','16:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(98,5,24,'XII RPL',NULL,NULL,'06:30:00','07:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(99,5,19,'XII RPL','Nina Marliana Purwantini, S.Pd.,Gr.',NULL,'07:00:00','08:20:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(100,5,20,'XII RPL','Dina Amelia, S.Hum.,Gr.',NULL,'08:20:00','09:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(101,5,20,'XII RPL','Dina Amelia, S.Hum.,Gr.',NULL,'09:10:00','09:50:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(102,5,13,'XII RPL','Cep Kusaeri, ST.',NULL,'09:50:00','11:10:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(103,5,1,'XII RPL','Sellvi Octavia, S.Pd.',NULL,'12:40:00','14:40:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(104,5,18,'XII RPL',NULL,NULL,'14:40:00','15:10:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(105,5,23,'XII RPL',NULL,NULL,'15:10:00','15:40:00','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(106,5,25,'XII RPL',NULL,NULL,'15:40:00','16:00:00','2026-09-02 19:24:38','2026-09-02 19:24:38');
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES
('6hRkDqrHBDwtcuVjJGBPlw16SDnVmppNnyayB0me',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYTBkRHZYTGhHYWlVdlYzam5kS2lYUmxLM0tCNVhxeG01bUxEQmNXSSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fX0=',1788432133),
('AtqorI2UjUvliBb3uangvHEKd4srrMORt2qLeaB3',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkY1Qmt6ODZpOUJjSEFmNU50OTlCQ2l2SlJ6Q09SSFFEOFJsSWxzZSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODA4MC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fX0=',1788438905),
('G8A1AektHDBxUs4sytMteiVDxpZL0tcCP1ImRcNr',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ2NIUHJaQVk1cThhQTdPQ3Q0RDlGYW5BNUF4NEZ1MUZNd09DSGN5QiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1788439800),
('vkdWQIF4KSyBAPnQFFARMB97LOaxENSPgGY3LNHF',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiOTZBQnhoNlUxZE5uaWtDQjluRjdNZ0FyTm54SmlTT0djRERVeTVxSyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODA4MC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fX0=',1788439317),
('VVY32CymOQkjbdUf323j0wbZcYHcjmvngqYgCGKS',251,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:154.0) Gecko/20100101 Firefox/154.0','YTo0OntzOjY6Il90b2tlbiI7czo0MDoieU52U2Y4b2ltZHloamlObnVNV1d1d0prZ05CdDlkNUVpQThPaHdNRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjI1MTt9',1788432153);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES
(1,'Matematika','MAT','📐','#ef4444','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(2,'B.Indonesia','BIN','📖','#3b82f6','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(3,'IPA','IPA','🔬','#10b981','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(4,'B.Inggris','ENG','💬','#8b5cf6','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(5,'IPS','IPS','🌍','#f59e0b','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(6,'Seni Budaya','SBD','🎨','#ec4899','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(7,'PPKN','PKN','🤝','#14b8a6','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(8,'Penjaskes','PJK','⚽','#f97316','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(9,'Agama','AGM','🕌','#06b6d4','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(10,'Prakarya','PRK','✂️','#64748b','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(11,'Konsentrasi Keahlian RPL','KK-RPL','💻','#2563eb','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(12,'Mata Pelajaran Pilihan RPL','MP-RPL','⚡','#4f46e5','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(13,'Kreativitas, Inovasi, dan Kewirausahaan','PKK','💡','#eab308','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(14,'Bahasa Indonesia','BIN-12','📖','#0284c7','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(15,'Bimbingan Konseling','BK','🧭','#10b981','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(16,'Pendidikan Agama Islam dan Budi Pekerti','PAI','🕌','#14b8a6','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(17,'Bahasa Inggris','ENG-12','💬','#9333ea','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(18,'PSE','PSE','🌱','#ec4899','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(19,'Pendidikan Pancasila','PPKN-12','🤝','#f43f5e','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(20,'Bahasa Sunda','BSN','🎭','#84cc16','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(21,'Upacara Bendera','UPC','🇮🇩','#dc2626','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(22,'Apel Pagi','APL-P','🌅','#d97706','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(23,'Apel Sore','APL-S','🌇','#ea580c','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(24,'Kokurikuler','KKR','🌟','#0891b2','2026-09-02 19:24:38','2026-09-02 19:24:38'),
(25,'ESKUL','ESK','🏆','#7c3aed','2026-09-02 19:24:38','2026-09-02 19:24:38');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `user_achievements`
--

DROP TABLE IF EXISTS `user_achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_achievements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `achievement_id` bigint(20) unsigned NOT NULL,
  `earned_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_achievements_user_id_foreign` (`user_id`),
  KEY `user_achievements_achievement_id_foreign` (`achievement_id`),
  CONSTRAINT `user_achievements_achievement_id_foreign` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_achievements_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_achievements`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `user_achievements` WRITE;
/*!40000 ALTER TABLE `user_achievements` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_achievements` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `user_sanctions`
--

DROP TABLE IF EXISTS `user_sanctions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sanctions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `admin_id` bigint(20) unsigned NOT NULL,
  `type` enum('exp_deduction','mute','streak_reset','warning','ban') NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `reason` text NOT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_acknowledged` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_sanctions_admin_id_foreign` (`admin_id`),
  KEY `user_sanctions_user_id_is_active_index` (`user_id`,`is_active`),
  KEY `user_sanctions_user_id_is_acknowledged_index` (`user_id`,`is_acknowledged`),
  CONSTRAINT `user_sanctions_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_sanctions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sanctions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `user_sanctions` WRITE;
/*!40000 ALTER TABLE `user_sanctions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sanctions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nisn` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `gender` enum('L','P') DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','admin') NOT NULL DEFAULT 'student',
  `avatar_seed` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `exp` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 1,
  `streak_days` int(11) NOT NULL DEFAULT 0,
  `last_activity_date` date DEFAULT NULL,
  `muted_until` timestamp NULL DEFAULT NULL,
  `is_banned` tinyint(1) NOT NULL DEFAULT 0,
  `has_completed_onboarding` tinyint(1) NOT NULL DEFAULT 0,
  `class` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_nisn_unique` (`nisn`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=259 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,NULL,'Admin Sekolah',NULL,'admin@schoolquest.id',NULL,'$2y$12$u/YO5ms3pUw9Jk/0EayhAO62XIglPL5uyTXOpvmzErJYG0mvhMjIO','admin',NULL,NULL,0,1,0,NULL,NULL,0,1,NULL,NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(2,NULL,'Guru Piket',NULL,'guru@schoolquest.id',NULL,'$2y$12$x/X3rCVDQyNVu9PFU/nRGebmlTvr3sfhk9ZkMU8BQ42nMvi.QGyMi','admin',NULL,NULL,0,1,0,NULL,NULL,0,1,NULL,NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(3,'0117148583','AISYAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(4,'0112413356','ALIA RAHMAWATI GUNAWAN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(5,'0107094516','AMANDA AMELIA PUTRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(6,'0115300239','AMELIA PUTRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(7,'0104452254','DARA ANNISA RAMADHANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(8,'0117309491','DAVINA JULYAN NOOR WAHID',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(9,'0114643174','DEDE ASRI SAFITRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(10,'0106486784','ELSA NURHIDAYAT',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(11,'0105470789','FANI NASWA RAHMANIAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(12,'0111021684','GHINA DZAKWAN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(13,'0102580835','HANUM KIRANA PUTRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(14,'0103322092','KEISYA MAHIRA PUTRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(15,'0102341519','KEYLA PUTRI PRANATA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(16,'0116123701','KHANSA CIBILLA AZ ZAHRAN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(17,'0109411960','MARVELL GARCIA NANDA AGAM',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(18,'0111320578','MAULIADIVA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(19,'0109167586','MILEVA MELISENDA ADNI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(20,'0105541279','MIZQI KHANSA MAHARDHIKA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(21,'0106972435','NABILA AUFA AGUSTIN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(22,'0109095935','NABILA AULIA ZAHRA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(23,'0104267281','NADIRA RAISA SHAMILA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(24,'0114730562','NAISYA RESFIORI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(25,'0112579809','NANDA KHOIRUNNISA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(26,'0112565950','NASYA KINANTI LESTARI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(27,'0112473270','NAYLA SABILLA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(28,'0108038895','PANJI SETIAWAN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(29,'0116312564','PARAMITHA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(30,'0118490560','RADEN SABRINA MAHARANI PUTRI SOERYADI NINGRAT',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(31,'0118545832','RAIN KALEA INDRYASKA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(32,'0115790343','RAIS AGNA MUNAWAR',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(33,'0103917052','RAISYA SALSABILA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(34,'0094547104','RAMDAN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(35,'0102534954','RAVA DWI ANASTASYA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(36,'0101416056','SAFA JULIANA MOCHTAR',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(37,'0119769506','SAFIRA FEBRYANTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(38,'0113754143','SHIFA CAHAYA KAMILA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(39,'0116308395','SIFA DITIANI PUTRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(40,'0107975252','TALITHA AMANDA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(41,'0119714431','TANIA ISNAENI PUTRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(42,'0092613939','TIRTA WELAS TANDANG',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(43,'0115908461','VALERIE SYAUQIA FAUSTINE',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(44,'0112873580','VEVIERA AZAHRA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(45,'0109960797','VINA YUSTI FAUZIAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(46,'0115809729','YULIANTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(47,'0103742689','ANGGI SYAHPUTRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(48,'0106330592','ASYFA NOER RAHMANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(49,'0115221502','AULIA NURWULAN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(50,'0116109070','AURORA GANTARI ASMARANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(51,'0115354722','DELFINO RIZMAULIDAN ADIGRAHA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(52,'0104531343','DENAYA NAZAH AISYARAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(53,'0114675075','DEWI FARHANA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(54,'0106231060','FINA NAZWA RAHMA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(55,'0109912183','GANJAR PUTRA GUMILANG',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(56,'0103663723','JANE AL ZENA PONGO',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(57,'0108590793','KAILA NURCAHYANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(58,'0112456266','KHANSA NAFISAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(59,'0118313116','KHEYRA AULIA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(60,'0101830611','M. FIKRI NURZAINI SALAM',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(61,'0111900838','MOCH ZILBRAN ALFHARIZI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(62,'0104171543','MOCHAMAD FAHRI HUSAENI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(63,'0103546103','MUHAMMAD ARI NUGRAHA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(64,'0106068031','NAYSILA ASRI NOVIANTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(65,'0105893670','NAZLA RAMADHANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(66,'0105962496','NESA AGUSTRIANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(67,'0107192202','NESYA ASTIANTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(68,'0101784270','NINDA NUR ASARIFUDIN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(69,'0119751677','NOVI ARIYANTI MUSTOPA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(70,'0108396143','NURSIFA AMELIA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(71,'0106382283','PUTRA PRATAMA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(72,'0102008487','PUTRI OKTAVIANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(73,'0105421363','RAYA RAMADHANI SAFITRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(74,'0104251140','RAZKIA RAMDIANA MAULANA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(75,'0116142587','RENA APRILIA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(76,'0105803994','RINA AULIA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(77,'0107662223','RINI AUDI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(78,'0108840351','RISCHA JULIANTY',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(79,'0108663707','RIZQITA APRILLIA ANISA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(80,'0107440503','SILVA SAFIRA AULIA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(81,'0119940776','SITI NAFISYA PUTRI NOOR',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(82,'0107350595','SITI NURFAJRIYAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(83,'0106900955','SYAKILA WARDA ANJANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(84,'0107358541','TOMY TAUPIK RAHMAN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(85,'0106182069','TYARA DWI PUTRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(86,'0115730906','VIRA ALTHOFUNNISA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(87,'0115190212','VIRLI APRILIANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(88,'0109699362','VITA MEILANY',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(89,'0105918046','VITRI MELANI NUGRAHA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(90,'0108488884','ZIDNI SALIM BRIK BAJRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-MPLB 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(91,'0108842745','AANDINI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(92,'0101137098','ADHILLA NOVISHA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(93,'0118453911','AFDAL CAHYA RAJAB',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(94,'0106626474','AFIAH NURFADILAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(95,'0107607752','AFIZA QANITA EL FASHA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(96,'0108664503','AINUNNISA JELIKA DAMAYANTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(97,'0104854049','AIRA OKTAVIANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(98,'0104574913','ALDO PUTRA PRATAMA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(99,'0112970516','ALISHBA NUR AZMAH HARAHAP',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(100,'0104473734','BUNGA RAFIILIA SALSABIL',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(101,'0105598614','CAHAYA WULAN TIKA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(102,'0107087773','DEA TRIWAHYUNI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(103,'0105944154','DEFARA PUTRI KIRANA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(104,'0111563722','DENOVA DWI JAYANTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(105,'0118543412','EDO SAPUTRA PRATAMA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(106,'0109790704','EPA ROSITA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(107,'0104042192','HANDINI DWI ARYANTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(108,'0105906119','HANI OKTAPIANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(109,'0119364183','JAIDI NUR ROHMAN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(110,'0108602787','KAIFA MARWAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(111,'0114731941','KARISA NAYA PUTRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(112,'3111595947','KAYLA MARITZA SALSABILA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(113,'0094285560','KEYNAS SHIFA PURNAMA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(114,'0104478828','M. SANDI ANUGRAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(115,'0107827267','MALA NURPANJANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(116,'0115513148','NABIL RAYYA SILVIA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(117,'0112488850','NADIA AVIZAH AZAHRA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(118,'0102126514','NAFISAH KHOIRUNNISA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(119,'0096392285','NAYLA APRILIANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(120,'0106550426','RADILLA ALIFA PUTRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(121,'0103802470','RAFFI HAMDANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(122,'0109572245','RAFI SURYA GUMELAR',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(123,'0112018104','RAISYA INTAN QIRANIA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(124,'0104343432','SAEFUL FAHRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(125,'0114882322','SAFITRI NURMALA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(126,'3108479730','SALMA AULIA MALIK',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(127,'0101761642','SALSA SABILA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(128,'0116824187','SALWA ANANTA PUTRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(129,'0105467864','SALWA NURFADILAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(130,'0108556571','SARAH AZZAHRA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(131,'0117072793','TANTRI APRILYANTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(132,'0112715674','TASYA NUR APRILIYANTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(133,'0108099640','ZAHIRA ERVRITA CLARISA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(134,'0106136781','ZAHRA AVINA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 1',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(135,'0127520447','ALYA NUR MAULIDA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(136,'0113117086','ALYA RIZKI MAULIDA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(137,'0117121751','ALYASYFA FAUZIAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(138,'0105812939','ALYSSA NUR SHAFIRA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(139,'0108383031','AMANDA AGRA DISASTRA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(140,'0105309679','AMELIA RAHMATIN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(141,'0102749875','ANDHIRA RAMDHAN DHARMADI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(142,'0103139951','ANDINI AIRIN ALI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(143,'3117671624','CHANTIKA JASMINE THUFAILLAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(144,'0117091843','CITRA AYU NABILLA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(145,'0107164257','DESWITA MAHARANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(146,'0104794282','DETIANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(147,'0106108727','DEVINNA SHINTYA SARI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(148,'0102805087','DHIYA RAHMA HANNIYAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(149,'0108488518','FITRIA ANDJANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(150,'0112221165','FRIZKA ALFIONITA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(151,'0105714754','HANNA NASILA RAMADHANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(152,'0107451974','KEYSHA DWI ANANDHA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(153,'0104601044','KEYSHA RIZKI SEPTIYANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(154,'0111967782','KHALISA AIDA SHAFIRA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(155,'0116758050','LAILA ZAHRA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(156,'0116238867','MEISYA PUTRI ANDERI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(157,'0117688613','MELIA SRI RAHMASARI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(158,'0119127123','NAYLA DERI SAFITRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(159,'0108131847','NAZWA AL RITAZ MECCA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(160,'0119592302','NAZWA NURSIFA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(161,'0104420484','NISA APRILIA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(162,'0112991443','QISWA ALIFA MERYANDANY',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(163,'0112455530','RAUDHA REVI RISGRIANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(164,'0108520819','RAYNA JULIA MAVICA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(165,'0101230487','RAYSHA MASSAHID SENTONO',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(166,'0115312791','RD NISRINA ATHIRAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(167,'0119888336','RESTI CAHYANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(168,'0104125984','SARAH NUR SALSABILA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(169,'0101908063','SARAH OKTAPIANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(170,'0101081572','SATRIA RESTU RIADI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(171,'0102674753','SEKAR GHIANTY',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(172,'0117021602','SELLY APRILIANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(173,'0118365157','SHAILA NURHALIJAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(174,'0108317893','SHELA ISAURA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(175,'0104629544','TRI SAKTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(176,'0095668623','YANTI NURCAHYA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(177,'0106728951','ZALFA ALFIYAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(178,'0103686129','ZALFA ASHFIYA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 2',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(179,'3115272065','ANINDYA LUTHFATUS SA`DIYYAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(180,'0115645186','AQILLAH ZULFIANA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(181,'0115097324','ASHYFA AZAHRA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(182,'0107746400','AURA SAVA RADITYA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(183,'0104342917','AUREL RAM ZHULYESFA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(184,'0125928421','AZ ZAHRA PUTRI ARIYANTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(185,'0093018555','AZKA ALFARIZI ALIMUDIN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(186,'0107153580','AZKA ALLANA FAUZAN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(187,'0119965211','CLARISSA ISKANDAR',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(188,'0116267488','CYNTIA RAHMA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(189,'0107187530','DIANA ZULVA NURAFNI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(190,'0101068092','DIAS SAPUTRA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(191,'0114720977','DTRI NUR MAULANA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(192,'0105815220','DWI AYU LISTIAWATI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(193,'0109558448','IMELIA RACHMA DANIEZ',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(194,'0101575979','INTAN NURUL AINI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(195,'0109614123','KHALISTA JULIANTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(196,'0109129054','KHANIA GILDA RIYANA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(197,'0105919466','KHANSA ALIFAH AZZAHRA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(198,'0104505773','MEYLAN PUTRI ENGGAL ARDANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(199,'0106724648','MOZZA APRILLIA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(200,'0101871977','MUTIARA ZUHRIATUL HAFIDZ',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(201,'3100980098','NISA AULIA RAMADHANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(202,'0109758107','NURUL LATIFAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(203,'0118405939','NURYAMAN',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(204,'0101217195','PUTRI ELLENA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(205,'0109082581','PUTRI KARTIKA AMELLIANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(206,'0117670710','RESYA AMALIA PUTRI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(207,'0109623768','RHESMA NOVIYANTI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(208,'0119446341','RIPA PUTRI NURHAYATI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(209,'0111995868','RISKI ELDIANSA PILIANG',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(210,'0105361122','RIZAL AL - FARISI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(211,'3101890263','RIZKY NUR FADILAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(212,'0114245657','RUBY PUTRI ANJANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(213,'0106308647','RUMAISYA FADHILAH RAMADHANI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(214,'0105913598','SITI NURWATI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(215,'0118487841','SITI RAHMA DHIYA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(216,'0114756254','SOFIA SUMBINGAH',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(217,'0117356264','SYAHRIANI AGRIL',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(218,'0116630984','SYAHRIL AWALI LESMANA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(219,'0101719563','SYIFA LUMATUTS TSURAYA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(220,'0108625892','ZASKIYA AZZAHRA RIANDINI',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(221,'0111302611','ZIPANA MAULIDINA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(222,'0102180770','ZIVANA NAJLA NURFAJRIA',NULL,NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'X-PM 3',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(223,'0089997511','AGNI RAHAYU','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(224,'0077077182','AHMAD REFAN','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(225,'0093469454','AIRIN MAULINDA','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(226,'0093999188','ALIYA KHOERUNISA','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(227,'0092771332','ALYSSA SRI NURDEWI','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(228,'0089097891','ANISA PARADINA AGUSTIN','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(229,'0093343832','ANNIDA KHOERUNNISA','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(230,'0096776045','BINTANG RIZKY KURNIA','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(231,'0097465682','BULAN PERMATA WARDHANI','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(232,'0088755546','BUTSAINA DZURWA MUMTAZA','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(233,'0082134630','DENIA NUR FALAH','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(234,'0084953276','DESI NUR LESTARI','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(235,'0096513104','DESINTA NISRI KUSUMA','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(236,'0093953239','FAUZAN KARIMA','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(237,'0084376279','GIBRAN SYAHREZA','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(238,'0087655990','HENDRI MAULANA YUSUP','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(239,'0088514532','LUBNA FADHILAH DANIYAH','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(240,'0093548692','MEILI RIZKINA PUTRI','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(241,'0084169869','MITA','P',NULL,NULL,'$2y$12$NQw8VVceBxZXiPtVh9xgVuYxlwyfo.p02MoWjLWRHwrA5jtX9K1Uq','student',NULL,NULL,0,1,0,NULL,NULL,0,1,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-03 00:01:35'),
(242,'0093724681','MONI ASTRIYANI','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(243,'0098858266','MUHAMAD AFDZAN SBASTIAN','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(244,'0083707851','MUHAMAD FAHRI AL HIDAYAT','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(245,'0095384722','MUHAMMAD NAFIS SHIDDIQ','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(246,'0096821016','NATASYIA SAPUTRI','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(247,'0092748865','NAYARA KHANSA ZENINA','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(248,'0089996896','NAZWA FITRIA NABILA','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(249,'3084862933','NUR AFNI HERAWATI','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(250,'0093451127','OTNIEL GABRIEL SHANE COU L','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,1,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-03 00:14:56'),
(251,'0091503709','RAGIL AGUSTINO ANANDA SUR','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,1,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 21:22:05'),
(252,'0083428672','RAIHAN SHANDY PRATAMA','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(253,'0086052097','RAZIFF AFKAR RUSLI','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(254,'0089311128','RISTIAN DWIYANTO','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(255,'0093181066','RIZAL ANDHIKA WIJAYA','L',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(256,'0098286473','SINTA MEILINDA','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(257,'0095892129','YASMIN KAMILA DEWI','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38'),
(258,'0099807995','ZAHRA AGUSTIN PUTRI','P',NULL,NULL,'$2y$12$Hqn6aI1hU6/YamhOnDa2Cu8qr/x9LGasrPR6.bYpzEGQgngzHhL2K','student',NULL,NULL,0,1,0,NULL,NULL,0,0,'XII RPL',NULL,'2026-09-02 19:24:38','2026-09-02 19:24:38');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-09-03 19:59:20
