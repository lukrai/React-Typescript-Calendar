import * as express from "express";

class CalendarController {
    public router = express.Router();

    private posts: any[] = [
        {
            author: "Marcin",
            content: "Dolor sit amet",
            title: "Lorem Ipsum",
        },
    ];

    constructor() {
        console.log("Initialize calendar controller");
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get("/calendar", this.getAllCallendarData);
        this.router.post("/calendar", this.createCalendarItem);
    }

    public getAllCallendarData = (request: express.Request, response: express.Response) => {
        return response.send(this.posts);
    }

    public createCalendarItem = (request: express.Request, response: express.Response) => {
        const post = request.body;
        this.posts.push(post);
        response.send(post);
    }
}

export default CalendarController;
