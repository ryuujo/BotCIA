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
      let guild = client.guilds.get(config.guildID);
      let message = guild.channels.get(config.textChannelID.cron);
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
          'Selamat pagi semuanya! Saat ini belum ada livestream yang akan berlangsung namun bakal aku kasih tau kalo misalkan ada.\nCek Twitter masing-masing vliver untuk info lebih lanjut ya...'
        );
      }
      let morning;
      switch (schedule[0]['vliver.name']) {
        case 'hana':
          morning = 'Ohana! Ayo bangun!';
          break;
        case 'zea':
          morning = 'Launching CronZEA.exe...\n皆さん、おはようございます！！';
          break;
        case 'taka':
          morning =
            'Selamat pagi semua, Eksekutif muda virtual Taka Radjiman di sini. Etto... Sebelum saya berangkat ngantor saya mau bajak BotCIA dulu.';
          break;
        case 'rai':
          morning = 'EEEEEEeeeeeeeeeEEeeEEeE...';
          break;
        case 'amicia':
          morning = 'Iyeeeeyyy... Selamat Pagi semuanya!';
          break;
        case 'miyu':
          morning = 'WOI! BANGUUUN!!';
          break;
        case 'riksa':
          morning = 'Kamu pikir saya akan ngomong selamat pagi? KAMU SALAH!';
          break;
        case 'azura':
          morning = 'Zuramat Pagi semuanya!';
          break;
        case 'layla':
          morning = 'KABONGA!!!';
          break;
        case 'nara':
          morning = 'Auummm...';
          break;
        case 'etna':
          morning = 'DUUUUAAAAAARRRRRR BORGAAAARRR!!!!!';
          break;
        case 'bobon':
          morning = 'Halo guys, Om Bobon di sini. Dan';
          break;
        case 'siska':
          morning = 'Hey kamu. Iya, kamu yang selalu ada di hatiku. Selamat pagi!';
          break;
        default:
          morning = 'Halo guys, Staff-san di sini.';
      }
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
                .utcOffset('+07:00')
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
        `${morning} Hari ini ada ${schedule.length} stream yang akan berlangsung.\nStream lainnya akan bertambah dan berubah sewaktu-waktu, jadi cek Twitter masing-masing vliver untuk info lebih lanjut ya`,
        {
          embed: liveEmbed,
        }
      );
    } catch (err) {
      console.log('Something error: ', err);
    }
  },
};
