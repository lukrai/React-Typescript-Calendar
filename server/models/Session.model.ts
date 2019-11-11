import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { SequelizeAttributes } from "../typings/SequelizeAttributes";

export interface ISession extends Model {
  id?: number;
  sid: string;
  expires: Date;
  data: string;
}

export type SessionModel = typeof Model & (new (values?: object, options?: BuildOptions) => ISession) & {};

export const SessionFactory = (sequelize: Sequelize): SessionModel => {
  const attributes: Partial<SequelizeAttributes<ISession>> = {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expires: DataTypes.DATE,
    data: (DataTypes.STRING(50000) as unknown) as string,
  };

  return sequelize.define("Session", attributes, {
    indexes: [
      {
        name: "session_sid_index",
        fields: ["sid"],
      },
    ],
  }) as SessionModel;
};
