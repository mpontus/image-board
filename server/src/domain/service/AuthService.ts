import { User } from "../model/User";

export abstract class AuthService {
  public abstract getUser(token: string): Promise<User>;
}
