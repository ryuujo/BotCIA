const axios = require("axios");
const { RichEmbed } = require("discord.js");
const moment = require("moment");
const { prefix } = require("../config.js");
const { name, version } = require("../package.json");

module.exports = {
  name: "roll",
  description: "Rolling a nice card for you",
  args: true,
  async execute(message, args) {
    const timeFormat = "Do MMMM YYYY, HH:mm";
    const game = args[0] ? args[0].toLowerCase() : "none";
    if (args[0]) message.channel.send("Rolling gacha just for you...");
    switch (game) {
      case "ll":
      case "lovelive":
        const llMin = 1;
        const llMax = 2271;
        const rand = llMin + Math.random() * (llMax - llMin);
        const number = Math.floor(rand);
        const color = {
          smile: "#e60076",
          pure: "#27aa54",
          cool: "0199ec"
        };
        try {
          const { data } = await axios.get(
            `https://schoolido.lu/api/cards/${number}`
          );
          const embed = new RichEmbed()
            .setColor(color[data.attribute.toLowerCase()])
            .setAuthor(
              "LoveLive Gacha Roll by BotCIA",
              "https://d2jcw5q7j4vmo4.cloudfront.net/WGFyx2PNQkEYFxGtSodPpifBpFIu7nqlikBIXjHdrh9XZfUge35q5lwZAD7mx07NXvpv=w512"
            )
            .setTitle(
              data.rarity === "N" || data.rarity === "R"
                ? "Here is your card"
                : `Wow You Got ${data.rarity} card!`
            )
            .setThumbnail(
              data.round_card_image
                ? `http:${data.round_card_image}`
                : `http:${data.round_card_idolized_image}`
            )
            .setURL(data.website_url)
            .addField("Smile", data.minimum_statistics_smile, true)
            .addField("Pure", data.minimum_statistics_pure, true)
            .addField("Cool", data.minimum_statistics_cool, true)
            .addField("Skill", data.skill ? data.skill : "None", true)
            .addField(
              "Center Skill",
              data.center_skill ? data.center_skill : "None",
              true
            )
            .addField(
              "Skill Details",
              data.skill_details ? data.skill_details : "None"
            )
            .addField("Rarity", data.rarity, true)
            .addField("Character", data.idol.name, true)
            .setImage(
              data.card_image
                ? `http:${data.card_image}`
                : `http:${data.card_idolized_image}`
            )
            .setFooter(
              `${name} v${version} - This message was created on ${moment().format(
                timeFormat
              )} | ID: ${number}`
            );
          return await message.reply(embed);
        } catch (err) {
          return await message.reply(
            "Consider you are not lucky. Please try again" + bandoriNumber
          );
        }
      case "bandori":
        const bandoriMin = 501;
        const bandoriMax = 1341;
        const bandoriRand =
          bandoriMin + Math.random() * (bandoriMax - bandoriMin);
        const bandoriNumber = Math.floor(bandoriRand);
        const bandoriColor = {
          pure: "#61d148",
          cool: "#596ee8",
          happy: "#ff9a2e",
          power: "#ff4f70"
        };
        const bandoriStar = ["☆☆☆☆", "★☆☆☆", "★★☆☆", "★★★☆", "★★★★"];
        try {
          const { data } = await axios.get(
            `https://bandori.party/api/cards/${bandoriNumber}`
          );
          const member = await axios.get(
            `https://bandori.party/api/members/${data.member}`
          );
          const memberData = member.data;
          const bandoriEmbed = new RichEmbed()
            .setColor(bandoriColor[data.i_attribute.toLowerCase()])
            .setThumbnail(data.image ? data.image : data.image_trained)
            .setTitle("This is your Card!")
            .addField("Performance", data.performance_min, true)
            .addField("Technique", data.technique_min, true)
            .addField("Visual", data.visual_min, true)
            .addField("Skills", data.full_skill)
            .addField("Rarity", bandoriStar[data.i_rarity], true)
            .addField(
              "Character",
              `${memberData.name} (${memberData.i_band})`,
              true
            )
            .setImage(data.art ? data.art : data.art_trained)
            .setFooter(
              `${name} v${version} - This message was created on ${moment().format(
                timeFormat
              )} | ID: ${bandoriNumber}`
            );
          return await message.reply(bandoriEmbed);
        } catch (err) {
          return await message.reply(
            "Consider you are not lucky. Please try again" + bandoriNumber
          );
        }
      default:
        return message.reply(
          "```Silahkan pilih kartu mana yang mau di roll:\nKeyword: " +
            prefix +
            "roll [nama game]\n1. lovelive / ll\n2. bandori```"
        );
    }
  }
};
