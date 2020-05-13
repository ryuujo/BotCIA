module.exports = {
  name: 'iam',
  description: 'Assign a role',
  async execute(message, args) {
    try {
      if (!args[0]) {
        return message.reply('Role tidak ditemukan');
      }
      let role = await message.guild.roles.find(
        (role) => role.name.toLowerCase() === args[0].toLowerCase()
      );
      if (
        !message.member.roles.some(
          (r) => r.name.toLowerCase() === args[0].toLowerCase()
        )
      ) {
        await message.member.addRole(role);
        return message.reply(`Role ${args[0]} telah ditambahkan`);
      } else {
        return message.reply('Kamu sudah mendapatkan role itu');
      }
    } catch (err) {
      return message.reply('Role tidak ditemukan');
    }
  },
};
