import * as express from "express";
import { inject, injectable } from "inversify";
import { interfaces } from "inversify-express-utils";
import { AuthService } from "../domain/service/AuthService";
import { Types } from "../domain/Types";
import { AnonymousUser } from "./AnonymousUser";
import { AuthenticatedUser } from "./AuthenticatedUser";

const getToken = (req: express.Request): string | undefined => {
  if (!req.headers.authorization) {
    return;
  }

  const [scheme, credentials, ...rest] = req.headers.authorization.split(" ");

  if (rest.length > 0) {
    throw new Error("Invalid credentials format");
  }

  if (!/^Bearer$/i.test(scheme)) {
    throw new Error("Invalid credentials scheme");
  }

  return credentials;
};

@injectable()
export class AuthProvider implements interfaces.AuthProvider {
  @inject(Types.AuthService)
  private readonly authService: AuthService;

  public async getUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const token = getToken(req);

    if (token) {
      const user = await this.authService.getUser(token);

      return new AuthenticatedUser(user);
    }

    return new AnonymousUser();
  }
}
