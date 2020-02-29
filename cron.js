const Discord = require("discord.js");
const moment = require("moment");
const config = require("./config.js");
const { name, version } = require("./package.json");
const Sequelize = require("sequelize");
const Schedule = require("./models").Schedule;

const { Op } = Sequelize;

module.exports = {
  execute: async client => {
    console.log("cron executed");
    try {
      let guild = client.guilds.get(config.guildID);
      let message = guild.channels.get(config.textChannelID.cron);
      moment.locale("id");
      const timeFormat = "Do MMMM YYYY, HH:mm";
      const schedule = await Schedule.findAll({
        where: {
          dateTime: {
            [Op.gt]: new Date().setMinutes(new Date().getMinutes() - 30),
            [Op.lt]: new Date().setDate(new Date().getDate() + 1)
          }
        },
        order: [
          ["dateTime", "ASC"],
          ["id", "ASC"]
        ],
        raw: true,
        include: "vliver"
      });
      if (schedule.length === 0) {
        await message.send(
          "Selamat sore semuanya! Belum ada livestream saat ini namun aku bakal kasih tau kalo misalkan ada.\nCek Twitter masing-masing vliver untuk info lebih lanjut ya..."
        );
      } else {
        const liveEmbed = {
          color: parseInt(
            schedule.length !== 0 ? schedule[0]["vliver.color"] : ""
          ),
          title: "Upcoming Stream",
          description: schedule
            .map(
              (d, i) =>
                `${i + 1}. __**${d["vliver.fullName"]}**__ (${
                  d.type
                })\nJudul Stream:** ${d.title}**\nTanggal dan Waktu: **${moment(
                  d.dateTime
                )
                  .utcOffset("+07:00")
                  .format(timeFormat)} WIB / GMT+7** (*${moment(
                  d.dateTime
                ).fromNow()}*)\n${d.youtubeUrl}\n\n`
            )
            .join(""),
          footer: {
            text: `${name} v${version} - This message was created on ${moment()
              .utcOffset("+07:00")
              .format(timeFormat)}`
          }
        };
        await message.send(
          `Selamat sore semuanya! Hari ini akan ada ${schedule.length} stream yang akan berlangsung hari ini\nStream lainnya akan bertambah sewaktu-waktu, jadi cek Twitter masing-masing vliver untuk info lebih lanjut ya`,
          {
            embed: liveEmbed
          }
        );
      }
  
      await console.log(
        `Cron Job complete. Time sent on ${moment()
          .utcOffset("+07:00")
          .format("dddd DD MMMM YYYY HH:mm:ss Z")}.`
      );
    } catch (err) {
      console.log("Something error: ", err);
    }
  }
};
