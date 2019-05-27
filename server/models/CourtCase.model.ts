import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";
import {IDatabase} from "../typings/DbInterface";
import {SequelizeAttributes} from "../typings/SequelizeAttributes";

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

export type CourtCaseModel = typeof Model &
    (new (values?: object, options?: BuildOptions) => ICourtCase) & {
    associate: (model: IDatabase) => any;
};

export const CourtCaseFactory = (sequelize: Sequelize): CourtCaseModel => {
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

    const courtCase = sequelize.define("CourtCase", attributes) as CourtCaseModel;

    courtCase.associate = models => {
        courtCase.belongsTo(models.Calendar);
        courtCase.belongsTo(models.User, { foreignKey: "AuthorId" });

    };

    return courtCase;
};
