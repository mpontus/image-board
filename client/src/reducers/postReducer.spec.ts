import {
  Action,
  CREATE_POST,
  loadPostsResolve,
  createPostResolve,
  createPostReject
} from "../actions";
import postReducer from "./postReducer";

const postFixtures = [
  {
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
  },
  {
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
  }
];

const initialState = postReducer(undefined, {} as any);

describe("Post reducer", () => {
  describe("initial state", () => {
    it("should match snapshot", () => {
      expect(initialState).toMatchSnapshot();
    });
  });

  describe("listing retrieval", () => {
    it("should add posts to the state", () => {
      const action = loadPostsResolve({
        total: 2,
        items: postFixtures
      });

      const state = postReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        total: 2,
        ids: [postFixtures[0].id, postFixtures[1].id],
        byId: {
          [postFixtures[0].id]: postFixtures[0],
          [postFixtures[1].id]: postFixtures[1]
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
          post: postFixtures[0]
        }
      };

      const state = postReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        pendingIds: [postFixtures[0].id],
        byId: {
          [postFixtures[0].id]: postFixtures[0]
        }
      });
    });

    it("should remove post from pending after it's committed", () => {
      const action = createPostResolve(postFixtures[0], postFixtures[1]);
      const state0 = {
        ...initialState,
        pendingIds: [postFixtures[0].id],
        byId: {
          [postFixtures[0].id]: postFixtures[0]
        }
      };
      const state1 = postReducer(state0, action);

      expect(state1).toEqual({
        ...state0,
        pendingIds: [],
        ids: [postFixtures[0].id],
        byId: {
          ...state0.byId,
          [postFixtures[1].id]: postFixtures[1]
        },
        instances: {
          [postFixtures[0].id]: postFixtures[1].id
        }
      });
    });

    it("should remove post when creation is unsuccessful", () => {
      const action = createPostReject(postFixtures[0], new Error("foo"));
      const state0 = {
        ...initialState,
        pendingIds: [postFixtures[0].id],
        byId: {
          [postFixtures[0].id]: postFixtures[0]
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
});
