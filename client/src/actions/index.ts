import { Action as PostAction } from "./postActions";
import { Action as AuthAction } from "./authActions";

export type Action = PostAction | AuthAction;

export {
  LOAD_POSTS,
  LOAD_POSTS_RESOLVE,
  LOAD_POSTS_REJECT,
  loadPosts,
  loadPostsResolve,
  loadPostsReject
} from "./postActions";

export {
  AUTHENTICATED,
  LOGIN,
  LOGOUT,
  authenticated,
  login,
  logout
} from "./authActions";
