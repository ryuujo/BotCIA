const config = require("../config.js");

module.exports = {
  name: "gws",
  description: "Says Get well soon to someone",
  execute(message) {
    const args = message.content.slice(config.prefix.length).split(/ +/);
    if (!message.mentions.users.size && args[1]) {
      if (args[1][0] !== "@") {
        return message.reply("Kamu harus mention user tersebut!");
      }
    }
    if (message.mentions.users.size > 0) {
      message.channel.send(
        `GWS untuk kamu ${message.mentions.users
          .map(user => `<@${user.id}>`)
          .join(", ")}`
      );
      return;
    }
    return message.reply("GWS juga untuk kamu");
  }
};
