const axios = require("axios");
const { RichEmbed } = require("discord.js");
const moment = require("moment");
const { roles, textChannelID, prefix } = require("../config.js");
const { name, version } = require("../package.json");

module.exports = {
  name: "nh",
  description: "Something NSFW that you would like",
  async execute(message, args) {
    const getDoujin = async (number, message) => {
      try {
        let { data } = await axios.get(
          "https://nhtai-api.glitch.me/api/id?id=" + number
        );
        const cover_type = { j: "jpg", p: "png" };
        const this_type = data.images.thumbnail.t;
        const djEmbed = {
          color: 0xec2955,
          author: {
            name: "nHentai Fetcher by BotCIA",
            icon_url:
              "https://pbs.twimg.com/profile_images/733172726731415552/8P68F-_I_400x400.jpg"
          },
          title: data.title.english,
          url: `https://nhent.ai/g/${data.id}`,
          thumbnail: {
            url: `https://t.nhent.ai/galleries/${data.media_id}/cover.${cover_type[this_type]}`
          },
          fields: [
            {
              name: "ID",
              value: data.id
            },
            {
              name: "Tags",
              value: data.tags.map(tag => `${tag.name}`).join(", ")
            },
            {
              name: "nHentai Link",
              value: `https://nhentai.net/g/${data.id}`,
              inline: true
            },
            {
              name: "Mirror Link",
              value: `https://nhent.ai/g/${data.id}`,
              inline: true
            }
          ],
          footer: {
            text: `${name} v${version} - This message was created on ${moment()
              .utcOffset("+07:00")
              .format(timeFormat)}`
          }
        };
        await message.reply({ embed: djEmbed });
      } catch (err) {
        console.log(err.message);
      }
    };

    const timeFormat = "Do MMMM YYYY, HH:mm";

    if (message.channel.id === textChannelID.nh) {
      if (args.length === 0) {
        return message.reply(
          "Kamu perlu menulis perintah setelah tanda `" +
            prefix +
            "nh`. Lihat `" +
            prefix +
            "nh help` untuk pilihan perintah"
        );
      }
      if (
        message.member.roles.some(r => roles.nh.includes(r.name)) ||
        args[0] === "help"
      ) {
        switch (args[0]) {
          case "help":
            return message.channel.send(
              "```help: Here's the help then\ninfo <ID>: Fetching the info of the doujin ID\nrandom <number>: Sent you a random doujin\nsearch <keyword>: Finding your doujin based on your keyword\n\nPastikan kamu menggunakan bot ini di Channel Degen. Nanti Cia marah lho```"
            );
          case "info":
            if (!args[1])
              return message.reply("Kamu perlu menambahkan 6-digit nuklir.");
            await message.channel.send(
              `Mencari data untuk doujin ini... ID: ${args[1]}`
            );
            return await getDoujin(args[1], message);
          case "random":
            const timesRoll = parseInt(args[1]) || 1;
            const maxRoll = 3;
            if (timesRoll > maxRoll)
              return message.reply(
                `Maksimal yang bisa diberikan ${maxRoll} kali ya...`
              );
            await message.channel.send(
              `Mencarikan${
                timesRoll > 1 ? " " + timesRoll : ""
              } doujin favorit yang pas untukmu`
            );
            for (let i = 0; i < timesRoll; ++i) {
              const min = 150000;
              const max = 301000;
              const rand = min + Math.random() * (max - min);
              const number = Math.floor(rand);
              await getDoujin(number, message);
            }
            return await message.channel.send("Semoga kamu suka ya~");
          case "search":
            const query = args.slice(1, args.length).join(" ");
            try {
              const { data } = await axios.get(
                `https://nhtai-api.glitch.me/api/search?query=${query}&page=1`
              );
              const queryEmbed = {
                color: 0xec2955,
                author: {
                  name: "nHentai Fetcher by BotCIA",
                  icon_url:
                    "https://pbs.twimg.com/profile_images/733172726731415552/8P68F-_I_400x400.jpg"
                },
                title: `Results of ${query}`,
                description:
                  data.result.length !== 0
                    ? data.result
                        .slice(0, 10)
                        .map(
                          (dj, i) =>
                            `${i + 1}. ${
                              dj.title.english
                            }\nhttps://nhentai.net/g/${
                              dj.id
                            } | https://nhent.ai/g/${dj.id}`
                        )
                        .join("\n\n")
                    : "*No Doujins Found*",
                fields: [
                  {
                    name: "More Results",
                    value: `https://nhent.ai/search/${query
                      .split(" ")
                      .join("%20")}`
                  }
                ],
                footer: {
                  text: `${name} v${version} - This message was created on ${moment()
                    .utcOffset("+07:00")
                    .format(timeFormat)}`
                }
              };
              return message.channel.send({ embed: queryEmbed });
            } catch (err) {
              console.log(err.message);
            }
          default:
            return message.reply(
              "Kamu perlu menulis perintah setelah tanda `" +
                prefix +
                "nh`. Lihat `" +
                prefix +
                "nh help` untuk pilihan perintah"
            );
        }
      } else {
        return await message.reply("", {
          file: "https://i.imgur.com/4YNSGmG.jpg"
        });
      }
    } else {
      await message.channel.bulkDelete(1);
      return await message.author.send(
        "Jangan gunakan tag itu di sembarang tempat! Ku geplak kamu...",
        { file: "https://i.imgur.com/FxfX5wL.png" }
      );
    }
  }
};
