import app from "@src/app";
import * as request from "supertest";
import { createToken, resetDb } from "../utils";

beforeEach(() => resetDb());

describe("/api/posts", () => {
  describe("GET", () => {
    describe("when no posts exist", () => {
      it("should return a valid response", async () => {
        const response = await request(app)
          .get("/api/posts")
          .expect(200);

        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when some posts exist", () => {
      beforeEach(() => require("@test/seed/single-post").default());

      it("should return a valid response", async () => {
        const response = await request(app)
          .get("/api/posts")
          .expect(200);

        expect(response.body).toMatchSnapshot();
      });
    });
  });

  describe("POST", () => {
    describe("when file is an image", () => {
      it("should return a valid response", async () => {
        const token = createToken({
          sub: "123",
          nickname: "Alex Pushkin",
          picture: "https://picsum.photos/200/200"
        });

        const response = await request(app)
          .post("/api/posts")
          .attach("file", __dirname + "/../fixtures/sample.jpg")
          .set("Authorization", `Bearer ${token}`)
          .expect(201);

        expect(response.body).toMatchSnapshot({
          id: expect.any(String),
          timestamp: expect.any(String)
        });
      });
    });

    describe("when token contains insufficient information", () => {
      it("should return a valid response", async () => {
        const token = createToken({
          nickname: undefined
        });

        const response = await request(app)
          .post("/api/posts")
          .attach("file", __dirname + "/../fixtures/sample.jpg")
          .set("Authorization", `Bearer ${token}`)
          .expect(400);

        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
