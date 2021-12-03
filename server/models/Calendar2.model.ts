import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { CourtCase } from "./CourtCase2.model";

interface TrackCourtCase {
  id: string;
  judgeGroupId: number;
  fileNo: string;
  court: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isDisabled?: boolean;
  time: string; // e.g. 9:00
  sessionTimeInMinutes: number;
  userId: number;
  registeredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CalendarAttributes {
  id?: number;
  date: string;
  tracks: TrackCourtCase[][];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Calendar extends Model<CalendarAttributes> implements CalendarAttributes {
  public id!: number;
  public date!: string;
  public tracks!: TrackCourtCase[][];

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
