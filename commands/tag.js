const { Op } = require('sequelize');
const Tag = require('../models').Tag;
const { roles } = require('../config.js');

module.exports = {
  name: 'tag',
  description: 'Just like Nadeko or Dyno, saving your tag for memes',
  async execute(message, args) {
    const help =
      '```HELP LIST\n1. create [keyword] [content]: Menambahkan tag baru\n2. edit [keyword] [content]: Mengupdate tag\n3. delete [keyword] : Menghapus tag\n4. list : Menampilkan list tag yang sudah dibuat olehmu\n5. tags: Menampilkan keseluruhan tag\n6. search [keyword] : Mencari tag berdasarkan keyword```';
    if (args.length > 0) {
      switch (args[0]) {
        case 'create':
        case 'add':
          try {
            const tag = await Tag.findOne({ where: { command: args[1] } });
            if (!tag) {
              await Tag.create({
                command: args[1],
                response: args.slice(2, args.length).join(' '),
                createdBy:
                  message.author.username + '#' + message.author.discriminator,
                updatedBy:
                  message.author.username + '#' + message.author.discriminator
              });
              return await message.channel.send(
                'Tag `' + args[1] + '` berhasil dibuat!'
              );
            } else {
              return message.channel.send('Tag `' + args[1] + '` sudah ada');
            }
          } catch (err) {
            console.log(err);
            return message.reply(
              `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
            );
          }
        case 'list':
          try {
            const lists = await Tag.findAll({
              where: {
                createdBy:
                  message.author.username + '#' + message.author.discriminator
              },
              order: [['command', 'ASC']]
            });
            const listEmbed = {
              title: message.author.username + ' Tag Lists',
              description:
                lists.length !== 0
                  ? lists.map(list => list.dataValues.command).join(', ')
                  : '*Tidak ada tags yang ditampilkan*'
            };
            message.reply('tag list', { embed: listEmbed });
          } catch (err) {
            console.log(err);
            return message.reply(
              'Ada sesuatu yang salah tapi itu bukan kamu: ' + err.message
            );
          }
          return;
        case 'search':
          try {
            const result = await Tag.findAll({
              where: {
                command: { [Op.like]: `%${args[1]}%` }
              },
              order: [['command', 'ASC']]
            });
            const resultEmbed = {
              title: 'Tag Search Results',
              description:
                result.length !== 0
                  ? result.map(res => res.dataValues.command).join(', ')
                  : '*Tidak ada hasil yang ditampilkan*'
            };
            return message.channel.send({ embed: resultEmbed });
          } catch (err) {
            console.log(err);
            return message.reply(
              'Ada sesuatu yang salah tapi itu bukan kamu: ' + err.message
            );
          }
        case 'edit':
          try {
            const tag = await Tag.findOne({ where: { command: args[1] } });
            if (tag) {
              if (
                tag.createdBy ===
                message.author.username + '#' + message.author.discriminator
              ) {
                tag.response = args.slice(2, args.length).join(' ');
                tag.updatedBy =
                  message.author.username + '#' + message.author.discriminator;
                await tag.save();
                return message.channel.send(
                  'Tag `' + args[1] + '` berhasil diubah!'
                );
              } else {
                return message.reply('', {
                  file: 'https://i.imgur.com/4YNSGmG.jpg'
                });
              }
            } else {
              return message.channel.send(
                'Tidak ada tag `' + args[1] + '` yang ditemukan'
              );
            }
          } catch (err) {
            console.log(err);
            return message.reply(
              'Ada sesuatu yang salah tapi itu bukan kamu: ' + err.message
            );
          }
        case 'delete':
          try {
            const tag = await Tag.findOne({ where: { command: args[1] } });
            if (tag) {
              if (
                tag.createdBy ===
                  message.author.username +
                    '#' +
                    message.author.discriminator ||
                message.member.roles.some(r => roles.live.includes(r.name))
              ) {
                await Tag.destroy({ where: { command: args[1] } });
                return message.channel.send(
                  'Tag `' + args[1] + '` berhasil dihapus'
                );
              } else {
                return message.reply('', {
                  file: 'https://i.imgur.com/4YNSGmG.jpg'
                });
              }
            } else {
              return message.channel.send(
                'Tidak ada tag `' + args[1] + '` yang ditemukan'
              );
            }
          } catch (err) {
            console.log(err);
            return message.reply(
              'Ada sesuatu yang salah tapi itu bukan kamu: ' + err.message
            );
          }
        case 'help':
          return message.channel.send(help);
        default:
          try {
            const tag = await Tag.findOne({ where: { command: args[0] } });
            if (tag) {
              tag.count = tag.count + 1;
              await tag.save();
              return message.channel.send(tag.response);
            } else {
              return message.channel.send(
                'Tidak ada tag `' + args[0] + '` yang ditemukan'
              );
            }
          } catch (err) {
            console.log(err);
            return message.reply(
              'Ada sesuatu yang salah tapi itu bukan kamu: ' + err.message
            );
          }
      }
    } else {
      return message.channel.send(help);
    }
  }
};
