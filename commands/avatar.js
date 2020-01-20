const Discord = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Get the avatar URL of the tagged user(s), or your own avatar.",
  execute(message) {
    console.log(message.author);
    const profileEmbed = new Discord.RichEmbed()
      .setTitle("Avatar Info")
      .setColor("#0099ff")
      .setDescription(
        `${message.author.username}#${message.author.discriminator}`
      )
      .setURL(message.author.displayAvatarURL)
      .setImage(message.author.displayAvatarURL);

    if (!message.mentions.users.size) {
      return message.channel.send(profileEmbed);
    }

    const avatarList = message.mentions.users.map(user => {
      return `${user.username}'s avatar: ${user.displayAvatarURL}`;
    });

    message.channel.send(avatarList);
  }
};
