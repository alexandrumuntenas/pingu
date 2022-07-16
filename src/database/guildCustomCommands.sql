CREATE TABLE `guildCustomCommands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guild` bigint(255) NOT NULL,
  `customCommand` longtext COLLATE utf8mb4_bin NOT NULL,
  `customcommandproperties` longtext COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin