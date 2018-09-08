import { AxiosInstance, default as axios } from "axios";
import * as moxios from "moxios";
import { never, of } from "rxjs";
import { toArray } from "rxjs/operators";
import { TestScheduler } from "rxjs/testing";
import {
  CREATE_POST,
  createPostReject,
  createPostResolve,
  deletePost,
  deletePostReject,
  deletePostResolve,
  likePost,
  likePostReject,
  likePostResolve,
  loadPosts,
  loadPostsReject,
  loadPostsResolve,
  uploadProgress
} from "../actions";
import { Post as ApiPost } from "../api";
import { mapResponseToPostData, Post } from "../models";
import postEpic from "./postEpic";

const post1: ApiPost = {
  id: "1",
  imageUrl:
    "https://images.unsplash.com/photo-1535412833400-85426926b8c1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=47e717c53dae51ed4a300fffa13733a8&auto=format&fit=crop&w=500&q=60",
  imageWidth: 500,
  imageHeight: 333,
  author: {
    id: "auth9|123123",
    name: "Foo bar",
    avatarUrl:
      "https://images.unsplash.com/profile-1532310311737-e56bb5caa506?dpr=1&auto=format&fit=crop&w=64&h=64&q=60&crop=faces&bg=fff"
  },
  likes: 1,
  isLiked: true,
  timestamp: new Date(1973, 10, 30)
};

const post2: ApiPost = {
  id: "5",
  imageUrl:
    "https://images.unsplash.com/photo-1535412833400-85426926b8c1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=47e717c53dae51ed4a300fffa13733a8&auto=format&fit=crop&w=500&q=60",
  imageWidth: 500,
  imageHeight: 333,
  author: {
    id: "auth9|123123",
    name: "Foo bar",
    avatarUrl:
      "https://images.unsplash.com/profile-1532310311737-e56bb5caa506?dpr=1&auto=format&fit=crop&w=64&h=64&q=60&crop=faces&bg=fff"
  },
  likes: 1,
  isLiked: true,
  timestamp: new Date(1973, 10, 30)
};

let testScheduler: TestScheduler;

beforeEach(() => {
  testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
});

// TODO: Fix these tests after refactoring
describe.skip("Post epic", () => {
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
        items: [post1, post2]
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
            expect(actions).toEqual([
              loadPostsResolve(7, [post1, post2].map(mapResponseToPostData))
            ]);
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
                post: post1
              }
            }
          });
          const output$ = postEpic(action$ as any, null as any, { api } as any);

          expectObservable(output$).toBe("--a-b-", {
            a: uploadProgress(post1.id, 250, 400),
            b: uploadProgress(post1.id, 300, 400)
          });
        });
      });
    });

    describe("when the request is successful", () => {
      const file = new File([""], "picture.png");
      it("should dispatch CREATE_POST_RESOLVE", () => {
        testScheduler.run(({ hot, cold, expectObservable }) => {
          const action$ = cold("-a-", {
            a: {
              type: CREATE_POST,
              payload: {
                file,
                post: post1
              }
            }
          });
          const response$ = cold("--a|", {
            a: {
              data: post2
            }
          });
          const api = {
            post: () => response$
          };
          const output$ = postEpic(action$ as any, null as any, { api } as any);

          expectObservable(output$).toBe("---a", {
            a: createPostResolve(
              mapResponseToPostData(post1),
              mapResponseToPostData(post2)
            )
          });
        });
      });
    });

    describe("when the request fails", () => {
      const file = new File([""], "picture.png");
      const post = post1;
      const error = new Error("foo");

      it("should dispatch CREATE_POST_REJECT", () => {
        testScheduler.run(({ cold, expectObservable }) => {
          const action$ = cold("-a-", {
            a: {
              type: CREATE_POST,
              payload: {
                file,
                post: post1
              }
            }
          });
          const response$ = cold("--#|", {}, error);
          const api = {
            post: () => response$
          };
          const output$ = postEpic(action$ as any, null as any, { api } as any);

          expectObservable(output$).toBe("---a--", {
            a: createPostReject(mapResponseToPostData(post), error)
          });
        });
      });
    });
  });

  describe("deleting post", () => {
    // Create denormalized instance from fixture
    const post: Post = {
      ...mapResponseToPostData(post1),
      pending: false,
      progress: null
    };

    describe("when the request is successful", () => {
      it("dispatches DELETE_POST_RESOLVE", () => {
        testScheduler.run(({ hot, expectObservable }) => {
          // prettier-ignore
          const [actions, responses] = [
	    "-x---",
	    "---x-"
	  ];

          const action$ = hot(actions, {
            x: deletePost(post)
          });

          const response$ = hot(responses, {
            x: {}
          });

          const api = {
            delete: (url: string) => {
              expect(url).toBe(`posts/${post.id}`);

              return response$;
            }
          };

          const output$ = postEpic(action$ as any, null as any, { api } as any);

          expectObservable(output$).toBe("---x-", {
            x: deletePostResolve(post)
          });
        });
      });
    });

    describe("when the request fails", () => {
      const error = new Error("foo");

      it("dispatches DELETE_POST_REJECT", () => {
        testScheduler.run(({ hot, expectObservable }) => {
          // prettier-ignore
          const [actions, responses] = [
	    "-x---",
	    "---#"
	  ];

          const action$ = hot(actions, {
            x: deletePost(post)
          });

          const response$ = hot(responses, {}, error);

          const api = {
            delete: (url: string) => {
              expect(url).toBe(`posts/${post.id}`);

              return response$;
            }
          };

          const output$ = postEpic(action$ as any, null as any, { api } as any);

          expectObservable(output$).toBe("---x-", {
            x: deletePostReject(post, error)
          });
        });
      });
    });
  });

  describe("liking post", () => {
    // Create denormalized instance from fixture
    const post: Post = {
      ...mapResponseToPostData(post1),
      pending: false,
      progress: null
    };

    describe("when the request is successful", () => {
      it("dispatches LIKE_POST_RESOLVE", () => {
        testScheduler.run(({ hot, expectObservable }) => {
          // prettier-ignore
          const [actions, responses] = ["-x---", "---x-"];

          const action$ = hot(actions, {
            x: likePost(post, 1)
          });

          const response$ = hot(responses, {
            x: {}
          });

          const api = {
            put: (url: string) => {
              expect(url).toBe(`posts/${post.id}/like`);

              return response$;
            }
          };

          const output$ = postEpic(action$ as any, null as any, { api } as any);

          expectObservable(output$).toBe("---x-", {
            x: likePostResolve(post, 1)
          });
        });
      });
    });

    describe("when the request fails", () => {
      const error = new Error("foo");

      it("dispatches LIKE_POST_REJECT", () => {
        testScheduler.run(({ hot, expectObservable }) => {
          // prettier-ignore
          const [actions, responses] = [
	    "-x---",
	    "---#"
	  ];

          const action$ = hot(actions, {
            x: likePost(post, 1)
          });

          const response$ = hot(responses, {}, error);

          const api = {
            put: (url: string) => {
              expect(url).toBe(`posts/${post.id}/like`);

              return response$;
            }
          };

          const output$ = postEpic(action$ as any, null as any, { api } as any);

          expectObservable(output$).toBe("---x-", {
            x: likePostReject(post, 1, error)
          });
        });
      });
    });
  });
});
