export const AUTHENTICATED = "AUTHENTICATED";
export const LOGOUT = "LOGOUT";

export type Action =
  | {
    type: typeof AUTHENTICATED;
    payload: {
      idToken: string;
    };
  }
  | {
    type: typeof LOGOUT;
  };

export const authenticated = (idToken: string): Action => ({
  type: AUTHENTICATED,
  payload: {
    idToken
  }
});

export const logout = (): Action => ({
  type: LOGOUT
});
