import { Observable, of, concat } from "rxjs";
import { tap, shareReplay, startWith, filter } from "rxjs/operators";
import jwtDecode from "jwt-decode";

const ID_TOKEN_KEY = "idToken";

const isTokenExpired = token => jwtDecode(token).exp * 1000 < Date.now();

const isTokenValid = token => !isTokenExpired(token);

/**
 * Authentication service using auth0 lock enhanced with persistent storage
 */
class AuthService {
  constructor(lock, tokenStorage) {
    this.lock = lock;
    this.tokenStorage = tokenStorage;

    this.idToken$ = concat(
      of(this.tokenStorage.getItem(ID_TOKEN_KEY)).pipe(filter(isTokenValid)),
      Observable.create(observer =>
        this.lock.on("authenticated", authResult => {
          observer.next(authResult.idToken);
        })
      ).pipe(tap(idToken => tokenStorage.setItem(ID_TOKEN_KEY, idToken)))
    ).pipe(shareReplay(1), tap(token => console.log("token", token)));
  }

  login() {
    this.lock.show();
  }

  logout() {
    this.tokenStorage.setItem(ID_TOKEN_KEY, null);

    this.lock.logout();
  }

  getIdToken() {
    return this.idToken$;
  }
}

export default AuthService;
