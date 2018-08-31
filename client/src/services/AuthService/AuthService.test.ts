import { encode } from "jwt-simple";
import AuthService from "./AuthService";

const ID_TOKEN_KEY = "idToken";

// JSON web token which expires after 24 hours
const idToken = encode(
  { exp: Math.floor(Date.now() / 1000) + 24 * 3600 },
  "secret"
);

describe("AuthService", () => {
  it("retrieves token from local storage", () => {
    const auth = new AuthService({
      lock: {
        on: () => {},
      },
      localStorage: {
        getItem: key => {
          expect(key).toBe(ID_TOKEN_KEY);

          return idToken;
        },
      },
    });

    expect(auth.getIdToken()).resolves.toBe(idToken);
  });

  it("stores id token in local storage after authentication", () => {
    const localStorage = {
      getItem: () => {},
      setItem: jest.fn(),
    };
    const lock = {
      on: (event, callback) => {
        expect(event).toBe("authenticated");

        lock.show.mockImplementation(() => {
          callback({ id_token: idToken });
        });
      },
      show: jest.fn(),
    };
    const auth = new AuthService({
      lock,
      localStorage,
    });

    auth.login();

    expect(localStorage.setItem).toHaveBeenCalledWith(ID_TOKEN_KEY, idToken);
  });

  it("reloads the page after login", () => {
    const lock = {
      on: (event, callback) => {
        expect(event).toBe("authenticated");

        lock.show.mockImplementation(() => {
          callback({ id_token: idToken });
        });
      },
      show: jest.fn(),
    };
    const location = {
      reload: jest.fn(),
    };
    const auth = new AuthService({
      lock,
      localStorage: {
        getItem: () => {},
        setItem: () => {},
      },
      location,
    });

    auth.login();

    expect(location.reload).toHaveBeenCalled();
  });

  it("resets the token after logout", () => {
    const localStorage = {
      getItem: () => {},
      setItem: jest.fn(),
    };
    const auth = new AuthService({
      lock: {
        on: () => {},
      },
      localStorage,
    });

    auth.logout();

    expect(localStorage.setItem).toHaveBeenCalledWith(ID_TOKEN_KEY, null);
  });

  it("reloads the page after logout", () => {
    const location = {
      reload: jest.fn(),
    };
    const auth = new AuthService({
      lock: {
        on: () => {},
      },
      localStorage: {
        getItem: () => {},
        setItem: () => {},
      },
      location,
    });

    auth.logout();

    expect(location.reload).toHaveBeenCalled();
  });

  describe("Token refresh", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it("refreshes expired id token automatically", async () => {
      const nextIdToken = encode(
        { exp: Math.floor(Date.now() / 1000) + 48 * 3600 },
        "secret"
      );
      const localStorage = {
        getItem: key => {
          expect(key).toBe(ID_TOKEN_KEY);

          return idToken;
        },
        setItem: jest.fn(),
      };
      const lock = {
        on: () => {},
        checkSession: (options, callback) => {
          expect(options).toEqual({});

          callback(null, { id_token: nextIdToken });
        },
      };
      const auth = new AuthService({
        lock,
        localStorage,
      });

      jest.runAllTimers();

      // We need to wait for the promise to resolve
      await auth.getIdToken();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        ID_TOKEN_KEY,
        nextIdToken
      );
    });
  });
});
