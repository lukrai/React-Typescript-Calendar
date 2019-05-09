import { Router} from "express";
import UserController from "../controllers/user.controller";

class UserRouter {
    public router: Router;
    private userController: UserController = new UserController();

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get("/", this.userController.getAllUsers);
        this.router.post("/new", this.userController.createUser);
        this.router.get("/:id", this.userController.getUser);
        this.router.put("/:id", this.userController.updateUser);
        this.router.delete("/:id", this.userController.deleteUser);
    }
}

const userRouter = new UserRouter();

export default userRouter.router;
