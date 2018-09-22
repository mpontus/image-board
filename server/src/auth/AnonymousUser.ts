import { interfaces } from "inversify-express-utils";

export class AnonymousUser implements interfaces.Principal {
  public details: void = undefined;

  public isAuthenticated() {
    return Promise.resolve(false);
  }

  public isResourceOwner(resourceId: any) {
    return Promise.resolve(false);
  }

  public isInRole(role: string) {
    return Promise.resolve(false);
  }
}
