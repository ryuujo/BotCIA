const moment = require('moment');
const { name, version } = require('../package.json');
const { roles, textChannelID, prefix } = require('../config.js');
const { youtube } = require('../config/youtube');
const Vliver = require('../models').Vliver;
const Schedule = require('../models').Schedule;

module.exports = {
  name: 'announce',
  description: 'Announces Upcoming live and premiere immediately',
  args: true,
  async execute(message, args) {
    moment.locale('id');
    const messages =
      'Tulis formatnya seperti ini ya: ```' +
      prefix +
      'announce [live/premiere] [Link Video Youtube]```';

    if (!message.member.roles.some((r) => roles.live.includes(r.name))) {
      return message.reply('', { file: 'https://i.imgur.com/4YNSGmG.jpg' });
    }
    if (args.length !== 2) {
      return message.reply(messages);
    }
    if (
      args[0].toLowerCase() !== 'live' &&
      args[0].toLowerCase() !== 'premiere'
    ) {
      return message.reply(messages);
    }
    message.channel.send(
      'Mohon tunggu, sedang menyiapkan data untuk dikirimkan'
    );
    const timeFormat = 'Do MMMM YYYY, HH:mm';
    const timeForDB = 'MM DD YYYY, HH:mm';
    const linkData = args[1].split('/');
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
    if (exist) {
      return message.reply(
        `Seseorang sudah mengupload ini terlebih dahulu pada ${moment(
          exist.createdAt
        )
          .utcOffset('+07:00')
          .format(timeFormat)}`
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

      const vData = await Vliver.findOne({
        where: {
          channelURL: `https://www.youtube.com/channel/${youtubeInfo.channelId}`,
        },
      });
      if (!vData) {
        throw {
          message: `Channel ${youtubeInfo.channelTitle} tidak ada di database kami. Channel ID: ${youtubeInfo.channelId}`,
        };
      }
      const videoDateTime = moment(youtubeLive.scheduledStartTime).utcOffset(
        '+07:00'
      );
      const videoDateTimeJapan = moment(
        youtubeLive.scheduledStartTime
      ).utcOffset('+09:00');
      await Schedule.create({
        title: youtubeInfo.title,
        youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
        dateTime: new Date(videoDateTime.format(timeForDB)),
        vliverID: vData.dataValues.id,
        type: args[0].toLowerCase(),
        thumbnailUrl: youtubeInfo.thumbnails.standard.url,
      });
      const liveEmbed = {
        color: parseInt(vData.dataValues.color),
        title: `${vData.dataValues.fullName} akan ${
          args[0].toLowerCase() === 'live'
            ? 'melakukan Livestream'
            : 'mengupload video baru'
        }!`,
        author: {
          name: vData.dataValues.fullName,
          icon_url: vData.dataValues.avatarURL,
          url: vData.dataValues.channelURL,
        },
        thumbnail: {
          url: vData.dataValues.avatarURL,
        },
        fields: [
          {
            name: `Tanggal & Waktu ${
              args[0].toLowerCase() === 'live' ? 'live' : 'premiere'
            }`,
            value: `${videoDateTime.format(
              timeFormat
            )} UTC+7 / WIB\n${videoDateTimeJapan.format(
              timeFormat
            )} UTC+9 / JST`,
          },
          {
            name: 'Link Video Youtube',
            value: `https://www.youtube.com/watch?v=${youtubeId}`,
          },
          {
            name: `Judul ${
              args[0].toLowerCase() === 'live' ? 'Live' : 'Video'
            }`,
            value: youtubeInfo.title,
          },
        ],
        image: {
          url: youtubeInfo.thumbnails.standard.url,
        },
        footer: {
          text: `${name} v${version} - This message was created on ${moment()
            .utcOffset('+07:00')
            .format(timeFormat)}`,
        },
      };
      let mention = '';
      if (vData.dataValues.fanName || vData.dataValues.fanName === '') {
        const roleId = message.guild.roles.find(
          (r) => r.name === vData.dataValues.fanName
        );
        if (roleId) {
          mention = `<@&${roleId.id}>`;
        } else {
          mention = '@here';
        }
      } else {
        mention = '@here';
      }
      const channel = message.guild.channels.get(textChannelID.live);
      await channel.send(
        `${mention}\n**${
          vData.dataValues.fullName
        }** akan melakukan Livestream pada **${videoDateTime.format(
          timeFormat
        )} WIB!**`,
        { embed: liveEmbed }
      );
      return await message.reply(
        `Informasi ${args[0].toLowerCase()} sudah dikirim ke text channel tujuan.\nNama VLiver: ${
          vData.dataValues.fullName
        }\nJudul Livestream: ${
          youtubeInfo.title
        }\nJadwal live: ${videoDateTime.format(timeFormat)} WIB`
      );
    } catch (err) {
      return message.reply(
        `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
      );
    }
  },
};
