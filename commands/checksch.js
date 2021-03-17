const moment = require('moment');
const { textChannelID, prefix } = require('../config.js');
const { youtube } = require('../config/youtube');
const Schedule = require('../models').Schedule;

module.exports = {
  name: 'checksch',
  description: 'Update the Schedule',
  args: true,
  async execute(message, args) {
    moment.locale('id');
    const messages =
      'Tulis formatnya seperti ini ya:\n ```' +
      prefix +
      'checksch [Link Video Youtube]```';

    if (message.channel.id !== textChannelID.announce) {
      return message.reply('', { file: 'https://i.imgur.com/4YNSGmG.jpg' });
    }
    if (args.length > 1) {
      return message.reply(messages);
    }
    message.channel.send('Mohon tunggu, sedang menyiapkan data untuk diupdate');
    const timeFormat = 'Do MMMM YYYY, HH:mm';
    const timeForDB = 'MM DD YYYY, HH:mm';
    const linkData = args[0].split('/');
    let youtubeId;
    if (linkData[0] !== 'https:' || linkData[3] === '') {
      return message.reply(messages);
    }
    switch (linkData[2]) {
      case 'www.youtube.com':
        const paramData = linkData[3].split('=');
        youtubeId = paramData[1].split('&', 1)[0];
        break;
      case 'youtu.be':
        youtubeId = linkData[3];
        break;
      default:
        return message.reply(messages);
    }
    if (youtubeId === undefined) {
      return message.reply(messages);
    }
    const exist = await Schedule.findOne({
      where: { youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}` },
    });
    if (!exist) {
      return message.reply(
        'Video ini belum ada di database kami. Silahkan announce.'
      );
    }
    try {
      const config = {
        id: youtubeId,
        part: 'snippet,liveStreamingDetails',
        fields:
          'pageInfo,items(snippet(title,thumbnails/standard/url,channelTitle,channelId),liveStreamingDetails)',
      };
      const youtubeData = await youtube.videos.list(config);
      const youtubeInfo = youtubeData.data.items[0].snippet;
      const youtubeLive = youtubeData.data.items[0].liveStreamingDetails;
      if (
        youtubeInfo.title === exist.title &&
        youtubeInfo.thumbnails.standard.url === exist.thumbnailUrl &&
        moment(youtubeLive.scheduledStartTime).format(timeFormat) ===
          moment(exist.dateTime).format(timeFormat)
      ) {
        return message.reply(
          'Kayaknya ga ada yang berbeda deh dari streamnya.'
        );
      }
      const videoDateTime = moment(youtubeLive.scheduledStartTime)
        .utcOffset('+07:00');
      exist.title = youtubeInfo.title;
      exist.thumbnailUrl = youtubeInfo.thumbnails.standard.url;
      exist.dateTime = new Date(videoDateTime.format(timeForDB));
      await exist.save();
      return await message.reply('Informasi sudah diubah!');
    } catch (err) {
      return message.reply(
        `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
      );
    }
  },
};
