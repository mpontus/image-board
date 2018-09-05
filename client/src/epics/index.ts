import { combineEpics } from "redux-observable";
import postEpic from "./postEpic";

export default combineEpics(postEpic);
