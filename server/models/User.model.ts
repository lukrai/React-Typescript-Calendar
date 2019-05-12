import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";
import {SequelizeAttributes} from "../typings/SequelizeAttributes/index";

export interface IUser extends Model {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    court: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Need to declare the static model so `findOne` etc. use correct types.
export type UserStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUser,
};

export const UserFactory = (sequelize: Sequelize): UserStatic => {
    const attributes: Partial<SequelizeAttributes<IUser>> = {
        court: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        phoneNumber: {
            type: DataTypes.STRING,
        },
    };

    return sequelize.define("User", attributes) as UserStatic;
};
