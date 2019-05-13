import {Sequelize} from "sequelize";
import {IDatabase} from "../typings/DbInterface/index";
import {CalendarFactory} from "./Calendar.model";
import {CourtCaseFactory} from "./CourtCase.model";
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
        Calendar: CalendarFactory(sequelize),
        CourtCase: CourtCaseFactory(sequelize),
        User: UserFactory(sequelize),
        sequelize,
    };

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    return db;
};
