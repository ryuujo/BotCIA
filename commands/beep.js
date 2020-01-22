const { textChannelID } = require('../config.json');

module.exports = {
  name: 'beep',
  description: 'Beep!',
  execute(message) {
    if (message.channel.type === 'dm') return;
    const channel = message.guild.channels.get(textChannelID);
    if (!channel) return;
    channel.send('Yahoo');
  }
};
