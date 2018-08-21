import { Observable, from, of } from "rxjs";
import { mergeMap, filter, map, catchError, takeUntil } from "rxjs/operators";
import {
  CREATE_POST,
  DELETE_POST,
  uploadProgress,
  createPostSuccess,
  createPostError
} from "../actions";

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
            map(response => createPostSuccess(response.data)),
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

export default createPostEpic;
