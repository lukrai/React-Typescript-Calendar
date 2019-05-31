import { Router} from "express";
import CourtCaseController from "../controllers/courtCase.controller";

class CourtCaseRoutesRouter {
    public router: Router;
    private courtCaseController: CourtCaseController = new CourtCaseController();

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get("/", this.courtCaseController.getAllCourtCases);
        this.router.post("/", this.courtCaseController.createCourtCase);
        this.router.get("/:id", this.courtCaseController.getCourtCase);
        this.router.put("/:id", this.courtCaseController.updateCourtCase);
        this.router.delete("/:id", this.courtCaseController.deleteCourtCase);
    }
}

const courtCaserRouter = new CourtCaseRoutesRouter();

export default courtCaserRouter.router;
