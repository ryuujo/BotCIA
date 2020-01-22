if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');

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
  client.user.setActivity(process.env.ACTIVITY);
  console.log('Ready!');
});

client.on('message', message => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot)
    return;

  const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
  const command = args.shift().toLowerCase();
  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(process.env.TOKEN);
