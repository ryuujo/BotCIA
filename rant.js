const Discord = require('discord.js');
const Sequelize = require('sequelize');
const uuid = require('uuid');
const moment = require('moment');
const config = require('./config.js');
const { name, version } = require('./package.json');
const Curhat = require('./models').Curhat;
const timeFormat = 'Do MMMM YYYY, HH:mm';

module.exports = {
  execute: async (message) => {
    const curhatCorner = message.guild.channels.get(
      config.textChannelID.rant.to
    );
    skeyGenerate = uuid.v4().slice(0, 8);
    //gunakan .split('-').join('') kalau butuh uuid lebih dari 8 karakter
    await Curhat.create({
      skey: skeyGenerate,
      userId: message.author.id,
      userName: `${message.author.username}#${message.author.discriminator}`,
      message: message.content,
    });
    const rantEmbed = {
      title: 'This is an anonymous message',
      description: message.content,
      footer: {
        text: `${name} v${version} - This message was created on ${moment()
          .utcOffset('+07:00')
          .format(timeFormat)} - ${skeyGenerate}`,
      },
    };
    setTimeout(
      () => curhatCorner.send('', { embed: rantEmbed }),
      config.rantDelay
    );
    message.delete();
  },
};
