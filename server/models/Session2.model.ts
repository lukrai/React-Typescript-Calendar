import { DataTypes, Model, Sequelize } from "sequelize";

export interface SessionAttributes {
  // id: number;
  sid: string;
  expires: Date;
  data: string;
}

export class Session extends Model<SessionAttributes> implements SessionAttributes {
  // public id!: number;
  public sid!: string;
  public expires!: Date;
  public data!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const SessionFactory = (sequelize: Sequelize) => {
  Session.init(
    {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      expires: DataTypes.DATE,
      data: DataTypes.STRING(50000),

      // userId: DataTypes.STRING,
      // expires: DataTypes.DATE,
      // data: DataTypes.TEXT,
    },
    {
      sequelize,
      indexes: [
        {
          name: "session_sid_index",
          fields: ["sid"],
        },
      ],
    },
  );
};
