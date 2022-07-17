CREATE TABLE `guildConfigurations` (
  `guild` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `common` longtext COLLATE utf8mb4_bin DEFAULT NULL,
  `welcome` longtext COLLATE utf8mb4_bin DEFAULT NULL,
  `farewell` longtext COLLATE utf8mb4_bin DEFAULT NULL,
  `leveling` longtext COLLATE utf8mb4_bin DEFAULT NULL,
  `autoreply` longtext COLLATE utf8mb4_bin DEFAULT NULL,
  `customcommands` longtext COLLATE utf8mb4_bin DEFAULT NULL,
  `moderation` longtext COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`guild`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin