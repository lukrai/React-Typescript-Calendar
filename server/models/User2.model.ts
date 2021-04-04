// import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { IDatabase } from "../typings/DbInterface";
import { SequelizeAttributes } from "../typings/SequelizeAttributes/index";
import { CourtCase } from "./CourtCase2.model";

import {
  Sequelize,
  Model,
  ModelDefined,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
} from "sequelize";

export interface UserAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
  phoneNumber: string;
  court: string;
  isAdmin: boolean;
  // courtCases: CourtCase[];
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, "id">;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  // public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  // public name!: string;
  // public preferredName!: string | null; // for nullable fields

  public id!: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public passwordConfirmation!: string | null;
  public phoneNumber: string;
  public court: string;
  public isAdmin: boolean;
  public readonly courtCases: CourtCase[];
  // public createdAt!: Date | null;
  // public updatedAt!: Date | null;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getCourtCases!: HasManyGetAssociationsMixin<CourtCase>; // Note the null assertions!
  public addCourtCase!: HasManyAddAssociationMixin<CourtCase, number>;
  public hasCourtCase!: HasManyHasAssociationMixin<CourtCase, number>;
  public countCourtCases!: HasManyCountAssociationsMixin;
  public createCourtCase!: HasManyCreateAssociationMixin<CourtCase>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  // public readonly projects?: Project[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    courtCases: Association<User, CourtCase>;
  };
}

// Need to declare the static model so `findOne` etc. use correct types.
// export type UserModel = typeof Model &
//   (new (values?: object, options?: BuildOptions) => IUser) & {
//     associate: (model: IDatabase) => any;
//   };

export const UserFactory = (sequelize: Sequelize) => {
  User.init(
    {
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
    },
    {
      sequelize,
      //   tableName: 'notes',
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
    },
  );

  // User.hasMany(CourtCase, {
  //   as: "courtCases",
  //   foreignKey: {
  //     name: "userId",
  //   },
  // });

  // const User2: ModelDefined<UserAttributes, UserCreationAttributes> = sequelize.define(
  //   "User",
  //   {
  //     court: {
  //       type: DataTypes.STRING,
  //     },
  //     email: {
  //       type: DataTypes.STRING,
  //       unique: true,
  //     },
  //     firstName: {
  //       type: DataTypes.STRING,
  //     },
  //     lastName: {
  //       type: DataTypes.STRING,
  //     },
  //     password: {
  //       type: DataTypes.STRING,
  //     },
  //     phoneNumber: {
  //       type: DataTypes.STRING,
  //     },
  //     isAdmin: {
  //       type: DataTypes.BOOLEAN,
  //     },
  //   },
  //   {
  //     //   tableName: 'notes',
  //     indexes: [
  //       {
  //         name: "user_id_index",
  //         fields: ["id"],
  //       },
  //       {
  //         name: "user_email_index",
  //         fields: ["email"],
  //       },
  //     ],
  //   },
  // );
  // User2.hasMany(CourtCase, {
  //   as: "courtCases",
  //   foreignKey: {
  //     name: "userId",
  //   },
  // });

  // return User2;
};
