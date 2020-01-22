const { RichEmbed } = require("discord.js");
const moment = require("moment");
const vliver = require("../constants/vliver");
const fetchYoutube = require("youtube-info");
const { roles, textChannelID } = require("../config.js");

module.exports = {
  name: "live",
  description: "Announces Upcoming live immediately",
  args: true,
  async execute(message, args) {
    moment.locale("id");
    if (message.member.roles.some(r => roles.includes(r.name))) {
      if (args.length !== 4) {
        return message.reply(
          "Tulis formatnya seperti ini ya:\n```!live [Nama depan vliver] [Tanggal Livestream (DD/MM)] [Waktu Livestream (HH:MM)] [Video ID (https://www.youtube.com/watch?v={.....})]```"
        );
      }
      try {
        const dateSplit = args[1].split("/");
        const date =
          dateSplit[1] + "/" + dateSplit[0] + "/" + moment().format("YYYY");
        const livestreamDateTime = moment(
          Date.parse(`${date} ${args[2]}`)
        ).format("Do MMMM YYYY, HH:mm");
        const vliverFirstName = args[0].toLowerCase();
        const vData = vliver[vliverFirstName];
        const youtubeId = args[3];
        try {
          const youtubeData = await fetchYoutube(youtubeId);
          const liveEmbed = new RichEmbed()
            .setColor(vData.color)
            .setAuthor(vData.fullName, vData.avatarURL, vData.channelURL)
            .setTitle(`${vData.fullName} akan melakukan Livestream!`)
            .setURL("https://youtube.com/watch?v=" + youtubeId)
            .setDescription(
              `Stream akan dimulai ${moment(
                livestreamDateTime,
                "Do MMMM YYYY, HH:mm"
              ).fromNow()}`
            )
            .setThumbnail(vData.avatarURL)
            .addField("Tanggal & Waktu Livestream", livestreamDateTime, true)
            .addField("Link Video Youtube", youtubeData.url, true)
            .addField("Judul Livestream", youtubeData.title)
            .setImage(youtubeData.thumbnailUrl);
          const channel = message.guild.channels.get(textChannelID);
          await channel.send(liveEmbed);
          return await message.reply(
            "Informasi live sudah dikirim ke text channel tujuan"
          );
        } catch (err) {
          console.log(err);
          message.reply(
            `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
          );
          return setTimeout(() => message.channel.bulkDelete(2), 5000);
        }
      } catch (err) {
        message.reply(
          `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
        );
        return setTimeout(() => message.channel.bulkDelete(2), 5000);
      }
    } else {
      message.reply("", { file: "https://i.imgur.com/4YNSGmG.jpg" });
    }
  }
};
