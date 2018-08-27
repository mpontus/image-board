import { combineEpics } from "redux-observable";
import { map, tap, ignoreElements } from "rxjs/operators";
import { LOGIN, authenticated } from "../actions";

const authEpic = (action$, getState, { auth }) =>
  auth.getIdToken().pipe(map(authenticated));

const loginEpic = (action$, getState, { auth }) =>
  action$.ofType(LOGIN).pipe(
    tap(() => auth.login()),
    ignoreElements()
  );

export default combineEpics(authEpic, loginEpic);
