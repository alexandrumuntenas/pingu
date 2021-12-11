require('dotenv').config();
const mysql = require('mysql2');

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA,
  charset: 'utf8_unicode_ci'
});

con.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

con.config.namedPlaceholders = true;

con.query('SELECT * FROM `guildLevelsConfig`', async (err, rows) => {
  if (err) console.log(err);
  rows.forEach((element) => {
    con.query('UPDATE `guildData` SET `levelsChannel` = ?, `levelsMessage` = ?, `levelsDifficulty` = ? WHERE `guildData`.`guild` = ?', [element.levelsChannel, element.levelsMessage, element.levelsDifficulty, element.guild], (err) => {
      if (err) console.log(err);
      console.log(`Updated ${element.guild}`);
    });
  });
});
