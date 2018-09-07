import { AxiosRequestConfig } from "axios";
import { ThrowReporter } from "io-ts/lib/ThrowReporter";
import { combineEpics, Epic, ofType } from "redux-observable";
import { empty, from, Observable, Observer, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import {
  Action,
  CREATE_POST,
  createPostReject,
  createPostResolve,
  LOAD_POSTS,
  loadPostsReject,
  loadPostsResolve,
  uploadProgress
} from "../actions";
import { PageResponseSchema } from "../api";
import { State } from "../reducers";
import { Dependencies } from "../store";

const retrievePostsEpic: Epic<Action, Action, State, Dependencies> = (
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

const createPostEpic: Epic<Action, Action, State, Dependencies> = (
  action$,
  state$,
  { api }
) => {
  return action$.pipe(
    ofType(CREATE_POST),
    mergeMap((action: Action) => {
      if (action.type !== CREATE_POST) {
        return empty();
      }

      const { post, file } = action.payload;
      const data = new FormData();

      data.append("file", file);

      return Observable.create((observer: Observer<Action>) => {
        const config: AxiosRequestConfig = {
          onUploadProgress: (e: { loaded: number; total: number }) =>
            observer.next(uploadProgress(post.id, e.loaded, e.total))
        };

        from(api.post("posts", data, config))
          .pipe(
            map(response => createPostResolve(post, response.data)),
            catchError(error => of(createPostReject(post, error)))
          )
          .subscribe(observer);
      });
    })
  );
};
export default combineEpics(retrievePostsEpic, createPostEpic);
