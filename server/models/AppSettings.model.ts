import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { SequelizeAttributes } from "../typings/SequelizeAttributes";

export interface IAppSettings extends Model {
  id?: number;
  weekDay: number; // available day of the week in calendar
  createdAt?: Date;
  updatedAt?: Date;
}

export type AppSettingsModel = typeof Model & (new (values?: object, options?: BuildOptions) => IAppSettings);

export const AppSettingsFactory = (sequelize: Sequelize): AppSettingsModel => {
  const attributes: Partial<SequelizeAttributes<IAppSettings>> = {
    weekDay: {
      type: DataTypes.INTEGER,
    },
  };

  return sequelize.define("AppSettings", attributes) as AppSettingsModel;
};
