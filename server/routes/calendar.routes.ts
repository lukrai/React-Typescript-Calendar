import { Router} from "express";
import CalendarController from "../controllers/calendar.controller";

class CalendarRouter {
    public router: Router;
    private calendarController: CalendarController = new CalendarController();

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get("/", this.calendarController.getAllCallendarData);
        this.router.post("/new", this.calendarController.createCalendarItem);
        // this.router.get("/:id", this.calendarController.getFeed);
        // this.router.put("/:id", this.calendarController.updateFeed);
        // this.router.delete("/:id", this.calendarController.deleteFeed);
    }
}

const calendarRouter = new CalendarRouter();

export default calendarRouter.router;
