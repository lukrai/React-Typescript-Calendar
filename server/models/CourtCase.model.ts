import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";
import {IDatabase} from "../typings/DbInterface";
import {SequelizeAttributes} from "../typings/SequelizeAttributes";

export interface ICourtCase {
    id?: number;
    calendarId: number;
    fileNo: string;
    court: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
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
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        phoneNumber: {
            type: DataTypes.STRING,
        },
        fileNo: {
            type: DataTypes.STRING,
            unique: true,
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
        courtCase.belongsTo(models.Calendar, {
            foreignKey: {
                name: "calendarId",
                allowNull: false,
            },
            as: "calendar",
        });
        courtCase.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
            },
        });

    };

    return courtCase;
};
