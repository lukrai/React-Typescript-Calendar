import { Router } from "express";
import CalendarController from "../controllers/calendar2.controller";
import { authMiddlewareAdmin } from "../middlewares/auth.middleware";

class CalendarRouter {
  public router: Router;
  private calendarController: CalendarController = new CalendarController();

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.get("/", authMiddlewareAdmin, this.calendarController.getAllCalendarData);
    this.router.post("/", authMiddlewareAdmin, this.calendarController.createCalendar);
    this.router.get("/:date", authMiddlewareAdmin, this.calendarController.getCalendar);
    this.router.put("/:id", authMiddlewareAdmin, this.calendarController.updateCalendar);
    this.router.delete("/:id", authMiddlewareAdmin, this.calendarController.deleteCalendar);
  }
}

const calendarRouter = new CalendarRouter();

export default calendarRouter.router;
