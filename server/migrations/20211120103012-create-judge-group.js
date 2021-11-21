"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("JudgeGroups", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      timeCardCount: {
        type: Sequelize.INTEGER,
      },
      timeCardCount: {
        type: Sequelize.INTEGER,
      },
      startingHour: {
        type: Sequelize.INTEGER,
      },
      startingMinute: {
        type: Sequelize.INTEGER,
      },
      sessionTimeInMinutes: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("JudgeGroups");
  },
};
