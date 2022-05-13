CREATE TABLE`guildAutoReply`(
  `guild` varchar(255) NOT NULL,
  `autoreplyID` varchar(255) NOT NULL,
  `autoreplyTrigger` longtext NOT NULL,
  `autoreplyReply` longtext NOT NULL,
  `autoreplyProperties` longtext NOT NULL,
  UNIQUE KEY`autoreplyID`(`autoreplyID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4