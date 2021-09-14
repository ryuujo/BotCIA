const moment = require('moment');
const { textChannelID } = require('../config.js');
const Curhat = require('../models').Curhat;

module.exports = {
  name: 'track',
  description: 'Tracking curhat anonym',
  async execute(message, args, client) {
    if (message.channel.id !== textChannelID.rant.track) {
      return
    }
    if (!args[0]) {
      return message.channel.send('Mau nyari apa hayoo?');
    }
    const data = await Curhat.findOne({
      where: {
        skey: args[0],
      },
      raw: true,
    });
    const embed = {
      title: 'Anonym Message Tracker',
      fields: [
        {
          name: 'Unique ID',
          value: data.skey,
          inline: true,
        },
        {
          name: 'User ID',
          value: data.userId,
          inline: true,
        },
        {
          name: 'Username saat mengirimkan pesan',
          value: data.userName,
        },
        {
          name: 'Tanggal Kirim',
          value: moment(data.createdAt),
        },
        {
          name: 'Isi Pesan',
          value: `${data.message.slice(0,200)}...`,
        },
      ],
    };
    await message.channel.send('', { embed: embed });
  },
};
