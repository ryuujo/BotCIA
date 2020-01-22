const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, activity, roles } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  client.user.setActivity(activity);
  console.log('Ready!');
});

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  if (!client.commands.has(command)) return;

  if (message.member.roles.some(r => roles.includes(r.name))) {
    try {
      client.commands.get(command).execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
    }
  } else {
    message.reply('', { file: 'https://i.imgur.com/4YNSGmG.jpg' });
  }
});

client.login(token);
