import { combineReducers } from "redux";
import { State as PostState, default as postReducer } from "./postReducer";
import { State as AuthState, default as authReducer } from "./authReducer";

export type State = {
  readonly posts: PostState;
  readonly auth: AuthState;
};

export default combineReducers({
  posts: postReducer,
  auth: authReducer,
});
