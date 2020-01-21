const Discord = require('discord.js');

module.exports = {
  name: 'beep',
  description: 'Beep!',
  execute(message) {
    //const channel = client.channels.get('668781548203671552');
    //channel.send('Yahoo');
    message.channel.send('Boop!');
  }
};
