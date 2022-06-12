CREATE TABLE `memberData` (
  `member` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `guild` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `lvlLevel` longtext COLLATE utf8mb4_bin NOT NULL DEFAULT '1',
  `lvlExperience` longtext COLLATE utf8mb4_bin NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin