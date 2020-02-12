const Tag = require('../models').Tag;

module.exports = {
  name: 'tag',
  description: 'Just like Nadeko or Dyno, saving your tag for memes',
  async execute(message, args) {
    if (args.length > 0) {
      switch (args[0]) {
        case 'create':
          const command = args[1];
          const text = args.slice(2, args.length).join(' ');
          const author =
            message.author.username + '#' + message.author.discriminator;
          try {
            const tag = await Tag.findOne({ where: { command: command } });
            if (!tag) {
              await Tag.create({
                command: command,
                response: text,
                createdBy: author
              });
              return await message.channel.send(
                'Tag `' + command + '` berhasil dibuat!'
              );
            } else {
              return message.reply('Tagnya sudah ada');
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
          return message.channel.send('Deleting the tag');
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
