let mysql = require('mysql');

let connection = mysql.createConnection({
//    debug: true,

	host: 'localhost',
	port: 3306,
	user: 'cs386_jsalman',
	password:'sa0031',
	database: 'cs386_jsalman'
});

module.exports = connection;