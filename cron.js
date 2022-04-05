const Discord = require('discord.js');
const moment = require('moment');
const config = require('./config.js');
const { name, version } = require('./package.json');
const Sequelize = require('sequelize');
const Schedule = require('./models').Schedule;

const { Op } = Sequelize;

module.exports = {
  execute: async (client) => {
    try {
      let guild = client.guilds.cache.get(config.guildID);
      let message = guild.channels.cache.get(config.textChannelID.cron);
      moment.locale('id');
      const timeFormat = 'Do MMMM YYYY, HH:mm';
      const schedule = await Schedule.findAll({
        where: {
          dateTime: {
            [Op.gt]: new Date().setMinutes(new Date().getMinutes() - 30),
            [Op.lt]: new Date().setDate(new Date().getDate() + 1),
          },
        },
        order: [
          ['dateTime', 'ASC'],
          ['id', 'ASC'],
        ],
        raw: true,
        include: 'vliver',
      });
      if (schedule.length === 0) {
        return await message.send(
          `Selamat pagi semuanya! Saat ini belum ada livestream yang akan berlangsung.\nCek <#${config.textChannelID.live}> untuk info lebih lanjut ya...`
        );
      }
      const morning =
        schedule[0]['vliver.morningMessage'] || 'Selamat Pagi Semuanya!';
      const liveEmbed = {
        color: parseInt(
          schedule.length !== 0 ? schedule[0]['vliver.color'] : ''
        ),
        title: 'Upcoming Stream',
        description: `${schedule
          .slice(0, 5)
          .map(
            (d, i) =>
              `${i + 1}. __**${d['vliver.fullName']}**__ (${
                d.type
              })\nJudul Stream:** ${d.title}**\nTanggal dan Waktu: **${moment(
                d.dateTime
              )
                .format(timeFormat)} WIB / GMT+7** (*${moment(
                d.dateTime
              ).fromNow()}*)\n${d.youtubeUrl}\n\n`
          )
          .join('')}${
          schedule.length - 5 > 0
            ? `***Dan ${schedule.length - 5} livestream lainnya...***`
            : ''
        }`,
        footer: {
          text: `${name} v${version} - This message was created on ${moment()
            .utcOffset('+07:00')
            .format(timeFormat)}`,
        },
      };
      return await message.send(
        {
          content: `${morning} Hari ini ada ${schedule.length} stream yang akan berlangsung.\nStream lainnya akan bertambah dan berubah sewaktu-waktu, jadi cek <#${config.textChannelID.live}> untuk info lebih lanjut ya`,
          embeds: [liveEmbed],
        }
      );
    } catch (err) {
      console.log('Something error: ', err);
    }
  },
};
