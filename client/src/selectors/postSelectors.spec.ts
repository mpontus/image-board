import * as fixture from "../@testing/fixtures";
import { denormalizePost } from "../models";
import reducers, { State } from "../reducers";
import { makeGetPostById, makeGetPostIds } from "./postSelectors";

const initialState = reducers(undefined, {} as any);

const posts = [fixture.post(), fixture.post()];

const state: State = {
  ...initialState,
  posts: {
    ...initialState.posts,
    pendingIds: [posts[0].id],
    ids: [posts[1].id],
    byId: {
      [posts[0].id]: posts[0],
      [posts[1].id]: posts[1]
    }
  }
};

describe("postSelectors", () => {
  describe("makeGetPostIds", () => {
    const getPostIds = makeGetPostIds();

    it("Returns all post ids", () => {
      expect(getPostIds(state)).toEqual([posts[0].id, posts[1].id]);
    });

    it("should exclude ids marked as deleted", () => {
      const state1: State = {
        ...state,
        posts: {
          ...state.posts,
          isDeletedById: {
            [posts[0].id]: true
          }
        }
      };

      expect(getPostIds(state1)).toEqual([posts[1].id]);
    });

    it("should exclude ids for removed posts", () => {
      const state1: State = {
        ...state,
        posts: {
          ...state.posts,
          byId: {
            ...state.posts.byId,
            [posts[0].id]: undefined
          }
        }
      };

      expect(getPostIds(state1)).toEqual([posts[1].id]);
    });
  });

  describe("makeGetPostById", () => {
    const getPostById = makeGetPostById();

    it("should return post by its id", () => {
      expect(getPostById(state, { id: posts[1].id })).toEqual(
        denormalizePost(posts[1], false)
      );
    });

    it("should resolve pending post instance if it exists", () => {
      const state1: State = {
        ...state,
        posts: {
          ...state.posts,
          instances: {
            [posts[0].id]: posts[1].id
          }
        }
      };

      expect(getPostById(state1, { id: posts[0].id })).toEqual(
        denormalizePost(posts[1], false)
      );
    });
  });
});
