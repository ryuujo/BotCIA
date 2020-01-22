module.exports = {
  name: 'beep',
  description: 'Beep!',
  execute(message) {
    if (message.channel.type === 'dm') return;
    const channel = message.guild.channels.get(process.env.TEXT_CHANNEL_ID);
    if (!channel) return;
    channel.send('Yahoo');
  }
};
