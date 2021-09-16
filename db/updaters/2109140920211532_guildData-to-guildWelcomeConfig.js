const mysql = require('mysql2')

const con = mysql.createConnection({
  host: '#',
  user: '#',
  password: '#',
  database: '#',
  charset: 'utf8_unicode_ci'
})

con.connect(function (err) {
  if (err) throw err
  console.log('Connected!')
})

con.config.namedPlaceholders = true

con.query('SELECT * FROM `guildData` WHERE `welcome_enabled` = 1', async (err, rows) => {
  if (err) console.log(err)
  rows.forEach(element => {
    console.log('Inserted ' + element.guild)
    con.query('INSERT INTO `guildWelcomerConfig` (`guild`, `welcomeEnabled`, `welcomeChannel`, `welcomeMessage`, `welcomeImage`, `welcomeImageBackground`, `welcomeImageCustomBackground`, `welcomeRoles`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [element.guild, element.welcome_enabled, element.welcome_channel, element.welcome_message, element.welcome_image, element.welcome_image_background, element.welcome_image_customBackground, element.welcome_roles])
  })
})

con.query('SELECT * FROM `guildData` WHERE `welcome_enabled` = 0', async (err, rows) => {
  if (err) console.log(err)
  rows.forEach(element => {
    console.log('Inserted ' + element.guild)
    con.query('INSERT INTO `guildWelcomerConfig` (`guild`, `welcomeEnabled`, `welcomeChannel`, `welcomeMessage`, `welcomeImage`, `welcomeImageBackground`, `welcomeImageCustomBackground`, `welcomeRoles`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [element.guild, element.welcome_enabled, element.welcome_channel, element.welcome_message, element.welcome_image, element.welcome_image_background, element.welcome_image_customBackground, element.welcome_roles])
  })
})

process.exit()
