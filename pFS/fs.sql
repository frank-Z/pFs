-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        10.1.1-MariaDB - mariadb.org binary distribution
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 导出 fs 的数据库结构
CREATE DATABASE IF NOT EXISTS `fs` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `fs`;


-- 导出  表 fs.file 结构
CREATE TABLE IF NOT EXISTS `file` (
  `f_id` int(11) NOT NULL AUTO_INCREMENT,
  `f_name` varchar(50) NOT NULL,
  `f_u_id` int(11) NOT NULL,
  `f_u_uname` varchar(50) NOT NULL,
  `f_u_ulib` int(11) NOT NULL,
  `f_url` text NOT NULL,
  `f_hash` varchar(50) NOT NULL,
  `last_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`f_id`),
  KEY `u_id` (`f_u_id`),
  KEY `f_u_ulib` (`f_u_ulib`),
  KEY `f_u_uname` (`f_u_uname`),
  CONSTRAINT `FK_file_libarary` FOREIGN KEY (`f_u_id`) REFERENCES `library` (`l_u_id`),
  CONSTRAINT `FK_file_libarary_2` FOREIGN KEY (`f_u_uname`) REFERENCES `library` (`l_u_uname`),
  CONSTRAINT `FK_file_libarary_3` FOREIGN KEY (`f_u_ulib`) REFERENCES `library` (`l_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- 正在导出表  fs.file 的数据：~3 rows (大约)
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` (`f_id`, `f_name`, `f_u_id`, `f_u_uname`, `f_u_ulib`, `f_url`, `f_hash`, `last_at`, `create_at`) VALUES
	(4, 'fileNameTest', 1, 'yonghu2', 123, '201702\\20170227\\2017022710\\6f7c34696f0f738e4452b3f407eca27c.txt', '', '2017-02-27 10:28:40', '2017-02-27 10:28:40'),
	(5, '呵呵', 1, 'yonghu2', 123, '201702\\20170227\\2017022710\\d5b25fb1334cc572fa718d41a9e6b360.txt', '', '2017-02-27 10:52:57', '2017-02-27 10:52:57'),
	(6, '123', 1, 'yonghu2', 123, '201702\\20170227\\2017022711\\867b8b9fb5918625a85f3a0256aca047.txt', '', '2017-02-27 11:07:04', '2017-02-27 11:07:04'),
	(7, '啦啦啦', 1, 'yonghu2', 123, '201702\\20170227\\2017022711\\013e080bcce8be2407f34c3d94455b02.txt', '46b13192432a5bc74183f3430dc2c61d', '2017-02-27 11:19:00', '2017-02-27 11:19:00');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;


-- 导出  表 fs.library 结构
CREATE TABLE IF NOT EXISTS `library` (
  `l_id` int(11) NOT NULL AUTO_INCREMENT,
  `l_name` varchar(50) NOT NULL,
  `l_u_id` int(11) NOT NULL,
  `l_u_uname` varchar(50) NOT NULL,
  `l_pid` int(11) NOT NULL DEFAULT '0',
  `last_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`l_id`),
  KEY `l_u_id` (`l_u_id`),
  KEY `l_u_uname` (`l_u_uname`),
  CONSTRAINT `FK_libarary_user` FOREIGN KEY (`l_u_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8;

-- 正在导出表  fs.library 的数据：~4 rows (大约)
/*!40000 ALTER TABLE `library` DISABLE KEYS */;
INSERT INTO `library` (`l_id`, `l_name`, `l_u_id`, `l_u_uname`, `l_pid`, `last_at`, `create_at`) VALUES
	(2, 'addku', 1, 'testA', 0, '2017-02-27 12:52:20', '2017-02-27 12:52:20'),
	(3, 'addku22', 1, 'testA', 2, '2017-02-27 12:57:14', '2017-02-27 12:57:14'),
	(4, 'addku22', 1, 'testA', 3, '2017-02-27 12:59:59', '2017-02-27 12:59:59'),
	(5, 'addku1', 1, 'testA', 0, '2017-02-27 13:44:30', '2017-02-27 13:26:26'),
	(123, 'hehe', 1, 'yonghu2', 0, '2017-02-27 10:06:26', '2017-02-24 09:48:03'),
	(124, 'addku22', 1, 'testA', 2, '2017-02-27 12:57:14', '2017-02-27 12:57:14'),
	(125, 'addku22', 1, 'testA', 2, '2017-02-27 12:57:14', '2017-02-27 12:57:14'),
	(126, 'addku22', 1, 'testA', 2, '2017-02-27 12:57:14', '2017-02-27 12:57:14'),
	(127, 'addku22', 1, 'testA', 124, '2017-02-28 12:42:33', '2017-02-27 12:57:14'),
	(128, 'addku22', 1, 'testA', 124, '2017-02-28 12:42:35', '2017-02-27 12:57:14'),
	(129, 'hehe', 1, 'yonghu2', 0, '2017-02-27 10:06:26', '2017-02-24 09:48:03'),
	(130, 'hehe', 1, 'yonghu2', 0, '2017-02-27 10:06:26', '2017-02-24 09:48:03'),
	(131, 'hehe', 1, 'yonghu2', 0, '2017-02-27 10:06:26', '2017-02-24 09:48:03'),
	(132, 'addku22', 1, 'testA', 124, '2017-02-28 12:42:35', '2017-02-27 12:57:14'),
	(133, 'addku22', 1, 'testA', 132, '2017-02-28 12:43:44', '2017-02-27 12:57:14'),
	(134, 'addku22', 1, 'testA', 132, '2017-02-28 12:43:45', '2017-02-27 12:57:14'),
	(135, 'addku22', 1, 'testA', 132, '2017-02-28 12:43:45', '2017-02-27 12:57:14'),
	(136, 'addku22', 1, 'testA', 132, '2017-02-28 12:43:47', '2017-02-27 12:57:14');
/*!40000 ALTER TABLE `library` ENABLE KEYS */;


-- 导出  表 fs.user 结构
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `sign` varchar(50) NOT NULL,
  `last_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- 正在导出表  fs.user 的数据：~1 rows (大约)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `name`, `sign`, `last_at`, `create_at`) VALUES
	(1, 'test', '123fffff', '2017-02-24 09:46:51', '2017-02-24 09:46:51');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
