const moment = require('moment');
const { Op } = require('sequelize');
const Schedule = require('../models').Schedule;
const Vliver = require('../models').Vliver;
const { name, version } = require('../package.json');
// const { ButtonPaginator } = require('@psibean/discord.js-pagination');

module.exports = {
  name: 'schedule',
  description: 'Check upcoming schedule',
  async execute(message, args) {
    moment.locale('id');
    const timeFormat = 'Do MMMM YYYY, HH:mm';

    const scheduleEmbed = (data, vliverName, avatar) => {
      const newData = [];
      for (let i = 0; i < data.length; i += 5) {
        const chunk = data.slice(i, i + 5);
        newData.push(chunk);
      }
      const listEmbeds = [];
      newData.slice(0, 10).map((data, index) => {
        const embed = {
          color: parseInt(data.length !== 0 ? data[0]['vliver.color'] : ''),
          title: vliverName
            ? `Upcoming stream dari ${vliverName}`
            : 'Upcoming Stream',
          thumbnail: {
            url: avatar,
          },
          description:
            data.length !== 0
              ? `${data
                  .map(
                    (d, i) =>
                      `${i + 1}. __**${d['vliver.fullName']}**__ (${
                        d.type
                      })\nJudul Stream:** ${
                        d.title
                      }**\nTanggal dan Waktu: **${moment(d.dateTime).format(
                        timeFormat
                      )} WIB / GMT+7** (*${moment(d.dateTime).fromNow()}*)\n${
                        d.youtubeUrl
                      }\n\n`
                  )
                  .join('')}`
              : '*Belum ada jadwal stream untuk saat ini*',
          footer: {
            text: `Page ${index + 1} of ${
              newData.length
            } |${name} v${version} - This message was created on ${moment()
              .utcOffset('+07:00')
              .format(timeFormat)}`,
          },
        };
        listEmbeds.push(embed);
      });
      
      return message.channel.send({
        content: 'List Stream/Premiere yang akan datang: ',
        embeds: listEmbeds,
      });
      /* Will work on this later
      const selectPaginator = new ButtonPaginator(message, { listEmbeds });
      selectPaginator.send(); */
    };

    try {
      if (!args[0]) {
        const data = await Schedule.findAll({
          where: {
            dateTime: {
              //[Op.gt]: new Date().setMinutes(new Date().getMinutes() - 30),
              [Op.gt]: moment(),
            },
          },
          order: [
            ['dateTime', 'ASC'],
            ['id', 'ASC'],
          ],
          raw: true,
          include: 'vliver',
        });
        return scheduleEmbed(data, null, null);
      } else {
        const vliverFirstName = args[0].toLowerCase();
        const vData = await Vliver.findOne({
          where: { name: vliverFirstName },
        });
        if (!vData) {
          throw {
            message: `Kamu menginput ${vliverFirstName} dan itu tidak ada di database kami`,
          };
        }
        const data = await Schedule.findAll({
          where: {
            dateTime: {
              [Op.gt]: new Date().setMinutes(new Date().getMinutes() - 10),
            },
            vliverID: vData.id,
          },
          order: [
            ['dateTime', 'ASC'],
            ['id', 'ASC'],
          ],
          raw: true,
          include: 'vliver',
        });
        return scheduleEmbed(data, vData.fullName, vData.avatarURL);
      }
    } catch (e) {
      return message.reply(
        `Ada sesuatu yang salah, tapi itu bukan kamu: ${e.message}`
      );
    }
  },
};
