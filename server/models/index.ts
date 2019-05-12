import {Sequelize} from "sequelize";
import {IDatabase} from "../typings/DbInterface/index";
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
        CourtCase: CourtCaseFactory(sequelize),
        User: UserFactory(sequelize),
        sequelize,
    };

    return db;
};
