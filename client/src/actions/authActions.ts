export const AUTHENTICATED = "AUTHENTICATED";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export type Action =
  | {
      type: typeof AUTHENTICATED;
      payload: {
        idToken: string;
      };
    }
  | {
      type: typeof LOGIN;
    }
  | {
      type: typeof LOGOUT;
    };

export const authenticated = (idToken: string): Action => ({
  type: AUTHENTICATED,
  payload: {
    idToken,
  },
});

export const login = (): Action => ({
  type: LOGIN,
});

export const logout = (): Action => ({
  type: LOGOUT,
});
