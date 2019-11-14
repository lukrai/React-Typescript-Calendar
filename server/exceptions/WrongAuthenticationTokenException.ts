import HttpException from "./HttpException";

export default class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, `Authentication token missing`);
  }
}
