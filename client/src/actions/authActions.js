export const LOGIN = "LOGIN";
export const AUTHENTICATED = "AUTHENTICATED";
export const LOGOUT = "LOGOUT";

export const login = () => ({
  type: LOGIN
});

export const authenticated = idToken => ({
  type: AUTHENTICATED,
  payload: {
    idToken
  }
});

export const logout = () => ({
  type: LOGOUT
});
