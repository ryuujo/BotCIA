'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      youtubeUrl: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dateTime: {
        allowNull: false,
        type: Sequelize.DATE
      },
      vliverID: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Vlivers',
          key: 'id'
        }
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('live', 'premiere'),
        defaultValue: 'live'
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
    return queryInterface.dropTable('Schedules');
  }
};
