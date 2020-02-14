module.exports = {
  name: "ping",
  description: "Ping me if you or this bot feel laggy",
  execute(message) {
    message.channel.send("**Pong.** Aku di sini~");
  }
};
