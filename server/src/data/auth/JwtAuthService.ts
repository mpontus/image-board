import { promisify } from "util";
import * as jwt from "jsonwebtoken";
import { AuthService } from "../../domain/service/AuthService";
import { User } from "../../domain/model/User";
import { tokenTransform } from "./tokenTransform";

const verifyToken = promisify<
  string,
  string | Buffer,
  jwt.VerifyOptions,
  string | object
>(jwt.verify);

export class JwtAuthService implements AuthService {
  constructor(
    private readonly secret: string | Buffer,
    private readonly verifyOptions: jwt.VerifyOptions
  ) {}

  public getUser(token: string) {
    const { secret, verifyOptions } = this;

    return verifyToken(token, secret, verifyOptions).then(tokenTransform);
  }
}
