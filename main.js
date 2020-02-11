const fs = require('fs');
const Discord = require('discord.js');
const moment = require('moment');
const config = require('./config.js');
const { version } = require('./package.json');
const Sequelize = require('sequelize');
const database = require('./config/config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const sequelize = new Sequelize(
  database.development.database,
  database.development.username,
  database.development.password,
  {
    host: database.development.host,
    dialect: database.development.dialect,
    logging: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    dialectOptions: {
      timezone: 'etc/GMT+7'
    }
  }
);

client.once('ready', () => {
  client.user.setActivity(config.activity);
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  console.log('BotCIA version: ' + version + ' is ready and active!');
  console.log(
    'My Active Time was at ' + moment().format('dddd DD MMMM YYYY HH:mm:ss Z')
  );
});

client.on('message', message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }
});

client.login(config.token);
