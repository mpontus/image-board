import { loadPostsResolve } from "../actions";
import postReducer from "./postReducer";

describe("Post reducer", () => {
  it("Saves listing in the state", () => {
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

    const action = loadPostsResolve({
      total: 2,
      items: posts
    });

    const result = postReducer(undefined, action);

    expect(result).toEqual({
      loading: false,
      total: 2,
      ids: ["1", "2"],
      byId: {
        "1": posts[0],
        "2": posts[1]
      }
    });
  });
});
