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
        this.router.get("/", this.calendarController.getAllCalendarData);
        this.router.post("/", this.calendarController.createCalendar);
        this.router.get("/:id", this.calendarController.getCalendar);
        this.router.put("/:id", this.calendarController.updateCalendar);
        this.router.delete("/:id", this.calendarController.deleteCalendar);
    }
}

const calendarRouter = new CalendarRouter();

export default calendarRouter.router;
