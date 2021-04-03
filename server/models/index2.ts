import { Sequelize } from "sequelize";
import { IDatabase } from "../typings/DbInterface";
// import { AppSettingsFactory } from "./AppSettings.model";
import { CalendarFactory, Calendar } from "./Calendar2.model";
import { CourtCaseFactory, CourtCase } from "./CourtCase2.model";
import { SessionFactory, Session } from "./Session2.model";
// import { SessionFactory } from "./Session.model";
import { UserFactory, User } from "./User2.model";

// export interface IDatabase {
//   defaultWeekDay?: number;
//   sequelize: Sequelize;
//   AppSettings: AppSettingsModel;
//   Calendar: CalendarModel;
//   CourtCase: CourtCaseModel;
//   User: UserModel;
//   Session: SessionModel;
// }

export type DB = {
  defaultWeekDay?: number;
  Calendar: typeof Calendar;
  CourtCase: typeof CourtCase;
  User: typeof User;
  Session: typeof Session;
  sequelize: Sequelize;
};

export let db: DB;

function buildDbRelations() {
  Calendar.hasMany(CourtCase, {
    as: "courtCases",
    foreignKey: {
      name: "calendarId",
      allowNull: false,
    },
  });

  CourtCase.belongsTo(Calendar, {
    foreignKey: {
      name: "calendarId",
      allowNull: false,
    },
    as: "calendar",
  });
  CourtCase.belongsTo(User, {
    foreignKey: {
      name: "userId",
    },
  });

  User.hasMany(CourtCase, {
    as: "courtCases",
    foreignKey: {
      name: "userId",
    },
  });
}

export const createModels = (): DB => {
  let sequelize: Sequelize;
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });
  } else {
    sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
      dialect: "postgres",
      logging: process.env.NODE_ENV !== "production",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
    });
  }
  CalendarFactory(sequelize);
  CourtCaseFactory(sequelize);
  UserFactory(sequelize);
  SessionFactory(sequelize);
  buildDbRelations();
  console.log("createModels 5");

  db = {
    // AppSettings: AppSettingsFactory(sequelize),
    Calendar,
    CourtCase,
    User,
    Session,
    sequelize,
  };

  // Object.keys(db).forEach(modelName => {
  //   if (db[modelName].associate) {
  //     db[modelName].associate(db);
  //   }
  // });

  return db;
};
