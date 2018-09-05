import { makeGetPostIds, makeGetPostById } from "./postSelectors";

describe("makeGetPostIds", () => {
  const getPostIds = makeGetPostIds();

  it("Returns post ids", () => {
    const state = {
      posts: {
        ids: ["3", "5", "9"]
      }
    };

    expect(getPostIds(state as any)).toEqual(["3", "5", "9"]);
  });
});

describe("makeGetPostById", () => {
  const getPostById = makeGetPostById();

  it("Returns post ids", () => {
    const post = {
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

    const state = {
      posts: {
        byId: {
          "5": post
        }
      }
    };

    expect(getPostById(state as any, { id: "5" })).toEqual(post);
  });
});
