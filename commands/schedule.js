const moment = require("moment");
const { Op } = require("sequelize");
const Schedule = require("../models").Schedule;
const { name, version } = require("../package.json");

module.exports = {
  name: "schedule",
  description: "Check upcoming schedule",
  async execute(message) {
    moment.locale("id");
    const timeFormat = "Do MMMM YYYY, HH:mm";
    try {
      const data = await Schedule.findAll({
        where: {
          dateTime: {
            [Op.gt]: new Date().setMinutes(new Date().getMinutes() - 30)
          }
        },
        order: [
          ["dateTime", "ASC"],
          ["id", "ASC"]
        ],
        raw: true,
        include: "vliver"
      });
      const liveEmbed = {
        color: parseInt(data.length !== 0 ? data[0]["vliver.color"] : ""),
        title: "Upcoming Stream",
        description:
          data.length !== 0
            ? `${data
                .slice(0, 5)
                .map(
                  (d, i) =>
                    `${i + 1}. __**${d["vliver.fullName"]}**__ (${
                      d.type
                    })\nJudul Stream:** ${
                      d.title
                    }**\nTanggal dan Waktu: **${moment(d.dateTime)
                      .utcOffset("+07:00")
                      .format(timeFormat)} WIB / GMT+7** (*${moment(
                      d.dateTime
                    ).fromNow()}*)\n${d.youtubeUrl}\n\n`
                )
                .join("")}${
                data.length - 5 > 0
                  ? `***Dan ${data.length - 5} livestream lainnya...***`
                  : ""
              }`
            : "*Belum ada jadwal livestream untuk saat ini.*",
        footer: {
          text: `${name} v${version} - This message was created on ${moment()
            .utcOffset("+07:00")
            .format(timeFormat)}`
        }
      };
      return message.channel.send("List Stream/Premiere yang akan datang: ", {
        embed: liveEmbed
      });
    } catch (e) {
      console.log(e);
    }
  }
};
