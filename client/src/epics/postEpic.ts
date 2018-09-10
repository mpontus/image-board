import { AxiosRequestConfig, AxiosResponse } from "axios";
import * as t from "io-ts";
import { failure } from "io-ts/lib/PathReporter";
import { combineEpics, Epic, ofType } from "redux-observable";
import { empty, from, merge, Observable, Observer, of, throwError } from "rxjs";
import { catchError, map, mapTo, mergeMap, switchMap } from "rxjs/operators";
import {
  Action,
  CREATE_POST,
  createPostReject,
  createPostResolve,
  DELETE_POST,
  deletePostReject,
  deletePostResolve,
  END_REACHED,
  LIKE_POST,
  likePostReject,
  likePostResolve,
  LOAD_POSTS,
  loadPostsReject,
  loadPostsResolve,
  uploadProgress
} from "../actions";
import { PageResponseSchema, PostSchema } from "../api";
import { mapResponseToPostData } from "../models";
import { State } from "../reducers";
import { Dependencies } from "../store";

/**
 * Validate the response object and cast the results to the given schema.
 *
 * @param schema Type io-ts schema definition
 * @return Observable<*> Observable of the instances of the given schema objects
 */
const validateResponse = <S extends t.Any>(schema: S) => (
  source: Observable<AxiosResponse<any>>
): Observable<t.TypeOf<S>> =>
  source.pipe(
    map(response =>
      schema
        .decode(response.data)
        .mapLeft(errors => failure(errors).join("\n"))
        .mapLeft(message => new Error(message))
    ),
    switchMap(result => result.fold(throwError, of))
  );

const retrievePostsEpic: Epic<Action, Action, State, Dependencies> = (
  action$,
  state$,
  { api }
) =>
  merge(
    action$.pipe(
      ofType(LOAD_POSTS),
      mapTo(1)
    ),
    action$.pipe(
      ofType(END_REACHED),
      map(action => {
        if (action.type !== END_REACHED) {
          throw new Error("I'm a useless type guard");
        }

        return action.payload.lastPage + 1;
      })
    )
  ).pipe(
    switchMap(page =>
      from(api.get(`posts?page=${page}`)).pipe(
        validateResponse(PageResponseSchema),
        map(({ total, items }) =>
          loadPostsResolve(page, total, items.map(mapResponseToPostData))
        ),
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
            validateResponse(PostSchema),
            map(response =>
              createPostResolve(post, mapResponseToPostData(response))
            ),
            catchError(error => of(createPostReject(post, error)))
          )
          .subscribe(observer);
      });
    })
  );
};

const deletePostEpic: Epic<Action, Action, State, Dependencies> = (
  action$,
  state$,
  { api }
) =>
  action$.pipe(
    ofType(DELETE_POST),
    switchMap(action => {
      // Type guard
      if (action.type !== DELETE_POST) {
        return empty();
      }

      const { post } = action.payload;

      return from(api.delete(`posts/${post.id}`)).pipe(
        map(() => deletePostResolve(post)),
        catchError(error => of(deletePostReject(post, error)))
      );
    })
  );

const likePostEpic: Epic<Action, Action, State, Dependencies> = (
  action$,
  state$,
  { api }
) =>
  action$.pipe(
    ofType(LIKE_POST),
    switchMap(action => {
      // Type guard
      if (action.type !== LIKE_POST) {
        return empty();
      }

      const { post, value } = action.payload;

      return from(
        value > 0
          ? api.put(`posts/${post.id}/like`)
          : api.delete(`posts/${post.id}/like`)
      ).pipe(
        map(() => likePostResolve(post, value)),
        catchError(error => of(likePostReject(post, value, error)))
      );
    })
  );

export default combineEpics(
  retrievePostsEpic,
  createPostEpic,
  deletePostEpic,
  likePostEpic
);
