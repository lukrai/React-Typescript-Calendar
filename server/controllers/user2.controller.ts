import * as bcrypt from "bcryptjs";
import * as express from "express";
import { NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import { CourtCase } from "../models/CourtCase2.model";
import { User, UserAttributes } from "../models/User2.model";
import { IRequestWithUser } from "../typings/Authentication";
import { Calendar } from "../models/Calendar2.model";

class UserController {
  constructor() {
    console.log("============== Initialize user controller ====================");
  }

  public getAllUsers = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction,
  ): Promise<express.Response<any, Record<string, any>>> => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
      });
      return res.status(200).send(users);
    } catch (err) {
      next(new HttpException(500, "Could not get users."));
    }
  };

  public getUser = async (req: IRequestWithUser, res: express.Response, next: NextFunction) => {
    try {
      if (req.user.id !== Number(req.params.id) && !req.user.isAdmin) {
        return next(new NotAuthorizedException());
      }
      const user = await User.findByPk(req.params.id, {
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            as: "courtCases",
            model: CourtCase,
            limit: 500,
            order: [["registeredAt", "DESC"]],
            include: [
              {
                model: Calendar,
                as: "calendar",
              },
            ],
          },
        ],
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
  };

  public createUser = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction,
  ): Promise<void | express.Response<any, Record<string, any>>> => {
    try {
      const userData: UserAttributes = req.body;
      console.log(userData);
      if (!userData.email || !userData.password || !userData.passwordConfirmation) {
        return next(new HttpException(400, "Email or password is missing."));
      }
      if (userData.password.length < 8 || userData.password !== userData.passwordConfirmation) {
        return next(new HttpException(400, "Invalid password provided."));
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      user.password = undefined;
      return res.status(201).send(user);
    } catch (err) {
      return next(new HttpException(400, "Email already in use."));
    }
  };

  public updateUser = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const userData: UserAttributes = req.body;
      if (!userData.email) {
        return next(new HttpException(400, "Email or password is missing."));
      }
      if (userData.password && userData.password.length < 8 && userData.password !== userData.passwordConfirmation) {
        return next(new HttpException(400, "Invalid password provided."));
      }

      const user = await User.findByPk(req.params.id);
      if (!user) {
        next(new HttpException(404, "User Not Found"));
      }

      user.firstName = userData.firstName || user.firstName;
      user.lastName = userData.lastName || user.lastName;
      user.email = userData.email || user.email;
      user.phoneNumber = userData.phoneNumber || user.phoneNumber;
      user.court = userData.court || user.court;
      user.password = userData.password ? await bcrypt.hash(userData.password, 10) : user.password;
      user.isAdmin = req.body.isAdmin === true ? true : req.body.isAdmin === false ? false : user.isAdmin;
      await user.save();

      user.password = undefined;
      return res.status(201).send(user);
    } catch (err) {
      return next(new HttpException(500, "Can't create user."));
    }
  };

  public deleteUser = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: {
          exclude: ["password"],
        },
      });
      if (!user) {
        return next(new HttpException(404, "Can't delete user. User not found."));
      }
      await user.destroy();
      return res.status(200).send(user);
    } catch (err) {
      return next(new HttpException(500, "Can't delete user."));
    }
  };
}

export default UserController;
