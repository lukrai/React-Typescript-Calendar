import { Router} from "express";
import AuthenticationController from "../controllers/authentication.controller";
import UserController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

class UserRouter {
    public router: Router;
    private userController: UserController = new UserController();
    private authController: AuthenticationController = new AuthenticationController();

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get("/user", authMiddleware, this.userController.getAllUsers);
        this.router.post("/user", authMiddleware, this.userController.createUser);
        this.router.get("/user/:id", authMiddleware, this.userController.getUser);
        this.router.put("/user/:id", authMiddleware, this.userController.updateUser);
        this.router.delete("/user/:id", authMiddleware, this.userController.deleteUser);

        this.router.post("/auth/register", this.authController.register);
        this.router.post("/auth/login", this.authController.logIn);
        this.router.post("/auth/logout", this.authController.logOut);
        this.router.get("/auth/status", authMiddleware, this.authController.status);
    }
}

const userRouter = new UserRouter();

export default userRouter.router;
