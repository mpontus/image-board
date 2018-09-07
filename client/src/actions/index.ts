import { Action as AuthAction } from "./authActions";
import { Action as PostAction } from "./postActions";

export type Action = PostAction | AuthAction;

export {
  LOAD_POSTS,
  LOAD_POSTS_REJECT,
  LOAD_POSTS_RESOLVE,
  CREATE_POST,
  CREATE_POST_RESOLVE,
  CREATE_POST_REJECT,
  UPLOAD_PROGRESS,
  DELETE_POST,
  DELETE_POST_RESOLVE,
  DELETE_POST_REJECT,
  LIKE_POST,
  LIKE_POST_RESOLVE,
  LIKE_POST_REJECT,
  loadPosts,
  loadPostsResolve,
  loadPostsReject,
  createPost,
  createPostResolve,
  createPostReject,
  uploadProgress,
  deletePost,
  deletePostResolve,
  deletePostReject,
  likePost,
  likePostResolve,
  likePostReject
} from "./postActions";

export {
  AUTHENTICATED,
  LOGIN,
  LOGOUT,
  authenticated,
  login,
  logout
} from "./authActions";
