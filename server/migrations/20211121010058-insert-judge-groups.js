"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "JudgeGroups",
      [
        {
          timeCardCount: 5,
          startingHour: 9,
          startingMinute: 0,
          sessionTimeInMinutes: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          timeCardCount: 5,
          startingHour: 9,
          startingMinute: 0,
          sessionTimeInMinutes: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          timeCardCount: 5,
          startingHour: 9,
          startingMinute: 0,
          sessionTimeInMinutes: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          timeCardCount: 5,
          startingHour: 9,
          startingMinute: 0,
          sessionTimeInMinutes: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          timeCardCount: 5,
          startingHour: 9,
          startingMinute: 0,
          sessionTimeInMinutes: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          timeCardCount: 5,
          startingHour: 9,
          startingMinute: 0,
          sessionTimeInMinutes: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          timeCardCount: 5,
          startingHour: 9,
          startingMinute: 0,
          sessionTimeInMinutes: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("JudgeGroups", null, {});
  },
};
