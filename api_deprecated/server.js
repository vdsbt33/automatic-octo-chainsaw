/* Imports express and sets port */
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Task = require('./api/models/todoListModel'),
  bodyParser = require('body-parser');

/* instantiating connection */
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://root:admin@cluster0-ux3ht.mongodb.net/test?retryWrites=true&w=majority');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/todoListRoutes');
routes(app);

/* Listens to the open port */
app.listen(port); 

console.log("todo list RESTful API server started on port " + port);