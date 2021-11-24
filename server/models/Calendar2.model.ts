import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { CourtCase } from "./CourtCase2.model";

export interface CalendarAttributes {
  id?: number;
  date: string;
  tracks: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Calendar extends Model<CalendarAttributes> implements CalendarAttributes {
  public id!: number;
  public date!: string;
  public tracks!: any;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly courtCases: CourtCase[];

  public static associations: {
    courtCases: Association<Calendar, CourtCase>;
  };
}

export const CalendarFactory = (sequelize: Sequelize) => {
  Calendar.init(
    {
      date: {
        type: DataTypes.STRING,
        unique: true,
      },
      tracks: {
        type: DataTypes.JSON,
      },
    },
    {
      sequelize,
      indexes: [
        {
          name: "calendar_date_index",
          fields: ["date"],
        },
      ],
    },
  );

  // Calendar.hasMany(CourtCase, {
  //   as: "courtCases",
  //   foreignKey: {
  //     name: "calendarId",
  //     allowNull: false,
  //   },
  // });
};
