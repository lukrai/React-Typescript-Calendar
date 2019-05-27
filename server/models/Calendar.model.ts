import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";
import {IDatabase} from "../typings/DbInterface";
import {SequelizeAttributes} from "../typings/SequelizeAttributes";

export interface ICalendar extends Model {
    id?: number;
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
        },
    };

    const calendar = sequelize.define("Calendar", attributes) as CalendarModel;

    calendar.associate = models => {
        calendar.hasMany(models.CourtCase);
    };

    return calendar;
};
