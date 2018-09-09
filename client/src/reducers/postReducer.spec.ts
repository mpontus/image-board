import {
  Action,
  CREATE_POST,
  createPostReject,
  createPostResolve,
  deletePost,
  deletePostReject,
  likePost,
  likePostReject,
  loadPostsResolve
} from "../actions";
import { denormalizePost, PostData } from "../models";
import postReducer from "./postReducer";

const post1: PostData = {
  id: "1",
  picture: {
    url:
      "https://images.unsplash.com/photo-1535412833400-85426926b8c1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=47e717c53dae51ed4a300fffa13733a8&auto=format&fit=crop&w=500&q=60",
    width: 500,
    height: 333
  },
  author: {
    id: "auth9|123123",
    name: "Foo bar",
    avatarUrl:
      "https://images.unsplash.com/profile-1532310311737-e56bb5caa506?dpr=1&auto=format&fit=crop&w=64&h=64&q=60&crop=faces&bg=fff"
  },
  likesCount: 1,
  isLiked: true,
  timestamp: 1535731213512
};

const post2: PostData = {
  id: "2",
  picture: {
    url:
      "https://images.unsplash.com/photo-1535406110845-88cbe4f661bc?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f4a0c1c0797ffc0e0008c764bf37fdf4&auto=format&fit=crop&w=500&q=60",
    width: 500,
    height: 281
  },
  author: {
    id: "auth9|123123",
    name: "Foo bar",
    avatarUrl:
      "https://images.unsplash.com/profile-1532310311737-e56bb5caa506?dpr=1&auto=format&fit=crop&w=64&h=64&q=60&crop=faces&bg=fff"
  },
  likesCount: 1,
  isLiked: true,
  timestamp: 1535731213512
};

const initialState = postReducer(undefined, {} as any);

describe("Post reducer", () => {
  describe("initial state", () => {
    it("should match snapshot", () => {
      expect(initialState).toMatchSnapshot();
    });
  });

  describe("listing retrieval", () => {
    it("should add posts to the state", () => {
      const action = loadPostsResolve(7, [post1, post2]);
      const state = postReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        total: 7,
        ids: [post1.id, post2.id],
        byId: {
          [post1.id]: post1,
          [post2.id]: post2
        }
      });
    });
  });

  describe("post creation", () => {
    it("should add the post optimistically", () => {
      const file = new File([""], "picture.png");
      const action: Action = {
        type: CREATE_POST,
        payload: {
          file,
          post: post1
        }
      };

      const state = postReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        byId: {
          [post1.id]: post1
        },
        pendingIds: [post1.id],
        isPendingById: {
          [post1.id]: true
        }
      });
    });

    it("should remove post from pending after it's committed", () => {
      const action = createPostResolve(post1, post2);
      const state0 = {
        ...initialState,
        pendingIds: [post1.id],
        byId: {
          [post1.id]: post1
        }
      };
      const state1 = postReducer(state0, action);

      expect(state1).toEqual({
        ...state0,
        pendingIds: [],
        ids: [post1.id],
        byId: {
          ...state0.byId,
          [post2.id]: post2
        },
        instances: {
          [post1.id]: post2.id
        }
      });
    });

    it("should remove post when creation is unsuccessful", () => {
      const action = createPostReject(post1, new Error("foo"));
      const state0 = {
        ...initialState,
        pendingIds: [post1.id],
        byId: {
          [post1.id]: post1
        }
      };
      const state1 = postReducer(state0, action);

      expect(state1).toEqual({
        ...state0,
        pendingIds: [],
        byId: {}
      });
    });
  });

  describe("post deletion", () => {
    const post1denormalized = denormalizePost(post1, false);

    it("should delete post optimistically", () => {
      const state0 = {
        ...initialState,
        byId: {
          [post1.id]: post1
        }
      };

      const action = deletePost(post1denormalized);
      const state = postReducer(state0, action);

      expect(state).toEqual({
        ...state0,
        isDeletedById: {
          [post1.id]: true
        }
      });
    });

    it("should revive the post on error", () => {
      const state0 = {
        ...initialState
      };
      const action = deletePostReject(post1denormalized, new Error("foo"));
      const state = postReducer(state0, action);

      expect(state).toEqual({
        ...state0,
        isDeletedById: {
          [post1.id]: false
        }
      });
    });
  });

  describe("post liking", () => {
    const post1denormalized = denormalizePost(post1, false);

    it("should like the post optimistically", () => {
      const state0 = {
        ...initialState,
        byId: {
          [post1.id]: post1
        }
      };
      const action = likePost(post1denormalized, 1);
      const state = postReducer(state0, action);

      expect(state).toEqual({
        ...state0,
        byId: {
          [post1.id]: {
            ...post1,
            likesCount: post1.likesCount + 1
          }
        }
      });
    });

    it("should revert like count on error", () => {
      const state0 = {
        ...initialState,
        byId: {
          [post1.id]: post1
        }
      };
      const action = likePostReject(post1denormalized, 1, new Error("foo"));
      const state = postReducer(state0, action);

      expect(state).toEqual({
        ...state0,
        byId: {
          [post1.id]: {
            ...post1,
            likesCount: post1.likesCount - 1
          }
        }
      });
    });
  });
});
