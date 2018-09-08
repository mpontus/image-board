import reducers, { State } from "../reducers";
import { makeGetPostById, makeGetPostIds } from "./postSelectors";

const postFixture = {
  id: "5",
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

const postFixture2 = {
  id: "7",
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

const initialState = reducers(undefined, {} as any);

describe("postSelectors", () => {
  describe("makeGetPostIds", () => {
    const getPostIds = makeGetPostIds();

    it("Returns all post ids", () => {
      const state = {
        ...initialState,
        posts: {
          ...initialState.posts,
          pendingIds: ["2", "4"],
          ids: ["3", "5", "9"]
        }
      };

      expect(getPostIds(state)).toEqual(["2", "4", "3", "5", "9"]);
    });
  });

  describe("makeGetPostById", () => {
    const getPostById = makeGetPostById();

    it("should return post by its id", () => {
      const state = {
        ...initialState,
        posts: {
          ...initialState.posts,
          byId: {
            [postFixture.id]: postFixture
          }
        }
      };

      expect(getPostById(state, { id: postFixture.id })).toEqual(postFixture);
    });

    it("should resolve pending post instance if it exists", () => {
      const state: State = {
        ...initialState,
        posts: {
          ...initialState.posts,
          instances: {
            [postFixture.id]: postFixture2.id
          },
          byId: {
            [postFixture.id]: postFixture,
            [postFixture2.id]: postFixture2
          }
        }
      };

      expect(getPostById(state, { id: "5" })).toEqual(postFixture2);
    });
  });
});
