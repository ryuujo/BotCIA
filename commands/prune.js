const { roles } = require("../config.js");

module.exports = {
  name: "prune",
  description: "Prune up to 99 messages.",
  execute(message, args) {
    if (!message.member.roles.some(r => roles.admin.includes(r.name))) {
      return message.reply("", { file: "https://i.imgur.com/4YNSGmG.jpg" });
    }
    const amount = parseInt(args[0]) + 1;
    if (isNaN(amount)) {
      return message.reply("Sayangnya itu bukan angka.");
    } else if (amount <= 1 || amount > 100) {
      return message.reply("Kamu harus input antara 1 sampai 99.");
    }
    message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      message.channel.send(
        "there was an error trying to prune messages in this channel!"
      );
    });
  }
};
