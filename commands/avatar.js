const Discord = require("discord.js");
const { prefix } = require("../config.json");

module.exports = {
  name: "avatar",
  description: "Get the avatar URL of the tagged user(s), or your own avatar.",
  execute(message) {
    const profileEmbed = new Discord.RichEmbed()
      .setTitle("Self Avatar Info")
      .setColor("#0099ff")
      .setDescription(`${message.author.username}'s Avatar`)
      .setURL(message.author.displayAvatarURL)
      .setImage(message.author.displayAvatarURL);

    const args = message.content.slice(prefix.length).split(/ +/);
    
    if (!message.mentions.users.size && args[1]) {
      if (args[1][0] !== "@") {
        return message.reply("You need to mention that user!");
      }
    } else if (message.mentions.users.size === 1) {
      message.mentions.users.map(user => {
        const profileEmbed = new Discord.RichEmbed()
          .setTitle("User Avatar Info")
          .setColor("#0099ff")
          .setDescription(`${user.username}'s Avatar`)
          .setURL(user.displayAvatarURL)
          .setImage(user.displayAvatarURL);
        return message.channel.send(profileEmbed);
      });
    } else {
      return message.channel.send(profileEmbed);
    }
  }
};
