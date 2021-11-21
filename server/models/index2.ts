import { Sequelize } from "sequelize";
import { AppSettingsFactory, AppSettings } from "./AppSettings2.model";
import { CalendarFactory, Calendar } from "./Calendar2.model";
import { CourtCaseFactory, CourtCase } from "./CourtCase2.model";
import { SessionFactory, Session } from "./Session2.model";
import { JudgeGroupFactory, JudgeGroup } from "./JudgeGroup.model";
import { UserFactory, User } from "./User2.model";

export type DB = {
  defaultWeekDay?: number;
  AppSettings: typeof AppSettings;
  Calendar: typeof Calendar;
  CourtCase: typeof CourtCase;
  User: typeof User;
  Session: typeof Session;
  JudgeGroup: typeof JudgeGroup;
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
  AppSettingsFactory(sequelize);
  CalendarFactory(sequelize);
  CourtCaseFactory(sequelize);
  UserFactory(sequelize);
  SessionFactory(sequelize);
  JudgeGroupFactory(sequelize);
  buildDbRelations();

  db = {
    AppSettings,
    Calendar,
    CourtCase,
    User,
    Session,
    JudgeGroup,
    sequelize,
  };

  return db;
};