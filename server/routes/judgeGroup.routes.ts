import { Router } from "express";
import JudgeGroupController from "../controllers/judgeGroup.controller";
import { authMiddlewareAdmin } from "../middlewares/auth.middleware";

class JudgeGroupRouter {
  public router: Router;
  private judgeGroupController = new JudgeGroupController();

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.get("/", authMiddlewareAdmin, this.judgeGroupController.getAllJudgeGroups);
    // this.router.post("/", authMiddlewareAdmin, this.calendarController.createCalendar);
    // this.router.get("/:date", authMiddlewareAdmin, this.calendarController.getCalendar);
    this.router.put("/:id", authMiddlewareAdmin, this.judgeGroupController.updateJudgeGroup);
    // this.router.delete("/:id", authMiddlewareAdmin, this.calendarController.deleteCalendar);
  }
}

const judgeGroupRouter = new JudgeGroupRouter();

export default judgeGroupRouter.router;
