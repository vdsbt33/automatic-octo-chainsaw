const Habit = require('../models/Habit');
const conn = require('../models/dbconnection');
const util = require('util');

module.exports = {

  async getAll(req, res) {
    var query = 'select kha_identi, kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate from hab_keyhab ';
    
    if (req.query.name !== undefined) {
      query += `where kha_name like "%${req.query.name}%"`;
    } else if (req.query.description !== undefined) {
      query += `where kha_descri like "%${req.query.description}%"`;
    } else if (req.query.crdate !== undefined) {
      query += `where kha_crdate = "%${req.query.crdate}%"`;
    } else if (req.query.eddate !== undefined) {
      query += `where kha_eddate = "%${req.query.eddate}%"`;
    }

    var objects = [];

    var setObjects = function(value) {
      objects = value;
    }

    conn.query(query, function(err, result) {
      if (err) throw err;
      for (var i = 0; i < result.length; i++){
        // results.push(new Habit(result[i].kha_identi, result[i].kha_name, result[i].kha_descri, result[i].kha_streak, result[i].crdate, result[i].eddate));
        objects.push(result[i]);
      }

      /*
      This was put here instead of outside conn.query
      Because this function is async, which means I was
      returning the value before the response came back.
      */
      return res.json(objects);
    });

    /* Ending connection means I will have to create it again */
    // conn.endConnection();

    // return res.json(objects);
  },

  async getByDescription(req, res) {
    const query = 'select kha_identi, kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate from hab_keyhab where kha_descri like "?";';

    var objects = [];

    var setObjects = function(value) {
      objects = value;
    }

    console.log('req.query.description = ' + req.query.description);
    conn.query(query, [req.query.description], function(err, result) {
      if (err) throw err;
      for (var i = 0; i < result.length; i++){
        objects.push(result[i]);
      }

      /*
      This was put here instead of outside conn.query
      Because this function is async, which means I was
      returning the value before the response came back.
      */
      return res.json(objects);
    });

    // conn.endConnection();

    // return res.json(objects);
  },

  async store(req, res) {
    const { kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate } = req.body;
    const query = 'insert into hab_keyhab ( kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate ) values ("?", "?", ?, \'?\', ?)';
    
    const habit = new Habit(kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate);

    conn.connect();

    // console.log('kha_crdate.toISOString(): ' + habit.kha_crdate() + ' / kha_eddate.toISOString(): ' + habit.kha_eddate());
    conn.query(query, [[habit.kha_name(), habit.kha_descri(), habit.kha_streak(), habit.kha_crdate(), habit.kha_eddate()]], function(err, result) {
      if (err) throw err;
      console.log("Item inserted");
    });

    return res.json(habit.getModel());
  }
};