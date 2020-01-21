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
    console.log(args);
    message.channel.send(args);
  }
};
