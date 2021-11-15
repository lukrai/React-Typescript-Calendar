import { Request } from "express";
import { UserAttributes } from "models/User2.model";

export interface IRequestWithUser extends Request {
  user: UserAttributes;
}
