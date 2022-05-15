CREATE TABLE `guildSuggestions` (
  `id` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `guild` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `author` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `suggestion` longtext COLLATE utf8mb4_bin NOT NULL,
  `notes` longtext COLLATE utf8mb4_bin NOT NULL DEFAULT '[]',
  `status` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT 'pending',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `votingresults` longtext COLLATE utf8mb4_bin NOT NULL DEFAULT '{}',
  `reviewer` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  UNIQUE KEY `suggestionId` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin