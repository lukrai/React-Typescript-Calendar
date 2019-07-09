import {NextFunction, Response} from "express";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import { IRequestWithUser} from "../typings/Authentication";

export async function authMiddleware(request: IRequestWithUser, response: Response, next: NextFunction) {
    if (request.user) {
        return next();
    }
    return next(new AuthenticationTokenMissingException());
}

export async function authMiddlewareAdmin(request: IRequestWithUser, response: Response, next: NextFunction) {
    if (request.user && request.user.isAdmin) {
        return next();
    }
    return next(new AuthenticationTokenMissingException());
}
