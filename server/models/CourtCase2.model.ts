import { Association, BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { IDatabase } from "../typings/DbInterface";
import { SequelizeAttributes } from "../typings/SequelizeAttributes";
import { Calendar } from "./Calendar2.model";
import { User } from "./User2.model";

interface CourtCaseAttributes {
  id?: number;
  calendarId: number;
  fileNo: string;
  court: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isDisabled?: boolean;
  time: string; // e.g. 9:00
  userId: number;
  registeredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// You can write `extends Model<AddressAttributes, AddressAttributes>` instead,
// but that will do the exact same thing as below
export class CourtCase extends Model<CourtCaseAttributes> implements CourtCaseAttributes {
  public id!: number;
  public calendarId!: number;
  public fileNo!: string;
  public court!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phoneNumber!: string;
  public isDisabled!: boolean | null;
  public time!: string; // e.g. 9:00
  public userId!: number;
  public registeredAt!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly calendar: CourtCase;

  public static associations: {
    calendar: Association<CourtCase, Calendar>;
  };
}

// export interface ICourtCase {
//   id?: number;
//   calendarId: number;
//   fileNo: string;
//   court: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   isDisabled?: boolean;
//   time: string; // e.g. 9:00
//   userId: number;
//   registeredAt?: Date;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export type CourtCaseModel = typeof Model &
//   (new (values?: object, options?: BuildOptions) => ICourtCase) & {
//     associate: (model: IDatabase) => any;
//   };

export const CourtCaseFactory = (sequelize: Sequelize) => {
  CourtCase.init(
    {
      court: {
        type: DataTypes.STRING,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      fileNo: {
        type: DataTypes.STRING,
      },
      isDisabled: {
        type: DataTypes.BOOLEAN,
      },
      time: {
        type: DataTypes.STRING,
      },
      registeredAt: {
        type: DataTypes.DATE,
      },
      userId: {
        type: DataTypes.INTEGER,
        // field: 'user_id'
      },
      calendarId: {
        type: DataTypes.INTEGER,
        // field: 'user_id'
      },
    },
    {
      tableName: "CourtCases",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  // CourtCase.associate = models => {
  // CourtCase.belongsTo(Calendar, {
  //   foreignKey: {
  //     name: "calendarId",
  //     allowNull: false,
  //   },
  //   as: "calendar",
  // });
  // CourtCase.belongsTo(User, {
  //   foreignKey: {
  //     name: "userId",
  //   },
  // });
};
