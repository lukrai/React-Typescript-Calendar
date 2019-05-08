import * as bodyParser from "body-parser";
import * as express from "express";
import CalendarController from "./controllers/calendar.controller";

class App {
    public app: express.Application;
    public port: number;

    constructor(port = 5000) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers();
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(this.loggerMiddleware);
    }

    private loggerMiddleware(request: express.Request, response: express.Response, next) {
        console.log(`${request.method} ${request.path}`);
        next();
    }

    private initializeControllers() {
        this.app.use("/api", new CalendarController().router);
    }
}

export default App;
