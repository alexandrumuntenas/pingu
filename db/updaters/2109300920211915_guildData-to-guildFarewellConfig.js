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

con.query('SELECT * FROM `guildData`', async (err, rows) => {
  if (err) console.log(err);
  rows.forEach((element) => {
    console.log(`Inserted ${element.guild}`);
    con.query('INSERT INTO `guildFarewellConfig` (`guild`, `farewellEnabled`, `farewellChannel`, `farewellMessage`) VALUES (?, ?, ?, ?)', [element.guild, element.farewell_enabled, element.farewell_channel, element.farewell_message]);
  });
  process.exit();
});
