import { combineReducers } from "redux";
import { default as authReducer, State as AuthState } from "./authReducer";
import { default as postReducer, State as PostState } from "./postReducer";

export interface State {
  readonly posts: PostState;
  readonly auth: AuthState;
}

export default combineReducers({
  posts: postReducer,
  auth: authReducer
});
