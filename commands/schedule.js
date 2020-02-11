const Schedule = require('../models').Schedule;
const { Op } = require('sequelize');

module.exports = {
  name: 'schedule',
  description: 'Check upcoming schedule',
  async execute(message) {
    try {
      const data = await Schedule.findAll({
        where: { dateTime: { [Op.gt]: new Date() } },
        order: [
          ['dateTime', 'ASC'],
          ['id', 'ASC']
        ],
        raw: true,
        include: 'vliver'
      });
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }
};
