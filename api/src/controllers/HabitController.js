const Habit = require('../models/Habit');

module.exports = {
  async index(req, res) {

  },

  async store(req, res) {
    console.log('req.json: ' + req + '\nreq.body: ' + req.body);
    const { kha_name, kha_descri, kha_streak, kha_crdate, kha_eddate } = req.body;
    
    const habit = await Habit(
      kha_name,
      kha_descri,
      kha_streak,
      kha_crdate,
      kha_eddate
    );

    print('name: ' + habit.kha_name);
      
    return res.json(habit);
  }
};