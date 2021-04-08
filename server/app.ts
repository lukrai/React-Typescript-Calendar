import * as bcrypt from "bcryptjs";
import * as cors from "cors";
import * as https from "https";
import * as fs from "fs";
import * as express from "express";
import * as session from "express-session";
import * as path from "path";
import { IRequestWithUser } from "typings/Authentication";
import passport from "./helpers/passport";
import errorMiddleware from "./middlewares/error.middleware";
import { createModels, DB } from "./models/index2";
import { AppSettingsModel } from "./models/AppSettings.model";
import { UserModel } from "./models/User.model";
import { User } from "./models/User2.model";
import CalendarRouter from "./routes/calendar.routes";
import CourtCaseRouter from "./routes/courtCase.routes";
import UserRouter from "./routes/user.routes";
import { IDatabase } from "typings/DbInterface";
import { AppSettings } from "./models/AppSettings2.model";

class App {
  public app: express.Application;
  public port: number;
  // public db: IDatabase;
  public db: DB;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  private SequelizeStore = require("connect-session-sequelize")(session.Store);

  constructor() {
    this.app = express();
    this.port = ((process.env.PORT as unknown) as number) || 5000;
    this.init();
  }

  public listen() {
    // Uncomment if you have valid certificate for https
    // const keyPath =
    //     process.env.NODE_ENV === "production"
    //         ? path.join(__dirname, "..", "..", "server/certificate.key")
    //         : "./certificate.key";
    // const certPath =
    //     process.env.NODE_ENV === "production"
    //         ? path.join(__dirname, "..", "..", "server/certificate.cert")
    //         : "./certificate.cert";
    // var options = {
    //     key: fs.readFileSync(keyPath),
    //     cert: fs.readFileSync(certPath),
    //     requestCert: false,
    //     rejectUnauthorized: false,
    // };

    // const server = https.createServer(options, this.app);

    // server.listen(this.port, function() {
    //     console.log(`App listening on the port ${JSON.stringify(server.address())}`);
    // });

    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private async init() {
    await this.initializeDatabaseConnection();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.app.use(errorMiddleware);
  }

  private async initializeDatabaseConnection() {
    try {
      this.db = createModels();
      await this.db.sequelize.authenticate();
      console.log("=================== Database connected. ==========================");
      await this.db.sequelize.sync();
      this.db.defaultWeekDay = await this.setDefaultDayOfTheWeek();
      await this.setDefaultAdminUser();
    } catch (err) {
      console.log("=================== Connection to database failed. =======================");
      console.log(err);
    }
  }

  private initializeMiddlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    // this.app.use(cors({ origin: "http://localhost:3000", credentials: true }));
    const dbStore = new this.SequelizeStore({
      db: this.db.sequelize,
      table: "Session",
    });
    this.app.use(
      session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 60 * 60 * 1000,
        },
        store: dbStore,
      }),
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    this.app.use(this.loggerMiddleware);
  }

  private initializeRoutes() {
    const router = express.Router();
    router.get("/favicon.ico", (req, res) => res.status(204));
    this.app.use("/", router);
    this.app.get("/check", (req, res) => res.send("Works"));
    this.app.use("/api/calendar", CalendarRouter);
    this.app.use("/api", UserRouter);
    this.app.use("/api/court-case", CourtCaseRouter);
    if (process.env.NODE_ENV === "production") {
      this.app.use(express.static(path.join(__dirname, "..", "..", "client/build")));

      this.app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "..", "client/build", "index.html"));
      });
    }
    console.log("======================= Initialized Routes ============================");
  }

  private loggerMiddleware(request: IRequestWithUser, response: express.Response, next) {
    if (request.path !== "/favicon.ico" && !request.path.includes("static") && !request.path.includes("manifest")) {
      console.log(`${request.method} ${request.path} ${request.user && request.user.email}`);
      response.on("finish", () => {
        console.info(
          `${new Date()} ${request.method} ${request.path} ${request.user && request.user.email} ${
            response.statusCode
          } ${response.statusMessage} ${response.get("Content-Length") || 0}b sent`,
        );
      });
    }
    next();
  }

  private async setDefaultDayOfTheWeek(): Promise<number> {
    try {
      const [setting] = await AppSettings.findOrCreate({ where: { id: 1 }, defaults: { weekDay: 3 } });
      return setting.weekDay;
    } catch (err) {
      console.log(err);
    }
  }

  private async setDefaultAdminUser() {
    try {
      const defaultEmail = process.env.ADMIN_EMAIL || "admin@admin.local";
      await User.findOrCreate({
        where: { email: defaultEmail },
        defaults: {
          email: defaultEmail,
          firstName: process.env.ADMIN_FIRST_NAME,
          lastName: process.env.ADMIN_LAST_NAME,
          court: "Kauno apygardos teismas",
          phoneNumber: process.env.ADMIN_PHONE_NUMBER,
          password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
          isAdmin: true,
        },
      });
      console.log("=============== FindOrCreate default Admin user ===================");
    } catch (err) {
      console.log(err);
    }
  }
}

export default App;
