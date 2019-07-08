const HabitSchema = {
  kha_identi: Number,
  kha_name: String,
  kha_descri: String,
  kha_streak: {
    type: Number,
    default: 0
  },
  kha_crdate: Date,
  kha_eddate: Date
};

module.exports = HabitSchema;