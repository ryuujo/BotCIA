const { name, version } = require("../package.json");

module.exports = {
  name: "about",
  description: "About this BOT",
  execute(message) {
    message.channel.send(
      "```Hello my name is " +
        name +
        " v" +
        version +
        ". At your Service!\nMy master is: RJKuker#3103```"
    );
  }
};
