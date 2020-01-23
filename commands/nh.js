const axios = require('axios');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
const { roles, textChannelID, prefix } = require('../config.js');
const { name, version } = require('../package.json');

module.exports = {
  name: 'nh',
  description: 'Something NSFW that you would like',
  async execute(message, args) {
    const getDoujin = async (number, message) => {
      try {
        let { data } = await axios.get(
          'https://nhtai-api.glitch.me/api/id?id=' + number
        );
        const cover_type = { j: 'jpg', p: 'png' };
        const this_type = data.images.thumbnail.t;
        const doujinEmbed = new RichEmbed()
          .setColor('#EC2955')
          .setAuthor(
            'nHentai Fetcher by BotCIA',
            'https://pbs.twimg.com/profile_images/733172726731415552/8P68F-_I_400x400.jpg',
            'https://nhent.ai'
          )
          .setTitle(data.title.english)
          .setURL(`https://nhent.ai/g/${data.id}`)
          .setThumbnail(
            `https://t.nhent.ai/galleries/${data.media_id}/cover.${cover_type[this_type]}`
          )
          .addField('ID', data.id)
          .addField(
            'Tags',
            data.tags.map(tag => `${tag.name}`)
          )
          .setFooter(
            `${name} v${version} - This message was created on ${moment().format(
              timeFormat
            )}`
          );
        await message.channel.bulkDelete(1);
        await message.reply(doujinEmbed);
      } catch (err) {
        console.log(err.message);
      }
    };

    const timeFormat = 'Do MMMM YYYY, HH:mm';

    if (message.channel.id === textChannelID.nh) {
      if (args.length === 0) {
        return message.reply(
          'Kamu perlu menulis argumen setelah `' +
            prefix +
            'nh`. Lihat `' +
            prefix +
            'nh help` untuk pilihan argumen'
        );
      }
      if (
        message.member.roles.some(r => roles.nh.includes(r.name)) ||
        args[0] === 'help'
      ) {
        switch (args[0]) {
          case 'help':
            return message.channel.send(
              "```help      : Here's the help then\ninfo <ID> : Fetching the info of the doujin ID\nrandom    : Sent you a random doujin\n\nPastikan kamu menggunakan bot ini di Channel Degen. Nanti Cia marah lho```"
            );
          case 'info':
            if (args[1]) {
              await message.channel.send(
                `Mencari data untuk doujin ini... ID: ${args[1]}`
              );
              return await getDoujin(args[1], message);
            } else {
              return message.reply('Kamu perlu menambahkan 6-digit nuklir.');
            }
          case 'random':
            await message.channel.send(
              'Mencarikan doujin favorit yang pas untukmu'
            );
            const min = 150000;
            const max = 270000;
            const rand = min + Math.random() * (max - min);
            const number = Math.floor(rand);
            await getDoujin(number, message);
            return await message.channel.send('Semoga kamu suka ya~');
          default:
            return message.reply(
              'Kamu perlu menulis argumen setelah `!nh`. Lihat `!nh help` untuk pilihan argumen'
            );
        }
      } else {
        return await message.reply('', {
          file: 'https://i.imgur.com/4YNSGmG.jpg'
        });
      }
    } else {
      await message.channel.bulkDelete(1);
      await message.reply('', { file: 'https://i.imgur.com/4YNSGmG.jpg' });
      return await message.author.send(
        'Tolong jangan gunakan tag ini di sembarang tempat ya...'
      );
    }
  }
};
