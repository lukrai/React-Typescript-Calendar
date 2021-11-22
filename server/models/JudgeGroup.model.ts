import { Sequelize, Model, DataTypes, Optional } from "sequelize";

export interface JudgeGroupAttributes {
  id?: number;

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
