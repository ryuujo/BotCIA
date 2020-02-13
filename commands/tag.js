const Tag = require('../models').Tag;
const { roles } = require('../config.js');

module.exports = {
  name: 'tag',
  description: 'Just like Nadeko or Dyno, saving your tag for memes',
  async execute(message, args) {
    if (args.length > 0) {
      switch (args[0]) {
        case 'create':
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
              }
            });
            const listEmbed = {
              title:
                message.author.username +
                '#' +
                message.author.discriminator +
                ' Tag Lists',
              description:
                lists.length !== 0
                  ? lists.map(list => list.dataValues.command).join(', ')
                  : '*Tidak ada tags yang ditampilkan*'
            };
            message.channel.send(
              message.author.username +
                '#' +
                message.author.discriminator +
                ' tag list',
              { embed: listEmbed }
            );
          } catch (err) {
            console.log(err);
          }
          return;
        case 'search':
          return; // message.channel.send('Searching');
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
                return await message.channel.send(
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
          }

        default:
          try {
            const tag = await Tag.findOne({ where: { command: args[0] } });
            if (tag) {
              return message.channel.send(tag.response);
            } else {
              return message.channel.send(
                'Tidak ada tag `' + args[0] + '` yang ditemukan'
              );
            }
          } catch (err) {
            console.log(err);
          }
      }
    } else {
      return message.channel.send(
        '```HELP LIST\n1. create [keyword] [content]: Menambahkan keyword baru\n2. edit [keyword] [content]: Mengupdate keyword\n3. delete [keyword] : Menghapus keyword\n4. list : Menampilkan list tag yang sudah dibuat olehmu\n5. search [keyword] : Mencari keyword (In development)```'
      );
    }
  }
};
