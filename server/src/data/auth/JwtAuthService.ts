import * as jwt from "jsonwebtoken";
import { promisify } from "util";
import { AuthService } from "../../domain/service/AuthService";
import { tokenTransform } from "./tokenTransform";

const verifyToken = promisify<
  string,
  string | Buffer,
  jwt.VerifyOptions,
  string | object
>(jwt.verify);

export class JwtAuthService extends AuthService {
  constructor(
    private readonly secret: string | Buffer,
    private readonly verifyOptions: jwt.VerifyOptions
  ) {
    super();
  }

  public getUser(token: string) {
    const { secret, verifyOptions } = this;

    return verifyToken(token, secret, verifyOptions).then(tokenTransform);
  }
}
