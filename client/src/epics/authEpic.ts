import { combineEpics } from "redux-observable";
import { from } from "rxjs";
import { filter, map, tap, ignoreElements } from "rxjs/operators";
import { LOGIN, LOGOUT, authenticated } from "../actions";

const authEpic = (action$, getState, { auth }) =>
  from(auth.getIdToken()).pipe(
    filter(token => !!token),
    map(authenticated)
  );

const loginEpic = (action$, getState, { auth }) =>
  action$.ofType(LOGIN).pipe(
    tap(() => auth.login()),
    ignoreElements()
  );

const logoutEpic = (action$, getState, { auth }) =>
  action$.ofType(LOGOUT).pipe(
    tap(() => auth.logout()),
    ignoreElements()
  );

export default combineEpics(authEpic, loginEpic, logoutEpic);
