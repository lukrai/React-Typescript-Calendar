import {Request} from "express";
import {IUser} from "../../models/User.model";

export interface ITokenData {
    token: string;
    expiresIn: number;
}

export interface IDataStoredInToken {
    id: number;
    email: string;
}

export interface IRequestWithUser extends Request {
    user: IUser;
}
