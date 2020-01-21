const { RichEmbed } = require('discord.js');
const moment = require('moment');
const vliver = require('../constants/vliver');
const fetchYoutube = require('youtube-info');

module.exports = {
  name: 'live',
  description: 'Announces Upcoming live immediately',
  args: true,
  async execute(message, args) {
    moment.locale('id');
    if (args.length !== 4) {
      message.reply(
        'Please type these arguments:\n```!live Vliver [First Name] [Livestream Date (DD/MM/YYYY)] [Livestream Time (HH:MM)] [Video ID (https://www.youtube.com/watch?v={.....})]```'
      );
      return setTimeout(() => message.channel.bulkDelete(2), 5000);
    }

    try {
      const dateSplit = args[1].split('/');
      const date = dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2];
      const vliverFirstName = args[0].toLowerCase();
      const livestreamDateTime = moment(
        Date.parse(`${date} ${args[2]}`)
      ).format('Do MMMM YYYY, HH:mm');
      const youtubeId = args[3];
      const vData = vliver[vliverFirstName];

      const youtubeData = await fetchYoutube(youtubeId);

      await message.channel.bulkDelete(1);
      const liveEmbed = new RichEmbed()
        .setColor(vData.color)
        .setAuthor(vData.fullName, vData.avatarURL, vData.channelURL)
        .setTitle(`${vData.fullName} akan melakukan live!`)
        .setURL('https://youtube.com/watch?v=' + youtubeId)
        .setDescription(
          `Stream akan dimulai ${moment(
            livestreamDateTime,
            'Do MMMM YYYY, HH:mm'
          ).fromNow()}`
        )
        .setThumbnail(vData.avatarURL)
        .addField('Tanggal & Waktu Livestream', livestreamDateTime, true)
        .addField('Link Video Youtube', youtubeData.url, true)
        .addField('Judul Livestream', youtubeData.title)
        .setImage(youtubeData.thumbnailUrl);
      await message.channel.send(liveEmbed);
    } catch (err) {
      console.error(err);
      return message.channel.send('Something error in here: ', err.message);
    }
  }
};
