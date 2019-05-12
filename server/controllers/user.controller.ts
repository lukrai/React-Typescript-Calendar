import * as express from "express";
import {db} from "../models/index";
import {IUser, UserStatic} from "../models/User.model";

class UserController {
    constructor() {
        console.log("Initialize user controller");
    }

    public getAllUsers = async (req: express.Request, res: express.Response) => {
        try {
            const users: IUser[] = await db.User.findAll();
            res.status(200).json({ users });
        } catch (err) {
            res.status(500).json({ err: ["oops", err] });
        }
    }

    public getUser = (req: express.Request, res: express.Response) => {
        return res.send({user: "user"});
    }

    public createUser = (req: express.Request, res: express.Response) => {
        const user = req.body;
        return res.send(user);
    }

    public updateUser = (req: express.Request, res: express.Response) => {
        const user = req.body;
        return res.send(user);
    }

    public deleteUser = (req: express.Request, res: express.Response) => {
        return res.send("ok");
    }
}

export default UserController;
