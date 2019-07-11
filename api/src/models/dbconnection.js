var mysql = require('mysql');
    port = process.env.PORT || 3333;
var WebConfig = require('./WebConfig.json');
  var connection;

function handleDisconnect() {
  if (connection === undefined) {
    connection = mysql.createConnection(WebConfig);

    connection.connect(function (err) {
      setInterval(function() {
        console.log('selecting 1 in db');
        connection.query('SELECT 1;');
      }, 5000);
    });
  }

  
  connection.on('error', function (err) {
    console.log('db error ', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('DISCONNECTED. Creating new connection');
    connection.end(0);
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

var getConnection = function() {
  handleDisconnect();
  
  return connection;
}
  

module.exports = getConnection;