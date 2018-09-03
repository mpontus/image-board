import { Action as PostAction } from "./postActions";

export type Action = PostAction;

export {
  LOAD_POSTS,
  LOAD_POSTS_RESOLVE,
  LOAD_POSTS_REJECT,
  loadPosts,
  loadPostsResolve,
  loadPostsReject
} from "./postActions";
