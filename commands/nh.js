module.exports = {
  name: 'nh',
  description: 'Something NSFW that you would like',
  execute(message, args) {
    console.log(args);
    switch (args[0]) {
      case 'help':
        return message.channel.send("Here's the help");
      case 'info':
        if (args[1]) {
          return message.channel.send(
            `Returning your favorite doujin ${args[1]}`
          );
        } else {
          return message.reply('Kamu perlu menambahkan 6-digit nuklir.');
        }
      default:
        return message.reply(
          'Kamu perlu menulis argumen setelah `!nh`. Lihat `!nh help` untuk pilihan argumen'
        );
    }
  }
};
