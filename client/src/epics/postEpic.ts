import { ThrowReporter } from "io-ts/lib/ThrowReporter";
import { Epic, ofType } from "redux-observable";
import { from, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import {
  Action,
  LOAD_POSTS,
  loadPostsReject,
  loadPostsResolve
} from "../actions";
import { PageResponseSchema } from "../api";
import { State } from "../reducers";
import { Dependencies } from "../store";

const postEpic: Epic<Action, Action, State, Dependencies> = (
  action$,
  state$,
  { api }
) =>
  action$.pipe(
    ofType(LOAD_POSTS),
    switchMap(() =>
      from(api.get("posts?page=1")).pipe(
        // map(response => loadPostsResolve(response.data)),
        map(response => {
          const { data } = response;

          const validationResult = PageResponseSchema.decode(data);

          ThrowReporter.report(validationResult);

          return validationResult.value;
        }),
        map(loadPostsResolve),
        catchError(error => of(loadPostsReject(error)))
      )
    )
  );

export default postEpic;
