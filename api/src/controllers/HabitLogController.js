const HabitLog = require('../models/HabitLog');
var conn = require('../models/dbconnection');


/*
 Gets each value of a Habit Log
 object and saves them as
 structured objects
 */
var getValues = function(req) {
  var result = [];
  if (req.query.identi !== undefined)
    result.push({"property": "identi", "type": "int", "value": req.query.identi});
  if (req.query.kha_identi !== undefined)
    result.push({"property": "kha_identi", "type": "int", "value": req.query.kha_identi});
  if (req.query.action !== undefined)
    result.push({"property": "action", "type": "string", "value": req.query.action});
  if (req.query.streak !== undefined)
    result.push({"property": "streak", "type": "int", "value": req.query.streak});
  
  if (req.query.crdateStart !== undefined)
    result.push({"property": "crdate", "type": "dateStart", "value": req.query.crdateStart});
  if (req.query.crdateEnd !== undefined)
    result.push({"property": "crdate", "type": "dateEnd", "value": req.query.crdateEnd});

  return result;
}

/*
Gets the value of a Habit Log object
in a list according to it's property
name and type
*/
var getValue = function(arrayList, property, type) {
  for (var i = 0; i < arrayList.length; i++) {
    if (arrayList[i].property === property && arrayList[i].type === type) {
      return arrayList[i];
    }
  }
}

/*
Builds the where conditions
of the GET (Habit Log)
*/
var getLog_where = function(req){
  var query = '';
  var valueList = getValues(req);
  for (var i = 0; i < valueList.length; i++) {
    if (i == 0) {
      query += 'where ';
    } else if (i < valueList.length) {
      query += ' and ';
    }

    if (valueList[i].type === 'int'){
      query += `stl_${valueList[i].property} = ${valueList[i].value}`;
    }
    else if (valueList[i].type === 'string') {
      query += `stl_${valueList[i].property} like "%${valueList[i].value}%"`;
    } else if (valueList[i].type === 'dateStart') {
      /* Date > */
      if (valueList[i].property === 'crdate')
        var valueEnd = getValue(valueList, 'crdate', 'dateEnd');
      
      if (valueEnd !== undefined)
        query += `stl_${valueList[i].property} between '${valueList[i].value}' and '${valueEnd.value}' `;
      else
        query += `stl_${valueList[i].property} >= '${valueList[i].value}' `;
    }
  }

  return query;
}

/*
Builds the VALUES section
of the POST (Habit Log) query
*/
var postLog_values = function(log) {
  var query = '';
  
  query += `${log.stl_kha_identi()}, "${log.stl_action()}", ${log.stl_streak()}, '${log.stl_crdate()}'`;

  return query;
}

module.exports = {

  /*
  Route /habit/log/get
  */
  async getLog(req, res) {

    var query = 'select stl_identi, stl_kha_identi, stl_action, stl_streak, stl_crdate from hab_strlog ';
    query += getLog_where(req) + ' order by stl_identi desc';

    console.log(`query: ${query}`);
    var objects = [];

    conn().query(query, function(err, result) {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        objects.push(result[i]);
      }

      return res.json(objects);
    });
  },

  /*
  Route /habit/log/post
  */
 async postLog(req, res) {
   //stl_identi, stl_kha_identi, stl_action, stl_streak, stl_crdate from hab_strlog
    const { stl_kha_identi, stl_action, stl_streak } = req.body;
    const log = new HabitLog(undefined, stl_kha_identi, stl_action, stl_streak, undefined);

    const query = `insert into hab_strlog ( stl_kha_identi, stl_action, stl_streak, stl_crdate ) values ( ${postLog_values(log)} );`;

    // console.log('kha_crdate.toISOString(): ' + habit.kha_crdate() + ' / kha_eddate.toISOString(): ' + habit.kha_eddate());
    // console.log(`query = ${query}`);
    console.log(`habitLog = ${JSON.stringify(log)}`);
    conn().query(query, function(err, result) {
      if (err) throw err;
      console.log("Item inserted");

      return res.json(log.getModel());
    });

  }

};