const Discord = require("discord.js");
const config = require("../config.js");

module.exports = {
  name: "avatar",
  description: "Get the avatar URL of the tagged user(s), or your own avatar.",
  execute(message) {
    const profileEmbed = new Discord.RichEmbed()
      .setTitle("Info Foto Profil")
      .setColor("#0099ff")
      .setDescription(`Foto Profil milik ${message.author.username}`)
      .setURL(message.author.displayAvatarURL)
      .setImage(message.author.displayAvatarURL);

    const args = message.content.slice(config.prefix.length).split(/ +/);

    if (!message.mentions.users.size && args[1]) {
      if (args[1][0] !== "@") {
        return message.reply("Kamu harus mention user tersebut!");
      }
    } else if (message.mentions.users.size === 1) {
      message.mentions.users.map(user => {
        const profileEmbed = new Discord.RichEmbed()
          .setTitle("Info Foto Profil User")
          .setColor("#0099ff")
          .setDescription(`Foto Profil milik ${user.username}`)
          .setURL(user.displayAvatarURL)
          .setImage(user.displayAvatarURL);
        return message.channel.send(profileEmbed);
      });
    } else {
      return message.channel.send(profileEmbed);
    }
  }
};
