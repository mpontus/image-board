import { User } from "../model/User";

export interface AuthService {
  getUser(token: string): Promise<User>;
}
