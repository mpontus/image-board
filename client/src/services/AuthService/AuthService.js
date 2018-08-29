import jwtDecode from "jwt-decode";
import createAxiosInterceptor from "./createAxiosInterceptor";

const ID_TOKEN_KEY = "idToken";

const isTokenExpired = token => jwtDecode(token).exp * 1000 < Date.now();

const isTokenValid = token => {
  try {
    return !isTokenExpired(token);
  } catch (error) {
    return false;
  }
};

/**
 * Authentication service using auth0 lock enhanced with persistent storage
 */
class AuthService {
  static createAxiosInterceptor = createAxiosInterceptor;

  idToken = Promise.resolve(null);

  constructor({
    lock,
    location = window.location,
    localStorage = window.localStorage,
  }) {
    this.lock = lock;
    this.location = location;
    this.localStorage = localStorage;

    const idToken = localStorage.getItem(ID_TOKEN_KEY);

    if (idToken && isTokenValid(idToken)) {
      this.idToken = Promise.resolve(idToken);
      this.scheduleRefreshToken(idToken);
    } else {
      this.lock.on("authenticated", ({ idToken }) => {
        localStorage.setItem(ID_TOKEN_KEY, idToken);
        location.reload();
      });
    }
  }

  login() {
    this.lock.show();
  }

  logout() {
    this.localStorage.setItem(ID_TOKEN_KEY, null);

    this.lock.logout();

    this.location.reload();
  }

  getIdToken() {
    return this.idToken;
  }

  scheduleRefreshToken(idToken) {
    const { exp } = jwtDecode(idToken);

    setTimeout(() => {
      this.idToken = this.refreshToken();

      this.idToken.then(idToken => {
        this.localStorage.setItem(ID_TOKEN_KEY, idToken);
        this.scheduleRefreshToken(idToken);
      });
    }, exp * 1000 - Date.now());
  }

  refreshToken() {
    return new Promise((resolve, reject) => {
      this.lock.checkSession({}, (err, data) => {
        try {
          err ? reject(err) : resolve(data.id_token);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

export default AuthService;
