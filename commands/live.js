const { RichEmbed } = require('discord.js');
const moment = require('moment');
const vliver = require('../constants/vliver');

module.exports = {
  name: 'live',
  description: 'Announces Upcoming live immediately',
  args: true,
  execute(message, args) {
    moment.locale('id');
    if (args.length !== 4) {
      message.reply(
        'Please type these arguments: `Vliver First Name`, `Livestream Date (MM/DD/YYYY)`, `Livestream Time (HH:MM)`, `Youtube Link (https://)`'
      );
      return setTimeout(() => message.channel.bulkDelete(2), 5000);
    }

    message.channel.bulkDelete(1).catch(err => {
      console.error(err);
      return message.channel.send('I need permission to delete your message');
    });

    const vliverFirstName = args[0].toLowerCase();
    const livestreamDateTime = moment(
      Date.parse(`${args[1]} ${args[2]}`)
    ).format('Do MMMM YYYY, HH:mm');
    const youtubeLink = args[3];

    const vData = vliver[vliverFirstName];

    const liveEmbed = new RichEmbed()
      .setColor(vData.color)
      .setAuthor(vData.fullName, vData.avatarURL, vData.channelURL)
      .setTitle(`${vData.fullName} akan melakukan live!`)
      .setURL(youtubeLink)
      .setDescription(
        `Stream akan dimulai ${moment(
          livestreamDateTime,
          'Do MMMM YYYY, HH:mm'
        ).fromNow()}`
      )
      .setThumbnail(vData.avatarURL)
      .addField('Tanggal & Waktu Livestream', livestreamDateTime, true)
      .addField('Link Video Youtube', youtubeLink, true);

    message.channel.send(liveEmbed);
  }
};
