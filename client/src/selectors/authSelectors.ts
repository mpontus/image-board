import jwtDecode from "jwt-decode";
import { createSelector } from "reselect";
import { User } from "../models";
import { State } from "../reducers";

export const makeGetAuthenticatedUser = () =>
  createSelector<State, string | null, User | null>(
    state => state.auth.idToken,
    idToken => {
      if (idToken == null) {
        return null;
      }

      const payload = jwtDecode<{
        sid: string;
        name: string;
        picture: string;
      }>(idToken);

      return {
        id: payload.sid,
        name: payload.name,
        avatarUrl: payload.picture
      };
    }
  );
