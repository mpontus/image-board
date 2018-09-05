import { encode } from "jwt-simple";
import { makeGetAuthenticatedUser } from "./authSelectors";
import { User } from "../models";

describe("makeGetAuthenticatedUser", () => {
  it("returns null when user is unauthenticated", () => {
    const getAuthenticatedUser = makeGetAuthenticatedUser();
    const state = {
      auth: {
        idToken: null
      }
    };

    expect(getAuthenticatedUser(state as any)).toEqual(null);
  });

  it("returns null when user is unauthenticated", () => {
    const user: User = {
      id: "someid",
      name: "foo bar",
      avatarUrl: "https://example.org/picture.jpg"
    };
    const getAuthenticatedUser = makeGetAuthenticatedUser();
    const state = {
      auth: {
        idToken: encode(
          {
            sid: user.id,
            name: user.name,
            picture: user.avatarUrl
          },
          "secret"
        )
      }
    };

    expect(getAuthenticatedUser(state as any)).toEqual(user);
  });
});
