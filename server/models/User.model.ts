import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { IDatabase } from "../typings/DbInterface";
import { SequelizeAttributes } from "../typings/SequelizeAttributes/index";
import { ICourtCase } from "./CourtCase.model";

export interface IUser extends Model {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
  phoneNumber: string;
  court: string;
  isAdmin: boolean;
  courtCases: ICourtCase[];
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
      unique: true,
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
    isAdmin: {
      type: DataTypes.BOOLEAN,
    },
  };

  const user = sequelize.define("User", attributes, {
    indexes: [
      {
        name: "user_id_index",
        fields: ["id"],
      },
      {
        name: "user_email_index",
        fields: ["email"],
      },
    ],
  }) as UserModel;

  user.associate = models => {
    // TODO: fix any
    user.hasMany(models.CourtCase as any, {
      as: "courtCases",
      foreignKey: {
        name: "userId",
      },
    });
  };

  return user;
};
