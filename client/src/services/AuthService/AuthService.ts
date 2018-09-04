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
  location?: Location;
  storage?: Storage;
}

/**
 * Authentication service using auth0 lock enhanced with persistent storage
 */
class AuthService {
  static createAxiosInterceptor = createAxiosInterceptor;

  private readonly lock: Auth0Lock;

  idToken: Promise<string | null> = Promise.resolve(null);

  constructor({ lock }: Options) {
    this.lock = lock;

    const idToken = localStorage.getItem(ID_TOKEN_KEY);

    if (idToken && isTokenValid(idToken)) {
      this.idToken = Promise.resolve(idToken);
      this.scheduleRefreshToken(idToken);
    } else {
      this.lock.on("authenticated", ({ idToken }) => {
        localStorage.setItem(ID_TOKEN_KEY, idToken);

        window.location.reload();
      });
    }
  }

  login() {
    this.lock.show();
  }

  logout() {
    localStorage.removeItem(ID_TOKEN_KEY);

    this.lock.logout({});

    location.reload();
  }

  getIdToken() {
    return this.idToken;
  }

  scheduleRefreshToken(idToken: string) {
    const { exp } = jwtDecode(idToken);
    const delay = exp * 1000 - Date.now();

    setTimeout(() => {
      this.idToken = this.refreshToken();

      this.idToken.then(idToken => {
        if (idToken === null) {
          localStorage.removeItem(ID_TOKEN_KEY);

          return;
        }

        localStorage.setItem(ID_TOKEN_KEY, idToken);
        this.scheduleRefreshToken(idToken);
      });
    }, delay);
  }

  refreshToken(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.lock.checkSession({}, (err, data) => {
        err ? reject(err) : resolve(data ? data.idToken : null);
      });
    });
  }
}

export default AuthService;
