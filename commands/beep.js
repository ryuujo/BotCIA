const { roles } = require('../config.json');

module.exports = {
  name: 'beep',
  description: 'Beep!',
  execute(message) {
    if (message.member.roles.some(r => roles.includes(r.name))) {
      if (message.channel.type === 'dm') return;
      const channel = message.guild.channels.get(process.env.TEXT_CHANNEL_ID);
      if (!channel) return;
      channel.send('Yahoo');
    } else {
      message.reply('', { file: 'https://i.imgur.com/4YNSGmG.jpg' });
    }
  }
};
