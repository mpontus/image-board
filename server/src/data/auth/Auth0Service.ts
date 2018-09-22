import { promisify } from "util";
import * as jwt from "jsonwebtoken";
import * as jwksRsa from "jwks-rsa";
import { AuthService } from "../../domain/service/AuthService";
import { tokenTransform } from "./tokenTransform";

export class Auth0Service implements AuthService {
  private readonly client: jwksRsa.JwksClient;

  constructor(
    clientOptions: jwksRsa.Options,
    private readonly verifyOptions: jwt.VerifyOptions
  ) {
    this.client = jwksRsa(clientOptions);
  }

  getUser(token: string) {
    const decoded = jwt.decode(token, { complete: true });
    const verifyToken = promisify<
      string,
      string | Buffer,
      jwt.VerifyOptions,
      string | object
    >(jwt.verify);
    const getSigningKey = promisify<string, jwksRsa.Jwk>(
      this.client.getSigningKey
    );

    if (decoded === null || typeof decoded === "string") {
      throw new Error("Invalid token");
    }

    return getSigningKey(decoded.header.kid)
      .then(key => key.publicKey || key.rsaPublicKey || "")
      .then(secret => verifyToken(token, secret, this.verifyOptions))
      .then(tokenTransform);
  }
}
