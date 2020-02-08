const { RichEmbed } = require("discord.js");
const moment = require("moment");
const vliver = require("../constants/vliver");
const fetchYoutube = require("youtube-info");
const { roles, textChannelID, prefix } = require("../config.js");
const { name, version } = require("../package.json");

module.exports = {
  name: "live",
  description: "Announces Upcoming live immediately",
  args: true,
  async execute(message, args) {
    moment.locale("id");
    const messages =
      "Tulis formatnya seperti ini ya:\n> ```" +
      prefix +
      "live [Nama depan vliver] [Tanggal Livestream (DD/MM)] [Waktu Livestream dalam WIB / GMT+7 (HH:MM)] [Link Video Youtube]```";

    if (message.member.roles.some(r => roles.live.includes(r.name))) {
      if (args.length !== 4) {
        return message.reply(messages);
      }
      try {
        const timeFormat = "Do MMMM YYYY, HH:mm";
        const dateSplit = args[1].split("/");
        const date =
          dateSplit[1] + "/" + dateSplit[0] + "/" + moment().format("YYYY");
        const dateTime = Date.parse(`${date} ${args[2]}`);
        const livestreamDateTime = moment(dateTime).format(timeFormat);
        const livestreamDateTimeJapan = moment(dateTime)
          .add(2, "hours")
          .format(timeFormat);
        const vliverFirstName = args[0].toLowerCase();
        const vData = vliver[vliverFirstName];
        const linkData = args[3].split("/");
        let youtubeId;
        if (linkData[0] !== "https:" || linkData[3] === "") {
          return message.reply(messages);
        }
        switch (linkData[2]) {
          case "www.youtube.com":
            const paramData = linkData[3].split("=");
            youtubeId = paramData[1].split("&", 1)[0];
            break;
          case "youtu.be":
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
          const liveEmbed = new RichEmbed()
            .setColor(vData.color)
            .setAuthor(vData.fullName, vData.avatarURL, vData.channelURL)
            .setTitle(`${vData.fullName} akan melakukan Livestream!`)
            .setURL(youtubeData.url)
            .setThumbnail(vData.avatarURL)
            .addField(
              "Tanggal & Waktu Livestream",
              `${livestreamDateTime} GMT+7 / WIB \n${livestreamDateTimeJapan} GMT+9 / JST`
            )
            .addField("Link Video Youtube", youtubeData.url)
            .addField("Judul Livestream", youtubeData.title)
            .setImage(youtubeData.thumbnailUrl)
            .setFooter(
              `${name} v${version} - This message was created on ${moment().format(
                timeFormat
              )}`
            );
          const channel = message.guild.channels.get(textChannelID.live);
          await channel.send(liveEmbed);
          return await message.reply(
            `Informasi live sudah dikirim ke text channel tujuan.\nNama VLiver: ${vData.fullName}\nJudul Livestream: ${youtubeData.title}\nJadwal live: ${livestreamDateTime} WIB / GMT+7`
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
      message.reply("", { file: "https://i.imgur.com/4YNSGmG.jpg" });
    }
  }
};
