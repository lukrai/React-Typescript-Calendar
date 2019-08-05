import * as express from "express";
import { IRequestWithUser } from "../typings/Authentication";

class AuthenticationController {
    public logIn = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        request.user.password = undefined;
        return response.send(request.user);
    };

    public logOut = (request, response: express.Response) => {
        request.logout();
        request.session.destroy();
        response.cookie("connect.sid", "", { maxAge: 0, httpOnly: true });
        return response.send(200);
    };

    public status = (request: IRequestWithUser, response: express.Response) => {
        return response.send(request.user);
    };
}

export default AuthenticationController;
