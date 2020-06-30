const moment = require('moment');
const { name, version } = require('../package.json');
const { roles, textChannelID, prefix } = require('../config.js');
const Vliver = require('../models').Vliver;
const Schedule = require('../models').Schedule;

module.exports = {
  name: 'livefb',
  description: 'Announces upcoming live immediately on Facebook',
  args: true,
  async execute(message, args) {
    moment.locale('id');
    const messages =
      'Tulis formatnya seperti ini ya:\n> ```' +
      prefix +
      'live [Nama depan vliver] [Tanggal Livestream (DD/MM)] [Waktu Livestream dalam WIB / GMT+7 (HH:MM)] [Link Video Facebook]```';
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
      .utcOffset('+09:00')
      .format(timeFormat);
    const vliverFirstName = args[0].toLowerCase();
    const linkData = args[3].split('/');
    if (linkData[0] !== 'https:' || linkData[3] === '') {
      return message.reply(messages);
    }
    const exist = await Schedule.findOne({
      where: { youtubeUrl: args[3] },
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
      const liveEmbed = {
        color: parseInt(vData.dataValues.color),
        title: `${vData.dataValues.fullName} akan melakukan Livestream di Facebook!`,
        author: {
          name: vData.dataValues.fullName,
          icon_url: vData.dataValues.avatarURL,
          url: vData.dataValues.channelURL,
        },
        fields: [
          {
            name: 'Tanggal & Waktu Livestream',
            value: `${livestreamDateTime} GMT+7 / WIB \n${livestreamDateTimeJapan} GMT+9 / JST`,
          },
          {
            name: 'Link Video Facebook',
            value: args[3],
          },
        ],
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
        `${mention}\n**${vData.dataValues.fullName}** akan melakukan Livestream di Facebook pada **${livestreamDateTime} WIB!**`,
        { embed: liveEmbed }
      );
      await Schedule.create({
        title: `Facebook Live from ${vData.dataValues.fullName}`,
        youtubeUrl: args[3],
        dateTime: new Date(dateTime),
        vliverID: vData.dataValues.id,
        type: 'live',
        thumbnailUrl: '',
      });
      return await message.reply(
        `Informasi live FB sudah dikirim ke text channel tujuan.\nNama VLiver: ${vData.dataValues.fullName}\nJadwal live: ${livestreamDateTime} WIB / GMT+7`
      );
    } catch (err) {
      message.reply(
        `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
      );
    }
  },
};
