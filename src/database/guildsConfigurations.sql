CREATE TABLE `guildConfigurations` (
  `guild` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `common` longtext COLLATE utf8mb4_bin DEFAULT '{"language":"es","prefix":"!","interactions":{"enabled":true}}',
  `interactions` longtext COLLATE utf8mb4_bin DEFAULT NULL,
  `welcome` longtext COLLATE utf8mb4_bin DEFAULT '{"enabled":false,"channel":"0","message":"Hey {user}, welcome to **{server}**!","welcomecard":{"enabled":true,"background":"https://raw.githubusercontent.com/alexandrumuntenas/pingu/main/setup/defaultresourcesforguilds/backgroundforwelcomecard.jpg","title":"{user.tag} just joined the server","subtitle":"Member #{server.member_count}","overlay":{"color":"#044860","opacity":50}},"roles":[]}',
  `farewell` longtext COLLATE utf8mb4_bin DEFAULT '{"enabled":false,"channel":"0","message":"**{user.tag}** just left the server"}',
  `leveling` longtext COLLATE utf8mb4_bin DEFAULT '{"enabled":true,"channel":"1","message":"GG {user}, you just advanced to level {newlevel}!","difficulty":1,"card":{"background":"https://raw.githubusercontent.com/alexandrumuntenas/pingu/main/setup/defaultresourcesforguilds/backgroundforlevelingcards.jpg","overlay":{"color":"#030305","opacity":75}}}',
  `suggestions` longtext COLLATE utf8mb4_bin DEFAULT '{enable:false}',
  `autoreplies` longtext COLLATE utf8mb4_bin DEFAULT '{enable:false}',
  `customcommands` longtext COLLATE utf8mb4_bin DEFAULT '{enable:false}',
  `mcsrvstatus` longtext COLLATE utf8mb4_bin NOT NULL DEFAULT '{"enabled":false}',
  `moderation` longtext COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`guild`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin