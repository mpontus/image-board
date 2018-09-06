import { of, never } from "rxjs";
import { default as axios, AxiosInstance } from "axios";
import { toArray } from "rxjs/operators";
import * as moxios from "moxios";
import postEpic from "./postEpic";
import { loadPosts, loadPostsResolve, loadPostsReject } from "../actions";

const data = {
  total: 2,
  items: [
    {
      id: "1",
      picture: {
        url:
          "https://images.unsplash.com/photo-1535412833400-85426926b8c1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=47e717c53dae51ed4a300fffa13733a8&auto=format&fit=crop&w=500&q=60",
        width: 500,
        height: 333,
      },
      author: {
        id: "auth9|123123",
        name: "Foo bar",
        avatarUrl:
          "https://images.unsplash.com/profile-1532310311737-e56bb5caa506?dpr=1&auto=format&fit=crop&w=64&h=64&q=60&crop=faces&bg=fff",
      },
      likesCount: 1,
      isLiked: true,
      timestamp: 1535731213512,
    },
    {
      id: "2",
      picture: {
        url:
          "https://images.unsplash.com/photo-1535406110845-88cbe4f661bc?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f4a0c1c0797ffc0e0008c764bf37fdf4&auto=format&fit=crop&w=500&q=60",
        width: 500,
        height: 281,
      },
      author: {
        id: "auth9|123123",
        name: "Foo bar",
        avatarUrl:
          "https://images.unsplash.com/profile-1532310311737-e56bb5caa506?dpr=1&auto=format&fit=crop&w=64&h=64&q=60&crop=faces&bg=fff",
      },
      likesCount: 1,
      isLiked: true,
      timestamp: 1535731213512,
    },
  ],
};

const api = axios.create({ baseURL: "/api" });

beforeEach(() => {
  moxios.install(api as any);
});

afterEach(() => {
  moxios.uninstall();
});

describe("Post epic", () => {
  describe("when request is successful", () => {
    beforeEach(() => {
      moxios.stubRequest("/api/posts?page=1", {
        status: 200,
        response: data,
      });
    });

    it("should dispatch loadPostsResolve", () => {
      const action$ = of(loadPosts());
      const store$ = never();
      const output$ = postEpic(action$ as any, store$ as any, {
        api: api as AxiosInstance,
        auth: {} as any,
      });

      return output$
        .pipe(toArray())
        .toPromise()
        .then(actions => {
          expect(actions).toEqual([loadPostsResolve(data)]);
        });
    });
  });

  describe("when request fails", () => {
    beforeEach(() => {
      moxios.stubRequest("/api/posts?page=1", {
        status: 500,
        response: {},
      });
    });

    it("should dispatch loadPostsReject", () => {
      const action$ = of(loadPosts());
      const store$ = never();
      const output$ = postEpic(action$ as any, store$ as any, {
        api: api as AxiosInstance,
        auth: {} as any,
      });

      return output$
        .pipe(toArray())
        .toPromise()
        .then(actions => {
          expect(actions).toEqual([loadPostsReject(expect.any(Error))]);
        });
    });
  });
});
