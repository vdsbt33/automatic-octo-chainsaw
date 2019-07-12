const LogModel = {
  stl_identi: {
    type: Number,
    default: 0
  },
  stl_kha_identi: Number,
  stl_action: String,
  stl_streak: Number,
  stl_crdate: {
    type: Date,
    default: new Date()
  }
};

function HabitLog(stl_identi, stl_kha_identi, stl_action, stl_streak, stl_crdate) {
  LogModel.stl_identi = stl_identi !== undefined ? stl_identi : undefined;
  LogModel.stl_kha_identi = stl_kha_identi !== undefined ? stl_kha_identi : undefined;
  LogModel.stl_action = stl_action !== undefined ? stl_action : undefined;
  LogModel.stl_streak = stl_streak !== undefined ? stl_streak : undefined;
  LogModel.stl_crdate = stl_crdate !== undefined ? stl_crdate : new Date();
}

HabitLog.prototype.getModel = function() {
  return LogModel;
}

HabitLog.prototype.stl_identi = function() {
  return LogModel.stl_identi;
}

HabitLog.prototype.stl_kha_identi = function() {
  return LogModel.stl_kha_identi;
}

HabitLog.prototype.stl_action = function() {
  return LogModel.stl_action;
}

HabitLog.prototype.stl_streak = function() {
  return LogModel.stl_streak;
}

HabitLog.prototype.stl_crdate = function() {
  return LogModel.stl_crdate != undefined ? LogModel.stl_crdate.toISOString().replace(/T/, ' ').replace(/\..+/, '') : undefined;
}

module.exports = HabitLog;