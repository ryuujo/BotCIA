const Discord = require("discord.js");
const moment = require("moment");
const config = require("./config.js");
const { version } = require("./package.json");
const Sequelize = require("sequelize");
const database = require("./config/config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const sequelize = new Sequelize(
  database.development.database,
  database.development.username,
  database.development.password,
  {
    host: database.development.host,
    dialect: database.development.dialect,
    logging: false,
    dialectOptions: {
      timezone: "etc/GMT+7"
    }
  }
);

client.login(config.token);

client.once("ready", async () => {
  try {
    let guild = client.guilds.get(config.guildID);
    await sequelize
      .authenticate()
      .then(console.log("Database Connected. Trying to send the message..."));
      
    await guild.channels.get(config.textChannelID.cron).send("Good Morning");

    await console.log(
      `Cron Job complete. Time sent on ${moment().format(
        "dddd DD MMMM YYYY HH:mm:ss Z"
      )}. Trying to exit... `
    );
    await client.destroy();
  } catch (err) {
    client.destroy();
    console.log("Something error: ", err);
  }
});
