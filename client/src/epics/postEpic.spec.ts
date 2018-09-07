import { AxiosInstance, default as axios } from "axios";
import * as moxios from "moxios";
import { never, of } from "rxjs";
import { toArray } from "rxjs/operators";
import { TestScheduler } from "rxjs/testing";
import {
  CREATE_POST,
  createPostReject,
  createPostResolve,
  loadPosts,
  loadPostsReject,
  loadPostsResolve,
  uploadProgress
} from "../actions";
import postEpic from "./postEpic";

const posts = [
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

let testScheduler: TestScheduler;

beforeEach(() => {
  testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
});

describe("Post epic", () => {
  describe("retrieving posts", () => {
    const api = axios.create({ baseURL: "/api" });

    beforeEach(() => {
      moxios.install(api as any);
    });

    afterEach(() => {
      moxios.uninstall();
    });

    describe("when request is successful", () => {
      const response = {
        total: 2,
        items: posts
      };

      beforeEach(() => {
        moxios.stubRequest("/api/posts?page=1", {
          status: 200,
          response
        });
      });

      it("should dispatch loadPostsResolve", () => {
        const action$ = of(loadPosts());
        const store$ = never();
        const output$ = postEpic(action$ as any, store$ as any, {
          api: api as AxiosInstance,
          auth: {} as any
        });

        return output$
          .pipe(toArray())
          .toPromise()
          .then(actions => {
            expect(actions).toEqual([loadPostsResolve(response)]);
          });
      });
    });

    describe("when request fails", () => {
      beforeEach(() => {
        moxios.stubRequest("/api/posts?page=1", {
          status: 500,
          response: {}
        });
      });

      it("should dispatch loadPostsReject", () => {
        const action$ = of(loadPosts());
        const store$ = never();
        const output$ = postEpic(action$ as any, store$ as any, {
          api: api as AxiosInstance,
          auth: {} as any
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

  describe("creating post", () => {
    describe("dispatches UPLOAD_PROGRESS", () => {
      const file = new File([""], "picture.png");

      it("should dispatch UPLOAD_PROGRESS", () => {
        testScheduler.run(({ cold, expectObservable }) => {
          const progress = cold("-a-b-", {
            a: {
              loaded: 250,
              total: 400
            },
            b: {
              loaded: 300,
              total: 400
            }
          });
          const api = {
            post: (url: string, data: any, { onUploadProgress }: any) => {
              expect(url).toEqual("posts");

              progress.subscribe(onUploadProgress);

              return never();
            }
          };
          const action$ = cold("-a-", {
            a: {
              type: CREATE_POST,
              payload: {
                file,
                post: posts[0]
              }
            }
          });
          const output$ = postEpic(action$ as any, null as any, { api } as any);

          expectObservable(output$).toBe("--a-b-", {
            a: uploadProgress(posts[0].id, 250, 400),
            b: uploadProgress(posts[0].id, 300, 400)
          });
        });
      });
    });

    describe("when the request is successful", () => {
      const file = new File([""], "picture.png");
      const post = posts[0];
      const instance = posts[1];

      it("should dispatch CREATE_POST_RESOLVE", () => {
        testScheduler.run(({ hot, cold, expectObservable }) => {
          const action$ = cold("-a-", {
            a: {
              type: CREATE_POST,
              payload: {
                file,
                post: posts[0]
              }
            }
          });
          const response$ = cold("--a|", {
            a: {
              data: instance
            }
          });
          const api = {
            post: () => response$
          };
          const output$ = postEpic(action$ as any, null as any, { api } as any);

          expectObservable(output$).toBe("---a", {
            a: createPostResolve(post, instance)
          });
        });
      });
    });

    describe("when the request fails", () => {
      const file = new File([""], "picture.png");
      const post = posts[0];
      const error = new Error("foo");

      it("should dispatch CREATE_POST_REJECT", () => {
        testScheduler.run(({ cold, expectObservable }) => {
          const action$ = cold("-a-", {
            a: {
              type: CREATE_POST,
              payload: {
                file,
                post: posts[0]
              }
            }
          });
          const response$ = cold("--#|", {}, error);
          const api = {
            post: () => response$
          };
          const output$ = postEpic(action$ as any, null as any, { api } as any);

          expectObservable(output$).toBe("---a--", {
            a: createPostReject(post, error)
          });
        });
      });
    });
  });
});
