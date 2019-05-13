import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";
import {SequelizeAttributes} from "../typings/SequelizeAttributes/index";

export interface ICalendar {
    id?: number;
    date: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CalendarStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ICalendar,
};

export const CalendarFactory = (sequelize: Sequelize): CalendarStatic => {
    const attributes: Partial<SequelizeAttributes<ICalendar>> = {
        date: {
            type: DataTypes.STRING,
        },
    };

    return sequelize.define("Calendar", attributes) as CalendarStatic;
};
