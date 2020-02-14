"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Vlivers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fullName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fanName: {
        allowNull: true,
        type: Sequelize.STRING
      },
      color: {
        allowNull: false,
        type: Sequelize.STRING
      },
      avatarURL: {
        allowNull: false,
        type: Sequelize.STRING
      },
      channelURL: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Vlivers");
  }
};
