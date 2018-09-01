import { AxiosInstance } from "axios";
import configureStore from "./configureStore";

describe("configureStore", () => {
  it("should return store instance", () => {
    const store = configureStore({ api: {} as AxiosInstance });

    expect(typeof store.dispatch).toBe("function");
  });
});
