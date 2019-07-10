const Habit = require('../models/Habit');
const conn = require('../models/dbconnection');
const util = require('util');

module.exports = {

  async getAll(req, res) {
    const query = 'select kha_identi, kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate from hab_keyhab;';

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