import * as app from "@src/app";
import * as request from "supertest";
import { createToken, resetDb } from "../utils";

beforeEach(() => resetDb());

describe("/api/posts", () => {
  const { postId, authorId, default: seed } = require("@test/seed/single-post");

  describe("DELETE", () => {
    describe("when user owns the post", () => {
      beforeEach(seed);

      it("should return a valid response", async () => {
        const response = await request(app)
          .delete(`/api/posts/${postId}`)
          .set("Authorization", `Bearer ${createToken({ sub: authorId })}`)
          .expect(204);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when user does not own the post", () => {
      beforeEach(seed);

      it("should return a 401 Unauthorized", async () => {
        const response = await request(app)
          .delete(`/api/posts/${postId}`)
          .set("Authorization", `Bearer ${createToken()}`)
          .expect(401);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when user is unauthenticated", () => {
      beforeEach(seed);

      it("should return a 401 Unauthorized", async () => {
        const response = await request(app)
          .delete(`/api/posts/${postId}`)
          .expect(401);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when post does not exist", () => {
      it("should return a 404 Not Found", async () => {
        const response = await request(app)
          .delete(`/api/posts/${postId}`)
          .set("Authorization", `Bearer ${createToken()}`)
          .expect(404);

        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
