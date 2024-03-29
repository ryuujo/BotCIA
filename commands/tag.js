const { Op } = require('sequelize');
const moment = require('moment');
const Tag = require('../models').Tag;
const { roles } = require('../config.js');

module.exports = {
  name: 'tag',
  description: 'Just like Nadeko or Dyno, saving your tag for memes',
  async execute(message, args, client) {
    moment.locale('id');
    const timeFormat = 'Do MMMM YYYY, HH:mm';
    const help =
      '```HELP LIST\n1. create/add [keyword] [content]: Menambahkan tag baru\n2. edit [keyword] [content]: Mengupdate tag\n3. delete [keyword] : Menghapus tag\n4. list : Menampilkan list tag yang sudah dibuat olehmu\n6. info [keyword] : Menampilkan informasi tag\n7. rank : Menampilkan informasi penggunaan tag terbanyak di server```';
    const checkMinLength = (keyword) => {
      if (keyword.length < 3) {
        message.reply('Keyword tag minimal 3 karakter ya...');
        return true;
      }
      return false;
    };
    if (args.length > 0) {
      switch (args[0]) {
        case 'create':
        case 'add':
          try {
            if (!args[1] || !args[2]) {
              return message.reply('Isi keyword dan kontennya ya...');
            }
            if (checkMinLength(args[1])) return;
            const tag = await Tag.findOne({ where: { command: args[1] } });
            if (tag) {
              return message.channel.send('Tag `' + args[1] + '` sudah ada');
            }
            await Tag.create({
              command: args[1],
              response: args.slice(2, args.length).join(' '),
              createdBy: message.author.id,
              updatedBy: message.author.id,
            });
            return await message.channel.send(
              'Tag `' + args[1] + '` berhasil dibuat!'
            );
          } catch (err) {
            return message.reply(
              `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
            );
          }
        case 'list':
          try {
            const lists = await Tag.findAll({
              where: {
                createdBy: message.author.id,
              },
              order: [['command', 'ASC']],
            });
            const listRes = await Tag.findAndCountAll({
              where: {
                createdBy: message.author.id,
              },
            });
            const listEmbed = {
              title: message.author.username + ' Tag Lists',
              description:
                lists.length !== 0
                  ? lists
                      .map((list) =>
                        list.nsfw ? `_${list.command}_` : list.command
                      )
                      .join(', ')
                  : '*Tidak ada tags yang ditampilkan*',
              fields: [{ name: 'Total Tags', value: listRes.count.toString() }],
            };
            message.reply({ content: 'Tag List', embeds: [listEmbed] });
          } catch (err) {
            return message.reply(
              'Ada sesuatu yang salah tapi itu bukan kamu: ' + err.message
            );
          }
          return;
        case 'search':
          try {
            if (!args[1]) {
              return message.channel.send('Mau nyari apa hayoo?');
            }
            if (checkMinLength(args[1])) return;
            const result = await Tag.findAll({
              where: {
                command: { [Op.like]: `%${args[1]}%` },
              },
              order: [['command', 'ASC']],
            });
            const totalRes = await Tag.findAndCountAll({
              where: {
                command: { [Op.like]: `%${args[1]}%` },
              },
              order: [['command', 'ASC']],
            });
            const resultEmbed = {
              title: 'Tag Search Results',
              description:
                result.length !== 0
                  ? result
                      .map((res) =>
                        res.nsfw ? `_${res.command}_` : res.command
                      )
                      .join(', ')
                  : '*Tidak ada hasil yang ditampilkan*',
              fields: [
                { name: 'Total Tags', value: totalRes.count.toString() },
              ],
            };
            return message.channel.send({
              content: 'Tag Search Results',
              embeds: [resultEmbed],
            });
          } catch (err) {
            return message.reply(
              'Ada sesuatu yang salah tapi itu bukan kamu: ' + err.message
            );
          }
        case 'edit':
          if (!args[1] || !args[2]) {
            return message.reply('Isi keyword dan kontennya ya...');
          }
          try {
            const tag = await Tag.findOne({ where: { command: args[1] } });
            if (!tag) {
              return message.channel.send(
                'Tidak ada tag `' + args[1] + '` yang ditemukan'
              );
            }
            if (tag.createdBy !== message.author.id) {
              return message.reply({
                files: [{ attachment: 'https://i.imgur.com/4YNSGmG.jpg' }],
              });
            }
            tag.response = args.slice(2, args.length).join(' ');
            tag.updatedBy = message.author.id;
            await tag.save();
            return message.channel.send(
              'Tag `' + args[1] + '` berhasil diubah!'
            );
          } catch (err) {
            return message.reply(
              'Ada sesuatu yang salah tapi itu bukan kamu: ' + err.message
            );
          }
        case 'delete':
          if (!args[1]) {
            return message.reply('Isi keyword yang mau di delete nya ya...');
          }
          try {
            const tag = await Tag.findOne({ where: { command: args[1] } });
            if (!tag) {
              return message.channel.send(
                'Tidak ada tag `' + args[1] + '` yang ditemukan'
              );
            }
            if (
              tag.createdBy === message.author.id ||
              message.member.roles.cache.some((r) =>
                roles.live.includes(r.name)
              )
            ) {
              await Tag.destroy({ where: { command: args[1] } });
              return message.channel.send(
                'Tag `' + args[1] + '` berhasil dihapus'
              );
            } else {
              return message.reply({
                files: [{ attachment: 'https://i.imgur.com/4YNSGmG.jpg' }],
              });
            }
          } catch (err) {
            return message.reply(
              'Ada sesuatu yang salah tapi itu bukan kamu: ' + err.message
            );
          }
        case 'info':
          try {
            const tag = await Tag.findOne({ where: { command: args[1] } });
            if (!tag) {
              return message.channel.send(
                'Tidak ada tag `' + args[1] + '` yang ditemukan'
              );
            }
            const user = await client.users.fetch(tag.createdBy);
            let tagUser;
            if (user) {
              tagUser = user.username + '#' + user.discriminator;
            } else {
              tagUser = 'User not found';
            }
            const embed = {
              title: `Info tag untuk ${tag.command}`,
              fields: [
                {
                  name: 'Tag Name',
                  value: tag.command,
                },
                {
                  name: 'Created By',
                  value: tagUser,
                },
                {
                  name: 'Times used',
                  value: tag.count.toString(),
                  inline: true,
                },
                {
                  name: 'NSFW',
                  value: tag.nsfw.toString(),
                  inline: true,
                },
                {
                  name: 'ID',
                  value: tag.id.toString(),
                  inline: true,
                },
                {
                  name: 'Created At',
                  value: moment(tag.createdAt)
                    .utcOffset('+07:00')
                    .format(timeFormat)
                    .toString(),
                },
              ],
            };
            return message.channel.send({ embeds: [embed] });
          } catch (err) {
            return message.reply(
              'Ada sesuatu yang salah tapi itu bukan kamu: ' + err.message
            );
          }
        case 'help':
          return message.channel.send(help);
        case 'rank':
          try {
            const tags = await Tag.findAll({
              order: [['count', 'DESC']],
              where: { nsfw: false },
            });
            const rank = tags.slice(0, 10);
            const rankTags = await Promise.all(
              rank.map(async (r) => {
                const user = await client.users
                  .fetch(r.createdBy)
                  .then((result) => result);
                let tagUser;
                if (user) {
                  tagUser = user.username + '#' + user.discriminator;
                } else {
                  tagUser = 'User not found';
                }
                const rankData = {
                  command: r.command,
                  createdBy: tagUser,
                  count: r.count,
                };
                return rankData;
              })
            );

            const rankEmbed = {
              title: 'Top 10 Most Used Tags',
              description: rankTags
                .map(
                  (r, i) =>
                    `${i + 1}. **${r.command}** - Created by **${
                      r.createdBy
                    }**\nUsed **${r.count}** times`
                )
                .join('\n\n'),
            };
            return message.channel.send({ embeds: [rankEmbed] });
          } catch (err) {
            return message.reply(
              'Ada sesuatu yang salah tapi itu bukan kamu: ' + err.message
            );
          }
        case 'nsfw':
          const tag = await Tag.findOne({ where: { command: args[1] } });
          if (!tag) {
            return message.channel.send(
              'Tidak ada tag `' + args[1] + '` yang ditemukan'
            );
          }
          if (
            tag.createdBy === message.author.id ||
            message.member.roles.cache.some((r) => roles.live.includes(r.name))
          ) {
            tag.nsfw = true;
            await tag.save();
            return message.channel.send(
              'Tag `' + args[1] + '` sudah diset menjadi `' + tag.nsfw + '`'
            );
          } else {
            return message.reply({
              files: [{ attachment: 'https://i.imgur.com/4YNSGmG.jpg' }],
            });
          }
        default:
          try {
            const tag = await Tag.findOne({ where: { command: args[0] } });
            if (!tag) {
              return message.channel.send(
                'Tidak ada tag `' + args[0] + '` yang ditemukan'
              );
            }
            if (tag.nsfw && !message.channel.nsfw) {
              return message.reply(
                'Tolong gunakan tag ini di channel nsfw ya...'
              );
            }
            tag.count = tag.count + 1;
            await tag.save();
            return message.channel.send(tag.response);
          } catch (err) {
            return message.reply(
              'Ada sesuatu yang salah tapi itu bukan kamu: ' + err.message
            );
          }
      }
    } else {
      return message.channel.send(help);
    }
  },
};
