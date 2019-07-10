const Habit = require('../models/Habit');
const conn = require('../models/dbconnection');
const util = require('util');

var getValues = function(req)
{
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

var getValue = function(arrayList, property, type)
{
  for (var i = 0; i < arrayList.length; i++)
  {
    if (arrayList[i].property === property && arrayList[i].type === type)
    {
      return arrayList[i];
    }
  }
}

var getQuery_where = function(req)
{
  var query = '';
  var valueList = getValues(req);
  for (var i = 0; i < valueList.length; i++)
  {
    if (i == 0)
    {
      query += 'where ';
    } else if (i < valueList.length - 1) {
      query += 'and ';
    }

    if (valueList[i].type === 'string')
    {
      query += `kha_${valueList[i].property} like "%${valueList[i].value}%"`
    } else if (valueList[i].type === 'dateStart')
    {
      /* Date > */
      if (valueList[i].property === 'crdate')
        var valueEnd = getValue(valueList, 'crdate', 'dateEnd');
      else if (valueList[i].property === 'eddate')
        var valueEnd = getValue(valueList, 'eddate', 'dateEnd');
      
      if (valueEnd !== undefined)
        query += `kha_${valueList[i].property} between ${valueList[i].value} and ${valueEnd.value} `;
      else
        query += `kha_${valueList[i].property} > '${valueList[i].value}' `;
    }
  }

  return query;
}

module.exports = {

  async getAll(req, res)
  {
    var query = 'select kha_identi, kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate from hab_keyhab ';
    
    query += getQuery_where(req);

    console.log('query: ' + query);

    // if (values.length > 0){
    //   foreach (val in values){
    //     query += "kha_" + val;
    //   }
    // }

    var objects = [];

    conn.query(query, function(err, result)
    {
      if (err) throw err;
      for (var i = 0; i < result.length; i++)
      {
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

  async getByDescription(req, res)
  {
    const query = 'select kha_identi, kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate from hab_keyhab where kha_descri like "?";';

    var objects = [];

    var setObjects = function(value)
    {
      objects = value;
    }

    console.log('req.query.description = ' + req.query.description);
    conn.query(query, [req.query.description], function(err, result) {
      if (err) throw err;
      for (var i = 0; i < result.length; i++)
      {
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

  async store(req, res)
  {
    const { kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate } = req.body;
    const query = 'insert into hab_keyhab ( kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate ) values ("?", "?", ?, \'?\', ?)';
    
    const habit = new Habit(kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate);

    conn.connect();

    // console.log('kha_crdate.toISOString(): ' + habit.kha_crdate() + ' / kha_eddate.toISOString(): ' + habit.kha_eddate());
    conn.query(query, [[habit.kha_name(), habit.kha_descri(), habit.kha_streak(), habit.kha_crdate(), habit.kha_eddate()]], function(err, result)
    {
      if (err) throw err;
      console.log("Item inserted");
    });

    return res.json(habit.getModel());
  }
};