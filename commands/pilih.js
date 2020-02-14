module.exports = {
  name: "pilih",
  description:
    "Let BotCIA choose between two things. But please take it with a grain of salt.",
  execute(message, args) {
    const atauIndex = args.findIndex(arg => arg.toLowerCase() === "atau");
    if (atauIndex > 0) {
      const a = args.slice(0, atauIndex).join(" ");
      const b = args.slice(atauIndex + 1, args.length).join(" ");
      if (a.toLowerCase() === b.toLowerCase()) {
        return message.channel.send("Hmm... Maksudnya gimana ya?");
      }
      const min = 1;
      const max = 12;
      const rand = min + Math.random() * (max - min);
      const number = Math.floor(rand);
      switch (number) {
        case 2:
        case 5:
        case 6:
        case 8:
          return message.channel.send(`Aku pilih ${a}`);
        case 3:
        case 4:
        case 7:
        case 9:
          return message.channel.send(`Aku pilih ${b}`);
        case 1:
          return message.channel.send("Aku pilih keduanya");
        case 10:
          return message.channel.send("Aku gak pilih keduanya");
        case 11:
          return message.channel.send("Aku pilihnya kamu aja *wink*");
      }
    } else {
      message.reply(
        "Kamu perlu menambah kata `atau` agar aku bisa membandingkan kedua hal"
      );
    }
  }
};
