const Habit = require('../models/Habit');
var conn = require('../models/dbconnection');

/*
 Gets each value of a Habit
 object and saves them as
 structured objects
 */
var getValues = function(req) {
  var result = [];
  if (req.query.identi !== undefined)
    result.push({"property": "identi", "type": "int", "value": req.query.identi});
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

  if (req.query.active !== undefined && req.query.active !== '')
    result.push({"property": "active", "type": "bool", "value": req.query.active});

  return result;
}

/*
Gets the value of a Habit object
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
of the GET (Habit)
*/
var getHabit_where = function(req){
  var query = '';
  var valueList = getValues(req);
  for (var i = 0; i < valueList.length; i++) {
    if (i == 0) {
      query += 'where ';
    } else if (i < valueList.length) {
      query += ' and ';
    }

    if (valueList[i].type === 'int'){
      query += `kha_${valueList[i].property} = ${valueList[i].value}`;
    }
    else if (valueList[i].type === 'string') {
      query += `kha_${valueList[i].property} like "%${valueList[i].value}%"`;
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
    } else if (valueList[i].type === 'bool') {
      /* */
      if (valueList[i].property === 'active'){
        query += `kha_${valueList[i].property} = ${valueList[i].value}`;
      }
    }
  }

  return query;
}

/*
Builds the VALUES section
of the POST (Habit) query
*/
var postHabit_values = function(habit) {
  var query = '';
  
  query += `"${habit.kha_name()}", "${habit.kha_descri()}", ${habit.kha_streak()}, '${habit.kha_crdate()}', ${habit.kha_active() !== undefined ? habit.kha_active() : true}`;

  return query;
}

/*
Builds the VALUES section
of the PUT (Habit) query
*/
var putHabit_values = function(habit) {
  var query = '';
  var valueList = [];

  if (habit.kha_name() !== undefined)
    valueList.push({"property": "kha_name", "type": "string", "value": habit.kha_name()});
  if (habit.kha_descri() !== undefined)
    valueList.push({"property": "kha_descri", "type": "string", "value": habit.kha_descri()});
  if (habit.kha_streak() !== undefined)
    valueList.push({"property": "kha_streak", "type": "int", "value": habit.kha_streak()});
  if (habit.kha_eddate() !== undefined)
    valueList.push({"property": "kha_eddate", "type": "date", "value": habit.kha_eddate()});
  if (habit.kha_active() !== undefined)
    valueList.push({"property": "kha_active", "type": "bool", "value": habit.kha_active()});

  if (valueList.length == 0)
    return undefined;

  console.log(`valueList.length == ${valueList.length}`);
  for (var i = 0; i < valueList.length; i++) {
    if (i != 0 && i < valueList.length)
      query += ',';

    if (valueList[i].type == 'string' || valueList[i].type == 'date')
      query += `${valueList[i].property} = '${valueList[i].value}'`;
    else
      query += `${valueList[i].property} = ${valueList[i].value}`;
  }
  
  return query;
}

module.exports = {

  /*
  Route /habit/get
  */
  async getHabit(req, res) {
    const { kha_identi, kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate, kha_active } = req.body;
    const habit = new Habit(kha_identi, kha_name, kha_descri, kha_streak, undefined, undefined, kha_active);

    var query = 'select kha_identi, kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate, kha_active from hab_keyhab ';
    query += getHabit_where(req) + ' order by kha_identi desc';

    console.log(`query: '${query}' | active: '${req.query.active}'`);

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

  /*
  Route /habit/post
  */
  async postHabit(req, res) {
    const { kha_identi, kha_name, kha_descri, kha_streak, kha_eddate, kha_active } = req.body;
    const habit = new Habit(kha_identi, kha_name, kha_descri, kha_streak, undefined, undefined, kha_active);

    const query = `insert into hab_keyhab ( kha_name, kha_descri, kha_streak, kha_crdate ${kha_eddate === undefined ? '' : ', kha_eddate'}, kha_active ) values ( ${postHabit_values(habit)} );`;

    // console.log('kha_crdate.toISOString(): ' + habit.kha_crdate() + ' / kha_eddate.toISOString(): ' + habit.kha_eddate());
    console.log(`query = ${query} \nhabit.kha_descri() = ${habit.kha_descri()}`);
    conn().query(query, [habit.kha_name(), habit.kha_descri(), habit.kha_streak(), habit.kha_crdate(), habit.kha_eddate(), habit.kha_active()], function(err, result) {
      if (err) throw err;
      console.log("Item inserted");

      return res.json(habit.getModel());
    });

  },
  
  /*
  Route /habit/put
  */
  async putHabit(req, res) {
    const { kha_identi, kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate, kha_active } = req.body;
    
    const habit = new Habit(kha_identi, kha_name, kha_descri, kha_streak, undefined, new Date(), kha_active);

    const setValues = putHabit_values(habit);

    if (setValues === undefined)
      return res.json({"result": "Error. You must insert at least one parameter."});


    const query = `update hab_keyhab set ${setValues} where kha_identi = ${kha_identi};`;

    console.log(`query = ${query}`);
    conn().query(query, function(err, result) {
      if (err) throw err;

      return res.json(habit.getModel());
    });
  },

  /*
  Route /habit/streak/add/:kha_identi
  */
  async addStreak(req, res) {
    console.log(`req.params = ${JSON.stringify(req.params)}`);
    const { kha_identi } = req.params;
    const query = `update hab_keyhab set kha_streak = kha_streak + 1 where kha_identi = ${kha_identi};`;
    console.log(`query = ${query} (kha_identi = ${kha_identi})`); // where (kha_identi) is undefined

    conn().query(query, function(err, result) {
      if (err) throw err;
      
      return res.json({ "result": "ok"});
    });
  },

  /*
  Route /habit/streak/reset/:kha_identi
  */
  async resetStreak(req, res) {
    console.log(`req.params = ${JSON.stringify(req.params)}`);
    const { kha_identi } = req.params;
    const query = `update hab_keyhab set kha_streak = 0 where kha_identi = ${kha_identi};`;
    console.log(`query = ${query} (kha_identi = ${kha_identi})`); // where (kha_identi) is undefined

    conn().query(query, function(err, result) {
      if (err) throw err;
      
      return res.json({ "result": "ok"});
    });
  }

};