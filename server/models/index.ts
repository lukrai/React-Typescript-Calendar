import {Sequelize} from "sequelize";
import {IDatabase} from "../typings/DbInterface";
import {AppSettingsFactory} from "./AppSettings.model";
import {CalendarFactory} from "./Calendar.model";
import {CourtCaseFactory} from "./CourtCase.model";
import {SessionFactory} from "./Session.model";
import {UserFactory} from "./User.model";

export let db: IDatabase;

export const createModels = (): IDatabase => {
    const sequelize = new Sequelize(
        process.env.DATABASE,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        {
            dialect: "postgres",
        },
    );

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
