import { PageResponse } from "../api";
import { Post } from "../models";

export const LOAD_POSTS_REJECT = "LOAD_POSTS_REJECT";
export const LOAD_POSTS_RESOLVE = "LOAD_POSTS_RESOLVE";

export type Action =
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
  };

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
