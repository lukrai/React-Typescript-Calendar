import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";
import {IDatabase} from "../typings/DbInterface";
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
export type UserModel = typeof Model &
    (new (values?: object, options?: BuildOptions) => IUser) & {
    associate: (model: IDatabase) => any;
};

export const UserFactory = (sequelize: Sequelize): UserModel => {
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

    const user = sequelize.define("User", attributes) as UserModel;

    user.associate = models => {
        user.hasMany(models.CourtCase, { foreignKey: "AuthorId" });
    };

    return user;
};