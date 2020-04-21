const config = require("../config.js");

module.exports = {
  name: "gws",
  description: "Says Get well soon to someone",
  execute(message, args) {
    if (args.length > 0) {
      message.channel.send(
        `GWS untuk kamu, ${args[0]}`
      );
      return;
    }
    return message.reply("GWS juga untuk kamu");
  }
};
