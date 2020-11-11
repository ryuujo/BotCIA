"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Vlivers', 'morningMessage', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Vlivers");
  }
};
