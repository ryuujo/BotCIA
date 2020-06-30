'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Schedules', 'thumbnailUrl', {
      type: Sequelize.STRING,
      defaultValue: '',
      allowNull: false,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Schedules', 'thumbnailUrl');
  },
};
