import * as bodyParser from "body-parser";
import * as express from "express";
import CalendarController from "./controllers/calendar.controller";
import CalendarRouter from "./routes/calendar.routes";
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
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }

    private initializeDatabaseConnection() {

    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
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
        this.app.use("/api/user", UserRouter);
    }

    private loggerMiddleware(request: express.Request, response: express.Response, next) {
        console.log(`${request.method} ${request.path}`);
        next();
    }

}

export default App;
