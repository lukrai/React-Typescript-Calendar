import { DataTypes, Model, Sequelize } from "sequelize";

export interface AppSettingsAttributes {
  id?: number;
  weekDay: number; // available day of the week in calendar
}

export class AppSettings extends Model<AppSettingsAttributes> implements AppSettingsAttributes {
  public weekDay!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const AppSettingsFactory = (sequelize: Sequelize) => {
  AppSettings.init(
    {
      weekDay: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize },
  );
};
