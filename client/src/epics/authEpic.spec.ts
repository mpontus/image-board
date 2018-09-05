import authEpic from "./authEpic";
import { authenticated, logout } from "../actions";
import { of, never } from "rxjs";
import { TestScheduler } from "rxjs/testing";

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

describe("authEpic", () => {
  it("dispatches AUTHENTICATED action with the initial valueof ID token", () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const idToken = "idToken";
      const auth = {
        getIdToken: () => hot("---a", { a: idToken })
      };
      const output$ = authEpic(never() as any, never() as any, {
        api: null as any,
        auth: auth as any
      });

      expectObservable(output$).toBe("---a", {
        a: authenticated(idToken)
      });
    });
  });

  it("calls auth.logout when LOGOUT actions is dispatched", done => {
    const auth = {
      logout: done,
      getIdToken: () => never()
    } as any;

    authEpic(of(logout()) as any, never() as any, {
      auth,
      api: null as any
    }).subscribe();
  });
});
