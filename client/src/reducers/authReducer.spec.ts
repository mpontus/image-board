import { authenticated } from "../actions";
import authReducer from "./authReducer";

const initialState = authReducer(undefined, {} as any);

describe("authReducer", () => {
  describe("initial state", () => {
    it("should match snapshot", () => {
      expect(initialState).toMatchSnapshot();
    });
  });

  describe("reflecting authentication status", () => {
    it("should store id token in the state", () => {
      const idToken = "foo";
      const action = authenticated(idToken);
      const state = authReducer(initialState, action);

      expect(state.idToken).toBe(idToken);
    });
  });
});
