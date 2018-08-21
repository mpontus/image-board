import { combineEpics } from "redux-observable";

import authEpic from "./authEpic";
import postsEpic from "./postsEpic";

export default combineEpics(authEpic, postsEpic);
