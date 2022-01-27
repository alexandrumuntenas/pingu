const Database = require('mysql2').createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATA,
	charset: 'utf8mb4_unicode_ci',
	waitForConnections: true,
	connectionLimit: 100,
	queueLimit: 0,
});

Database.config.namedPlaceholders = true;

module.exports = Database;
