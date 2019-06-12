import {NextFunction, Response} from "express";
import * as jwt from "jsonwebtoken";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import {db} from "../models";
import {IDataStoredInToken, IRequestWithUser} from "../typings/Authentication";

async function authMiddleware(request: IRequestWithUser, response: Response, next: NextFunction) {
    const cookies = request.cookies;
    console.log(JSON.stringify(cookies));
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as IDataStoredInToken;
            const id = verificationResponse.id;

            const user = await db.User.findByPk(id, {attributes: {exclude: ["password"]}});
            if (user) {
                request.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new AuthenticationTokenMissingException());
    }
}

export default authMiddleware;
