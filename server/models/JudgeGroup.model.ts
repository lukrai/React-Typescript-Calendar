import { Sequelize, Model, DataTypes, Optional } from "sequelize";

export interface JudgeGroupAttributes {
  id?: number;
  defaultTimeCardCount: number;
  defaultStartingHour: number;
  defaultStartingMinute: number;
  defaultSessionTimeInMinutes: number;

  timeCardCount: number;
  startingHour: number;
  startingMinute: number;
  sessionTimeInMinutes: number;

  createdAt?: Date;
  updatedAt?: Date;
}

type JudgeGroupCreationAttributes = Optional<JudgeGroupAttributes, "id">;

export class JudgeGroup
  extends Model<JudgeGroupAttributes, JudgeGroupCreationAttributes>
  implements JudgeGroupAttributes {
  public id!: number;

  public defaultTimeCardCount: number;
  public defaultStartingHour: number;
  public defaultStartingMinute: number;
  public defaultSessionTimeInMinutes: number;

  public timeCardCount: number;
  public startingHour: number;
  public startingMinute: number;
  public sessionTimeInMinutes: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const JudgeGroupFactory = (sequelize: Sequelize) => {
  JudgeGroup.init(
    {
      defaultTimeCardCount: {
        type: DataTypes.INTEGER,
      },
      defaultStartingHour: {
        type: DataTypes.INTEGER,
      },
      defaultStartingMinute: {
        type: DataTypes.INTEGER,
      },
      defaultSessionTimeInMinutes: {
        type: DataTypes.INTEGER,
      },
      timeCardCount: {
        type: DataTypes.INTEGER,
      },
      startingHour: {
        type: DataTypes.INTEGER,
      },
      startingMinute: {
        type: DataTypes.INTEGER,
      },
      sessionTimeInMinutes: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
    },
  );
};
