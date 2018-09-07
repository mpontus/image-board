import { Action as AuthAction } from "./authActions";
import { Action as PostAction } from "./postActions";

export type Action = PostAction | AuthAction;

export {
  LOAD_POSTS,
  LOAD_POSTS_RESOLVE,
  LOAD_POSTS_REJECT,
  CREATE_POST,
  CREATE_POST_RESOLVE,
  CREATE_POST_REJECT,
  UPLOAD_PROGRESS,
  loadPosts,
  loadPostsResolve,
  loadPostsReject,
  createPost,
  createPostResolve,
  createPostReject,
  uploadProgress
} from "./postActions";

export {
  AUTHENTICATED,
  LOGIN,
  LOGOUT,
  authenticated,
  login,
  logout
} from "./authActions";
