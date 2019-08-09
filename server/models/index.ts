import { Sequelize } from "sequelize";
import { IDatabase } from "../typings/DbInterface";
import { AppSettingsFactory } from "./AppSettings.model";
import { CalendarFactory } from "./Calendar.model";
import { CourtCaseFactory } from "./CourtCase.model";
import { SessionFactory } from "./Session.model";
import { UserFactory } from "./User.model";

export let db: IDatabase;

export const createModels = (): IDatabase => {
    let sequelize;
    if (process.env.DATABASE_URL) {
        sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });
    } else {
        sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
            dialect: "postgres",
            logging: process.env.NODE_ENV !== "production",
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
        });
    }

    db = {
        AppSettings: AppSettingsFactory(sequelize),
        Calendar: CalendarFactory(sequelize),
        CourtCase: CourtCaseFactory(sequelize),
        User: UserFactory(sequelize),
        Session: SessionFactory(sequelize),
        sequelize,
    };

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    return db;
};
