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
  kha_eddate: Date
};

/* Constructor */
function Habit(kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate)
{
  HabitModel.kha_identi = null;
  HabitModel.kha_name = kha_name != undefined ? kha_name : undefined;
  HabitModel.kha_descri = kha_descri != undefined ? kha_descri : '',
  HabitModel.kha_streak = kha_streak != undefined ? kha_streak : 0;
  HabitModel.kha_crdate = kha_crdate != undefined ? kha_crdate : new Date();
  HabitModel.kha_eddate = kha_eddate != undefined ? kha_eddate : null;
}

Habit.prototype.getModel = function() {
  return HabitModel;
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
  return HabitModel.kha_crdate != null ? HabitModel.kha_crdate.toISOString().replace(/T/, ' ').replace(/\..+/, '') : null;
}

Habit.prototype.kha_eddate = function() {
  return HabitModel.kha_eddate != null ? HabitModel.kha_eddate.toISOString().replace(/T/, ' ').replace(/\..+/, '') : null;
}

module.exports = Habit;