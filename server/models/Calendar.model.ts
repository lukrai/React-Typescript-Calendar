import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { IDatabase } from "../typings/DbInterface";
import { SequelizeAttributes } from "../typings/SequelizeAttributes";
import { ICourtCase } from "./CourtCase.model";

export interface ICalendar extends Model {
  id?: number;
  courtCases: ICourtCase[];
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CalendarModel = typeof Model &
  (new (values?: object, options?: BuildOptions) => ICalendar) & {
    associate: (model: IDatabase) => any;
  };

export const CalendarFactory = (sequelize: Sequelize): CalendarModel => {
  const attributes: Partial<SequelizeAttributes<ICalendar>> = {
    date: {
      type: DataTypes.STRING,
      unique: true,
    },
  };

  const calendar = sequelize.define("Calendar", attributes, {
    indexes: [
      {
        name: "calendar_date_index",
        fields: ["date"],
      },
    ],
  }) as CalendarModel;

  calendar.associate = models => {
    calendar.hasMany(models.CourtCase, {
      as: "courtCases",
      foreignKey: {
        name: "calendarId",
        allowNull: false,
      },
    });
  };

  return calendar;
};
