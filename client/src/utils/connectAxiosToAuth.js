import { Observable, empty } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { set, lensPath } from "ramda";

/**
 * Connects axios instance AuthService using interceptors
 *
 * @param axios Axios
 * @param authService AuthService
 * @return fn Unsubscribe function
 */
const connectAxiosToAuth = (axios, authService) =>
  authService
    .getIdToken()
    .pipe(
      map(
        token =>
          token
            ? set(lensPath(["headers", "Authorization"]), `Bearer ${token}`)
            : null
      ),
      switchMap(
        interceptor =>
          interceptor
            ? Observable.create(() => {
                axios.interceptors.request.use(interceptor);

                return () => axios.interceptors.request.eject(interceptor);
              })
            : Observable.empty()
      )
    )
    .subscribe();

export default connectAxiosToAuth;
