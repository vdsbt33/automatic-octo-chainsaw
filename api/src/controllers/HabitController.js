const Habit = require('../models/Habit');
const mysql = require('mysql');
const dbconnection = require('../models/dbconnection');
const util = require('util');

module.exports = {

  async store(req, res) {
    const { kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate } = req.body;
    const query = 'insert into hab_keyhab ( kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate ) values ("?", "?", ?, \'?\', ?)';
    
    const habit = new Habit(kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate);

    dbconnection.connect();

    // console.log('kha_crdate.toISOString(): ' + habit.kha_crdate() + ' / kha_eddate.toISOString(): ' + habit.kha_eddate());
    dbconnection.query(query, [[habit.kha_name(), habit.kha_descri(), habit.kha_streak(), habit.kha_crdate(), habit.kha_eddate()]], function(err, result) {
      if (err) throw err;
      console.log("Item inserted");
    });
    
    dbconnection.end();

    return res.json(habit.getModel());
  }
};