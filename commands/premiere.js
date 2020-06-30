const moment = require('moment');
const { name, version } = require('../package.json');
const { roles, textChannelID, prefix } = require('../config.js');
const { youtube } = require('../config/youtube');
const Vliver = require('../models').Vliver;
const Schedule = require('../models').Schedule;

module.exports = {
  name: 'premiere',
  description: 'Announces Upcoming premiere immediately',
  args: true,
  async execute(message, args) {
    moment.locale('id');
    const messages =
      'Tulis formatnya seperti ini ya:\n> ```' +
      prefix +
      'live [Nama depan vliver] [Tanggal Premiere (DD/MM)] [Waktu Premiere dalam WIB / GMT+7 (HH:MM)] [Link Video Youtube]```';
    if (!message.member.roles.some((r) => roles.live.includes(r.name))) {
      return message.reply('', { file: 'https://i.imgur.com/4YNSGmG.jpg' });
    }
    if (args.length !== 4) {
      return message.reply(messages);
    }
    message.channel.send(
      'Mohon tunggu, sedang menyiapkan data untuk dikirimkan'
    );
    const timeFormat = 'Do MMMM YYYY, HH:mm';
    const dateSplit = args[1].split('/');
    const date =
      dateSplit[1] + '/' + dateSplit[0] + '/' + moment().format('YYYY');
    const dateTime = Date.parse(`${date} ${args[2]}`);
    const livestreamDateTime = moment(dateTime)
      .utcOffset('+07:00')
      .format(timeFormat);
    const livestreamDateTimeJapan = moment(dateTime)
      .utcOffset('+07:00')
      .add(2, 'hours')
      .format(timeFormat);
    const vliverFirstName = args[0].toLowerCase();
    const linkData = args[3].split('/');
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
      return message.reply('Seseorang sudah mengupload ini terlebih dahulu');
    }
    try {
      const vData = await Vliver.findOne({
        where: { name: vliverFirstName },
      });
      if (!vData) {
        throw {
          message: `Kamu menginput ${vliverFirstName} dan itu tidak ada di database kami`,
        };
      }
      const config = {
        id: youtubeId,
        part: 'snippet,liveStreamingDetails',
        fields:
          'pageInfo,items(snippet(title,thumbnails/standard/url),liveStreamingDetails)',
      };
      const youtubeData = await youtube.videos.list(config);
      const youtubeInfo = youtubeData.data.items[0].snippet;
      await Schedule.create({
        title: youtubeInfo.title,
        youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
        dateTime: new Date(dateTime),
        vliverID: vData.dataValues.id,
        type: 'premiere',
        thumbnailUrl: youtubeInfo.thumbnails.standard.url,
      });
      const liveEmbed = {
        color: parseInt(vData.dataValues.color),
        title: `${vData.dataValues.fullName} akan mengupload video baru!`,
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
            name: 'Tanggal & Waktu Premiere',
            value: `${livestreamDateTime} GMT+7 / WIB \n${livestreamDateTimeJapan} GMT+9 / JST`,
          },
          {
            name: 'Link Video Youtube',
            value: `https://www.youtube.com/watch?v=${youtubeId}`,
          },
          {
            name: 'Judul Live',
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
        `${mention}\n**${vData.dataValues.fullName}** akan mengupload video baru pada **${livestreamDateTime} WIB!**`,
        { embed: liveEmbed }
      );
      return await message.reply(
        `Informasi premiere sudah dikirim ke text channel tujuan.\nNama VLiver: ${vData.fullName}\nJudul Premiere: ${youtubeInfo.title}\nJadwal Premiere: ${livestreamDateTime} WIB / GMT+7`
      );
    } catch (err) {
      message.reply(
        `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
      );
    }
  },
};
