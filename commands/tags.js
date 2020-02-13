const Tag = require('../models').Tag;

module.exports = {
  name: 'tags',
  description: 'Show all tags',
  async execute(message) {
    try {
      const tag = await Tag.findAll({
        order: [['command', 'ASC']]
      });
      const listEmbed = {
        title: 'Tag Lists',
        description:
          tag.length !== 0
            ? tag.map(list => list.dataValues.command).join(', ')
            : '*Tidak ada tags yang ditampilkan*'
      };
      message.channel.send({ embed: listEmbed });
    } catch (err) {
      console.log(err);
    }
  }
};
