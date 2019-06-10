import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import errorMiddleware from "./middlewares/error.middleware";
import {createModels} from "./models";
import {AppSettingsModel} from "./models/AppSettings.model";
import CalendarRouter from "./routes/calendar.routes";
import CourtCaseRouter from "./routes/courtCase.routes";
import UserRouter from "./routes/user.routes";

class App {
    public app: express.Application;
    public port: number;

    constructor(port = 5000) {
        this.app = express();
        this.port = port;
        this.initializeDatabaseConnection();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.app.use(errorMiddleware);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }

    private async initializeDatabaseConnection() {
        const db = createModels();
        db.sequelize.authenticate()
            .then(() => console.log("Database connected..."))
            .catch(err => console.log("Error: " + err));
        await db.sequelize.sync();
        db.defaultWeekDay = await this.setDefaultDayOfTheWeek(db.AppSettings);
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(this.loggerMiddleware);
    }

    private initializeRoutes() {
        const router = express.Router();
        // placeholder route handler
        router.get("/", (req, res, next) => {
            res.json({
                message: "Hello!",
            });
        });
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
}

export default App;
