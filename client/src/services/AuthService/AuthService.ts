import auth0Lock from "auth0-lock";
import jwtDecode from "jwt-decode";
import createAxiosInterceptor from "./createAxiosInterceptor";

type Auth0Lock = typeof auth0Lock;

const ID_TOKEN_KEY = "idToken";

const isTokenExpired = (token: string): boolean =>
  jwtDecode<{ exp: number }>(token).exp * 1000 < Date.now();

const isTokenValid = (token: string): boolean => {
  try {
    return !isTokenExpired(token);
  } catch (error) {
    return false;
  }
};

interface Options {
  lock: Auth0Lock;
}

/**
 * Authentication service using auth0 lock enhanced with persistent storage
 */
class AuthService {
  public static createAxiosInterceptor = createAxiosInterceptor;

  private readonly lock: Auth0Lock;

  private idToken: Promise<string | null> = Promise.resolve(null);

  constructor({ lock }: Options) {
    this.lock = lock;

    const initialIdToken = localStorage.getItem(ID_TOKEN_KEY);

    if (initialIdToken && isTokenValid(initialIdToken)) {
      this.idToken = Promise.resolve(initialIdToken);
      this.scheduleRefreshToken(initialIdToken);
    } else {
      this.lock.on("authenticated", ({ idToken }) => {
        localStorage.setItem(ID_TOKEN_KEY, idToken);

        window.location.reload();
      });
    }
  }

  public login() {
    this.lock.show();
  }

  public logout() {
    localStorage.removeItem(ID_TOKEN_KEY);

    this.lock.logout({});

    location.reload();
  }

  public getIdToken() {
    return this.idToken;
  }

  public scheduleRefreshToken(idToken: string) {
    const { exp } = jwtDecode(idToken);
    const delay = exp * 1000 - Date.now();

    setTimeout(() => {
      this.idToken = this.refreshToken();

      this.idToken.then(nextIdToken => {
        if (nextIdToken === null) {
          localStorage.removeItem(ID_TOKEN_KEY);

          return;
        }

        localStorage.setItem(ID_TOKEN_KEY, nextIdToken);
        this.scheduleRefreshToken(idToken);
      });
    }, delay);
  }

  public refreshToken(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.lock.checkSession({}, (err, data) => {
        err ? reject(err) : resolve(data ? data.idToken : null);
      });
    });
  }
}

export default AuthService;
