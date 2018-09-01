import { Action as PostAction } from "./postActions";

export type Action = PostAction;

export {
  LOAD_POSTS_RESOLVE,
  LOAD_POSTS_REJECT,
  loadPostsResolve,
  loadPostsReject
} from "./postActions";
