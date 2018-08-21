import { createSelector } from "reselect";
import jwtDecode from "jwt-decode";

const getDecodedJwtToken = createSelector(
  state => (state.auth ? state.auth.token : null),
  token => (token ? jwtDecode(token) : null)
);

export const makeGetAuthenticatedUser = () =>
  createSelector(
    getDecodedJwtToken,
    token =>
      token && {
        id: token.sub,
        avatarUrl: token.picture,
        name: token.nickname
      }
  );
