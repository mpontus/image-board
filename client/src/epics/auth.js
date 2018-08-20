import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { authenticated } from "../actions";

const authEpic = (action$, getState, { auth }) =>
  Observable.create(observer => {
    return auth.on("authenticated", authResult => {
      observer.next(authResult.idToken);
    });
  }).pipe(map(authenticated));

export default authEpic;
