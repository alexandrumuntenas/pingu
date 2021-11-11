require('dotenv').config()
const mysql = require('mysql2')

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA,
  charset: 'utf8_unicode_ci'
})

con.connect(function (err) {
  if (err) throw err
  console.log('Connected!')
})

con.config.namedPlaceholders = true

con.query('SELECT * FROM `guildEconomyBankTransferBook`', (err, rows) => {
  if (err) console.log(err)
  rows.forEach(element => {
    console.log('Updated transaction ' + element.transactionID)
    con.query('UPDATE `guildEconomyBankTransferBook` SET guild = ? WHERE  transactionID = ?', [element.emisor, element.transactionID])
  })
})
