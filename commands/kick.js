module.exports = {
  name: 'kick',
  description: 'Tag a member and kick them (but not really).',
  execute(message) {
    if (!message.mentions.users.size) {
      return message.reply('Kamu harus mention user tersebut!');
    }

    const taggedUser = message.mentions.users.first();

    message.channel.send(`Tendangan maut untuk: ${taggedUser.username}`);
  }
};
