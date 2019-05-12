import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";
import {SequelizeAttributes} from "../typings/SequelizeAttributes/index";

export interface ICourtCase {
    id?: number;
    fileNo: string;
    court: string;
    courtNo: string;
    isDisabled?: boolean;
    time: string;  // e.g. 9:00
    createdAt?: Date;
    updatedAt?: Date;
}

export type CourtCaseStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ICourtCase,
};

export const CourtCaseFactory = (sequelize: Sequelize): CourtCaseStatic => {
    const attributes: Partial<SequelizeAttributes<ICourtCase>> = {
        court: {
            type: DataTypes.STRING,
        },
        courtNo: {
            type: DataTypes.STRING,
        },
        fileNo: {
            type: DataTypes.STRING,
        },
        isDisabled: {
            type: DataTypes.BOOLEAN,
        },
        time: {
            type: DataTypes.STRING,
        },
    };

    return sequelize.define("CourtCase", attributes) as CourtCaseStatic;
};
