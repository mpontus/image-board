import { Observable } from "rxjs";
import { tap, share, startWith, filter } from "rxjs/operators";

const ID_TOKEN_KEY = "idToken";

/**
 * Authentication service using auth0 lock
 */
class AuthService {
  constructor(lock, tokenStorage) {
    this.lock = lock;
    this.tokenStorage = tokenStorage;

    this.idToken$ = Observable.create(observer =>
      this.lock.on("authenticated", authResult => {
        observer.next(authResult.idToken);
      })
    ).pipe(
      tap(idToken => tokenStorage.setItem(ID_TOKEN_KEY, idToken)),
      share()
    );
  }

  login() {
    this.lock.show();
  }

  getIdToken() {
    return this.idToken$.pipe(
      startWith(this.tokenStorage.getItem(ID_TOKEN_KEY)),
      filter(idToken => !!idToken)
    );
  }
}

export default AuthService;
