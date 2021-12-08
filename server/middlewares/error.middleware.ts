import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";

function errorMiddleware(error: HttpException, request: Request, response: Response, _next: NextFunction) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  return response.status(status).send({ status, message, errors: (error as any).errors });
}

export default errorMiddleware;
