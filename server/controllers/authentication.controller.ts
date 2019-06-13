import * as bcrypt from "bcryptjs";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import {db} from "../models";
import {IUser} from "../models/User.model";
import {IRequestWithUser} from "../typings/Authentication";

interface ITokenData {
    token: string;
    expiresIn: number;
}

interface IDataStoredInToken {
    id: number;
    email: string;
}

class AuthenticationController {
    public register = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userData: IUser = request.body;
        // if (!userData.email || !userData.password) {
        //     next(new WrongCredentialsException());
        // }
        if (await db.User.findOne({where: {email: userData.email}})) {
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        } else {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await db.User.create({
                ...userData,
                password: hashedPassword,
            });
            user.password = undefined;
            const tokenData = this.createToken(user);
            this.createCookie(response, tokenData);
            return response.send(user);
        }
    }

    public logIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInData = request.body;
        if (!logInData.email || !logInData.password) {
            next(new WrongCredentialsException());
        }
        const user = await db.User.findOne({where: {email: logInData.email}});
        if (user) {
            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            if (isPasswordMatching) {
                user.password = undefined;
                const tokenData = this.createToken(user);
                this.createCookie(response, tokenData);
                return response.send(user);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }

    public logOut = (request: express.Request, response: express.Response) => {
        response.cookie("Authorization", "", {maxAge: 0, httpOnly: true});
        return response.send(200);
    }

    public status = (request: IRequestWithUser, response: express.Response) => {
        return response.send(request.user);
    }

    private createCookie(response: express.Response, tokenData: ITokenData) {
        response.cookie("Authorization", tokenData.token, {maxAge: tokenData.expiresIn, httpOnly: true});
    }

    private createToken(user: IUser): ITokenData {
        const expiresIn = 1000 * 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: IDataStoredInToken = {
            id: user.id,
            email: user.email,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, {expiresIn}),
        };
    }
}

export default AuthenticationController;
