import nanoid from "nanoid";
import { PageResponse } from "../api";
import { Post, User } from "../models";
import { fileToDataUrl, getImageDimensions } from "../utils";

export const LOAD_POSTS = "LOAD_POSTS";
export const LOAD_POSTS_REJECT = "LOAD_POSTS_REJECT";
export const LOAD_POSTS_RESOLVE = "LOAD_POSTS_RESOLVE";
export const CREATE_POST = "CREATE_POST";
export const CREATE_POST_RESOLVE = "CREATE_POST_RESOLVE";
export const CREATE_POST_REJECT = "CREATE_POST_REJECT";
export const UPLOAD_PROGRESS = "UPLOAD_PROGRESS";
export const DELETE_POST = "DELETE_POST";
export const DELETE_POST_RESOLVE = "DELETE_POST_RESOLVE";
export const DELETE_POST_REJECT = "DELETE_POST_REJECT";
export const LIKE_POST = "LIKE_POST";
export const LIKE_POST_RESOLVE = "LIKE_POST_RESOLVE";
export const LIKE_POST_REJECT = "LIKE_POST_REJECT";

export type Action =
  | {
      type: typeof LOAD_POSTS;
    }
  | {
      type: typeof LOAD_POSTS_RESOLVE;
      payload: {
        total: number;
        posts: Post[];
      };
    }
  | {
      type: typeof LOAD_POSTS_REJECT;
      payload: {
        error: Error;
      };
    }
  | {
      type: typeof CREATE_POST;
      payload: {
        file: File;
        post: Post;
      };
    }
  | {
      type: typeof CREATE_POST_RESOLVE;
      payload: {
        post: Post;
        instance: Post;
      };
    }
  | {
      type: typeof CREATE_POST_REJECT;
      payload: {
        post: Post;
        error: Error;
      };
    }
  | {
      type: typeof UPLOAD_PROGRESS;
      payload: {
        key: string;
        bytesTransferred: number;
        bytesTotal: number;
      };
    }
  | {
      type: typeof DELETE_POST;
      payload: {
        post: Post;
      };
    }
  | {
      type: typeof DELETE_POST_RESOLVE;
      payload: {
        post: Post;
      };
    }
  | {
      type: typeof DELETE_POST_REJECT;
      payload: {
        post: Post;
        error: Error;
      };
    }
  | {
      type: typeof LIKE_POST;
      payload: {
        post: Post;
        value: 1 | -1;
      };
    }
  | {
      type: typeof LIKE_POST_RESOLVE;
      payload: {
        post: Post;
        value: 1 | -1;
      };
    }
  | {
      type: typeof LIKE_POST_REJECT;
      payload: {
        post: Post;
        value: 1 | -1;
        error: Error;
      };
    };

export const loadPosts = (): Action => ({
  type: LOAD_POSTS
});

export const loadPostsResolve = ({ total, items }: PageResponse): Action => ({
  type: LOAD_POSTS_RESOLVE,
  payload: {
    total,
    posts: items
  }
});

export const loadPostsReject = (error: Error): Action => ({
  type: LOAD_POSTS_REJECT,
  payload: {
    error
  }
});

export const createPost = (file: File, user: User): Promise<Action> =>
  Promise.all([fileToDataUrl(file), getImageDimensions(file)]).then(
    ([url, { width, height }]): Action => ({
      type: CREATE_POST,
      payload: {
        file,
        post: {
          id: `temp/${nanoid()}`,
          author: user,
          picture: {
            url,
            width,
            height
          },
          likesCount: 1,
          isLiked: true,
          timestamp: Date.now()
        }
      }
    })
  );

export const createPostResolve = (post: Post, instance: Post): Action => ({
  type: CREATE_POST_RESOLVE,
  payload: {
    post,
    instance
  }
});

export const createPostReject = (post: Post, error: Error): Action => ({
  type: CREATE_POST_REJECT,
  payload: {
    post,
    error
  }
});

export const uploadProgress = (
  key: string,
  bytesTransferred: number,
  bytesTotal: number
): Action => ({
  type: UPLOAD_PROGRESS,
  payload: {
    key,
    bytesTransferred,
    bytesTotal
  }
});

export const deletePost = (post: Post): Action => ({
  type: DELETE_POST,
  payload: {
    post
  }
});

export const deletePostResolve = (post: Post): Action => ({
  type: DELETE_POST_RESOLVE,
  payload: {
    post
  }
});

export const deletePostReject = (post: Post, error: Error): Action => ({
  type: DELETE_POST_REJECT,
  payload: {
    post,
    error
  }
});

export const likePost = (post: Post, value: 1 | -1): Action => ({
  type: LIKE_POST,
  payload: {
    post,
    value
  }
});

export const likePostResolve = (post: Post, value: 1 | -1): Action => ({
  type: LIKE_POST_RESOLVE,
  payload: {
    post,
    value
  }
});

export const likePostReject = (
  post: Post,
  value: 1 | -1,
  error: Error
): Action => ({
  type: LIKE_POST_REJECT,
  payload: {
    post,
    value,
    error
  }
});
