module.exports = {
  name: 'sieg',
  description: 'HEIL!',
  execute(message) {
    message.channel.send("HEIL ( '-')/", {
      file:
        'https://cdn.discordapp.com/attachments/668781485427392543/670142770551193620/tenor.gif',
    });
  },
};
