import { Observable, empty } from "rxjs";
import { switchMap } from "rxjs/operators";
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
      switchMap(
        token =>
          token
            ? Observable.create(() => {
                const interceptor = set(
                  lensPath(["headers", "Authorization"]),
                  `Bearer ${token}`
                );

                axios.interceptors.request.use(interceptor);

                return () => axios.interceptors.request.eject(interceptor);
              })
            : empty()
      )
    )
    .subscribe();
export default connectAxiosToAuth;
