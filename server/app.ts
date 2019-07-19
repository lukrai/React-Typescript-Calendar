import * as bcrypt from "bcryptjs";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as session from "express-session";
import passport from "./helpers/passport";
import errorMiddleware from "./middlewares/error.middleware";
import {createModels} from "./models";
import {AppSettingsModel} from "./models/AppSettings.model";
import {UserModel} from "./models/User.model";
import CalendarRouter from "./routes/calendar.routes";
import CourtCaseRouter from "./routes/courtCase.routes";
import UserRouter from "./routes/user.routes";

class App {
    public app: express.Application;
    public port: number;
    public db;
    private SequelizeStore = require("connect-session-sequelize")(session.Store);

    constructor(port = 5000) {
        this.app = express();
        this.port = port;
        this.init();
    }

    public listen() {
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
            console.log("Database connected...");
            await this.db.sequelize.sync();
            this.db.defaultWeekDay = await this.setDefaultDayOfTheWeek(this.db.AppSettings);
            await this.setDefaultAdminUser(this.db.User);
        } catch (err) {
            console.log(err);
        }
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(cors({origin: "http://localhost:3000", credentials: true}));
        const dbStore = new this.SequelizeStore({
            db: this.db.sequelize,
            table: "Session",
        });
        this.app.use(session({
                secret: process.env.COOKIE_SECRET,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    maxAge: 60 * 60 * 1000,
                },
                store: dbStore,
            },
        ));
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        this.app.use(this.loggerMiddleware);
    }

    private initializeRoutes() {
        const router = express.Router();
        router.get("/favicon.ico", (req, res) => res.status(204));
        this.app.use("/", router);
        this.app.use("/api/calendar", CalendarRouter);
        this.app.use("/api", UserRouter);
        this.app.use("/api/court-case", CourtCaseRouter);
    }

    private loggerMiddleware(request: express.Request, response: express.Response, next) {
        console.log(`${request.method} ${request.path}`);
        next();
    }

    private async setDefaultDayOfTheWeek(AppSettings: AppSettingsModel) {
        try {
            return AppSettings.findOrCreate({where: {id: 1}, defaults: {weekDay: 3}})
                .spread((setting, created) => {
                    return setting.get({plain: true}).weekDay;
                });
        } catch (err) {
            console.log(err);
        }
    }

    private async setDefaultAdminUser(User: UserModel) {
        try {
            await User.findOrCreate(
                {
                    where: {email: "admin@admin.local"},
                    defaults: {
                        email: process.env.ADMIN_EMAIL,
                        firstName: process.env.ADMIN_FIRST_NAME,
                        lastName: process.env.ADMIN_LAST_NAME,
                        phoneNumber: process.env.ADMIN_PHONE_NUMBER,
                        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
                        isAdmin: true,
                    },
                });
        } catch (err) {
            console.log(err);
        }
    }
}

export default App;
