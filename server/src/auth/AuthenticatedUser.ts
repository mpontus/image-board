import { interfaces } from "inversify-express-utils";
import { User } from "../domain/model/User";

export class AuthenticatedUser implements interfaces.Principal {
  constructor(private readonly user: User) {}

  get details() {
    return this.user;
  }

  public isAuthenticated() {
    return Promise.resolve(true);
  }

  public isResourceOwner(resourceId: any) {
    return Promise.resolve(false);
  }

  public isInRole(role: string) {
    return Promise.resolve(false);
  }
}
