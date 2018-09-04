import { AxiosInstance } from "axios";
import { AuthService } from "../services";
import configureStore from "./configureStore";

describe("configureStore", () => {
  it("should return store instance", () => {
    const store = configureStore({
      api: {} as AxiosInstance,
      auth: {} as AuthService
    });

    expect(typeof store.dispatch).toBe("function");
  });
});
