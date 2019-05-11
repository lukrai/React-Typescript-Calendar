import * as Sequelize from "sequelize";
import {SequelizeAttributes} from "../typings/SequelizeAttributes/index";

export interface IUserAttributes {
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

export interface IUserInstance extends Sequelize.Instance<IUserAttributes>, IUserAttributes {
    // At the moment, there's nothing more to add apart
    // from the methods and attributes that the types
    // `Sequelize.Instance<UserAttributes>` and
    // `UserAttributes` give us. We'll add more here when
    //  we get on to adding associations.
}

export const UserFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<IUserInstance, IUserAttributes> => {
    const attributes: SequelizeAttributes<IUserAttributes> = {
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

    const User = sequelize.define<IUserInstance, IUserAttributes>("User", attributes);

    return User;
};
