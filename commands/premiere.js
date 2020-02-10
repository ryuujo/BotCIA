const moment = require('moment');
const fetchYoutube = require('youtube-info');
const { roles, textChannelID, prefix } = require('../config.js');
const { name, version } = require('../package.json');
const Vliver = require('../models/').Vliver;

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

    if (message.member.roles.some(r => roles.live.includes(r.name))) {
      if (args.length !== 4) {
        return message.reply(messages);
      }
      try {
        const timeFormat = 'Do MMMM YYYY, HH:mm';
        const dateSplit = args[1].split('/');
        const date =
          dateSplit[1] + '/' + dateSplit[0] + '/' + moment().format('YYYY');
        const dateTime = Date.parse(`${date} ${args[2]}`);
        const livestreamDateTime = moment(dateTime).format(timeFormat);
        const livestreamDateTimeJapan = moment(dateTime)
          .add(2, 'hours')
          .format(timeFormat);
        const vliverFirstName = args[0].toLowerCase();
        const vData = await Vliver.findOne({
          where: { name: vliverFirstName }
        });
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
        try {
          const youtubeData = await fetchYoutube(youtubeId);
          const liveEmbed = {
            color: parseInt(vData.dataValues.color),
            title: `${vData.dataValues.fullName} akan mengupload video baru!`,
            author: {
              name: vData.dataValues.fullName,
              icon_url: vData.dataValues.avatarURL,
              url: vData.dataValues.channelURL
            },
            thumbnail: {
              url: vData.dataValues.avatarURL
            },
            fields: [
              {
                name: 'Tanggal & Waktu Premiere',
                value: `${livestreamDateTime} GMT+7 / WIB \n${livestreamDateTimeJapan} GMT+9 / JST`
              },
              {
                name: 'Link Video Youtube',
                value: youtubeData.url
              },
              {
                name: 'Judul Premiere',
                value: youtubeData.title
              }
            ],
            image: {
              url: youtubeData.thumbnailUrl
            },
            footer: {
              text: `${name} v${version} - This message was created on ${moment().format(
                timeFormat
              )}`
            }
          };
          const roleId = message.guild.roles.find(
            r => r.name === roles.notification
          ).id;
          const channel = message.guild.channels.get(textChannelID.live);
          await channel.send(`<@&${roleId}>`, { embed: liveEmbed });
          return await message.reply(
            `Informasi premiere sudah dikirim ke text channel tujuan.\nNama VLiver: ${vData.fullName}\nJudul Premiere: ${youtubeData.title}\nJadwal Premiere: ${livestreamDateTime} WIB / GMT+7`
          );
        } catch (err) {
          console.log(err);
          message.reply(
            `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
          );
        }
      } catch (err) {
        console.log(err);
        message.reply(
          `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
        );
      }
    } else {
      message.reply('', { file: 'https://i.imgur.com/4YNSGmG.jpg' });
    }
  }
};
