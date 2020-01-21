const Discord = require('discord.js');

module.exports = {
  name: 'beep',
  description: 'Beep!',
  execute(message) {
    message.author.send('Boop!');
  }
};
