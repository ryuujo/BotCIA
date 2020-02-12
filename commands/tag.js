module.exports = {
  name: 'tag',
  description: 'Just like Nadeko or Dyno, saving your tag for memes',
  execute(message, args) {
    if (args.length > 0) {
      switch (args[0]) {
        case 'create':
          const command = args[1];
          const text = args.slice(2, args.length).join(' ');
          console.log('Command: ' + command);
          console.log('Text: ' + text);
          return message.channel.send('Creating the tag');
        case 'search':
          return message.channel.send('Searching');
        case 'edit':
          return message.channel.send('Editing the tag');
        case 'delete':
          return message.channel.send('Deleting the tag');
        default:
          return message.channel.send('Your example tag');
      }
    } else {
      return message.channel.send('Tagnya mana?');
    }
  }
};
