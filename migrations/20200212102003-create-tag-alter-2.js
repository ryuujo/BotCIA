"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Tags", "nsfw", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Tags", "nsfw");
  }
};
