import { Action as PostAction } from "./postActions";
import { Action as AuthAction } from "./authActions";

export type Action = PostAction | AuthAction;

export {
  LOAD_POSTS,
  LOAD_POSTS_RESOLVE,
  LOAD_POSTS_REJECT,
  CREATE_POST,
  CREATE_POST_RESOLVE,
  CREATE_POST_REJECT,
  loadPosts,
  loadPostsResolve,
  loadPostsReject,
  createPost,
  createPostResolve,
  createPostReject,
} from "./postActions";

export {
  AUTHENTICATED,
  LOGIN,
  LOGOUT,
  authenticated,
  login,
  logout,
} from "./authActions";
