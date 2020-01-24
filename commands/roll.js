const axios = require('axios');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
const { name, version } = require('../package.json');

module.exports = {
  name: 'roll',
  description: 'Rolling a nice card for you',
  args: true,
  async execute(message, args) {
    const timeFormat = 'Do MMMM YYYY, HH:mm';
    const game = args[0] ? args[0].toLowerCase() : 'none';
    message.channel.send('Rolling gacha just for you');
    switch (game) {
      case 'll':
      case 'lovelive':
        const llMin = 1;
        const llMax = 2271;
        const rand = llMin + Math.random() * (llMax - llMin);
        const number = Math.floor(rand);
        const color = {
          smile: '#e60076',
          pure: '#27aa54',
          cool: '0199ec'
        };
        try {
          const { data } = await axios.get(
            `https://schoolido.lu/api/cards/${number}`
          );
          const embed = new RichEmbed()
            .setColor(color[data.attribute.toLowerCase()])
            .setAuthor(
              'LoveLive Gacha Roll by BotCIA',
              'https://d2jcw5q7j4vmo4.cloudfront.net/WGFyx2PNQkEYFxGtSodPpifBpFIu7nqlikBIXjHdrh9XZfUge35q5lwZAD7mx07NXvpv=w512'
            )
            .setTitle(
              data.rarity === 'N' || data.rarity === 'R'
                ? 'Here is your card'
                : `Wow You Got ${data.rarity} card!`
            )
            .setThumbnail(
              data.round_card_image
                ? `http:${data.round_card_image}`
                : `http:${data.round_card_idolized_image}`
            )
            .setURL(data.website_url)
            .addField('Smile', data.minimum_statistics_smile, true)
            .addField('Pure', data.minimum_statistics_pure, true)
            .addField('Cool', data.minimum_statistics_cool, true)
            .addField('Skill', data.skill ? data.skill : 'None', true)
            .addField(
              'Center Skill',
              data.center_skill ? data.center_skill : 'None',
              true
            )
            .addField(
              'Skill Details',
              data.skill_details ? data.skill_details : 'None'
            )
            .addField('Rarity', data.rarity, true)
            .addField('Character', data.idol.name, true)
            .setImage(
              data.card_image
                ? `http:${data.card_image}`
                : `http:${data.card_idolized_image}`
            )
            .setFooter(
              `${name} v${version} - This message was created on ${moment()
                .add(7, 'hours')
                .format(timeFormat)} | ID: ${number}`
            );
          return await message.reply(embed);
        } catch (err) {
          return message.reply(
            'Sepertinya ada sesuatu yang salah. Coba roll lagi. ' + number
          );
        }
      case 'bandori':
        const bandoriMin = 501;
        const bandoriMax = 1341;
        const bandoriRand = llMin + Math.random() * (llMax - llMin);
        const bandoriNumber = Math.floor(rand);
        return message.reply('Lagi perkembangan');
      default:
        return message.reply(
          '```Silahkan pilih kartu mana yang mau di roll:\n1. lovelive / ll\n2. bandori```'
        );
    }
  }
};
