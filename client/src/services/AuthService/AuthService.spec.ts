import { encode } from "jwt-simple";
import AuthService from "./AuthService";

const ID_TOKEN_KEY = "idToken";

// JSON web token which expires after 24 hours
const idToken = encode(
  { exp: Math.floor(Date.now() / 1000) + 24 * 3600 },
  "secret"
);

beforeAll(() => {
  Object.defineProperty(window.location, "reload", {
    writable: true,
    value: jest.fn(),
  });

  Object.defineProperty(Storage.prototype, "getItem", {
    writable: true,
    value: jest.fn(),
  });

  Object.defineProperty(Storage.prototype, "setItem", {
    writable: true,
    value: jest.fn(),
  });

  Object.defineProperty(Storage.prototype, "removeItem", {
    writable: true,
    value: jest.fn(),
  });
});

afterEach(() => {
  (window.location.reload as any).mockReset();
  (window.localStorage.getItem as any).mockReset();
  (window.localStorage.setItem as any).mockReset();
  (window.localStorage.removeItem as any).mockReset();
});

describe("AuthService", () => {
  describe("initialization", () => {
    let auth: AuthService;

    beforeEach(() => {
      (localStorage.getItem as any).mockReturnValueOnce(idToken);

      auth = new AuthService({
        lock: {
          on: () => {},
        } as any,
      });
    });

    it("should retrieve token from local storage", () => {
      expect(localStorage.getItem).toHaveBeenCalledWith(ID_TOKEN_KEY);
    });

    it("should return retrieved token", () => {
      return expect(auth.getIdToken()).resolves.toBe(idToken);
    });
  });

  describe("authentication", () => {
    let auth: AuthService;

    beforeEach(() => {
      let callback: Function;

      auth = new AuthService({
        lock: {
          on: (event: "authenticated", cb: Function) => {
            if (event === "authenticated") {
              callback = cb;
            }
          },
          show: () => {
            if (callback) {
              callback({ idToken });
            }
          },
        } as any,
      });

      auth.login();
    });

    it("should put token into local storage", () => {
      expect(localStorage.setItem).toHaveBeenCalledWith(ID_TOKEN_KEY, idToken);
    });

    it("should reload the page", () => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    let lock: any;

    beforeEach(() => {
      lock = {
        on: () => {},
        logout: jest.fn(),
      };

      const auth = new AuthService({
        lock,
      });

      auth.logout();
    });

    it("should remove token from local storage", () => {
      expect(localStorage.removeItem).toHaveBeenCalledWith(ID_TOKEN_KEY);
    });

    it("should call Auth0Lock#logout", () => {
      expect(lock.logout).toHaveBeenCalled();
    });

    it("should reload the page", () => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  describe("refresh", () => {
    const nextIdToken = encode(
      { exp: Math.floor(Date.now() / 1000) + 48 * 3600 },
      "secret"
    );
    let auth: AuthService;

    beforeEach(async () => {
      jest.useFakeTimers();

      (localStorage.getItem as any).mockReturnValueOnce(idToken);

      auth = new AuthService({
        lock: {
          on: () => {},
          checkSession: (options: any, callback: Function) => {
            callback(null, { idToken: nextIdToken });
          },
        } as any,
      });

      jest.runAllTimers();

      // We need to wait for the promise to resolve
      await auth.getIdToken();
    });

    it("should refresh expired id token automatically", async () => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        ID_TOKEN_KEY,
        nextIdToken
      );
    });

    it("should return new id token", () => {
      return expect(auth.getIdToken()).resolves.toBe(nextIdToken);
    });
  });
});
