const vliver = require('../constants/vliver');

module.exports = {
  name: 'live',
  description: 'Announces Upcoming live immediately',
  args: true,
  execute(message, args) {
    message.channel.bulkDelete(1).catch(err => {
      console.error(err);
      return message.channel.send('I need permission to delete your message');
    });

    if (args.length !== 4) {
      return message.reply(
        'Please type these arguments: `Vliver First Name`, `Livestream Date (DD/MM/YYYY)`, `Livestream Time (HH:MM)`, `Youtube Link (https://)`'
      );
    }
    const vliverFirstName = args[0].toLowerCase();
    const livestreamDate = args[1];
    const livestreamTime = args[2];
    const youtubeLink = args[3];

    const vData = vliver[vliverFirstName];

    message.channel.send(
      `Here's your arguments:\nVliver First Name: ${vData.fullName}\nLivestream Date: ${livestreamDate}\nLivestream Time: ${livestreamTime}\nYoutube Link: ${youtubeLink}`
    );
  }
};
