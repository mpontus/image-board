import { combineEpics } from "redux-observable";
import authEpic from "./authEpic";
import retrievePostsEpic from "./postEpic";

export default combineEpics(authEpic, retrievePostsEpic);
