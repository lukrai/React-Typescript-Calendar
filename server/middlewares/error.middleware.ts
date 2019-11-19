import { Request, Response } from "express";
import HttpException from "../exceptions/HttpException";

function errorMiddleware(error: HttpException, request: Request, response: Response) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  return response.status(status).send({ status, message });
}

export default errorMiddleware;
