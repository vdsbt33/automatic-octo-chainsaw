/*
Reference:
http://timjrobinson.com/how-to-structure-your-nodejs-models-2/
*/

const HabitModel = {
  kha_identi: {
    type: Number,
    default: 0
  },
  kha_name: String,
  kha_descri: {
    type: String,
    default: ''
  },
  kha_streak: {
    type: Number,
    default: 0
  },
  kha_crdate: {
    type: Date,
    default: new Date()
  },
  kha_eddate: Date,
  kha_active: {
    type: Boolean,
    default: true
  }
};

/* Constructor */
function Habit(kha_identi, kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate, kha_active)
{
  HabitModel.kha_identi = kha_identi != undefined ? kha_identi : undefined;
  HabitModel.kha_name = kha_name != undefined ? kha_name : undefined;
  HabitModel.kha_descri = kha_descri != undefined ? kha_descri : undefined,
  HabitModel.kha_streak = kha_streak != undefined ? kha_streak : undefined;
  HabitModel.kha_crdate = kha_crdate != undefined ? kha_crdate : new Date();
  HabitModel.kha_eddate = kha_eddate != undefined ? kha_eddate : undefined;
  HabitModel.kha_active = kha_active != undefined ? kha_active : undefined;
}

Habit.prototype.getModel = function() {
  return HabitModel;
}

/*
Returns the values in an array
The param `acceptUndefined` controls
whether unset values are also added to the array
*/
Habit.prototype.getValues = function(acceptUndefined) {
  var values = [];

  if ((req.query.identi === undefined && acceptUndefined === true) || req.query.identi !== undefined)
    result.push({"property": "identi", "type": "int", "value": req.query.identi});
  if ((req.query.name === undefined && acceptUndefined === true) || req.query.name !== undefined)
    result.push({"property": "name", "type": "string", "value": req.query.name});
  if ((req.query.descri === undefined && acceptUndefined === true) || req.query.descri !== undefined)
    result.push({"property": "descri", "type": "string", "value": req.query.descri});
  
  if ((req.query.crdate === undefined && acceptUndefined === true) || req.query.crdate !== undefined)
    result.push({"property": "crdate", "type": "dateStart", "value": req.query.crdate});
  
  if ((req.query.eddate === undefined && acceptUndefined === true) || req.query.eddate !== undefined)
    result.push({"property": "eddate", "type": "dateStart", "value": req.query.eddate});

  if (((req.query.active === undefined || req.query.active === '') && acceptUndefined === true) || req.query.active !== undefined)
    result.push({"property": "active", "type": "bool", "value": req.query.active});
}

Habit.prototype.kha_identi = function() {
  return HabitModel.kha_identi;
}

Habit.prototype.kha_name = function() {
  return HabitModel.kha_name;
}

Habit.prototype.kha_descri = function() {
  return HabitModel.kha_descri;
}

Habit.prototype.kha_streak = function() {
  return HabitModel.kha_streak;
}

Habit.prototype.kha_crdate = function() {
  return HabitModel.kha_crdate != undefined ? HabitModel.kha_crdate.toISOString().replace(/T/, ' ').replace(/\..+/, '') : undefined;
}

Habit.prototype.kha_eddate = function() {
  return HabitModel.kha_eddate != undefined ? HabitModel.kha_eddate.toISOString().replace(/T/, ' ').replace(/\..+/, '') : undefined;
}

Habit.prototype.kha_active = function() {
  return HabitModel.kha_active;
}

module.exports = Habit;