"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Calendars", // table name
      "tracks", // new field name
      {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("Calendars", "tracks");
  },
};
