const { Op } = require('sequelize');
const Schedule = require('../models').Schedule;
const { roles } = require('../config.js');

module.exports = {
  name: 'clearsch',
  description: 'Only delete schedule which is outdated. Use wisely',
  async execute(message) {
    if (message.member.roles.some(r => roles.live.includes(r.name))) {
      try {
        const totalData = await Schedule.findAndCountAll({
          where: { dateTime: { [Op.lt]: new Date() } }
        });
        await Schedule.destroy({
          where: { dateTime: { [Op.lt]: new Date() } }
        });
        await message.channel.send(
          `Removed ${totalData.count} ${totalData.count === 1 ? 'row' : 'rows'}`
        );
      } catch (e) {
        console.log(e);
        message.channel.send(
          'Ada sesuatu yang salah, tapi itu bukan kamu: ',
          e
        );
      }
    } else {
      message.reply('', { file: 'https://i.imgur.com/4YNSGmG.jpg' });
    }
  }
};
