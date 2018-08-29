import { combineEpics } from "redux-observable";
import { Observable, merge, from, of, empty } from "rxjs";
import {
  catchError,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap,
  takeUntil,
} from "rxjs/operators";
import { CancelToken } from "axios";
import {
  FETCH_POSTS,
  END_REACHED,
  CREATE_POST,
  DELETE_POST,
  LIKE_POST,
  fetchPostsSuccess,
  fetchPostsError,
  createPostSuccess,
  createPostError,
  uploadProgress,
  deletePostSuccess,
  deletePostError,
  likePostSuccess,
  likePostError,
} from "../actions";

const fetchPostsEpic = (action$, getState, { api }) =>
  merge(
    action$.ofType(FETCH_POSTS).pipe(mapTo(1)),
    action$.ofType(END_REACHED).pipe(map(action => action.payload.lastPage + 1))
  ).pipe(
    switchMap(page =>
      from(api.get(`posts?page=${page}`)).pipe(
        map(response => {
          const { total, items } = response.data;

          return fetchPostsSuccess({ items, total, page });
        }),
        catchError(error => of(fetchPostsError(page, error)))
      )
    )
  );

const createPostEpic = (action$, getState, { api }) =>
  action$.ofType(CREATE_POST).pipe(
    mergeMap(action => {
      const { post, file } = action.payload;

      const data = new FormData();
      data.append("file", file);

      const cancelAction$ = action$
        .ofType(DELETE_POST)
        .pipe(filter(action => action.payload.post.id === post.id));

      return Observable.create(observer => {
        const source = CancelToken.source();

        const config = {
          onUploadProgress: e =>
            observer.next(uploadProgress(post.id, e.loaded, e.total)),
          cancelToken: source.token,
        };

        from(api.post("posts", data, config))
          .pipe(
            map(response => createPostSuccess(post, response.data)),
            catchError(error => {
              const action = createPostError(post, error);

              return of(action);
            }),
            takeUntil(cancelAction$)
          )
          .subscribe(observer);

        return source.cancel;
      });
    })
  );

const likePostEpic = (action$, getState, { api }) =>
  action$.ofType(LIKE_POST).pipe(
    mergeMap(action => {
      const { post, value } = action.payload;

      if (!post.committed) {
        return empty();
      }

      return from(
        value > 0
          ? api.put(`posts/${post.id}/like`)
          : api.delete(`posts/${post.id}/like`)
      ).pipe(
        mapTo(likePostSuccess(post, value)),
        catchError(error => of(likePostError(post, value, error)))
      );
    })
  );

const deletePostEpic = (action$, getState, { api }) =>
  action$.ofType(DELETE_POST).pipe(
    mergeMap(action => {
      const { post } = action.payload;

      if (!post.committed) {
        return empty();
      }

      return from(api.delete(`posts/${post.id}`)).pipe(
        mapTo(deletePostSuccess(post)),
        catchError(error => of(deletePostError(post, error)))
      );
    })
  );

export default combineEpics(
  fetchPostsEpic,
  createPostEpic,
  likePostEpic,
  deletePostEpic
);
