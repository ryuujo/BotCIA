const { RichEmbed } = require('discord.js');
const vliver = require('../constants/vliver');

module.exports = {
  name: 'live',
  description: 'Announces Upcoming live immediately',
  args: true,
  execute(message, args) {
    if (args.length !== 4) {
      message.reply(
        'Please type these arguments: `Vliver First Name`, `Livestream Date (DD/MM/YYYY)`, `Livestream Time (HH:MM)`, `Youtube Link (https://)`'
      );
      return setTimeout(() => message.channel.bulkDelete(2), 5000);
    }

    message.channel.bulkDelete(1).catch(err => {
      console.error(err);
      return message.channel.send('I need permission to delete your message');
    });

    const vliverFirstName = args[0].toLowerCase();
    const livestreamDate = args[1];
    const livestreamTime = args[2];
    const youtubeLink = args[3];

    const vData = vliver[vliverFirstName];

    const liveEmbed = new RichEmbed()
      .setColor(vData.color)
      .setAuthor(vData.fullName, vData.avatarURL, vData.channelURL)
      .setTitle(`${vData.fullName} akan melakukan live!`)
      .setURL(youtubeLink)
      .setThumbnail(vData.avatarURL)
      .addField('Link Video Youtube', youtubeLink)
      .addField('Tanggal Livestream', livestreamDate, true)
      .addField('Jam Livestream', livestreamTime, true);

    message.channel.send(liveEmbed);
  }
};
