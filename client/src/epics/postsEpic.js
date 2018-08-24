import { combineEpics } from "redux-observable";
import { Observable, from, of, empty } from "rxjs";
import {
  catchError,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap,
  takeUntil
} from "rxjs/operators";
import {
  FETCH_POSTS,
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
  likePostError
} from "../actions";

const fetchPostsEpic = (action$, getState, { api }) =>
  action$
    .ofType(FETCH_POSTS)
    .pipe(
      switchMap(action => api.get("posts")),
      map(response => fetchPostsSuccess(response.data)),
      catchError(error => of(fetchPostsError(error)))
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
        const config = {
          onUploadProgress: e =>
            observer.next(uploadProgress(post.id, e.loaded, e.total))
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

        // TODO; Cancel the request here
        return () => {};
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
