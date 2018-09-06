import { combineEpics, Epic, ofType } from "redux-observable";
import { empty, from, of } from "rxjs";
import {
  catchError,
  ignoreElements,
  map,
  switchMap,
  tap
} from "rxjs/operators";
import { Action, authenticated, LOGIN, LOGOUT } from "../actions";
import { State } from "../reducers";
import { Dependencies } from "../store";

const authEpic: Epic<Action, Action, State, Dependencies> = (
  action$,
  state$,
  { auth }
) =>
  from(auth.getIdToken()).pipe(
    switchMap(token => (token ? of(token) : empty())),
    map(token => authenticated(token)),
    catchError(() => empty())
  );

const loginEpic: Epic<Action, Action, State, Dependencies> = (
  action$,
  state$,
  { auth }
) =>
  action$.pipe(
    ofType(LOGIN),
    tap(() => auth.login()),
    ignoreElements()
  );

const logoutEpic: Epic<Action, Action, State, Dependencies> = (
  action$,
  state$,
  { auth }
) =>
  action$.pipe(
    ofType(LOGOUT),
    tap(() => auth.logout()),
    ignoreElements()
  );

export default combineEpics(authEpic, loginEpic, logoutEpic);
