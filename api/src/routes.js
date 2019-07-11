const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  multer = require('multer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const routes = new express.Router();
const HabitController = require('./controllers/HabitController');

// app.get('/habits', HabitController.getAll);
app.get('/habit/get', HabitController.getHabit);
app.post('/habit/post', HabitController.postHabit);
app.put('/habit/put', HabitController.putHabit);
app.put('/habit/streak/add/:kha_identi', HabitController.addStreak);
app.put('/habit/streak/reset/:kha_identi', HabitController.resetStreak);

/*
middleware is a function that always receive [req, res]
An interceptor of requests

req = request
res = response
*/


// routes.get('/', (req, res) => {
//   return res.send(`Hello ${req.query.name}`);
// });

// routes.post('/habit', HabitController.store);



module.exports = app;