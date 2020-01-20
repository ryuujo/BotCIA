const Discord = require("discord.js");

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
    if (!message.mentions.users.size) {
      return message.channel.send(profileEmbed);
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
      return;
    }
  }
};
