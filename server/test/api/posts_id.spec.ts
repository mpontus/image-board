import * as app from "@src/app";
import * as request from "supertest";
import { createToken, resetDb } from "../utils";

beforeEach(() => resetDb());

describe("/api/posts", () => {
  const seed = require("@test/seed/single-post").default;
  let post: any;

  beforeEach(async () => {
    post = await seed();
  });

  describe("DELETE", () => {
    describe("when user owns the post", () => {
      it("should return a valid response", async () => {
        const response = await request(app)
          .delete(`/api/posts/${post._id}`)
          .set(
            "Authorization",
            `Bearer ${createToken({ sub: post.author.id })}`
          )
          .expect(204);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when user does not own the post", () => {
      it("should return a 401 Unauthorized", async () => {
        const response = await request(app)
          .delete(`/api/posts/${post._id}`)
          .set("Authorization", `Bearer ${createToken({ sub: "123" })}`)
          .expect(401);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when user is unauthenticated", () => {
      it("should return a 401 Unauthorized", async () => {
        const response = await request(app)
          .delete(`/api/posts/${post._id}`)
          .expect(401);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when post does not exist", () => {
      it("should return a 404 Not Found", async () => {
        const response = await request(app)
          .delete(`/api/posts/foo`)
          .set("Authorization", `Bearer ${createToken({ sub: "123" })}`)
          .expect(404);

        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
