import { Router } from "express";
import CourtCaseController from "../controllers/courtCase2.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

class CourtCaseRoutesRouter {
  public router: Router;
  private courtCaseController: CourtCaseController = new CourtCaseController();

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.get("/", authMiddleware, this.courtCaseController.getAllCourtCases);
    this.router.post("/", authMiddleware, this.courtCaseController.createCourtCase);
    this.router.get("/:id", authMiddleware, this.courtCaseController.getCourtCase);
    this.router.put("/:id", authMiddleware, this.courtCaseController.updateCourtCase);
    this.router.put("/", authMiddleware, this.courtCaseController.disableEnableCourtCases);
    this.router.delete("/:id", authMiddleware, this.courtCaseController.deleteCourtCase);
  }
}

const courtCaserRouter = new CourtCaseRoutesRouter();

export default courtCaserRouter.router;
