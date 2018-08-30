import { combineReducers } from "redux";
import authReducer from "./authReducer";
import postsReducer from "./postsReducer";
import notificationsReducer from "./notificationsReducer";

export default combineReducers({
  auth: authReducer,
  posts: postsReducer,
  notification: notificationsReducer,
});
