import { fileToDataUrl, getImageDimensions } from "../utils";
import { CREATE_POST, createPost } from "./postActions";

jest.mock("../utils", () => ({
  fileToDataUrl: jest.fn(),
  getImageDimensions: jest.fn()
}));

describe("postActions", () => {
  describe("createPost", () => {
    const user = {
      id: "1",
      name: "foo",
      avatarUrl: "https://example.org/picutre.png"
    };
    const fileMock = new File([""], "picture.png", { type: "image/png " });
    const stubUrl = "https://example.org/picutre2.png";
    const stubDimensions = {
      width: 33,
      height: 55
    };

    it("must resolve to action", async () => {
      (fileToDataUrl as jest.Mock).mockImplementation(file => {
        expect(file).toBe(fileMock);

        return Promise.resolve(stubUrl);
      });

      (getImageDimensions as jest.Mock).mockImplementation(file => {
        expect(file).toBe(fileMock);

        return Promise.resolve(stubDimensions);
      });

      const action = await createPost(fileMock, user);

      expect(action).toEqual({
        type: CREATE_POST,
        payload: {
          file: fileMock,
          post: {
            id: expect.any(String),
            author: user,
            picture: {
              url: stubUrl,
              width: stubDimensions.width,
              height: stubDimensions.height
            },
            likesCount: 1,
            isLiked: true,
            timestamp: expect.any(Number)
          }
        }
      });
    });
  });
});
