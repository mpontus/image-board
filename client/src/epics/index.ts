import { combineEpics } from "redux-observable";
import authEpic from "./authEpic";
import postEpic from "./postEpic";

export default combineEpics(authEpic, postEpic);
