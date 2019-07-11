const Habit = require('../models/Habit');
var conn = require('../models/dbconnection');
const util = require('util');

var getValues = function(req) {
  var result = [];
  if (req.query.name !== undefined)
    result.push({"property": "name", "type": "string", "value": req.query.name});
  if (req.query.descri !== undefined)
    result.push({"property": "descri", "type": "string", "value": req.query.descri});
  
    if (req.query.crdateStart !== undefined)
  result.push({"property": "crdate", "type": "dateStart", "value": req.query.crdateStart});
  if (req.query.crdateEnd !== undefined)
  result.push({"property": "crdate", "type": "dateEnd", "value": req.query.crdateEnd});
  
  if (req.query.eddateStart !== undefined)
  result.push({"property": "eddate", "type": "dateStart", "value": req.query.eddateStart});
  if (req.query.eddateEnd !== undefined)
  result.push({"property": "eddate", "type": "dateEnd", "value": req.query.eddateEnd});

  return result;
}

var getValue = function(arrayList, property, type) {
  for (var i = 0; i < arrayList.length; i++) {
    if (arrayList[i].property === property && arrayList[i].type === type) {
      return arrayList[i];
    }
  }
}

/* Builds the where conditions of the GET (Habit) */
var getQuery_where = function(req){
  var query = '';
  var valueList = getValues(req);
  for (var i = 0; i < valueList.length; i++) {
    if (i == 0) {
      query += 'where ';
    } else if (i < valueList.length - 1) {
      query += 'and ';
    }

    if (valueList[i].type === 'string') {
      query += `kha_${valueList[i].property} like "%${valueList[i].value}%"`
    } else if (valueList[i].type === 'dateStart') {
      /* Date > */
      if (valueList[i].property === 'crdate')
        var valueEnd = getValue(valueList, 'crdate', 'dateEnd');
      else if (valueList[i].property === 'eddate')
        var valueEnd = getValue(valueList, 'eddate', 'dateEnd');
      
      if (valueEnd !== undefined)
        query += `kha_${valueList[i].property} between '${valueList[i].value}' and '${valueEnd.value}' `;
      else
        query += `kha_${valueList[i].property} >= '${valueList[i].value}' `;
    }
  }

  return query;
}

/* Builds the where conditions of the POST (Habit) */
var postQuery_values = function(habit){
  var query = '';
  
  query += `"${habit.kha_name()}", "${habit.kha_descri()}", ${habit.kha_streak()}, '${habit.kha_crdate()}' ${habit.kha_eddate() === undefined ? '' : ", '" + habit.kha_eddate() + "'"});`;

  return query;
}

module.exports = {

  async get(req, res) {

    var query = 'select kha_identi, kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate from hab_keyhab ';
    query += getQuery_where(req);

    console.log('query: ' + query);

    var objects = [];

    conn().query(query, function(err, result) {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
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
    // return res.json(objects);
  },

  async post(req, res) {
    const { kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate } = req.body;
    const habit = new Habit(kha_name, kha_descri, kha_streak, undefined, undefined);

    const query = `insert into hab_keyhab ( kha_name, kha_descri, kha_streak, kha_crdate ${kha_eddate === undefined ? '' : ', kha_eddate'} ) values ( ${postQuery_values(habit)}`;

    // console.log('kha_crdate.toISOString(): ' + habit.kha_crdate() + ' / kha_eddate.toISOString(): ' + habit.kha_eddate());
    console.log(`query = ${query} \nhabit.kha_descri() = ${habit.kha_descri()}`);
    conn().query(query, [habit.kha_name(), habit.kha_descri(), habit.kha_streak(), habit.kha_crdate(), habit.kha_eddate()], function(err, result) {
      if (err) throw err;
      console.log("Item inserted");

      return res.json(habit.getModel());
    });

  }
};