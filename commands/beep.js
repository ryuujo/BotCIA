const { roles, textChannelID } = require('../config.js');

module.exports = {
  name: 'beep',
  description: 'Beep!',
  execute(message) {
    if (message.member.roles.some(r => roles.live.includes(r.name))) {
      if (message.channel.type === 'dm') return;
      const channel = message.guild.channels.get(textChannelID.live);
      if (!channel) return;
      channel.send('Yahoo BotCIA di sini!');
    } else {
      message.reply('', { file: 'https://i.imgur.com/4YNSGmG.jpg' });
    }
  }
};
