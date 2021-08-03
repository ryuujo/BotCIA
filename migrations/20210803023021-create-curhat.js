'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Curhats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      skey: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      userName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.TEXT("long")
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Curhats');
  }
};