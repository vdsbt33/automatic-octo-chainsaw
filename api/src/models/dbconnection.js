var mysql = require('mysql');
    port = process.env.PORT || 3333;

if (port === 3333) {
  var connection = mysql.createConnection({
    host: 'br972.hostgator.com.br',
    port: 80,
    user: 'kosmod91_R00T',
    password: 'REPLACEME',
    database: 'kosmod91_habitrack',
    insecureAuth: true
  });
} else {

}

module.exports = connection;