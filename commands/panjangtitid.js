module.exports = {
  name: 'panjangtitid',
  description: 'Mengukur titid...',
  execute(msg, args) {
    let id = Math.floor(Math.random() * 100) / 10;
    if (args.length < 1) {
      if (id > 8) {
        msg.reply(`Panjang titidmu adalah ${id} cm, gokil aku suka :flushed:`);
      } else if (id > 6) {
        msg.reply(
          `Panjang titidmu adalah ${id}cm, boleh lah aku suka :flushed:`
        );
      } else if (id > 3) {
        msg.reply(`Panjang titidmu adalah ${id} cm, b aja`);
      } else {
        msg.reply(`Panjang titidmu adalah ${id} cm, ih pendek`);
      }
    } else {
      if (id > 8) {
        msg.channel.send(
          `Panjang titid ${args[0]} adalah ${id} cm, gokil aku suka :flushed:`
        );
      } else if (id > 6) {
        msg.channel.send(
          `Panjang titid ${args[0]} adalah ${id} cm, boleh lah aku suka :flushed:`
        );
      } else if (id > 3) {
        msg.channel.send(`Panjang titid ${args[0]} adalah ${id} cm, b aja`);
      } else {
        msg.channel.send(`Panjang titid ${args[0]} adalah ${id} cm, ih pendek`);
      }
    }
  },
};
