import { Token } from "@src/domain/model/Token";
import { User } from "@src/domain/model/User";

/**
 * Authentication service
 */
export interface AuthenticationService {
  /**
   * Retrieve user record corresponding to access token
   */
  validateToken(token: Token): Promise<User>;
}
