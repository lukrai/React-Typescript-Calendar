import * as express from "express";
import {db} from "../models";
import {IUser} from "../models/User.model";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import HttpException from "../exceptions/HttpException";
import {NextFunction} from "express";
import {IRequestWithUser} from "../typings/Authentication";

class UserController {
    constructor() {
        console.log("Initialize user controller");
    }

    public getAllUsers = async (req: express.Request, res: express.Response) => {
        try {
            const users: IUser[] = await db.User.findAll();
            res.status(200).json({users});
        } catch (err) {
            res.status(500).json({err: ["oops", err]});
        }
    }

    public getUser = async (req: IRequestWithUser, res: express.Response, next: NextFunction) => {
        try {
            if (req.user.id !== Number(req.params.id)) {
                return next(new NotAuthorizedException());
            }
            const user = await db.User.findByPk(req.params.id, {
                attributes: {
                    exclude: ["password"],
                },
                include: [{
                    as: "courtCases",
                    model: db.CourtCase,
                    limit: 50,
                    order: [["updatedAt", "DESC"]],
                    include: [{
                        model: db.Calendar,
                        as: "calendar",
                    }],
                }],
            });
            if (!user) {
                return res.status(404).send({
                    message: "User Not Found",
                });
            }
            return res.status(200).send(user);
        } catch (err) {
            console.log(err);
            next(new HttpException(500, "Could not get user."));
        }
    }

    public createUser = async (req: express.Request, res: express.Response) => {
        try {
            const user: IUser = await db.User.create({
                court: req.body.court,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                // password:  req.body.password
                phoneNumber: req.body.phoneNumber,
            });
            return res.status(201).send({user});
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    public updateUser = async (req: express.Request, res: express.Response) => {
        // const user = req.body;
        try {
            const user = await db.User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).send({
                    message: "User Not Found",
                });
            }
            await user.updateAttributes({
                court: req.body.court || user.court,
                email: req.body.email || user.email,
                firstName: req.body.firstName || user.firstName,
                lastName: req.body.lastName || user.lastName,
                // password:  req.body.password
                phoneNumber: req.body.phoneNumber || user.phoneNumber,
            });
            return res.status(200).send({user});
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    public deleteUser = async (req: express.Request, res: express.Response) => {
        try {
            const user = await db.User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).send({
                    message: "User Not Found",
                });
            }
            const r = await user.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(400).send(err);
        }
    }
}

export default UserController;
