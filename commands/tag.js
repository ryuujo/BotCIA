const Tag = require('../models').Tag;

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
        case 'search':
          return; // message.channel.send('Searching');
        case 'edit':
          return message.channel.send('Editing the tag');
        case 'delete':
          try {
            const tag = await Tag.findOne({ where: { command: args[1] } });
            if (tag) {
              await Tag.destroy({ where: { command: args[1] } });
              return await message.channel.send(
                'Tag `' + args[1] + '` berhasil dihapus'
              );
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
      return message.channel.send('This should be help');
    }
  }
};
