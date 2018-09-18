/* tslint:disable:no-shadowed-variable */
import app from "@src/app";
import * as request from "supertest";
import { createToken, resetDb } from "../utils";

beforeEach(() => resetDb());

describe("/api/posts/:id/like", () => {
  describe("PUT", () => {
    const {
      postId,
      authorId,
      default: seed
    } = require("@test/seed/single-post");

    describe("when post exists", () => {
      beforeEach(seed);

      it("should return 202 Accepted", async () => {
        const response = await request(app)
          .put(`/api/posts/${postId}/like`)
          .set("Authorization", `Bearer ${createToken({ sub: authorId })}`)
          .expect(202);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when post doesn't exist", () => {
      it("should return 400 Bad Request", async () => {
        const response = await request(app)
          .put(`/api/posts/${postId}/like`)
          .set("Authorization", `Bearer ${createToken({ sub: authorId })}`)
          .expect(400);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when user is unauthenticated", () => {
      beforeEach(seed);

      it("should return 401 Unauthorized", async () => {
        const response = await request(app)
          .put(`/api/posts/${postId}/like`)
          .expect(401);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when post is already liked", () => {
      const {
        postId,
        authorId,
        default: seed
      } = require("@test/seed/liked-post");

      beforeEach(seed);

      it("should return 400 Bad Request", async () => {
        const response = await request(app)
          .put(`/api/posts/${postId}/like`)
          .set("Authorization", `Bearer ${createToken({ sub: authorId })}`)
          .expect(400);

        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe("DELETE", () => {
    const {
      postId,
      authorId,
      default: seed
    } = require("@test/seed/liked-post");

    describe("when post exists", () => {
      beforeEach(seed);

      it("should return 202 Accepted", async () => {
        const response = await request(app)
          .delete(`/api/posts/${postId}/like`)
          .set("Authorization", `Bearer ${createToken({ sub: authorId })}`)
          .expect(202);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when post doesn't exist", () => {
      it("should return 400 Bad Request", async () => {
        const response = await request(app)
          .delete(`/api/posts/${postId}/like`)
          .set("Authorization", `Bearer ${createToken({ sub: authorId })}`)
          .expect(400);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when user is unauthenticated", () => {
      beforeEach(seed);

      it("should return 401 Unauthorized", async () => {
        const response = await request(app)
          .delete(`/api/posts/${postId}/like`)
          .expect(401);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when post has not been liked", () => {
      const {
        postId,
        authorId,
        default: seed
      } = require("@test/seed/single-post");

      beforeEach(seed);

      it("should return 400 Bad Request", async () => {
        const response = await request(app)
          .delete(`/api/posts/${postId}/like`)
          .set("Authorization", `Bearer ${createToken({ sub: authorId })}`)
          .expect(400);

        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
