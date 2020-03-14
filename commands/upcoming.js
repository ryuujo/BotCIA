const moment = require("moment");
const fetchYoutube = require("youtube-info");
const { Op } = require("sequelize");
const Schedule = require("../models").Schedule;
const Vliver = require("../models").Vliver;
const { name, version } = require("../package.json");

module.exports = {
  name: "upcoming",
  description: "Shows upcoming livestream from now or based on Vliver",
  async execute(message, args) {
    moment.locale("id");
    const timeFormat = "Do MMMM YYYY, HH:mm";
    const showEmbed = async (data, vliverName) => {
      try {
        if (!data) {
          const embed = {
            title: `Stream mendatang dari ${vliverName}`,
            description: `Saat ini belum ada stream mendatang dari ${vliverName}.`,
            footer: {
              text: `${name} v${version} - This message was created on ${moment()
                .utcOffset("+07:00")
                .format(timeFormat)}`
            }
          };
          return message.channel.send({ embed });
        }
        const paramData = data.youtubeUrl.split("=");
        const youtubeData = await fetchYoutube(paramData[1]);
        const embed = {
          title: `${
            data.type === "live" ? "Stream" : "Premiere"
          } mendatang dari ${vliverName}`,
          color: parseInt(data["vliver.color"]),
          thumbnail: {
            url: data["vliver.avatarURL"]
          },
          fields: [
            {
              name: "Tanggal & Waktu Livestream",
              value: `${moment(data.dateTime)
                .utcOffset("+07:00")
                .format(timeFormat)} GMT+7 / WIB\n(*${moment(
                data.dateTime
              ).fromNow()}*)`
            },
            {
              name: "Link Video Youtube",
              value: data.youtubeUrl
            },
            {
              name: "Judul Live",
              value: data.title
            }
          ],
          image: {
            url: youtubeData.thumbnailUrl
          },
          footer: {
            text: `${name} v${version} - This message was created on ${moment()
              .utcOffset("+07:00")
              .format(timeFormat)}`
          }
        };
        return message.channel.send({ embed });
      } catch (err) {
        message.reply(
          `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
        );
      }
    };

    try {
      if (!args[0]) {
        const data = await Schedule.findOne({
          where: {
            dateTime: {
              [Op.gt]: new Date().setMinutes(new Date().getMinutes() - 10)
            }
          },
          order: [
            ["dateTime", "ASC"],
            ["id", "ASC"]
          ],
          raw: true,
          include: "vliver"
        });
        return showEmbed(data, data["vliver.fullName"]);
      } else {
        const vliverFirstName = args[0].toLowerCase();
        const vData = await Vliver.findOne({
          where: { name: vliverFirstName }
        });
        if (!vData) {
          throw {
            message: `Kamu menginput ${vliverFirstName} dan itu tidak ada di database kami`
          };
        }
        const data = await Schedule.findOne({
          where: {
            dateTime: {
              [Op.gt]: new Date().setMinutes(new Date().getMinutes() - 10)
            },
            vliverID: vData.id
          },
          order: [
            ["dateTime", "ASC"],
            ["id", "ASC"]
          ],
          raw: true,
          include: "vliver"
        });
        return showEmbed(data, vData.fullName);
      }
    } catch (err) {
      message.reply(
        `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
      );
    }
  }
};