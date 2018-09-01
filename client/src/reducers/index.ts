import { combineReducers } from "redux";
import { State as PostState, default as postReducer } from "./postReducer";

export type State = {
  readonly posts: PostState;
};

export default combineReducers({
  posts: postReducer
});
