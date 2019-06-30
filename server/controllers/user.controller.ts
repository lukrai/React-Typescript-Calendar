import * as bcrypt from "bcryptjs";
import * as express from "express";
import {NextFunction} from "express";
import HttpException from "../exceptions/HttpException";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import {db} from "../models";
import {IUser} from "../models/User.model";
import {IRequestWithUser} from "../typings/Authentication";

class UserController {
    constructor() {
        console.log("Initialize user controller");
    }

    public getAllUsers = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const users: IUser[] = await db.User.findAll({
                attributes: {
                    exclude: ["password"],
                }
            });
            return res.status(200).send(users);
        } catch (err) {
            next(new HttpException(500, "Could not get users."));
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

    public createUser = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const userData: IUser = req.body;
            if (!userData.email || !userData.password || !userData.passwordConfirmation) {
                return next(new HttpException(400, "Email or password is missing."));
            }
            if (userData.password.length < 8 && userData.password !== userData.passwordConfirmation) {
                return next(new HttpException(400, "Invalid password provided."));
            }
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await db.User.create({
                ...userData,
                password: hashedPassword,
            });
            user.password = undefined;
            return res.status(201).send(user);
        } catch (err) {
            return next(new HttpException(500, "Can't create user."));
        }
    }

    public updateUser = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const userData: IUser = req.body;
            if (!userData.email) {
                return next(new HttpException(400, "Email or password is missing."));
            }
            if (userData.password && userData.password.length < 8 && userData.password !== userData.passwordConfirmation) {
                return next(new HttpException(400, "Invalid password provided."));
            }

            const user = await db.User.findByPk(req.params.id);
            if (!user) {
                next(new HttpException(404, "User Not Found"));
            }

            user.firstName = userData.firstName || user.firstName;
            user.lastName = userData.lastName || user.lastName;
            user.email = userData.email || user.email;
            user.phoneNumber = userData.phoneNumber || user.phoneNumber;
            user.court = userData.court || user.court;
            user.password = userData.password ? await bcrypt.hash(userData.password, 10) : user.password;
            await user.save();

            user.password = undefined;
            return res.status(201).send(user);
        } catch (err) {
            return next(new HttpException(500, "Can't create user."));
        }
    }

    public deleteUser = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const user = await db.User.findByPk(req.params.id);
            if (!user) {
                return next(new HttpException(404, "Can't delete user. User not found."));
            }
            await user.destroy();
            return res.status(200).send(user);
        } catch (err) {
            return next(new HttpException(500, "Can't delete user."));
        }
    }
}

export default UserController;
