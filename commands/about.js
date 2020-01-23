const { name, version } = require('../package.json');

module.exports = {
  name: 'about',
  description: 'About this BOT',
  execute(message) {
    message.channel.send(
      '```Hello my name is ' + name + ' v' + version + '\nAt your Service!```'
    );
  }
};
