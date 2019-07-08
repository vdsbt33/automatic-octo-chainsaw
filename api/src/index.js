const express = require('express');
const mongoose = require('mongoose');

const app = express()

// mongoose.connect('mongodb+srv://root:admin@cluster0-ux3ht.mongodb.net/test?retryWrites=true&w=majority', {
//   useNewUrlParser: true
// });

/*
  $servername = 'br972.hostgator.com.br';
  $dbname = "kosmod91_habitrack";
  $username = 'kosmod91_R00T';
  $password = 'REPLACEME';
*/


app.use(require('./routes'));

app.listen(3333);