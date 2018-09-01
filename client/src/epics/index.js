import { ignoreElements } from "rxjs/operators";

export default action$ => action$.pipe(ignoreElements());
